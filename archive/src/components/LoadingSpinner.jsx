/**
 * LoadingSpinner - A simple animated spinner for inline and small-area loading states.
 *
 * **When to use LoadingSpinner:**
 * - Small inline loading states (e.g., loading data within a specific section or component)
 * - Button loading states (e.g., showing a spinner while a form is submitting)
 * - Modal content loading (e.g., loading content inside a dialog or modal)
 * - Small UI areas where skeleton loaders would be distracting or unnecessary
 *
 * **When NOT to use LoadingSpinner:**
 * - Full-page loading states → Use page-specific skeleton components (e.g., DashboardSkeleton)
 * - Large sections or complex layouts → Use skeleton components to maintain layout structure
 * - Card lists or grids → Use SkeletonCard to prevent layout shift
 * - Tables → Use SkeletonTable to maintain table structure
 *
 * @param {Object} props - Component props
 * @param {'sm' | 'md' | 'lg'} props.size - Size variant of the spinner (default: 'md')
 * @returns {JSX.Element} A centered spinning loader
 *
 * @example
 * // Button loading state
 * <button disabled={isLoading}>
 *   {isLoading ? <LoadingSpinner size="sm" /> : 'Submit'}
 * </button>
 *
 * @example
 * // Modal content loading
 * {isLoading ? (
 *   <LoadingSpinner size="md" />
 * ) : (
 *   <ModalContent />
 * )}
 */
export default function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`}></div>
    </div>
  );
}
