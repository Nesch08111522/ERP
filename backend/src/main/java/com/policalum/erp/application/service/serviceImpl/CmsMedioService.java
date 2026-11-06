package com.policalum.erp.application.service.serviceImpl;

import com.policalum.erp.exception.FileStorageException;
import com.policalum.erp.infrastructure.config.FileStorageProperties;
import jakarta.validation.ValidationException;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/** Videos e imágenes del reel público. No comparte la carpeta de facturas ni de productos. */
@Service
@RequiredArgsConstructor
public class CmsMedioService {

    private static final long MAX_IMAGEN = 8L * 1024 * 1024;
    private static final long MAX_VIDEO = 40L * 1024 * 1024;
    private static final Set<String> IMAGENES = Set.of("jpg", "jpeg", "png", "webp");
    private static final Set<String> VIDEOS = Set.of("mp4", "webm");

    private final FileStorageProperties props;

    public String guardar(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new ValidationException("Selecciona una imagen o un video");
        }
        String extension = extensionDe(archivo.getOriginalFilename());
        boolean imagen = IMAGENES.contains(extension);
        boolean video = VIDEOS.contains(extension);
        if (!imagen && !video) {
            throw new ValidationException("Usa JPG, PNG, WEBP, MP4 o WEBM");
        }
        long tope = video ? MAX_VIDEO : MAX_IMAGEN;
        if (archivo.getSize() > tope) {
            throw new ValidationException(video ? "El video no puede superar 40 MB" : "La imagen no puede superar 8 MB");
        }
        String tipo = archivo.getContentType() == null ? "" : archivo.getContentType().toLowerCase(Locale.ROOT);
        if (!tipo.isBlank() && !tipo.equals("application/octet-stream")
                && (video ? !tipo.startsWith("video/") : !tipo.startsWith("image/"))) {
            throw new ValidationException("El archivo no coincide con una imagen o un video");
        }
        LocalDate hoy = LocalDate.now();
        String relativa = String.format("sitio/%04d/%02d/%s.%s", hoy.getYear(), hoy.getMonthValue(), UUID.randomUUID(), extension);
        try {
            Path destino = resolver(relativa);
            Files.createDirectories(destino.getParent());
            try (InputStream entrada = archivo.getInputStream()) {
                Files.copy(entrada, destino, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException | InvalidPathException e) {
            throw new FileStorageException("No se pudo guardar el archivo del reel", e);
        }
        return "/api/v1/public/medios?ruta=" + relativa;
    }

    public Resource cargar(String ruta) {
        try {
            Path archivo = resolver(ruta);
            if (!Files.isRegularFile(archivo)) {
                throw new ValidationException("El medio no existe");
            }
            return new UrlResource(archivo.toUri());
        } catch (MalformedURLException | InvalidPathException e) {
            throw new ValidationException("El medio no existe");
        }
    }

    public MediaType tipo(String ruta) {
        String lower = ruta == null ? "" : ruta.toLowerCase(Locale.ROOT);
        if (lower.endsWith(".png")) return MediaType.IMAGE_PNG;
        if (lower.endsWith(".webp")) return MediaType.parseMediaType("image/webp");
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return MediaType.IMAGE_JPEG;
        if (lower.endsWith(".mp4")) return MediaType.parseMediaType("video/mp4");
        if (lower.endsWith(".webm")) return MediaType.parseMediaType("video/webm");
        return MediaType.APPLICATION_OCTET_STREAM;
    }

    private Path resolver(String ruta) {
        if (ruta == null || ruta.isBlank() || ruta.contains("..") || ruta.contains("\\") || !ruta.startsWith("sitio/")) {
            throw new ValidationException("El medio no existe");
        }
        Path base = baseAbsoluta().resolve("sitio").normalize();
        Path archivo = baseAbsoluta().resolve(ruta).normalize();
        if (!archivo.startsWith(base)) {
            throw new ValidationException("El medio no existe");
        }
        return archivo;
    }

    private Path baseAbsoluta() {
        Path ruta = Paths.get(props.getBasePath() == null || props.getBasePath().isBlank() ? "uploads" : props.getBasePath());
        if (!ruta.isAbsolute()) {
            ruta = Paths.get(System.getProperty("user.dir")).resolve(ruta);
        }
        return ruta.toAbsolutePath().normalize();
    }

    private static String extensionDe(String nombre) {
        String limpio = nombre == null ? "" : nombre.replace('\\', '/');
        int barra = limpio.lastIndexOf('/');
        if (barra >= 0) limpio = limpio.substring(barra + 1);
        int punto = limpio.lastIndexOf('.');
        return punto > 0 ? limpio.substring(punto + 1).toLowerCase(Locale.ROOT) : "";
    }
}
