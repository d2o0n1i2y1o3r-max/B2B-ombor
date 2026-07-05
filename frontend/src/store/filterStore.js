import { create } from 'zustand';

const useFilterStore = create((set) => ({
  filters: {
    region: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    minSize: '',
    maxSize: '',
    status: 'available',
  },
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  resetFilters: () => set({
    filters: {
      region: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minSize: '',
      maxSize: '',
      status: 'available',
    }
  }),
}));

export default useFilterStore;
