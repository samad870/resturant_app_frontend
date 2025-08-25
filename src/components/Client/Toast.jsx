import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

/** Toast context + hook */
const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider />");
  return ctx;
}

/** Provider */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, duration = 4000 }) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [
        ...prev,
        { id, title, description, duration, createdAt: Date.now() },
      ]);

      // auto-dismiss
      setTimeout(() => remove(id), duration);
    },
    [remove]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast viewport */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  // extra safety: remove if somehow lingers too long
  useEffect(() => {
    const max = setTimeout(onClose, toast.duration + 2000);
    return () => clearTimeout(max);
  }, [onClose, toast.duration]);

  return (
    <div className="w-[320px] rounded-2xl shadow-lg border bg-white p-4">
      {toast.title && <div className="font-semibold mb-1">{toast.title}</div>}
      {toast.description && (
        <div className="text-sm text-gray-600">{toast.description}</div>
      )}
      <div className="mt-3 flex justify-end">
        <button
          onClick={onClose}
          className="text-sm px-3 py-1 rounded-full border hover:bg-gray-50"
          aria-label="Close"
        >
          Close
        </button>
      </div>
    </div>
  );
}
