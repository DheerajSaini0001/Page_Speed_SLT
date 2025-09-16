export default function Footer() {
    return (
      <footer className="lg:pl-64 sm:pr-6 relative bottom-0 flex bg-gray-900 text-gray-200 py-6 pt-8">
        <div className="container w-full mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm"><a className="hover:underline" href="https://www.sltechsoft.com">&copy; {new Date().getFullYear()} Success Leader Technologies.</a> All rights reserved.</p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/about" className="hover:text-blue-500 transition">About</a>
            <a href="https://sltechsoft.com/service" className="hover:text-blue-500 transition">Services</a>
            <a href="https://sltechsoft.com/" className="hover:text-blue-500 transition">Contact</a>
          </div>
        </div>
      </footer>
    );
  }
  