import React from "react";
import { CircleMarker, CircleMarkerProps, Tooltip, TooltipProps } from "react-leaflet";

/**
 * CircleMarkerTooltip Component
 * 
 * This component is a reusable wrapper around the `CircleMarker` and `Tooltip` components from `react-leaflet`.
 * It allows you to display a circle marker on a map with an optional tooltip.
 * 
 * Props:
 * - `coordinates` (required): The `[latitude, longitude]` coordinates where the circle marker will be placed.
 * - `radius` (optional): The radius of the circle marker. Default is `4`.
 * - `color` (optional): The color of the circle marker. Default is `"green"`.
 * - `className` (optional): Custom CSS classes for the tooltip. Default is `"bg-white p-2 rounded shadow-lg"`.
 * - `offset` (optional): Offset for the tooltip position. Default is `[10, 10]`.
 * - `tooltipProps` (optional): Additional props to pass to the `Tooltip` component.
 * - `children` (optional): React nodes to render inside the tooltip.
 * 
 * How It Works:
 * - The `CircleMarker` is rendered at the specified `coordinates` with the given `radius` and `color`.
 * - A `Tooltip` is nested inside the `CircleMarker` and is displayed permanently.
 * - The `Tooltip` can be customized using the `className`, `offset`, and `tooltipProps` props.
 * - Any content passed as `children` will be rendered inside the `Tooltip`.
 * 
 * Example Usage:
 * ```tsx
 * <CircleMarkerTooltip
 *   coordinates={[51.505, -0.09]}
 *   radius={6}
 *   color="blue"
 *   className="custom-tooltip-class"
 *   offset={[15, 15]}
 * >
 *   <div>Custom Tooltip Content</div>
 * </CircleMarkerTooltip>
 * ```
 * 
 * This will render a blue circle marker at the specified coordinates with a tooltip containing "Custom Tooltip Content".
 */

type CircleMarkerTooltipProps = Omit<CircleMarkerProps, "center" | "radius"> & {
  coordinates: [number, number];
  radius?: number;
  color?: string;
  className?: string;             // Override tooltip class
  offset?: [number, number];      //Override tooltip offset
  tooltipProps?: TooltipProps;
  children?: React.ReactNode;
};

const CircleMarkerTooltip: React.FC<CircleMarkerTooltipProps> = ({
  coordinates,
  radius = 4,
  color = "green",
  className = "",
  offset = [10, 10],
  tooltipProps,
  children,
}) => {
  return (
    <CircleMarker center={coordinates} radius={radius} color={color}>
      <Tooltip
        permanent
        className={`tooltip ${className}`}
        offset={offset}
        {...tooltipProps}
      >
        {children}
      </Tooltip>
    </CircleMarker>
  );
};

export default CircleMarkerTooltip;
