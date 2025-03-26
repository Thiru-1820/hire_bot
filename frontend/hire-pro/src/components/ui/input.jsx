export function Input({ value, onChange, placeholder }) {
    return (
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
      />
    );
  }
  