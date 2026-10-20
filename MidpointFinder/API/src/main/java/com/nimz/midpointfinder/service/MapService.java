package com.nimz.midpointfinder.service;

import com.nimz.midpointfinder.model.Coordinate;
import com.nimz.midpointfinder.model.Path;

import java.util.List;

public interface MapService {

    Path getPath(Coordinate start, Coordinate end, String travelMode);

    List<List<Double>> getWaypoints(Coordinate start, Coordinate end, String travelMode);

    Long getDurationBetweenTwoPoints(Coordinate start, Coordinate end, String travelMode);

    Long getDurationBetweenTwoPoints(List<Double> start, List<Double> end, String travelMode);

}
