import type { ButtonPrimaryProps } from "./props";

export function ButtonPrimary({ text, ...rest }: ButtonPrimaryProps) {
  return (
    <button
      className="w-full bg-red-magnum hover:bg-[#e6003d] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-magnum focus:ring-offset-2"
      {...rest}
    >
      {text}
    </button>
  );
}
