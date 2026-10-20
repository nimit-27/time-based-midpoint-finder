import React, { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import CircleMarkerTooltip from "./UI/CircleMarkerTooltip";
import MyButton from "./UI/Button/MyButton";
import TravelModeSelector from "./UI/TravelModeSelector";
import { getMidpoint, getPathBetweenTwoCoordinates } from "../service/mapService";
import { Coordinate, Path } from "../types/types";
import useApi from "../hooks/useApi";

// Helper functions
const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters.toFixed(0)} m`;
  }
  if (meters < 10000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(0)} sec`;
  }
  if (seconds < 3600) {
    return `${(seconds / 60).toFixed(0)} min`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

const getLatLngObj = (arr: [number, number]): Coordinate => {
  return {
    latitude: arr[0],
    longitude: arr[1],
  };
};

interface MapComponentProps {
  startPoint2: [number, number] | null;
  startPoint1: [number, number] | null;
  setStartPoint1: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  setStartPoint2: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}

const DEFAULT_CENTER: [number, number] = [28, 77];

const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ startPoint1, startPoint2, setStartPoint1, setStartPoint2 }) => {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  console.log("startPoint1", startPoint1);
  // const [startPoint1, setStartPoint1] = useState<[number, number] | null>(null);
  // const [startPoint2, setStartPoint2] = useState<[number, number] | null>(null);
  const [pendingStartPoint, setPendingStartPoint] = useState<
    [number, number] | null
  >(null);
  const [midPoint, setMidPoint] = useState<[number, number] | null>(null);
  const [paths, setPaths] = useState<Path[]>([]);
  const [travelMode, setTravelMode] = useState<string>("driving-car");

  // API hook call | getMidpoint 
  const {
    getApiHandler: fetchMidpoint,
    isLoading: isMidpointLoading,
    data: midpointData,
    isSuccess: isMidpointSuccess,
    error: midpointError,
  } = useApi<[number, number]>();

  // API hook call | getPathBetweenTwoCoordinates
  const {
    getApiHandler: fetchPath,
    isLoading: isPathLoading,
    data: pathData,
    isSuccess: isPathSuccess,
    error: pathError,
  } = useApi();

  const handleMapClick = (clickedPoint: [number, number]) => {
    setCenter(clickedPoint);

    if (!startPoint1) {
      setStartPoint1(clickedPoint);
    } else if (!startPoint2) {
      setStartPoint2(clickedPoint);
    } else {
      setPendingStartPoint(clickedPoint);
    }
  };

  // API call to get the midpoint between two coordinates
  const getMidpointHandler = (
    coord1: [number, number] | null,
    coord2: [number, number] | null
  ) => {
    if (!coord1 || !coord2) {
      alert("Please select two points on the map to get the midpoint.");
      return;
    }

    let payload: [Coordinate, Coordinate] = [
      getLatLngObj(coord1),
      getLatLngObj(coord2),
    ]

    fetchMidpoint(getMidpoint, payload, travelMode)
  };

  const getPathHandler = (
    coord1: [number, number] | null,
    coord2: [number, number] | null
  ) => {
    if (!coord1 || !coord2) {
      alert("Please select two points on the map to get the path.");
      return;
    }

    let payload: [Coordinate, Coordinate] = [
      getLatLngObj(coord1),
      getLatLngObj(coord2),
    ]

    getPathBetweenTwoCoordinates(payload, travelMode)
      .then((response) => {
        setPaths((prev) => [...prev, response.data]);
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching midpoint:", error);
      });
  };

  const setNewStartPoint = (startPoint: string) => {
    if (startPoint === "1") setStartPoint1(pendingStartPoint);
    else if (startPoint === "2") setStartPoint2(pendingStartPoint);
    setPendingStartPoint(null);
    setMidPoint(null);
    setPaths([]);
  };

  useEffect(() => {
    if (pendingStartPoint) {
      setCenter(pendingStartPoint);
    }
  }, [pendingStartPoint]);

  useEffect(() => {
    if (startPoint2) {
      setCenter(startPoint2);
    } else if (startPoint1) {
      setCenter(startPoint1);
    } else {
      setCenter(DEFAULT_CENTER);
    }
  }, [startPoint1, startPoint2]);

  useMemo(() => {
    if (isMidpointSuccess) {
      console.log("API call successful:", midpointData);
      if (midpointData && startPoint1 && startPoint2) {
        setMidPoint(midpointData); // Assuming response is [lat, lng]
        setPaths([]);
        Promise.all([
          getPathHandler(startPoint1, midpointData),
          getPathHandler(startPoint2, midpointData),
        ]);
      }
    }
  }, [isMidpointSuccess]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => handleMapClick([e.latlng.lat, e.latlng.lng]),
    });
    return null;
  };

  const resetMap = () => {
    setStartPoint1(null);
    setStartPoint2(null);
    setPendingStartPoint(null);
    setMidPoint(null);
    setPaths([]);
  };

  return (
    <div className="w90">
      <TravelModeSelector value={travelMode} onChange={setTravelMode} />
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: "100%", height: "500px" }}
      >
        <MapUpdater center={center} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        {startPoint1 && (
          <CircleMarkerTooltip coordinates={startPoint1}>
            <div className="text-sm font-medium">Start 1</div>
          </CircleMarkerTooltip>
        )}
        {startPoint2 && (
          <CircleMarkerTooltip coordinates={startPoint2}>
            <div className="text-sm font-medium">Start 2</div>
          </CircleMarkerTooltip>
        )}
        {pendingStartPoint && (
          <CircleMarkerTooltip
            coordinates={pendingStartPoint}
            color="orange"
            tooltipProps={{ interactive: true }}
          >
            <div
              className="text-sm font-medium button-group"
              onClick={(e) => e.stopPropagation()}
            >
              <MyButton className="my-button-dark" onClick={() => setNewStartPoint("1")}>Set Start 1</MyButton>
              <MyButton className="my-button-dark" onClick={() => setNewStartPoint("2")}>Set Start 2</MyButton>
              <MyButton className="my-button-dark" onClick={() => setPendingStartPoint(null)} aria-label="Remove Tooltip">✖</MyButton>
            </div>
          </CircleMarkerTooltip>
        )}

        {paths.map((path, i) => {
          return (
            <Polyline
              key={`path-${i}`}
              positions={path?.wayPoints.map((wp: any[]) => [wp[1], wp[0]])}
              color="blue"
            >
              <Tooltip
                permanent
                // direction="auto"
                className="bg-white p-2 rounded shadow-lg"
                offset={[10, 10]}
              >
                <div className="text-sm font-medium">
                  <div>{path?.distance != null ? formatDistance(path.distance) : "-"}</div>
                  <div>{path?.duration != null ? formatDuration(path.duration) : "-"}</div>
                </div>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* Midpoint Marker */}
        {midPoint && <CircleMarker center={midPoint} radius={4} color="red" />}
      </MapContainer>

      <div className="button-group">
        <MyButton onClick={() => getPathHandler(startPoint1, startPoint2)}>Get Path</MyButton>
        <MyButton onClick={() => getMidpointHandler(startPoint1, startPoint2)} disabled={!paths?.length}>Get Midpoint</MyButton>
        <MyButton onClick={resetMap}>Reset</MyButton>
      </div>
    </div>
  );
};

export default MapComponent;
