package ru.aston.backend.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    /** Generic upload used by banners/promos and anywhere else that isn't a product photo. */
    @PostMapping("/api/v1/files")
    public UploadResponse upload(@RequestParam("file") MultipartFile file) {
        String key = fileStorageService.upload(file);
        return new UploadResponse(key, fileStorageService.publicUrl(key));
    }
}
