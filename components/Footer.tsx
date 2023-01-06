const Footer: React.FC = () => {
  return (
    <footer className="bg-base-200 h-96 mt-20 text-base-content">
      <h1>Footer</h1>
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex justify-center md:order-2">
            <a href="#" className="text-gray-600 hover:text-gray-800 mx-4">
              Link 1
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 mx-4">
              Link 2
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 mx-4">
              Link 3
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
