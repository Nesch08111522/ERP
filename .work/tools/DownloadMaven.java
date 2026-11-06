import java.io.*;
import java.net.URI;
import java.net.http.*;
import java.nio.file.*;
public class DownloadMaven {
  public static void main(String[] args) throws Exception {
    Path out = Paths.get(args[0]);
    HttpClient client = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NORMAL).build();
    HttpRequest req = HttpRequest.newBuilder(URI.create(args[1])).header("User-Agent", "Policalum-Audit").GET().build();
    HttpResponse<Path> res = client.send(req, HttpResponse.BodyHandlers.ofFile(out));
    System.out.println("status=" + res.statusCode() + " bytes=" + Files.size(out));
    if(res.statusCode() / 100 != 2) throw new IOException("HTTP " + res.statusCode());
  }
}