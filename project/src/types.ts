export interface Medicine {
  id: string;
  name: string;
  expiryDate: string;
  batchNumber: string;
  manufacturer: string;
  quantity: number;
  condition: string;
  donorId: string;
  status: 'available' | 'reserved' | 'donated';
}

export interface HealthReport {
  id: string;
  userId: string;
  uploadDate: string;
  summary: string;
  insights: string[];
  recommendations: string[];
  patientInfo: {
    name: string;
    age: number;
    gender: string;
  };
  diagnoses: Array<{
    condition: string;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
    }>;
  }>;
}

export interface DonationMatch {
  id: string;
  medicineId: string;
  ngoId: string;
  status: 'pending' | 'accepted' | 'completed';
  createdAt: string;
}

export interface NGO {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contactPerson: string;
  phone: string;
  email: string;
}