const variants = {
  primary: 'bg-brand-600 hover:bg-brand-700 text-white',
  danger: 'bg-danger hover:opacity-90 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
};

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2
        text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}