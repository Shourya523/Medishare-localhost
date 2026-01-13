import React, { useEffect, useState, useRef } from 'react';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface NGO {
  id: string;
  name: string;
  address: string;
  distance: string;
  coordinates: [number, number]; // [latitude, longitude]
}

export default function NGOMap() {
  const [selectedNGO, setSelectedNGO] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  // Mock NGOs with coordinates
  const mockNGOs: NGO[] = [
    {
      id: '1',
      name: 'HelpAge India',
      address: 'C-14, Qutab Institutional Area, New Delhi',
      distance: '10 km',
      coordinates: [28.5402, 77.1756], // Qutab Institutional Area
    },
    {
      id: '2',
      name: 'Indian Cancer Society',
      address: 'Near AIIMS, Ansari Nagar, New Delhi',
      distance: '4 km',
      coordinates: [28.5675, 77.2111], // Near AIIMS
    },
    {
      id: '3',
      name: 'Doctors For You',
      address: 'East of Kailash, New Delhi',
      distance: '6 km',
      coordinates: [28.5555, 77.2422], // East of Kailash
    },
    {
      id: '4',
      name: 'Uday Foundation',
      address: '4/7, West Patel Nagar, New Delhi',
      distance: '3 km',
      coordinates: [28.6421, 77.2205], // Patel Nagar
    },
    {
      id: '5',
      name: 'Smile Foundation',
      address: 'Saket District Centre, New Delhi',
      distance: '12 km',
      coordinates: [28.5245, 77.2069], // Saket
    },
    {
      id: '6',
      name: 'Salaam Baalak Trust',
      address: 'Near New Delhi Railway Station, Paharganj',
      distance: '1.5 km',
      coordinates: [28.6421, 77.2205], // Paharganj
    },
    {
      id: '7',
      name: 'Blind Relief Association',
      address: 'Lal Bahadur Shastri Marg, Near Lodhi Road',
      distance: '3.2 km',
      coordinates: [28.5909, 77.2247], // Lodhi Road
    },
    {
      id: '8',
      name: 'Deepalaya',
      address: '46, Institutional Area, Kalkaji, New Delhi',
      distance: '9 km',
      coordinates: [28.5451, 77.2555], // Kalkaji
    }
  ];
  
  // Create custom icon outside of the effect to prevent recreation on rerenders
  const defaultIcon = L.icon({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Initialize map on component mount
  useEffect(() => {
    // Check if the map container exists
    if (!mapContainerRef.current) return;
    
    // Check if map is already initialized
    if (!mapRef.current) {
      try {
        // Create map instance
        const mapInstance = L.map(mapContainerRef.current).setView([28.6139, 77.2090], 13);
        
        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);
        
        // Save map instance to ref
        mapRef.current = mapInstance;
        
        // Add markers for each NGO
        mockNGOs.forEach(ngo => {
          const marker = L.marker(ngo.coordinates, { icon: defaultIcon })
            .addTo(mapInstance)
            .bindPopup(`<b>${ngo.name}</b><br>${ngo.address}`);
          
          // Use arrow function to avoid 'this' binding issues
          marker.on('mouseover', () => {
            marker.openPopup();
          });
          
          // Store marker reference
          markersRef.current.push(marker);
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }
    
    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        // Remove all markers first
        markersRef.current.forEach(marker => {
          if (marker) marker.remove();
        });
        markersRef.current = [];
        
        // Remove map
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  
  // Handle selecting an NGO
  useEffect(() => {
    if (mapRef.current && selectedNGO) {
      const ngo = mockNGOs.find(n => n.id === selectedNGO);
      if (ngo) {
        // Handle case when map might be in an inconsistent state
        try {
          mapRef.current.setView(ngo.coordinates, 15);
          
          // Close any existing popups
          mapRef.current.closePopup();
          
          // Open popup for the selected NGO
          L.popup()
            .setLatLng(ngo.coordinates)
            .setContent(`<b>${ngo.name}</b><br>${ngo.address}`)
            .openOn(mapRef.current);
        } catch (error) {
          console.error("Error updating map view:", error);
        }
      }
    }
  }, [selectedNGO]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="ngos">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby NGOs</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
            <div 
              ref={mapContainerRef} 
              id="map-container" 
              style={{ height: '100%', width: '100%' }}
            ></div>
          </div>
          <div className="h-96 md:h-auto lg:h-96 overflow-y-auto pr-2 pb-2">
            <div className="space-y-3">
              {mockNGOs.map((ngo) => (
                <div
                  key={ngo.id}
                  className={`bg-white border rounded-lg p-3 transition-shadow cursor-pointer ${
                    selectedNGO === ngo.id 
                      ? 'border-emerald-500 shadow-md' 
                      : 'border-gray-200 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedNGO(ngo.id)}
                >
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate">{ngo.name}</h3>
                      <p className="text-sm text-gray-500 break-words">{ngo.address}</p>
                      {/* <p className="text-sm text-emerald-600 mt-1">{ngo.distance}</p> */}
                      <div className="text-xs text-gray-400 mt-1">
                        {ngo.coordinates[0].toFixed(4)}, {ngo.coordinates[1].toFixed(4)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}