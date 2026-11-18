
package br.gov.sidesp.noticias;

import br.gov.sidesp.auth.ApiException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class NoticiaStorageService {

    private static final long TAMANHO_MAXIMO = 10 * 1024 * 1024;

    private final Path diretorio;

    public NoticiaStorageService(
            @Value("${sidesp.upload-dir}") String uploadDir) {
        this.diretorio = Path.of(uploadDir)
                .toAbsolutePath()
                .normalize();
    }

    private String identificarFormato(byte[] arquivo) {

        // JPEG
        if (arquivo.length >= 3
                && (arquivo[0] & 0xFF) == 0xFF
                && (arquivo[1] & 0xFF) == 0xD8
                && (arquivo[2] & 0xFF) == 0xFF) {
            return ".jpg";
        }

        // PNG
        if (arquivo.length >= 8
                && (arquivo[0] & 0xFF) == 0x89
                && arquivo[1] == 0x50
                && arquivo[2] == 0x4E
                && arquivo[3] == 0x47
                && arquivo[4] == 0x0D
                && arquivo[5] == 0x0A
                && arquivo[6] == 0x1A
                && arquivo[7] == 0x0A) {
            return ".png";
        }

        // WEBP
        if (arquivo.length >= 12
                && arquivo[0] == 'R'
                && arquivo[1] == 'I'
                && arquivo[2] == 'F'
                && arquivo[3] == 'F'
                && arquivo[8] == 'W'
                && arquivo[9] == 'E'
                && arquivo[10] == 'B'
                && arquivo[11] == 'P') {
            return ".webp";
        }

        return null;
    }

    private boolean mimeCompativel(String mime, String extensao) {

        if (mime == null) {
            return false;
        }

        return switch (extensao) {
            case ".jpg" -> mime.equalsIgnoreCase("image/jpeg");
            case ".png" -> mime.equalsIgnoreCase("image/png");
            case ".webp" -> mime.equalsIgnoreCase("image/webp");
            default -> false;
        };
    }

    private void validarIntegridade(byte[] conteudo, String extensao) {

        // ImageIO verifica a integridade de JPEG e PNG.
        // WEBP exige um decodificador específico.
        if (extensao.equals(".webp")) {
            return;
        }

        try (ByteArrayInputStream entrada =
                new ByteArrayInputStream(conteudo)) {

            if (ImageIO.read(entrada) == null) {
                throw ApiException.invalid(
                        "imagem",
                        "O arquivo enviado não é uma imagem válida.");
            }

        } catch (IOException e) {
            throw ApiException.invalid(
                    "imagem",
                    "Não foi possível interpretar a imagem.");
        }
    }

    public String armazenar(MultipartFile arquivo) {

        if (arquivo == null || arquivo.isEmpty()) {
            throw ApiException.invalid(
                    "imagem", "A imagem é obrigatória.");
        }

        if (arquivo.getSize() > TAMANHO_MAXIMO) {
            throw ApiException.invalid(
                    "imagem", "A imagem deve ter no máximo 10 MB.");
        }

        try {
            byte[] conteudo = arquivo.getBytes();

            String extensao = identificarFormato(conteudo);

            if (extensao == null
                    || !mimeCompativel(arquivo.getContentType(), extensao)) {
                throw ApiException.invalid(
                        "imagem",
                        "Formato inválido. Envie JPG, PNG ou WEBP.");
            }

            validarIntegridade(conteudo, extensao);

            Files.createDirectories(diretorio);

            String nomeArquivo = UUID.randomUUID() + extensao;

            Path destino = diretorio.resolve(nomeArquivo).normalize();

            if (!destino.startsWith(diretorio)) {
                throw ApiException.invalid(
                        "imagem", "Caminho de arquivo inválido.");
            }

            Files.write(destino, conteudo);

            return nomeArquivo;

        } catch (IOException e) {
            throw new RuntimeException(
                    "Erro ao armazenar imagem.", e);
        }
    }

    public void excluir(String nomeArquivo) {

        if (nomeArquivo == null || nomeArquivo.isBlank()) {
            return;
        }

        Path arquivo = diretorio.resolve(nomeArquivo).normalize();

        if (!arquivo.startsWith(diretorio)) {
            throw new IllegalArgumentException(
                    "Nome de arquivo inválido.");
        }

        try {
            Files.deleteIfExists(arquivo);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Erro ao excluir imagem.", e);
        }
    }
}
