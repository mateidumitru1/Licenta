package com.matei.backend.service;

import ch.qos.logback.classic.spi.LoggingEventVO;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class ImageService {

    private final String url = "https://storage.googleapis.com/matei-storage/";

    public String saveImage(String directoryName, String imageName) throws IOException {

        GoogleCredentials credentials = GoogleCredentials.fromStream(new ClassPathResource("gcp-credentials.json").getInputStream());

        Storage storage = StorageOptions
                .newBuilder()
                .setCredentials(credentials)
                .build()
                .getService();

        String bucketName = "matei-storage";
        Bucket bucket = storage.get(bucketName);

        File localImageFile = ResourceUtils.getFile("classpath:" + directoryName + "/" + imageName + ".jpg");

        String blobName = generateObjectPath(directoryName, imageName + ".jpg");

        try (InputStream inputStream = new FileInputStream(localImageFile)) {
            byte[] imageBytes = inputStream.readAllBytes();
            Blob blob = bucket.create(blobName, imageBytes);

            return url + blob.getName();

        } catch (IOException e) {
            // TODO: handle exception
            e.printStackTrace();
        }

        return "#";
    }

    public String saveImage(String directoryName, MultipartFile image) throws IOException {

        GoogleCredentials credentials = GoogleCredentials.fromStream(new ClassPathResource("gcp-credentials.json").getInputStream());

        Storage storage = StorageOptions
                .newBuilder()
                .setCredentials(credentials)
                .build()
                .getService();

        String bucketName = "matei-storage";
        Bucket bucket = storage.get(bucketName);

        String blobName = generateObjectPath(directoryName, image.getOriginalFilename());

        try (InputStream inputStream = image.getInputStream()) {
            byte[] imageBytes = inputStream.readAllBytes();
            Blob blob = bucket.create(blobName, imageBytes);

            return url + blob.getName();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return "#";
    }

    public void deleteImage(String url) {
        try {
            String objectName = getObjectFromUrl(url);

            if (objectName != null) {
                GoogleCredentials credentials = GoogleCredentials.fromStream(new ClassPathResource("gcp-credentials.json").getInputStream());
                Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();

                String bucketName = "matei-storage";

                storage.get(bucketName).get(objectName).delete();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String getObjectFromUrl(String url) {
        String prefix = "https://storage.googleapis.com/matei-storage/";
        if (url.startsWith(prefix)) {
            return url.substring(prefix.length());
        } else {
            return null;
        }
    }

    private String generateObjectPath(String directoryName, String imageName) {
        return directoryName + "/" + UUID.randomUUID() + "-" + imageName;
    }
}
