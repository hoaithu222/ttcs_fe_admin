import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { selectToastMessages } from "@/app/store/slices/toast";
import { removeToast } from "@/app/store/slices/toast";
import { MAX_VISIBLE_TOAST, TOAST_DURATION } from "./toast.constants";

const ToastContainer = () => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectToastMessages);

  // Auto remove toast after duration
  useEffect(() => {
    messages.forEach((toast) => {
      if (toast.duration !== 0) {
        const duration = toast.duration || TOAST_DURATION;
        const timer = setTimeout(() => {
          dispatch(removeToast(toast.id));
        }, duration);

        return () => clearTimeout(timer);
      }
    });
  }, [messages, dispatch]);

  const getToastStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white border-green-600";
      case "error":
        return "bg-red-500 text-white border-red-600";
      case "warning":
        return "bg-yellow-500 text-white border-yellow-600";
      case "info":
        return "bg-blue-500 text-white border-blue-600";
      default:
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "•";
    }
  };

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.slice(0, MAX_VISIBLE_TOAST).map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border-l-4
            transform transition-all duration-300 ease-in-out
            animate-in slide-in-from-right-full
            ${getToastStyles(toast.type)}
          `}
        >
          <span className="text-lg font-bold">{getToastIcon(toast.type)}</span>
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => dispatch(removeToast(toast.id))}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <span className="text-lg">×</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
