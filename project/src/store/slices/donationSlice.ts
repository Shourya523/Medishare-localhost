import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Medicine, DonationMatch } from '../../types';

interface DonationState {
  donations: Medicine[];
  matches: DonationMatch[];
  loading: boolean;
  error: string | null;
}

const initialState: DonationState = {
  donations: [],
  matches: [],
  loading: false,
  error: null,
};

const donationSlice = createSlice({
  name: 'donation',
  initialState,
  reducers: {
    setDonations: (state, action: PayloadAction<Medicine[]>) => {
      state.donations = action.payload;
    },
    addDonation: (state, action: PayloadAction<Medicine>) => {
      state.donations.push(action.payload);
    },
    setMatches: (state, action: PayloadAction<DonationMatch[]>) => {
      state.matches = action.payload;
    },
    updateDonationStatus: (state, action: PayloadAction<{ id: string; status: Medicine['status'] }>) => {
      const donation = state.donations.find(d => d.id === action.payload.id);
      if (donation) {
        donation.status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setDonations,
  addDonation,
  setMatches,
  updateDonationStatus,
  setLoading,
  setError,
} = donationSlice.actions;
export default donationSlice.reducer;