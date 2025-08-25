import type { InputCheckBoxProps } from "./props";

export function InputCheckBox({ description, error, ...rest }: InputCheckBoxProps) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <input
          id="terms"
          type="checkbox"
          className="h-4 w-4 text-red-magnum focus:ring-red-magnum border-gray-300 rounded"
          {...rest}
        />
        {description}
      </div>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </>
  );
}
