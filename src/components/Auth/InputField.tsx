import { FieldError, UseFormRegister } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
}

export function InputField({ label, name, type, register, error, required }: InputFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={name}
        {...register(name, { required: required ? `${label} is required` : false })}
        className={`mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-300 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}