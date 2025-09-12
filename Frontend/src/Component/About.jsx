import logo from "./android-chrome-192x192.png";
import Footer from "./Footer"
// import Dheeraj from "./Dheeraj.jpeg";
// import Piyush from "../Piyush.jpeg";
// import Mayank from "../Mayank.JPG";

export default function About() {
  return (
   <>
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen py-12 px-6">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full h-16 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3 font-serif text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          <img src={logo} alt="Site Audit Logo" className="h-12 w-12" />
          <span>Site Audits</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mt-20 max-w-6xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          About Our Site Audit Tool
        </h1>
        <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Our Site Audit tool helps developers, marketers, and businesses
          improve their website performance, SEO, and accessibility. 
          We aim to simplify the process of finding issues and boosting online presence.
        </p>

        {/* Sections */}
        <section className="grid md:grid-cols-2 gap-10">
          {/* Mission */}
          <div className="bg-white shadow-md rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              👉 To empower website owners and developers by providing actionable 
              insights that enhance site speed, SEO performance, and user experience.
            </p>
          </div>

          {/* Features */}
          <div className="bg-white shadow-md rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Comprehensive SEO Audits</li>
              <li>Performance & Speed Optimization Tips</li>
              <li>Accessibility & Compliance Checks</li>
              <li>Detailed Reporting Dashboard</li>
            </ul>
          </div>
        </section>

        {/* Team */}
        <section className="mt-20 text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-200 mb-6">Meet the Team</h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
            We are a passionate group of developers and analysts committed 
            to making the web faster and more accessible for everyone.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {/* Dheeraj */}
            <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-transform duration-300">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
                <img src="./Dheeraj.jpeg" alt="Dheeraj Saini - Frontend Developer" className=" object-cover" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Dheeraj Saini</h3>
              <p className="text-sm text-gray-500">Frontend Developer</p>
            </div>

            {/* Piyush */}
            <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-transform duration-300">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
                <img src="./Piyush.jpeg" alt="Piyush - Backend Developer" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Piyush</h3>
              <p className="text-sm text-gray-500">Backend Developer</p>
            </div>

            {/* Mayank */}
            <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-transform duration-300">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
                <img src="./Mayank.JPG" alt="Mayank - Backend Developer" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Mayank</h3>
              <p className="text-sm text-gray-500">Backend Developer</p>
            </div>
          </div>
        </section>
        
      </div>
      
    </div>
      <Footer/>
   </>
  );
}
