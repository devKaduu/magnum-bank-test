import logo from "../../assets/magnum-logo.png";
import type { LogoProps } from "./props";

export function Logo({ className, ...rest }: LogoProps) {
  return <img src={logo} className={`mx-auto ${className}`} {...rest} />;
}
