export function Button({ children, onClick, variant = "default" }) {
    const baseStyle = "px-4 py-2 rounded-md font-semibold focus:outline-none";
    const variants = {
      default: "bg-blue-500 text-white hover:bg-blue-600",
      destructive: "bg-red-500 text-white hover:bg-red-600",
    };
  
    return (
      <button className={`${baseStyle} ${variants[variant]}`} onClick={onClick}>
        {children}
      </button>
    );
  }
  