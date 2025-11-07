import { BarChart2, FileSpreadsheet, FileText } from 'lucide-react';
import Header from '../components/Header';

const API_BASE = import.meta.env.VITE_API_BASE_ROOT || 'http://localhost:5000';

export default function Reports() {
  const downloadPDF = () => {
    window.open(`${API_BASE}/api/reports/pdf`, '_blank');
  };

  const downloadCSV = () => {
    window.open(`${API_BASE}/api/reports/csv`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      <div className="min-h-screen p-6">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
            <BarChart2 className="text-indigo-600" /> Reports Dashboard
          </h1>
          <p className="text-gray-500">Overview of your generated reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition">
            <h2 className="text-gray-500 font-semibold text-sm">Total Reports</h2>
            <p className="text-2xl font-bold text-gray-800">128</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition">
            <h2 className="text-gray-500 font-semibold text-sm">Reports This Month</h2>
            <p className="text-2xl font-bold text-gray-800">24</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition">
            <h2 className="text-gray-500 font-semibold text-sm">Pending Reports</h2>
            <p className="text-2xl font-bold text-gray-800">3</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="text-indigo-600" /> Monthly PDF Report
            </h3>
            <p className="text-gray-500 mt-2">
              Download a detailed PDF report of the monthly performance metrics.
            </p>
            <button
              onClick={downloadPDF}
              className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
            >
              <FileText size={18} /> Download PDF
            </button>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileSpreadsheet className="text-green-600" /> Monthly CSV Report
            </h3>
            <p className="text-gray-500 mt-2">
              Download your reports in CSV format for Excel or other spreadsheet software.
            </p>
            <button
              onClick={downloadCSV}
              className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
            >
              <FileSpreadsheet size={18} /> Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


