import React from 'react';
import useFilterStore from '../store/filterStore';

const FilterSidebar = ({ isDark }) => {
  const { filters, updateFilter, resetFilters } = useFilterStore();

  const categories = [
    { value: '', label: 'Barchasi' },
    { value: 'sovutgichli', label: 'Sovutgichli' },
    { value: 'quruq', label: 'Quruq' },
    { value: 'ochiq_maydon', label: 'Ochiq maydon' },
    { value: 'konteyner', label: 'Konteyner' },
    { value: 'boshqa', label: 'Boshqa' },
  ];

  const regions = [
    { value: '', label: 'Barcha viloyatlar' },
    { value: 'Toshkent', label: 'Toshkent' },
    { value: 'Samarqand', label: 'Samarqand' },
    { value: 'Buxoro', label: 'Buxoro' },
    { value: 'Farg\'ona', label: 'Farg\'ona' },
    { value: 'Andijon', label: 'Andijon' },
    { value: 'Namangan', label: 'Namangan' },
    { value: 'Qashqadaryo', label: 'Qashqadaryo' },
    { value: 'Surxondaryo', label: 'Surxondaryo' },
    { value: 'Jizzax', label: 'Jizzax' },
    { value: 'Sirdaryo', label: 'Sirdaryo' },
    { value: 'Xorazm', label: 'Xorazm' },
    { value: 'Navoiy', label: 'Navoiy' },
    { value: 'Qoraqalpog\'iston', label: 'Qoraqalpog\'iston' },
  ];

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Filterlar</h2>
      
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Viloyat</label>
          <select
            value={filters.region}
            onChange={(e) => updateFilter('region', e.target.value)}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
          >
            {regions.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Kategoriya</label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Minimal narx (so'm)</label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            placeholder="Minimal narx"
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Maksimal narx (so'm)</label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            placeholder="Maksimal narx"
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Minimal maydon (m²)</label>
          <input
            type="number"
            value={filters.minSize}
            onChange={(e) => updateFilter('minSize', e.target.value)}
            placeholder="Minimal maydon"
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Maksimal maydon (m²)</label>
          <input
            type="number"
            value={filters.maxSize}
            onChange={(e) => updateFilter('maxSize', e.target.value)}
            placeholder="Maksimal maydon"
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
          />
        </div>

        <button
          onClick={resetFilters}
          className={`w-full py-2 rounded-md transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          Filterlarni tozalash
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
