"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Map container style (fills parent wrapper)
const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

const startingPoint = { lat: 30.762357, lng: 76.598619 }; // Starting Point A

// Red hazard circles (same as Google Map circles in map-view.tsx)
const hazardPoints: Array<{ lat: number; lng: number }> = [
  { lat: 30.740255, lng: 76.675231 },
  { lat: 30.735144, lng: 76.690829 },
  { lat: 30.733228, lng: 76.762807 },
  { lat: 30.730701, lng: 76.716321 },
  { lat: 30.714921, lng: 76.807727 },
];

// Build a GeoJSON FeatureCollection for hazard points
const hazardsGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: hazardPoints.map((p) => ({
    type: "Feature",
    properties: {},
    geometry: {
      type: "Point",
      coordinates: [p.lng, p.lat],
    },
  })),
};

const MapboxView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const token = (import.meta as any)?.env?.VITE_MAPBOX_TOKEN as string | undefined;
  const containerWrapperRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(() => {
    const vh = (window as any).visualViewport?.height ?? window.innerHeight;
    const isMd = window.innerWidth >= 768;
    const headerOffset = isMd ? 40 /* 2.5rem from pt-10 */ : 0;
    return Math.max(0, vh - headerOffset);
  });

  useEffect(() => {
    const updateHeight = () => {
      const vh = (window as any).visualViewport?.height ?? window.innerHeight;
      const isMd = window.innerWidth >= 768;
      const headerOffset = isMd ? 40 : 0;
      setContainerHeight(Math.max(0, Math.floor(vh - headerOffset)));
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    (window as any).visualViewport?.addEventListener?.("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
      (window as any).visualViewport?.removeEventListener?.("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    // Use provided token fallback if env is not set
    mapboxgl.accessToken =
      token ||
      "pk.eyJ1Ijoicm9oaXRiaGF0dDI0MzciLCJhIjoiY21mbWRia3NzMDBzMDJrc2J6cXg5aTBqeCJ9.d9SBYA8rSq4chTptEmx69w";

    if (!mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [startingPoint.lng, startingPoint.lat],
      zoom: 12,
    });
    mapInstance.current = map;

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");

    map.on("load", () => {
      // Add hazard points source
      if (!map.getSource("hazards")) {
        map.addSource("hazards", {
          type: "geojson",
          data: hazardsGeoJSON,
        });
      }

      // Circles in meters approximated via zoom-based pixel radii
      // At z=10 -> ~5px, z=12 -> ~22px, z=14 -> ~85px (approx for ~700m around ~30.7° lat)
      if (!map.getLayer("hazard-circles")) {
        map.addLayer({
          id: "hazard-circles",
          type: "circle",
          source: "hazards",
          paint: {
            "circle-color": "#FF0000",
            "circle-opacity": 0.2,
            "circle-stroke-color": "#FF0000",
            "circle-stroke-opacity": 0.8,
            "circle-stroke-width": 2,
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              10, 5,
              12, 22,
              14, 85,
              16, 170,
            ],
          },
        });
      }

      // Add starting point marker
      new mapboxgl.Marker({ color: "#3FB1CE" })
        .setLngLat([startingPoint.lng, startingPoint.lat])
        .addTo(map);

      // Attempt to get current location and show truck icon similar to Google Maps
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            const el = document.createElement("div");
            el.style.width = "40px";
            el.style.height = "40px";
            el.style.backgroundImage =
              "url('https://cdn-icons-png.flaticon.com/512/1048/1048329.png')";
            el.style.backgroundSize = "contain";
            el.style.backgroundRepeat = "no-repeat";

            new mapboxgl.Marker({ element: el })
              .setLngLat([longitude, latitude])
              .addTo(map);
          },
          () => {
            // ignore errors silently
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [token]);

  return (
    <div ref={containerWrapperRef} className="w-full" style={{ height: containerHeight }}>
      <div ref={mapRef} style={containerStyle} className="w-full h-full" />
    </div>
  );
};

export default MapboxView;
