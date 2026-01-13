import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UploadState {
  file: string | null;
  medicineName: string;
  expiryDate: string;
  quantity: number;
}

const initialState: UploadState = {
  file: null,
  medicineName: '',
  expiryDate: '',
  quantity: 0,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<string | null>) => {
      state.file = action.payload;
    },
    setMedicineName: (state, action: PayloadAction<string>) => {
      state.medicineName = action.payload;
    },
    setExpiryDate: (state, action: PayloadAction<string>) => {
      state.expiryDate = action.payload;
    },
    setQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
    resetForm: (state) => {
      state.file = null;
      state.medicineName = '';
      state.expiryDate = '';
      state.quantity = 0;
    },
  },
});

export const { setFile, setMedicineName, setExpiryDate, setQuantity, resetForm } = uploadSlice.actions;
export default uploadSlice.reducer;