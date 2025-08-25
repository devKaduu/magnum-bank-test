import { Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { ButtonPrimary } from "../../components/Form/Button";
import { InputIcons } from "../../components/Form/Inputs/InputIcons";
import { Label } from "../../components/Form/Label";
import { ShowPasswordButton } from "../../components/Form/ShowPassowordButton";
import type { LoginForm } from "./props";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ mode: "onChange" });

  const onSubmit = async (data: LoginForm) => {
    setSubmitError(null);
    try {
      await api.login({ email: data.email, password: data.password });
      navigate("/", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Não foi possível entrar.");
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h1>
          <p className="text-gray-600">Entre na sua conta para continuar</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <div className="space-y-1 mb-6">
            <h2 className="text-2xl font-semibold text-center text-gray-900">Login</h2>
            <p className="text-center text-gray-600">
              Digite suas credenciais para acessar sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" text="E-mail" />
              <InputIcons
                icon={<Mail size={16} className="text-gray-400" />}
                error={errors.email?.message}
                id="email"
                placeholder="seu@email.com"
                type="email"
                {...register("email", {
                  required: "E-mail é obrigatório",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "E-mail inválido",
                  },
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" text="Senha" />
              <InputIcons
                id="password"
                icon={<User size={16} className="text-gray-400" />}
                error={errors.password?.message}
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                {...register("password", {
                  required: "Senha é obrigatória",
                  minLength: { value: 6, message: "Senha deve ter pelo menos 6 caracteres" },
                })}
                rightButton={
                  <ShowPasswordButton
                    isShow={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </div>

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            <ButtonPrimary
              type="submit"
              disabled={isSubmitting}
              text={isSubmitting ? "Entrando..." : "Entrar"}
            />
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-red-magnum hover:underline font-medium">
                Crie uma conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
