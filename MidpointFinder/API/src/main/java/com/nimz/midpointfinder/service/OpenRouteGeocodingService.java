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

import java.util.ArrayList;
import java.util.Arrays;
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

        String openRouteGeocodingSearchStructuredURL = String.format(
                "https://api.openrouteservice.org/geocode/search/structured?api_key=%s&address=%s",
                appConfig.getOrsApiKey(),
                location
        );

        ResponseEntity<String> response = restTemplate.getForEntity(openRouteGeocodingSearchStructuredURL, String.class);

        JsonNode root = mapper.readTree(response.getBody());
        JsonNode coordinatesNode = root.path("features")
                                        .get(0)
                                        .path("geometry")
                                        .path("coordinates");

        if(coordinatesNode.isArray()) {
            return Arrays.asList(coordinatesNode.get(0).asDouble(), coordinatesNode.get(1).asDouble());
        }
        System.out.println(coordinatesNode);
//        return null;
        return null;
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
