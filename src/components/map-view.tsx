'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { Marker, DirectionsRenderer, Circle, GoogleMap } from '@react-google-maps/api';
import toast, { Toaster } from 'react-hot-toast';
import { LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '92.5vw',
  height: '80vh',
  marginTop: '-10px'
};

const startingPoint = { lat: 30.762357, lng: 76.598619 }; // Starting Point A

export default function MapView() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distanceTraveled, setDistanceTraveled] = useState<number | null>(null);
  // Add these (or update if you already have similar states)
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [timestamp, setTimestamp] = useState<Date | null>(null);

  const mapRef = useRef<GoogleMap | null>(null);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const fetchCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setCurrentLocation(newLocation);

        // Calculate distance from starting point
        const distance = calculateDistance(
          startingPoint.lat,
          startingPoint.lng,
          latitude,
          longitude
        );
        setDistanceTraveled(distance);
      },
      (error) => {
        toast.error("Unable to fetch current location")
        console.error(error);
      }
    );
  };

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    if (mapLoaded && currentLocation) {
      const directionsService = new window.google.maps.DirectionsService();

      // Request route from starting point to current location
      directionsService.route(
        {
          origin: startingPoint,
          destination: currentLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            toast.error('Unable to fetch directions')
          }
        }
      );
    }
  }, [mapLoaded, currentLocation, toast]);

  const [currentSpeed, setCurrentSpeed] = useState<number>(0);



  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const retryAfterDelay = () => {
      setTimeout(() => {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
      }, 3000);
    };

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      setCurrentLocation({ lat: latitude, lng: longitude });
      setTimestamp(new Date(position.timestamp));
      setLoading(false);
      setError(null);
    };

    const handleError = (error: GeolocationPositionError) => {
      console.error("Geolocation error:", error);
      if (
        error.code === error.POSITION_UNAVAILABLE ||
        error.message.includes('LocationUnknown')
      ) {
        setError('Location is temporarily unavailable. Retrying...');
        retryAfterDelay();
      } else if (error.code === error.PERMISSION_DENIED) {
        setError('Permission denied. Please allow location access.');
      } else if (error.code === error.TIMEOUT) {
        setError('Request timed out. Please try again.');
      } else {
        setError(error.message);
      }
      setLoading(false);
    };

    // Get current position initially
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, []);


  const speedLimitZone = {
    center: { lat: 30.756109, lng: 76.642427 }, // Zone center coordinate
    radius: 500, // in meters
    speedLimit: 30, // speed limit in km/h
  };

  useEffect(() => {
    if (currentLocation && currentSpeed) {
      // Calculate the distance (in km) from current location to the zone center,
      // then convert to meters:
      const distanceToZone = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        speedLimitZone.center.lat,
        speedLimitZone.center.lng
      ) * 1000;

      if (distanceToZone <= speedLimitZone.radius && currentSpeed > speedLimitZone.speedLimit) {
        toast.error(
          `Speed limit exceeded! Limit is ${speedLimitZone.speedLimit} km/h, current speed is ${currentSpeed.toFixed(
            2
          )} km/h`
        );
      }
    }
  }, [currentLocation, currentSpeed]);


  return (
    <div className="-z-10 border-none outline-none">
      <Toaster position='top-center' />
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_KEY}>
        <GoogleMap
          ref={mapRef}
          mapContainerStyle={containerStyle}
          center={startingPoint}
          zoom={12}
          onLoad={handleMapLoad}
        >
          {/* Directions Renderer */}
          {directions && (
            <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />
          )}

          {/* Starting Point Marker */}
          <Marker position={startingPoint} label=" " />

          {/* Current Location Marker with Custom Icon */}
          {mapLoaded && currentLocation && (
            <Marker
              position={currentLocation}
              icon={{
                url: 'https://cdn-icons-png.flaticon.com/512/1048/1048329.png',
                scaledSize: new window.google.maps.Size(50, 50),
              }}
            />
          )}

          {/* Add a circular fence at the coordinate 30.756109,76.642427 */}
          <Circle
            center={{ lat: 30.740255, lng: 76.675231 }}
            radius={700} // Radius in meters; adjust as needed
            options={{
              fillColor: "#FF0000",
              fillOpacity: 0.2,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              clickable: false,
              zIndex: 1,
            }}
          />
          <Circle
            center={{ lat: 30.735144, lng: 76.690829 }}
            radius={700} // Radius in meters; adjust as needed
            options={{
              fillColor: "#FF0000",
              fillOpacity: 0.2,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              clickable: false,
              zIndex: 1,
            }}
          />
          <Circle
            center={{ lat: 30.733228, lng: 76.762807 }}
            radius={700} // Radius in meters; adjust as needed
            options={{
              fillColor: "#FF0000",
              fillOpacity: 0.2,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              clickable: false,
              zIndex: 1,
            }}
          />
          <Circle
            center={{ lat: 30.730701, lng: 76.716321 }}
            radius={700} // Radius in meters; adjust as needed
            options={{
              fillColor: "#FF0000",
              fillOpacity: 0.2,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              clickable: false,
              zIndex: 1,
            }}
          />
          <Circle
            center={{ lat: 30.714921, lng: 76.807727 }}
            radius={700} // Radius in meters; adjust as needed
            options={{
              fillColor: "#FF0000",
              fillOpacity: 0.2,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              clickable: false,
              zIndex: 1,
            }}
          />
        </GoogleMap>

      </LoadScript>

      
      {/* Linear Current Speed Card */}
      <div className="rounded-xl flex justify-between shadow-lg p-4 bg-indigo-100 ">
        <div className="flex">
          <h2 className="text-xl font-bold">Distance Traveled:</h2>
          {distanceTraveled !== null && (
            <p className="text-xl ml-1" >{distanceTraveled.toFixed(2)} km</p>
          )}
        </div>
        <div className="flex">
          <h2 className="text-xl font-bold ">Current Speed:  </h2>
          <p className="text-xl ml-1">
            {currentSpeed.toFixed(2)} km/h
          </p>
        </div>
      </div>

    </div>
  );
}
