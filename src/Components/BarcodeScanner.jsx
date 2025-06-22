// 'use client';
// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Html5QrcodeScanner } from 'html5-qrcode';

// export default function BarcodeScanner({ onScan }) {
//   const [dataScaner, setDataScaner] = useState(null);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   useEffect(() => {
//     if (!isClient) return;

//     let scanner = null;

//     try {
//       scanner = new Html5QrcodeScanner('reader', {
//         fps: 5,
//         qrbox: { width: 250, height: 250 }
//       });

//       const success = (result) => {
//         if (scanner) {
//           scanner.clear().catch(console.error);
//         }
//         setDataScaner(result);
//         onScan(result);
//       };

//       const error = (err) => {
//         console.warn('خطأ في الماسح:', err);
//       };

//       scanner.render(success, error);
//     } catch (err) {
//       console.error('فشل تهيئة الماسح:', err);
//     }

//     return () => {
//       if (scanner) {
//         scanner.clear().catch(err => {
//           console.error('فشل في إيقاف الماسح:', err);
//         });
//       }
//     };
//   }, [isClient, onScan]);

//   const resetScanner = () => {
//     setDataScaner(null);
//     window.location.reload();
//   };

//   return (
//     <div className="mt-8">
//       <h2 className="text-lg font-semibold mb-2">قارئ الباركود</h2>
//       <div id="reader" className="border p-4 rounded bg-white shadow-md" />
//       {dataScaner && (
//         <div className="mt-2">
//           <p className="text-sm text-green-600">
//             تم قراءة الباركود: <strong>{dataScaner}</strong>
//           </p>
//           <Button onClick={resetScanner} variant="outline" className="mt-2">
//             مسح منتج آخر
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";

export default function BarcodeScanner({ onScanSuccess, onScanError }) {
  const [isClient, setIsClient] = useState(false);
  const [scannerStatus, setScannerStatus] = useState('initializing');
  const [lastScanned, setLastScanned] = useState(null);
  const scannerRef = useRef(null);

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.clear();
      scannerRef.current = null;
    }
  };

  useEffect(() => {
    setIsClient(true);
    return () => {
      stopScanner();
    };
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const initializeScanner = async () => {
      try {
        // Ensure any existing scanner is stopped
        await stopScanner();
        setScannerStatus('starting');

        const scanner = new Html5QrcodeScanner(
          "reader",
          {
            fps: 5,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: false, // Changed to false to prevent multiple instances
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            videoConstraints: {
              facingMode: "environment",
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 480, ideal: 720, max: 1080 }
            }
          },
          false // verbose flag
        );

        scannerRef.current = scanner;

        const handleScanSuccess = async (decodedText, decodedResult) => {
          setLastScanned(decodedText);
          setScannerStatus('success');
          onScanSuccess(decodedText, decodedResult);
          await stopScanner(); // Stop scanner after successful scan
        };

        await scanner.render(
          handleScanSuccess,
          (error) => {
            if (error?.name === "NotAllowedError") {
              setScannerStatus('error');
              onScanError(error);
            }
          }
        );

        setScannerStatus('ready');
      } catch (err) {
        console.error("Scanner initialization failed:", err);
        setScannerStatus('error');
        onScanError(err);
      }
    };

    initializeScanner();

    return () => {
      stopScanner();
    };
  }, [isClient]);

  const resetScanner = async () => {
    await stopScanner();
    setLastScanned(null);
    setScannerStatus('initializing');
    // Re-initialize scanner with a slight delay to ensure cleanup
    setTimeout(() => {
      if (!scannerRef.current) {
        const initializeScanner = async () => {
          try {
            // Ensure any existing scanner is stopped
            await stopScanner();
            setScannerStatus('starting');

            const scanner = new Html5QrcodeScanner(
              "reader",
              {
                fps: 5,
                qrbox: { width: 250, height: 250 },
                rememberLastUsedCamera: false, // Changed to false to prevent multiple instances
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true,
                videoConstraints: {
                  facingMode: "environment",
                  width: { min: 640, ideal: 1280, max: 1920 },
                  height: { min: 480, ideal: 720, max: 1080 }
                }
              },
              false // verbose flag
            );

            scannerRef.current = scanner;

            const handleScanSuccess = async (decodedText, decodedResult) => {
              setLastScanned(decodedText);
              setScannerStatus('success');
              onScanSuccess(decodedText, decodedResult);
              await stopScanner(); // Stop scanner after successful scan
            };

            await scanner.render(
              handleScanSuccess,
              (error) => {
                if (error?.name === "NotAllowedError") {
                  setScannerStatus('error');
                  onScanError(error);
                }
              }
            );

            setScannerStatus('ready');
          } catch (err) {
            console.error("Scanner initialization failed:", err);
            setScannerStatus('error');
            onScanError(err);
          }
        };

        initializeScanner();
      }
    }, 100);
  };

  if (!isClient) {
    return <div>جاري تحميل الماسح...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold">قارئ الباركود</h2>
          <p className="text-sm text-gray-500">
            الحالة: {scannerStatus}
          </p>
        </div>
        
        <div 
          id="reader" 
          className="border p-4 rounded bg-white shadow-md min-h-[300px]"
        />

        {lastScanned && (
          <div className="mt-4 text-center">
            <p className="text-sm text-green-600">
              تم المسح: <strong>{lastScanned}</strong>
            </p>
            <Button 
              onClick={resetScanner} 
              variant="outline" 
              className="mt-2"
            >
              مسح مرة أخرى
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
