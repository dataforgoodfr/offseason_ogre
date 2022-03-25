interface InputProps {
  text: string;
  type: string;
  id: string;
  name: string;
  value: string;
  setValue: any;
  placeholder: string;
}

function Input({ text, type, id, name, value, setValue, placeholder }: InputProps) {
  return (
    <label htmlFor={name} className="flex flex-col items-center mb-4">
      <span className="m-1 text-white">{text}</span>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="border-solid border-2  rounded w-96 text-center p-1 placeholder-black"
        style={{ backgroundColor: "hsl(0, 0%, 85%)" }}
      />
    </label>
  );
}

export default Input;
