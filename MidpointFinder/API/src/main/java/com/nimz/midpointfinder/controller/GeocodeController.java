package com.nimz.midpointfinder.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.nimz.midpointfinder.model.Location;
import com.nimz.midpointfinder.service.GeocodingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class GeocodeController {
    GeocodingService geocodingService;

    @Autowired
    public GeocodeController(GeocodingService geocodingService) {
        this.geocodingService = geocodingService;
    }

    @GetMapping("/getCoordinatesFromLocation/{location}")
    public ResponseEntity<List<Double>> getCoordinatesFromLocation(@PathVariable("location") String location) throws JsonProcessingException {
        if(!location.isEmpty()) {
            List<Double> coordinates = geocodingService.geocode(location);
            System.out.println("coordinates :" + coordinates);
            return ResponseEntity.ok(coordinates);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getAutoCompleteSuggestions/{location}")
    public ResponseEntity<List<Location>> getAutoCompleteSuggestions(@PathVariable("location") String location) {
        if(location.isEmpty()) return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(geocodingService.geocodeAutocompleteList(location));
    }
}
