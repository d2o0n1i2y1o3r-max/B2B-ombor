import React, { useState, useEffect } from 'react';
import WarehouseCard from '../components/WarehouseCard';
import FilterSidebar from '../components/FilterSidebar';
import MapView from '../components/MapView';
import Skeleton from '../components/Loaders/Skeleton';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import useFilterStore from '../store/filterStore';

const Listings = ({ isDark }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const filters = useFilterStore((state) => state.filters);

  useEffect(() => {
    fetchWarehouses();
  }, [filters]);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      let q = collection(db, 'warehouses');
      
      // Firestore'da filterlash
      if (filters.region) {
        q = query(q, where('location.region', '==', filters.region));
      }
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      const querySnapshot = await getDocs(q);
      const warehousesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('Fetched warehouses:', warehousesData);
      console.log('Query snapshot size:', querySnapshot.size);
      console.log('Current filters:', filters);

      // Client-side filter for price and size ranges
      let filtered = warehousesData;
      if (filters.minPrice) {
        filtered = filtered.filter(w => w.pricePerSqm >= Number(filters.minPrice));
      }
      if (filters.maxPrice) {
        filtered = filtered.filter(w => w.pricePerSqm <= Number(filters.maxPrice));
      }
      if (filters.minSize) {
        filtered = filtered.filter(w => w.sizeSqm >= Number(filters.minSize));
      }
      if (filters.maxSize) {
        filtered = filtered.filter(w => w.sizeSqm <= Number(filters.maxSize));
      }

      setWarehouses(filtered);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block w-1/4">
          <FilterSidebar isDark={isDark} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Omborlar</h1>
            <button
              onClick={() => setShowMap(!showMap)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              {showMap ? 'Ro\'yxatni ko\'rsatish' : 'Xaritani ko\'rsatish'}
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
                  <Skeleton className="w-full h-48" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : showMap ? (
            <MapView warehouses={warehouses} isDark={isDark} />
          ) : (
            <>
              {warehouses.length === 0 ? (
                <div className="text-center py-12">
                  <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Omborlar topilmadi</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {warehouses.map((warehouse) => (
                    <WarehouseCard key={warehouse.id} warehouse={warehouse} isDark={isDark} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
