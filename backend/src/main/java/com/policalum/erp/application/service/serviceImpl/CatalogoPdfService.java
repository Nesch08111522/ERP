package com.policalum.erp.application.service.serviceImpl;

import com.lowagie.text.BadElementException;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.policalum.erp.application.dto.response.EmpresaPublicaDTO;
import com.policalum.erp.application.dto.response.PaginaPublicaDTO;
import com.policalum.erp.application.dto.response.ProductoPublicoDTO;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CatalogoPdfService {

    private static final int PAGE_SIZE = 48;
    private static final Color AZUL = new Color(7, 85, 145);
    private static final Color CELESTE = new Color(232, 244, 250);
    private static final Color GRIS = new Color(83, 98, 112);

    private final PortalPublicoService portal;
    private final ProductoImagenService imagenes;

    public byte[] generar() {
        List<ProductoPublicoDTO> productos = new ArrayList<>();
        int pagina = 0;
        int paginas;
        do {
            PaginaPublicaDTO<ProductoPublicoDTO> resultado = portal.catalogo(
                    null, null, false, PageRequest.of(pagina, PAGE_SIZE, Sort.by("nombre").ascending()));
            productos.addAll(resultado.content());
            paginas = resultado.totalPages();
            pagina++;
        } while (pagina < paginas);
        return crearPdf(productos, portal.empresa());
    }

    private byte[] crearPdf(List<ProductoPublicoDTO> productos, EmpresaPublicaDTO empresa) {
        try (ByteArrayOutputStream salida = new ByteArrayOutputStream()) {
            Document documento = new Document(PageSize.A4, 34, 34, 58, 38);
            PdfWriter.getInstance(documento, salida);
            documento.open();

            String nombreEmpresa = empresa.nombreComercial() == null || empresa.nombreComercial().isBlank()
                    ? "POLICALUM" : empresa.nombreComercial();
            documento.add(new Paragraph(nombreEmpresa.toUpperCase(Locale.ROOT),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, AZUL)));
            Paragraph titulo = new Paragraph("CATÁLOGO DE PRODUCTOS",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, new Color(25, 45, 62)));
            titulo.setSpacingBefore(7);
            titulo.setSpacingAfter(4);
            documento.add(titulo);
            Paragraph descripcion = new Paragraph(
                    "Precios y descripciones de los productos disponibles. Guarda este documento para consultarlo sin conexión.",
                    FontFactory.getFont(FontFactory.HELVETICA, 9, GRIS));
            descripcion.setSpacingAfter(16);
            documento.add(descripcion);

            if (productos.isEmpty()) {
                documento.add(new Paragraph("No hay productos publicados en el catálogo.",
                        FontFactory.getFont(FontFactory.HELVETICA, 11, GRIS)));
            } else {
                PdfPTable tabla = new PdfPTable(2);
                tabla.setWidthPercentage(100);
                tabla.setWidths(new float[] { 1, 1 });
                tabla.setSplitRows(true);
                tabla.setSpacingAfter(8);
                for (ProductoPublicoDTO producto : productos) {
                    tabla.addCell(celdaProducto(producto));
                }
                if (productos.size() % 2 != 0) {
                    PdfPCell vacia = new PdfPCell(new Phrase(""));
                    vacia.setBorderColor(Color.WHITE);
                    tabla.addCell(vacia);
                }
                documento.add(tabla);
            }
            documento.close();
            return salida.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("No se pudo generar el catálogo en PDF", e);
        }
    }

    private PdfPCell celdaProducto(ProductoPublicoDTO producto) {
        PdfPCell celda = new PdfPCell();
        celda.setBorderColor(new Color(220, 230, 238));
        celda.setPadding(10);
        celda.setMinimumHeight(190);

        Image imagen = imagenProducto(producto);
        if (imagen != null) {
            imagen.scaleToFit(220, 86);
            imagen.setAlignment(Element.ALIGN_CENTER);
            celda.addElement(imagen);
        } else {
            PdfPCell marcador = new PdfPCell(new Phrase("POLICALUM",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, AZUL)));
            marcador.setBackgroundColor(CELESTE);
            marcador.setBorderColor(CELESTE);
            marcador.setFixedHeight(72);
            marcador.setHorizontalAlignment(Element.ALIGN_CENTER);
            marcador.setVerticalAlignment(Element.ALIGN_MIDDLE);
            PdfPTable imagenAusente = new PdfPTable(1);
            imagenAusente.setWidthPercentage(100);
            imagenAusente.addCell(marcador);
            celda.addElement(imagenAusente);
        }

        Paragraph nombre = new Paragraph(producto.nombre(),
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(25, 45, 62)));
        nombre.setSpacingBefore(7);
        nombre.setSpacingAfter(4);
        celda.addElement(nombre);

        String detalle = producto.descripcion() == null || producto.descripcion().isBlank()
                ? "Consulta disponibilidad y opciones con nuestro equipo."
                : producto.descripcion().trim();
        Paragraph descripcion = new Paragraph(detalle,
                FontFactory.getFont(FontFactory.HELVETICA, 8, GRIS));
        descripcion.setSpacingAfter(7);
        celda.addElement(descripcion);

        Paragraph precio = new Paragraph("S/ " + (producto.precioPublico() == null
                ? "Consultar" : String.format(Locale.US, "%,.2f", producto.precioPublico())),
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, AZUL));
        celda.addElement(precio);
        return celda;
    }

    private Image imagenProducto(ProductoPublicoDTO producto) {
        String url = producto.imagenUrl();
        if (url == null || !url.startsWith("/api/v1/public/catalogo/imagenes?ruta=")) return null;
        String ruta = URLDecoder.decode(url.substring(url.indexOf("ruta=") + 5), StandardCharsets.UTF_8);
        if (!ruta.startsWith("productos/") || ruta.toLowerCase(Locale.ROOT).endsWith(".webp")) return null;
        try {
            Resource archivo = imagenes.cargar(ruta);
            return Image.getInstance(archivo.getContentAsByteArray());
        } catch (IOException | BadElementException e) {
            log.warn("No se pudo incluir la imagen del producto {} en el catálogo PDF", producto.id(), e);
            return null;
        }
    }
}
