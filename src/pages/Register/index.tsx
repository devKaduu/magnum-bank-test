import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Mail, User } from "lucide-react";
import { ButtonPrimary } from "../../components/Form/Button";
import { InputCheckBox } from "../../components/Form/Inputs/InputCheckBox";
import { InputIcons } from "../../components/Form/Inputs/InputIcons";
import { Label } from "../../components/Form/Label";
import { ShowPasswordButton } from "../../components/Form/ShowPassowordButton";

import { api } from "../../api/api";
import { maskCPF } from "../../utils/maskCpf";
import type { RegisterForm } from "./props";

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ mode: "onChange" });

  const cpfValue = watch("cpf") ?? "";

  const onSubmit = async (data: RegisterForm) => {
    setSubmitError(null);
    try {
      await api.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      navigate("/", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Erro ao criar conta.");
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Criar conta</h1>
          <p className="text-gray-600">Preencha os dados para se cadastrar</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <div className="space-y-1 mb-6">
            <h2 className="text-2xl font-semibold text-center text-gray-900">Registro</h2>
            <p className="text-center text-gray-600">
              Digite suas informações para criar sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" text="Usuário" />
              <InputIcons
                icon={<User size={16} className="text-gray-400" />}
                error={errors.name?.message}
                id="name"
                placeholder="Seu usuário"
                {...register("name", {
                  required: "Usuário é obrigatório",
                  minLength: { value: 2, message: "Usuário deve ter pelo menos 2 caracteres" },
                })}
              />
            </div>

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
              <Label htmlFor="cpf" text="CPF" />
              <InputIcons
                icon={<User size={16} className="text-gray-400" />}
                error={errors.cpf?.message}
                id="cpf"
                placeholder="000.000.000-00"
                value={cpfValue}
                {...register("cpf", {
                  required: "CPF é obrigatório",
                  pattern: {
                    value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                    message: "CPF inválido",
                  },
                  onChange: (e) => {
                    setValue("cpf", maskCPF(e.target.value), { shouldValidate: true });
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

            <InputCheckBox
              id="terms"
              type="checkbox"
              {...register("terms", { required: "Você deve aceitar os termos de uso" })}
              error={errors.terms?.message}
              description={
                <label htmlFor="terms" className="text-sm text-gray-700">
                  Aceito os{" "}
                  <a href="#" className="text-red-magnum hover:underline">
                    termos de uso{" "}
                  </a>
                  e{" "}
                  <a href="#" className="text-red-magnum hover:underline">
                    política de privacidade
                  </a>
                </label>
              }
            />

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            <ButtonPrimary
              type="submit"
              disabled={isSubmitting}
              text={isSubmitting ? "Criando conta..." : "Criar conta"}
            />
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-red-magnum hover:underline font-medium">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
