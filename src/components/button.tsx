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
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cursor-pointer text-lg py-4 px-8 border border-white my-custom-font bg-black hover:bg-white hover:text-black text-white ${className}`}
    >
      {label}
    </button>
  );
}
