import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the structure of the API response
interface PatientInfo {
  name: string;
  age: number;
  gender: string | null;
}

interface Medication {
  name: string | null;
  dosage: string | null;
}

interface Diagnosis {
  condition: string;
  medication: Medication;
}

interface HealthReport {
  message: string;
  result: {
    patientInfo: PatientInfo;
    diagnoses: Diagnosis[];
    keyInsights: string[];
    recommendations: string[];
  };
}

interface HealthState {
  reports: HealthReport[];
  currentReport: HealthReport | null;
  loading: boolean;
  error: string | null;
}

const initialState: HealthState = {
  reports: [],
  currentReport: null,
  loading: false,
  error: null,
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    setReports: (state, action: PayloadAction<HealthReport[]>) => {
      state.reports = action.payload;
    },
    setCurrentReport: (state, action: PayloadAction<HealthReport | null>) => {
      state.currentReport = action.payload;
    },
    addReport: (state, action: PayloadAction<HealthReport>) => {
      state.reports.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setReports, setCurrentReport, addReport, setLoading, setError } = healthSlice.actions;
export default healthSlice.reducer;
