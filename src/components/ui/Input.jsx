import React from "react";

const Input = React.forwardRef(
  ({ label, id, error, className = "", ...props }, ref) => {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`w-full px-4 py-2.5 bg-gray-800/50 border rounded-lg text-gray-100 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-700 focus:border-green-500"
          } ${props.type === "date" ? "[&::-webkit-calendar-picker-indicator]:invert" : ""}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
