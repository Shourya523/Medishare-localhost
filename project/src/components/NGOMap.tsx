import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Navigation, Info, ExternalLink } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface NGO {
  id: string;
  name: string;
  address: string;
  distance: string;
  coordinates: [number, number];
}

export default function NGOMap() {
  const [selectedNGO, setSelectedNGO] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const mockNGOs: NGO[] = [
    { id: '1', name: 'HelpAge India', address: 'C-14, Qutab Institutional Area, New Delhi', distance: '10 km', coordinates: [28.5402, 77.1756] },
    { id: '2', name: 'Indian Cancer Society', address: 'Near AIIMS, Ansari Nagar, New Delhi', distance: '4 km', coordinates: [28.5675, 77.2111] },
    { id: '3', name: 'Doctors For You', address: 'East of Kailash, New Delhi', distance: '6 km', coordinates: [28.5555, 77.2422] },
    { id: '4', name: 'Uday Foundation', address: '4/7, West Patel Nagar, New Delhi', distance: '3 km', coordinates: [28.6421, 77.2205] },
    { id: '5', name: 'Smile Foundation', address: 'Saket District Centre, New Delhi', distance: '12 km', coordinates: [28.5245, 77.2069] },
    { id: '6', name: 'Salaam Baalak Trust', address: 'Near New Delhi Railway Station, Paharganj', distance: '1.5 km', coordinates: [28.6421, 77.2205] },
    { id: '7', name: 'Blind Relief Association', address: 'Lal Bahadur Shastri Marg, Near Lodhi Road', distance: '3.2 km', coordinates: [28.5909, 77.2247] },
    { id: '8', name: 'Deepalaya', address: '46, Institutional Area, Kalkaji, New Delhi', distance: '9 km', coordinates: [28.5451, 77.2555] }
  ];

  const defaultIcon = L.icon({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapRef.current) {
      try {
        const mapInstance = L.map(mapContainerRef.current, { 
          zoomControl: false,
          scrollWheelZoom: false 
        }).setView([28.6139, 77.2090], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstance);
        
        L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);
        mapRef.current = mapInstance;

        mockNGOs.forEach(ngo => {
          const marker = L.marker(ngo.coordinates, { icon: defaultIcon })
            .addTo(mapInstance)
            .bindPopup(`<b>${ngo.name}</b>`);
          marker.on('click', () => setSelectedNGO(ngo.id));
          markersRef.current.push(marker);
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && selectedNGO) {
      const ngo = mockNGOs.find(n => n.id === selectedNGO);
      if (ngo) {
        mapRef.current.flyTo(ngo.coordinates, 15, { duration: 1.5 });
      }
    }
  }, [selectedNGO]);

  return (
    <div className="bg-transparent py-16 px-4 sm:px-6 lg:px-8 font-sans relative z-0" id="ngos">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900">Locate Partners.</h2>
          <p className="text-lg text-gray-500 mt-2">Find certified NGOs and collection centers near you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full md:h-[700px]">
          <div className="md:col-span-8 h-[70%] bg-white rounded-[2.5rem] p-3 shadow-sm border border-gray-100 overflow-hidden relative z-10 transition-transform duration-500 hover:scale-[1.005]">
            <div 
              ref={mapContainerRef} 
              className="w-full h-[100%] rounded-[2rem] z-0"
            />
            <div className="absolute top-8 left-8 z-[400] bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">8 Active centers in New Delhi</span>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-4 relative z-10 h-[70%]">
            <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Nearby NGOs</h3>
                <Navigation className="h-5 w-5 text-emerald-500" />
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {mockNGOs.map((ngo) => (
                  <div
                    key={ngo.id}
                    onClick={() => setSelectedNGO(ngo.id)}
                    className={`group p-4 rounded-3xl transition-all duration-300 cursor-pointer ${
                      selectedNGO === ngo.id 
                        ? 'bg-emerald-50 border-emerald-100' 
                        : 'bg-gray-50 hover:bg-white hover:shadow-md border-transparent hover:border-gray-100'
                    } border`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-semibold transition-colors ${selectedNGO === ngo.id ? 'text-emerald-700' : 'text-gray-900'}`}>
                        {ngo.name}
                      </h4>
                      <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-full text-gray-400 border border-gray-100">
                        {ngo.distance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{ngo.address}</p>
                    {selectedNGO === ngo.id && (
                      <div className="mt-3 flex gap-2 animate-in fade-in zoom-in duration-300">
                        <button className="flex-1 bg-emerald-600 text-white text-xs py-2 rounded-xl font-medium hover:bg-emerald-700 transition-colors">
                          Get Directions
                        </button>
                        <button className="p-2 bg-white border border-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors">
                          <Info className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-1">Join the Network</h3>
                <p className="text-emerald-50 text-sm mb-4">Register your NGO to start receiving donations.</p>
                <button className="bg-white text-emerald-600 px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-emerald-50 transition-colors">
                  Apply Now <ExternalLink className="h-4 w-4" />
                </button>
              </div>
              <MapPin className="absolute -bottom-4 -right-4 h-32 w-32 text-white/10 rotate-12 transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}