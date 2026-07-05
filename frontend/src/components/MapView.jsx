import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapView = ({ warehouses, onMarkerClick }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  const defaultCenter = [41.2995, 69.2401]; // Toshkent

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {warehouses.map((warehouse) => (
          <Marker
            key={warehouse.id}
            position={[warehouse.location.lat, warehouse.location.lng]}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(warehouse),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{warehouse.title}</h3>
                <p className="text-sm">{warehouse.location.address}</p>
                <p className="text-sm">{warehouse.sizeSqm} m²</p>
                <p className="text-sm">{warehouse.pricePerSqm.toLocaleString()} so'm/m²</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
