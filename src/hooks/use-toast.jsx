import * as React from "react";

const ToastContext = React.createContext();

// Mock toast function structure that Shadcn/ui expects
function createToast({ title, description, variant = "default" }) {
  return {
    id: Math.random().toString(36).substring(2, 9),
    title,
    description,
    variant,
  };
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const toast = (props) => {
    const newToast = createToast(props);
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 5000);
    
    return newToast.id;
  };

  const dismiss = (toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within <ToastProvider />");
  }
  return context;
}