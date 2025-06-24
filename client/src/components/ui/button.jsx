// src/components/ui/Button.jsx

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`font-semibold rounded-full transition duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
