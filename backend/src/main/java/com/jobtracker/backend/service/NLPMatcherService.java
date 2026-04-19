package com.jobtracker.backend.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NLPMatcherService {

    private static final Set<String> STOP_WORDS = new HashSet<>(Arrays.asList(
            "a", "an", "the", "and", "or", "but", "in", "on", "at", "to",
            "for", "of", "with", "by", "from", "is", "are", "was", "were",
            "be", "been", "have", "has", "had", "do", "does", "did", "will",
            "would", "could", "should", "may", "might", "shall", "can", "need",
            "we", "you", "they", "he", "she", "it", "this", "that", "these",
            "those", "i", "my", "your", "our", "their", "its", "as", "if",
            "when", "where", "who", "which", "what", "how", "not", "no", "so"
    ));

    private static final List<String> TECH_SKILLS = Arrays.asList(
            "java", "python", "javascript", "typescript", "c++", "c#", "ruby", "go",
            "spring", "springboot", "spring boot", "hibernate", "jpa", "maven", "gradle",
            "react", "angular", "vue", "nodejs", "node.js", "express", "nextjs",
            "mysql", "postgresql", "mongodb", "redis", "oracle", "sql", "nosql",
            "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "ci/cd",
            "git", "github", "gitlab", "bitbucket", "linux", "rest", "api",
            "microservices", "kafka", "rabbitmq", "elasticsearch", "graphql",
            "machine learning", "deep learning", "tensorflow", "pytorch", "nlp",
            "html", "css", "tailwind", "bootstrap", "sass", "webpack",
            "junit", "mockito", "testing", "agile", "scrum", "jira",
            "data structures", "algorithms", "dsa", "system design", "oops"
    );

    // Tokenize and clean text
    private List<String> tokenize(String text) {
        return Arrays.stream(text.toLowerCase()
                        .replaceAll("[^a-zA-Z0-9\\s+#.]", " ")
                        .split("\\s+"))
                .filter(w -> w.length() > 2)
                .filter(w -> !STOP_WORDS.contains(w))
                .collect(Collectors.toList());
    }

    // Calculate term frequency
    private Map<String, Double> termFrequency(List<String> tokens) {
        Map<String, Double> tf = new HashMap<>();
        tokens.forEach(token -> tf.merge(token, 1.0, Double::sum));
        int total = tokens.size();
        tf.replaceAll((k, v) -> v / total);
        return tf;
    }

    // Calculate IDF
    private Map<String, Double> inverseDocumentFrequency(
            List<String> doc1, List<String> doc2) {
        Map<String, Double> idf = new HashMap<>();
        Set<String> allTerms = new HashSet<>();
        allTerms.addAll(doc1);
        allTerms.addAll(doc2);

        allTerms.forEach(term -> {
            int count = 0;
            if (doc1.contains(term)) count++;
            if (doc2.contains(term)) count++;
            idf.put(term, Math.log(2.0 / (count + 1)) + 1);
        });
        return idf;
    }

    // Calculate TF-IDF vector
    private Map<String, Double> tfidfVector(
            List<String> tokens, Map<String, Double> idf) {
        Map<String, Double> tf = termFrequency(tokens);
        Map<String, Double> tfidf = new HashMap<>();
        tf.forEach((term, tfVal) ->
                tfidf.put(term, tfVal * idf.getOrDefault(term, 1.0)));
        return tfidf;
    }

    // Calculate cosine similarity
    private double cosineSimilarity(
            Map<String, Double> vec1, Map<String, Double> vec2) {
        Set<String> common = new HashSet<>(vec1.keySet());
        common.retainAll(vec2.keySet());

        double dotProduct = common.stream()
                .mapToDouble(k -> vec1.get(k) * vec2.get(k))
                .sum();

        double mag1 = Math.sqrt(vec1.values().stream()
                .mapToDouble(v -> v * v).sum());
        double mag2 = Math.sqrt(vec2.values().stream()
                .mapToDouble(v -> v * v).sum());

        if (mag1 == 0 || mag2 == 0) return 0;
        return dotProduct / (mag1 * mag2);
    }

    // Extract skills from text
    private List<String> extractSkills(String text) {
        String lower = text.toLowerCase();
        return TECH_SKILLS.stream()
                .filter(lower::contains)
                .collect(Collectors.toList());
    }

    // Main match method
    public Map<String, Object> match(String resumeText, String jobText) {
        List<String> resumeTokens = tokenize(resumeText);
        List<String> jobTokens = tokenize(jobText);

        Map<String, Double> idf = inverseDocumentFrequency(resumeTokens, jobTokens);
        Map<String, Double> resumeVec = tfidfVector(resumeTokens, idf);
        Map<String, Double> jobVec = tfidfVector(jobTokens, idf);

        double similarity = cosineSimilarity(resumeVec, jobVec);
        int matchScore = (int) Math.round(similarity * 100);

        // Extract skills
        List<String> resumeSkills = extractSkills(resumeText);
        List<String> jobSkills = extractSkills(jobText);

        List<String> matchingSkills = resumeSkills.stream()
                .filter(jobSkills::contains)
                .collect(Collectors.toList());

        List<String> missingSkills = jobSkills.stream()
                .filter(s -> !resumeSkills.contains(s))
                .collect(Collectors.toList());

        // Generate suggestions
        List<String> suggestions = new ArrayList<>();
        if (!missingSkills.isEmpty()) {
            suggestions.add("Add these missing skills to your resume: " +
                    String.join(", ", missingSkills.subList(0, Math.min(3, missingSkills.size()))));
        }
        if (matchScore < 50) {
            suggestions.add("Tailor your resume more specifically to match the job description keywords");
        }
        if (resumeTokens.size() < 100) {
            suggestions.add("Your resume seems short. Add more details about your experience and projects");
        }
        suggestions.add("Quantify your achievements with numbers and metrics for better impact");

        // Summary
        String summary;
        if (matchScore >= 70) summary = "Strong match! Your profile aligns well with this role.";
        else if (matchScore >= 40) summary = "Moderate match. Some improvements can increase your chances.";
        else summary = "Low match. Consider tailoring your resume for this role.";

        Map<String, Object> result = new HashMap<>();
        result.put("matchScore", matchScore);
        result.put("matchingSkills", matchingSkills);
        result.put("missingSkills", missingSkills);
        result.put("suggestions", suggestions);
        result.put("summary", summary);

        return result;
    }
}