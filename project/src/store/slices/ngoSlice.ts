import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NGO } from '../../types';

interface NGOState {
  ngos: NGO[];
  selectedNGO: NGO | null;
  loading: boolean;
  error: string | null;
}

const initialState: NGOState = {
  ngos: [],
  selectedNGO: null,
  loading: false,
  error: null,
};

const ngoSlice = createSlice({
  name: 'ngo',
  initialState,
  reducers: {
    setNGOs: (state, action: PayloadAction<NGO[]>) => {
      state.ngos = action.payload;
    },
    setSelectedNGO: (state, action: PayloadAction<NGO | null>) => {
      state.selectedNGO = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setNGOs, setSelectedNGO, setLoading, setError } = ngoSlice.actions;
export default ngoSlice.reducer;