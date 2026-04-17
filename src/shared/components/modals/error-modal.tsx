

const ErrorModal = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-subtitle text-danger">Something went wrong</h2>
        <p className="mt-4 text-text-secondary">
          Please try again or reload the page.
        </p>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-button-primary-bg text-button-primary-text rounded-radius-sm font-[var(--weight-semibold)] cursor-pointer h-11 active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
