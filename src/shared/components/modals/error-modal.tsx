

const ErrorModal = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-bold text-red-800">Something went wrong</h2>
        <p className="mt-4 text-gray-700">
          Please try again or reload the page.
        </p>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-100 text-green-600 rounded-md font-semibold cursour-pointer"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
