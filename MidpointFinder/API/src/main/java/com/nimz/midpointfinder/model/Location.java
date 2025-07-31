package com.nimz.midpointfinder.model;

import java.util.List;

public class Location {
    private String name;
    private List<Double> coordinates;

    public Location(String name, List<Double> coordinates) {
        this.name = name;
        this.coordinates = coordinates;
    }

    public Location(String name, Coordinate coordinate) {
        this.name = name;
        this.coordinates = List.of(coordinate.getLatitude(), coordinate.getLongitude());
    }

    public List<Double> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<Double> coordinates) {
        this.coordinates = coordinates;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
