

import { Button } from "@/shared/components/ui/button";

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
        <Button
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </div>
    </div>
  );
};

export default ErrorModal;
