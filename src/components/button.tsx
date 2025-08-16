interface ButtonProps {
  label: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  label,
  type = "button",
  onClick,
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer text-lg py-4 px-8 border border-white my-custom-font bg-black hover:bg-white hover:text-black hover:border-black hover:border-4 text-white ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : ''
      } ${className}`}
    >
      {label}
    </button>
  );
}