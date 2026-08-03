package ru.aston.backend.storage;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.aston.backend.config.MinioProperties;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final MinioClient minioClient;
    private final MinioProperties properties;

    public String upload(MultipartFile file) {
        String extension = extensionOf(file.getOriginalFilename());
        String objectKey = UUID.randomUUID() + extension;
        try (InputStream in = file.getInputStream()) {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(properties.getBucket())
                    .object(objectKey)
                    .stream(in, file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Не удалось загрузить файл в хранилище: " + e.getMessage(), e);
        }
        return objectKey;
    }

    public void delete(String objectKey) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(properties.getBucket())
                    .object(objectKey)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Не удалось удалить файл из хранилища: " + e.getMessage(), e);
        }
    }

    public String publicUrl(String objectKey) {
        if (objectKey == null || objectKey.isBlank()) return null;
        return properties.getEndpoint() + "/" + properties.getBucket() + "/" + objectKey;
    }

    /** Only used for diagnostics/tests — normal photo serving goes through {@link #publicUrl} directly against MinIO. */
    public InputStream openStream(String objectKey) throws IOException {
        try {
            return minioClient.getObject(GetObjectArgs.builder()
                    .bucket(properties.getBucket())
                    .object(objectKey)
                    .build());
        } catch (Exception e) {
            throw new IOException(e);
        }
    }

    private String extensionOf(String originalFilename) {
        if (originalFilename == null) return "";
        int dot = originalFilename.lastIndexOf('.');
        return dot >= 0 ? originalFilename.substring(dot) : "";
    }
}
