import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
}) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full ${maxWidth} shadow-2xl scale-100 animate-in fade-in zoom-in-95 duration-200`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {title && (
          <h2 className="text-xl font-bold text-white mb-4 pr-8">{title}</h2>
        )}

        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
