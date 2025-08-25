import { Logo } from "../Logo";

export function AuthBanner() {
  return (
    <div className="hidden lg:flex flex-1 bg-gradient-to-br from-black/90 to-red-magnum/100 items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <Logo />
        <h2 className="text-2xl font-bold text-white">Aqui, sua paixão vale mais.</h2>
        <p className="text-white leading-relaxed">
          O primeiro banco que transforma tudo o que você compra em benefícios reais para a sua
          maior paixão: você mesmo.
        </p>
      </div>
    </div>
  );
}
