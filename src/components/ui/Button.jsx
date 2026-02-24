import React from "react";

const Button = React.forwardRef(
  (
    {
      children,
      variant = "primary",
      fullWidth = false,
      isLoading = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-green-500 hover:bg-green-400 text-black focus:ring-green-500 px-6 py-3",
      secondary:
        "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 focus:ring-gray-700 px-6 py-3",
      outline:
        "bg-transparent hover:bg-gray-800 text-white border border-gray-600 focus:ring-gray-600 px-6 py-3",
      text: "bg-transparent hover:text-green-400 text-gray-300 hover:underline px-2 py-1",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
