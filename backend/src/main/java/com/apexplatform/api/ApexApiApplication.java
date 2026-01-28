package com.apexplatform.api;

import java.util.TimeZone;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ApexApiApplication {
    public static void main(String[] args) {
        // Ensure consistent timezone across JVM + JDBC driver + database session.
        // Some Windows/JDK timezone mappings can resolve to legacy IDs like "Asia/Calcutta",
        // which PostgreSQL 16 rejects during connection startup.
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        System.out.println("[apex-api] JVM default TimeZone = " + TimeZone.getDefault().getID());
        SpringApplication.run(ApexApiApplication.class, args);
    }
}

