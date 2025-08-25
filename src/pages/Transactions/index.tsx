import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getStoredUser } from "../../api/api";
import { ButtonPrimary } from "../../components/Form/Button";
import { Input } from "../../components/Form/Inputs/Input";
import { InputIcons } from "../../components/Form/Inputs/InputIcons";
import { Label } from "../../components/Form/Label";
import { ShowPasswordButton } from "../../components/Form/ShowPassowordButton";
import type { TransactionRequestDTO } from "../../services/api/dtos/transactionRequestDTO";
import { formatCurrency } from "../../utils/formatCurrency";
import type { FormErrors } from "./props";

const TX_PASS_KEY = "__tx_password";
function getTxPassword(): string | null {
  return localStorage.getItem(TX_PASS_KEY);
}
function setTxPassword(pass: string) {
  localStorage.setItem(TX_PASS_KEY, pass);
}

export function Transaction() {
  const [formData, setFormData] = useState<TransactionRequestDTO>({
    transferType: "pix",
    cpfCnpj: "",
    beneficiaryName: "",
    bank: "",
    branch: "",
    accountNumber: "",
    pixKey: "",
    amount: "",
    transactionDate: new Date().toISOString().split("T")[0],
    password: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentBalanceCents, setCurrentBalanceCents] = useState<number>(0);

  useEffect(() => {
    const u = getStoredUser<{ balance: number }>();
    setCurrentBalanceCents(u?.balance ?? 0);
  }, []);

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, "");
    return cleanCPF.length === 11;
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.cpfCnpj) {
      newErrors.cpfCnpj = "CPF/CNPJ é obrigatório";
    } else if (!validateCPF(formData.cpfCnpj)) {
      newErrors.cpfCnpj = "CPF/CNPJ inválido";
    }

    if (!formData.beneficiaryName) {
      newErrors.beneficiaryName = "Nome do beneficiário é obrigatório";
    }

    if (formData.transferType === "ted") {
      if (!formData.bank) newErrors.bank = "Banco é obrigatório";
      if (!formData.branch) newErrors.branch = "Agência é obrigatória";
      if (!formData.accountNumber) newErrors.accountNumber = "Conta é obrigatória";
    } else {
      if (!formData.pixKey) newErrors.pixKey = "Chave PIX é obrigatória";
    }

    const amountNumber = Number.parseFloat(formData.amount || "0");
    if (!formData.amount || amountNumber <= 0) {
      newErrors.amount = "Valor deve ser maior que zero";
    } else {
      const amountCents = Math.round(amountNumber * 100);
      if (amountCents > currentBalanceCents) {
        newErrors.amount = "Saldo insuficiente";
      }
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = "Data é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof TransactionRequestDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleContinue = () => {
    setSubmitError(null);

    if (validateForm()) {
      setShowSummary(true);
    }
  };

  const handleConfirmTransaction = async () => {
    setSubmitError(null);

    if (!formData.password) {
      setErrors({ password: "Senha de transação é obrigatória" });
      return;
    }

    const existing = getTxPassword();
    if (existing && formData.password !== existing) {
      setErrors({ password: "Senha de transação incorreta" });
      return;
    }
    if (!existing) {
      setTxPassword(formData.password);
    }

    const amountCents = Math.round(Number.parseFloat(formData.amount) * 100);

    const payload = {
      transferType: formData.transferType,
      cpfCnpj: formData.cpfCnpj,
      beneficiaryName: formData.beneficiaryName,
      bank: formData.transferType === "ted" ? formData.bank : undefined,
      branch: formData.transferType === "ted" ? formData.branch : undefined,
      accountNumber: formData.transferType === "ted" ? formData.accountNumber : undefined,
      pixKey: formData.transferType === "pix" ? formData.pixKey : undefined,
      amount: amountCents,
      transactionDate: formData.transactionDate,
    } as const;

    try {
      setIsProcessing(true);
      await api.createTx(payload);

      const userStore = getStoredUser<{ balance: number }>();
      setCurrentBalanceCents(userStore?.balance ?? currentBalanceCents);

      setShowSummary(false);
      setFormData({
        transferType: "pix",
        cpfCnpj: "",
        beneficiaryName: "",
        bank: "",
        branch: "",
        accountNumber: "",
        pixKey: "",
        amount: "",
        transactionDate: new Date().toISOString().split("T")[0],
        password: "",
      });

      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setSubmitError(e?.message ?? "Erro ao criar a transação.");
    } finally {
      setIsProcessing(false);
    }
  };

  const currentBalance = currentBalanceCents / 100;

  if (showSummary) {
    return (
      <div className="max-w-md mx-auto mt-22">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 text-center border-b border-gray-100">
            <div className="mx-auto w-12 h-12 bg-red-magnum/10 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-magnum"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Confirmar Transferência</h3>
            <p className="mt-2 text-gray-600">Revise os dados antes de confirmar</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tipo:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                    formData.transferType === "pix" ? "bg-red-magnum" : "bg-gray-500"
                  }`}
                >
                  {formData.transferType.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Beneficiário:</span>
                <span className="font-medium">{formData.beneficiaryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CPF/CNPJ:</span>
                <span>{formData.cpfCnpj}</span>
              </div>

              {formData.transferType === "ted" ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Banco:</span>
                    <span>{formData.bank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Agência:</span>
                    <span>{formData.branch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conta:</span>
                    <span>{formData.accountNumber}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-gray-600">Chave PIX:</span>
                  <span className="break-all text-sm">{formData.pixKey}</span>
                </div>
              )}

              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Valor:</span>
                <span className="text-red-magnum">
                  {formatCurrency(Number.parseFloat(formData.amount || "0"))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data:</span>
                <span>{new Date(formData.transactionDate).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Senha de Transação
              </label>
              <div className="relative">
                <InputIcons
                  icon
                  rightButton={
                    <ShowPasswordButton
                      isShow={showPassword}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  }
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  className="pl-2"
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Digite sua senha"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.password}
                </p>
              )}
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowSummary(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                disabled={isProcessing}
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmTransaction}
                className="flex-1 px-4 py-2 bg-red-magnum text-white rounded-lg hover:bg-red-magnum/80 disabled:opacity-50"
                disabled={isProcessing}
              >
                {isProcessing ? "Processando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-2 mt-2">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">Saldo Disponível</p>
          <p className="text-2xl font-bold text-red-magnum mt-1">
            {formatCurrency(currentBalance)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-2 border-b border-gray-100">
          <h3 className="text-xl font-bold">Nova Transferência</h3>
          <p className="mt-1 text-gray-600">Escolha o tipo e preencha os dados</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Tipo de Transferência</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="transferType"
                  value="pix"
                  checked={formData.transferType === "pix"}
                  onChange={(e) =>
                    handleInputChange("transferType", e.target.value as "ted" | "pix")
                  }
                  className="w-4 h-4 text-red-magnum border-gray-300 focus:ring-red-magnum"
                />
                <span className="text-sm font-medium">PIX</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="transferType"
                  value="ted"
                  checked={formData.transferType === "ted"}
                  onChange={(e) =>
                    handleInputChange("transferType", e.target.value as "ted" | "pix")
                  }
                  className="w-4 h-4 text-red-magnum border-gray-300 focus:ring-red-magnum"
                />
                <span className="text-sm font-medium">TED</span>
              </label>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-2">
            <div className="space-y-1">
              <Label
                htmlFor="cpfCnpj"
                text="CPF/CNPJ do Beneficiário"
                className="block text-sm font-medium"
              />
              <Input
                id="cpfCnpj"
                value={formData.cpfCnpj}
                onChange={(e) => handleInputChange("cpfCnpj", e.target.value)}
                placeholder="000.000.000-00"
                className={"pl-2"}
                error={errors.cpfCnpj}
              />
            </div>

            <div className="space-y-1">
              <Label
                text="Nome do Beneficiário"
                htmlFor="beneficiaryName"
                className="block text-sm font-medium"
              />
              <Input
                id="beneficiaryName"
                value={formData.beneficiaryName}
                onChange={(e) => handleInputChange("beneficiaryName", e.target.value)}
                placeholder="Nome completo"
                className={"pl-2"}
                error={errors.beneficiaryName}
              />
            </div>

            {formData.transferType === "ted" && (
              <div>
                <div className="space-y-2">
                  <Label text="Banco" htmlFor="bank" className="block text-sm font-medium" />
                  <Input
                    id="bank"
                    value={formData.bank}
                    onChange={(e) => handleInputChange("bank", e.target.value)}
                    placeholder="Nome do banco"
                    className={"pl-2"}
                    error={errors.bank}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch" text="Agência" className="block text-sm font-medium" />
                    <Input
                      id="branch"
                      value={formData.branch}
                      onChange={(e) => handleInputChange("branch", e.target.value)}
                      placeholder="0000"
                      className={"pl-2"}
                      error={errors.branch}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      text="Conta"
                      htmlFor="accountNumber"
                      className="block text-sm font-medium"
                    />
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                      placeholder="00000-0"
                      className={"pl-2"}
                      error={errors.accountNumber}
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.transferType === "pix" && (
              <div className="space-y-2">
                <Label text="Chave PIX" htmlFor="pixKey" className="block text-sm font-medium" />
                <Input
                  id="pixKey"
                  value={formData.pixKey}
                  onChange={(e) => handleInputChange("pixKey", e.target.value)}
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
                  className={"pl-2"}
                  error={errors.pixKey}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label text="Valor (R$)" htmlFor="amount" className="block text-sm font-medium" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="0,00"
                  className={"pl-2"}
                  error={errors.amount}
                />
              </div>

              <div className="space-y-1">
                <Label
                  text="Data"
                  htmlFor="transactionDate"
                  className="block text-sm font-medium"
                />
                <Input
                  id="transactionDate"
                  type="date"
                  value={formData.transactionDate}
                  onChange={(e) => handleInputChange("transactionDate", e.target.value)}
                  className={"pl-2"}
                  error={errors.transactionDate}
                />
              </div>
            </div>
          </div>

          <ButtonPrimary
            text="Continuar"
            onClick={handleContinue}
            className="w-full px-4 py-3 bg-red-magnum text-white rounded-lg hover:bg-red-magnum/80 font-medium transition-colors"
          />

          {submitError && <p className="text-sm text-red-magnum mt-3">{submitError}</p>}
        </div>
      </div>
    </div>
  );
}
