package com.jobtracker.backend.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class JobFetchService {

    public Map<String, String> fetchJobDetails(String url) {
        Map<String, String> result = new HashMap<>();
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .timeout(10000)
                    .get();

            String title = "";
            String company = "";
            String description = "";

            // Try meta tags first
            title = doc.select("meta[property=og:title]").attr("content");
            description = doc.select("meta[property=og:description]").attr("content");

            // LinkedIn specific
            if (url.contains("linkedin.com")) {
                if (title.isEmpty()) title = doc.select("h1.top-card-layout__title").text();
                if (company.isEmpty()) company = doc.select("a.topcard__org-name-link").text();
                if (company.isEmpty()) company = doc.select("span.topcard__flavor").first() != null ?
                        doc.select("span.topcard__flavor").first().text() : "";
            }

            // Naukri specific
            if (url.contains("naukri.com")) {
                if (title.isEmpty()) title = doc.select("h1.jd-header-title").text();
                if (company.isEmpty()) company = doc.select("a.jd-header-comp-name").text();
                if (description.isEmpty()) description = doc.select("div.job-desc").text();
            }

            // Indeed specific
            if (url.contains("indeed.com")) {
                if (title.isEmpty()) title = doc.select("h1.jobsearch-JobInfoHeader-title").text();
                if (company.isEmpty()) company = doc.select("div.jobsearch-CompanyInfoContainer").text();
            }

            // Generic fallback
            if (title.isEmpty()) title = doc.title();
            if (company.isEmpty()) {
                company = doc.select("meta[property=og:site_name]").attr("content");
            }
            if (description.isEmpty()) {
                description = doc.select("meta[name=description]").attr("content");
            }

            // Clean up title
            if (title.contains(" - ")) {
                String[] parts = title.split(" - ");
                if (company.isEmpty() && parts.length > 1) {
                    company = parts[parts.length - 1].trim();
                }
                title = parts[0].trim();
            }
            if (title.contains(" at ")) {
                String[] parts = title.split(" at ");
                if (company.isEmpty() && parts.length > 1) {
                    company = parts[1].trim();
                }
                title = parts[0].trim();
            }

            result.put("jobTitle", title.isEmpty() ? "Software Engineer" : title);
            result.put("companyName", company.isEmpty() ? "Unknown Company" : company);
            result.put("description", description.isEmpty() ? "" : description.substring(0, Math.min(500, description.length())));
            result.put("success", "true");

        } catch (Exception e) {
            result.put("success", "false");
            result.put("error", "Could not fetch job details: " + e.getMessage());
        }
        return result;
    }
}