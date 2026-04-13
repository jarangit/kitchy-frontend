

const ErrorModal = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-bold text-[var(--color-danger)]">Something went wrong</h2>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          Please try again or reload the page.
        </p>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[var(--color-surface)] text-[var(--color-success)] rounded-md font-semibold cursor-pointer h-11 active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
