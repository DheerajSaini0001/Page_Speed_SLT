export default function Footer() {
    return (
      <footer className="lg:pl-64 sm:pr-6 relative  flex bg-gray-900 text-gray-300 py-8 pt-10">
        <div className="container w-full mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Success Leader Technologies. All rights reserved.</p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/about" className="hover:text-white transition">About</a>
            <a href="https://sltechsoft.com/service" className="hover:text-white transition">Services</a>
            <a href="https://sltechsoft.com/" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    );
  }
  