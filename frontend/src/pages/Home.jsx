import { Link } from "react-router-dom";

export default function Home(){
  return(
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">ReportGen Pro</h1>
          <div className="space-x-2">
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Login</Link>
            <Link to="/register" className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col md:flex-row items-center justify-center container mx-auto px-6 py-20">
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            Transform Your Data into Insightful Reports
          </h2>
          <p className="text-gray-600 mb-6">
            Automate your company reports and make data-driven decisions faster.
            Generate professional reports in seconds and keep your team in sync.
          </p>
          <Link to="/login" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">Get Started</Link>
        </div>

        {/* Image or Illustration */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="./dashboard-report.png"
            alt="Dashboard illustration"
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="container mx-auto text-center text-gray-600">
          &copy; 2025 ReportGen Pro. All rights reserved.
        </div>
      </footer>
    </div>
    </>
  );
}