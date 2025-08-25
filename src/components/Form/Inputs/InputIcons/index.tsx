import { Input } from "../Input";
import type { InputIconsProps } from "./props";

export function InputIcons({ icon, rightButton, error, ...rest }: InputIconsProps) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3">{icon}</div>
      <Input error={error} id="name" placeholder="Seu Usuário completo" {...rest} />
      {rightButton && <div className="absolute right-3 top-3">{rightButton}</div>}
    </div>
  );
}
