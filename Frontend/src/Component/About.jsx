import logo from "./android-chrome-192x192.png";
export default function About() {
    return (
     
      <div className="bg-gray-50 min-h-screen py-12 px-6">
   <nav className="fixed top-0 left-0 w-full h-16 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 z-50">

        <div className="flex flex-col-rev justify-center items-center gap-4  font-serif text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          <div><img src={logo} alt="" className="h-14" /></div>
          <div>Site Audits</div>
        </div>
      </nav>

        <div className="mt-16 max-w-5xl mx-auto">
          {/* Heading */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            About Our Site Audit Tool
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Our Site Audit tool helps developers, marketers, and businesses 
            improve their website performance, SEO, and accessibility. 
            We aim to simplify the process of finding issues and boosting online presence.
          </p>
  
          {/* Sections */}
          <div className="grid md:grid-cols-2 gap-10">
            {/* Mission */}
            <div className="bg-white shadow-md rounded-2xl p-8 hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To empower website owners and developers by providing actionable 
                insights that enhance site speed, SEO performance, and user experience.
              </p>
            </div>
  
            {/* Features */}
            <div className="bg-white shadow-md rounded-2xl p-8 hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Comprehensive SEO Audits</li>
                <li>Performance & Speed Optimization Tips</li>
                <li>Accessibility & Compliance Checks</li>
                <li>Detailed Reporting Dashboard</li>
              </ul>
            </div>
          </div>
  
          {/* Team */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet the Team</h2>
            <p className="text-gray-600 mb-8">
              We are a passionate group of developers and analysts committed 
              to making the web faster and more accessible for everyone.
            </p>
  
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="bg-white shadow-md rounded-2xl p-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-800">Dheeraj Saini</h3>
                <p className="text-sm text-gray-500">Founder & Developer</p>
              </div>
              <div className="bg-white shadow-md rounded-2xl p-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-800">Team Member</h3>
                <p className="text-sm text-gray-500">SEO Analyst</p>
              </div>
              <div className="bg-white shadow-md rounded-2xl p-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-800">Team Member</h3>
                <p className="text-sm text-gray-500">UI/UX Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  