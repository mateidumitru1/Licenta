package com.matei.backend.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;

@Service
public class ImageService {

    private final String url = "https://storage.googleapis.com/matei-storage/";

    public String saveImage(String folderName, String imageName) throws IOException {

        GoogleCredentials credentials = GoogleCredentials.fromStream(new ClassPathResource("gcp-credentials.json").getInputStream());

        Storage storage = StorageOptions
                .newBuilder()
                .setCredentials(credentials)
                .build()
                .getService();

        String bucketName = "matei-storage";
        Bucket bucket = storage.get(bucketName);

        File localImageFile = ResourceUtils.getFile("classpath:" + folderName + "/" + imageName + ".jpg");

        String blobName = folderName + "/" + imageName + ".jpg";

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
}
