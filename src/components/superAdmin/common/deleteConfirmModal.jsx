import { motion, AnimatePresence } from "framer-motion"

export function DeleteConfirmModal({ 
  show, 
  onCancel, 
  onConfirm, 
  loading 
}) {
  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300 
          }}
          className="relative rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            {/* Warning Icon */}
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-red-100 text-red-600 border-2 border-red-200">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-3xl font-bold text-red-900 mb-4">
              Confirm Deletion
            </h3>

            {/* Warning Message */}
            <div className="bg-red-100 border-2 border-red-200 rounded-2xl p-4 mb-6">
              <p className="text-red-800 font-semibold text-lg">
                ⚠️ This action cannot be undone!
              </p>
              <p className="text-red-700 mt-2">
                All your restaurant data, menu items, and settings will be permanently deleted.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                onClick={onCancel}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                className="flex-1 py-4 bg-gray-500 text-white rounded-2xl font-bold shadow-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </motion.button>
              
              <motion.button
                onClick={onConfirm}
                disabled={loading}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <span>🗑️</span>
                    Yes, Delete
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}