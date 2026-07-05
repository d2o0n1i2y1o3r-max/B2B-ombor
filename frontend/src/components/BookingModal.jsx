import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const BookingModal = ({ warehouse, isOpen, onClose, onSubmit }) => {
  const [requestedPeriod, setRequestedPeriod] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ requestedPeriod, message });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ijaraga olish so'rovi</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <h3 className="font-semibold">{warehouse.title}</h3>
          <p className="text-sm text-gray-600">{warehouse.location.address}</p>
          <p className="text-sm text-gray-600">{warehouse.sizeSqm} m²</p>
          <p className="text-sm text-gray-600">{warehouse.pricePerSqm.toLocaleString()} so'm/m²/oy</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ijaraga olish muddati (oy)
            </label>
            <input
              type="number"
              value={requestedPeriod}
              onChange={(e) => setRequestedPeriod(e.target.value)}
              min={warehouse.minRentPeriod}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={`Minimal: ${warehouse.minRentPeriod} oy`}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xabar (ixtiyoriy)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Qo'shimcha ma'lumot..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Yuborish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
