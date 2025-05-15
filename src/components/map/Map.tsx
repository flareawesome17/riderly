import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProps {
  mapboxToken: string;
  selectedDriver: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  } | null;
}

export default function Map({ mapboxToken, selectedDriver }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  // Oroquieta City, Philippines coordinates
  const [lng] = useState(123.8106);
  const [lat] = useState(8.4848);
  const [zoom] = useState(13);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, lng, lat, zoom]);

  useEffect(() => {
    if (!map.current || !selectedDriver) return;

    // Remove existing markers
    const markers = document.getElementsByClassName("mapboxgl-marker");
    while (markers.length > 0) {
      markers[0].remove();
    }

    // Add new marker for selected driver
    new mapboxgl.Marker()
      .setLngLat([selectedDriver.longitude, selectedDriver.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3>${selectedDriver.name}</h3><p>Status: Active</p>`
        )
      )
      .addTo(map.current);

    // Center map on selected driver
    map.current.flyTo({
      center: [selectedDriver.longitude, selectedDriver.latitude],
      zoom: 12,
      essential: true,
    });
  }, [selectedDriver]);

  return (
    <div
      ref={mapContainer}
      className="h-[600px] w-full rounded-lg"
      style={{ height: "600px" }}
    />
  );
} 