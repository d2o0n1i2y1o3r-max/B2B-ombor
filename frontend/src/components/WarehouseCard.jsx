import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiDollarSign, FiBox, FiStar } from 'react-icons/fi';

const WarehouseCard = ({ warehouse, isDark }) => {
  const {
    id,
    title,
    location,
    sizeSqm,
    pricePerSqm,
    category,
    images,
    isPremium,
    status
  } = warehouse;

  const imageUrl = images && images.length > 0 ? images[0] : '/placeholder.jpg';

  return (
    <Link to={`/warehouse/${id}`} className="block">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
            }}
          />
          {isPremium && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <FiStar size={12} />
              TOP
            </div>
          )}
          {status === 'rented' && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Ijaraga olingan
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className={`text-lg font-semibold mb-2 truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
          
          <div className={`flex items-center text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <FiMapPin className="mr-1" />
            <span className="truncate">{location.region}, {location.address}</span>
          </div>

          <div className={`flex items-center text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <FiBox className="mr-1" />
            <span>{sizeSqm} m²</span>
          </div>

          <div className={`flex items-center text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <FiDollarSign className="mr-1" />
            <span>{pricePerSqm.toLocaleString()} so'm/m²/oy</span>
          </div>

          <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className={`inline-block text-xs px-2 py-1 rounded ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
              {category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WarehouseCard;
