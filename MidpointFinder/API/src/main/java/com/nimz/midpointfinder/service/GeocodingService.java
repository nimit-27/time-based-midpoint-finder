package com.nimz.midpointfinder.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.nimz.midpointfinder.model.Coordinate;
import com.nimz.midpointfinder.model.Location;

import java.util.List;

public interface GeocodingService {
    List<Double> geocode(String location) throws JsonProcessingException;
    String reverseGeocode(Coordinate coordinate);
    List<Location> geocodeAutocompleteList(String location);
}
