export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const currencyPtBr = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 });
