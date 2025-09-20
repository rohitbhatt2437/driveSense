import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerId = "qr-scanner-container";

  // Helper to stop and clear the scanner
  const stopScanner = () => {
    if (scannerRef.current) {
      // Only try to stop if we’re actually scanning
      if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
        scannerRef.current.stop()
          .then(() => {
            // Clean up DOM elements from the scanner
            scannerRef.current?.clear();
          })
          .catch((error) => {
            console.error("Error stopping scanner:", error);
          });
      } else {
        // If it's not in SCANNING state, we can try clearing directly
        try {
          scannerRef.current.clear();
        } catch (err) {
          console.error("Error clearing scanner:", err);
        }
      }
    }
  };

  const startScanner = async () => {
    if (!scannerRef.current) {
      // Create a new scanner instance *only if* we haven't yet
      scannerRef.current = new Html5Qrcode(scannerId);
    }

    const config = { fps: 10, qrbox: 250 };

    // If we’re already scanning, skip re-initializing
    if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
      return;
    }

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          console.log("✅ Scanned:", decodedText);
          onScanSuccess(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          console.warn("QR Error:", errorMessage);
        }
      );
    } catch (error) {
      console.error("Unable to start scanner:", error);
    }
  };

  useEffect(() => {
    // Start only once on mount
    startScanner();

    // On unmount, stop and clear
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Close Button */}
      <button
        type="button"
        onClick={() => {
          stopScanner();
          onClose();
        }}
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md"
      >
        <X className="w-5 h-5 text-black" />
      </button>

      {/* This is where the camera feed lives */}
      <div id={scannerId} className="w-full h-full" />
    </div>
  );
};

export default QRScanner;
