import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Clock, User, Stethoscope, Pill, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function ReportAnalysis() {
  const navigate = useNavigate();
  const report = useSelector((state: RootState) => state.health.currentReport);

  useEffect(() => {
    if (!report) {
      navigate('/');
    }
  }, [report, navigate]); // Ensures navigation happens only after component mounts

  if (!report) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Report Analysis</h1>
          <p className="text-gray-500 mt-2">{report.message}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Patient Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Patient Information</h2>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {report.result.patientInfo.name}</p>
              <p><span className="font-medium">Age:</span> {report.result.patientInfo.age}</p>
              <p><span className="font-medium">Gender:</span> {report.result.patientInfo.gender || 'Not Specified'}</p>
            </div>
          </div>

          {/* Diagnoses and Medications */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Stethoscope className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Diagnoses</h2>
            </div>
            <div className="space-y-4">
              {report.result.diagnoses.map((diagnosis, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium text-gray-900">{diagnosis.condition}</h3>
                  {diagnosis.medication?.name ? (
                    <div className="mt-2 flex items-start space-x-2">
                      <Pill className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{diagnosis.medication.name}</p>
                        <p className="text-sm text-gray-500">
                          {diagnosis.medication.dosage || 'No dosage specified'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No medication prescribed</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Key Insights</h2>
            </div>
            <ul className="space-y-2">
              {report.result.keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mt-2" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Recommendations</h2>
            </div>
            <ul className="space-y-2">
              {report.result.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mt-2" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
