import { useState, useEffect } from 'react';

export default function LocationTracker() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState<Date | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    // Retry location if kCLErrorLocationUnknown is received
    const retryAfterDelay = () => {
      setTimeout(() => {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
      }, 3000);
    };

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      setLocation({ latitude, longitude, accuracy });
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

    // Optionally you can also watch for live updates:
    // const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
    // return () => navigator.geolocation.clearWatch(watchId);

  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Location Tracker</h2>

      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-2 text-gray-600">Fetching your location...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <p className="mt-2 text-sm text-gray-600">
            Make sure location services are enabled and you're not in incognito mode.
          </p>
        </div>
      )}

      {location && !loading && !error && (
        <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
          <p className="font-bold">Location Found!</p>
          <ul className="mt-2 space-y-1">
            <li><span className="font-semibold">Latitude:</span> {location.latitude.toFixed(6)}</li>
            <li><span className="font-semibold">Longitude:</span> {location.longitude.toFixed(6)}</li>
            <li><span className="font-semibold">Accuracy:</span> {location.accuracy.toFixed(2)} meters</li>
            {timestamp && (
              <li><span className="font-semibold">Updated:</span> {timestamp.toLocaleString()}</li>
            )}
          </ul>

          <div className="mt-4">
            <a
              href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              View on Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
