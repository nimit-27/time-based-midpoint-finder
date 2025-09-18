package com.nimz.midpointfinder.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimz.midpointfinder.config.AppConfig;
import com.nimz.midpointfinder.model.Coordinate;
import com.nimz.midpointfinder.model.Location;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@Service
public class OpenRouteGeocodingService implements GeocodingService{
    private final AppConfig appConfig;
    private final RestTemplate restTemplate = new RestTemplate();

    public OpenRouteGeocodingService(AppConfig appConfig) {
        this.appConfig = appConfig;
    }

    @Override
    public List<Double> geocode(String location) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();

        String openRouteGeocodingSearchURL = UriComponentsBuilder
                .fromHttpUrl("https://api.openrouteservice.org/geocode/search")
                .queryParam("api_key", appConfig.getOrsApiKey())
                .queryParam("text", location)
                .build()
                .encode()
                .toUriString();

        ResponseEntity<String> response = restTemplate.getForEntity(openRouteGeocodingSearchURL, String.class);

        JsonNode root = mapper.readTree(response.getBody());
        JsonNode featuresNode = root.path("features");

        if (featuresNode.isArray() && featuresNode.size() > 0) {
            JsonNode coordinatesNode = featuresNode
                    .get(0)
                    .path("geometry")
                    .path("coordinates");

            if (coordinatesNode.isArray() && coordinatesNode.size() >= 2) {
                double longitude = coordinatesNode.get(0).asDouble();
                double latitude = coordinatesNode.get(1).asDouble();
                return List.of(latitude, longitude);
            }
        }

        return List.of();
    }

    @Override
    public String reverseGeocode(Coordinate coordinate) {
        return "";
    }

    @Override
    public List<Location> geocodeAutocompleteList(String location) {
        ObjectMapper mapper = new ObjectMapper();

        String openRouteGeocodeAutocompleteURL = String.format(
                "https://api.openrouteservice.org/geocode/autocomplete?api_key=%s&text=%s",
                appConfig.getOrsApiKey(),
                location
        );

        ResponseEntity<String> response = restTemplate.getForEntity(openRouteGeocodeAutocompleteURL, String.class);

        List<Location> locations = new ArrayList<>();
        try {
            JsonNode root = mapper.readTree(response.getBody());
            for (JsonNode feature : root.path("features")) {
                String name = feature.path("properties").path("name").asText();
                JsonNode coordinatesNode = feature.path("geometry").path("coordinates");
                if (coordinatesNode.isArray() && coordinatesNode.size() >= 2) {
                    double longitude = coordinatesNode.get(0).asDouble();
                    double latitude = coordinatesNode.get(1).asDouble();
                    locations.add(new Location(name, List.of(latitude, longitude)));
                }
            }
        } catch (JsonProcessingException e) {
            return List.of();
        }

        return locations;
    }
}
