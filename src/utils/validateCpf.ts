export const validateCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/\D/g, "");
  return cleanCPF.length === 11;
};
