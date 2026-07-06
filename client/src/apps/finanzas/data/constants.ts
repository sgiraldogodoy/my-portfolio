export const ACCOUNTS = [
  "Efectivo",
  "Savings",
  "Checking",
  "Lavandería",
  "Goatbucks",
  "BonusPoints",
  "Starbucks",
  "Viajes",
  "T. Cred",
] as const;

export const CATEGORIES = [
  "Matrícula",
  "Vivienda",
  "Alimentación",
  "Salud",
  "Teléfono",
  "Lavandería y Aseo",
  "Paseos",
  "Break",
  "Diversión",
  "Libros y Materiales",
  "Casa, Ropa",
  "Pasajes",
  "Personal Santis",
  "JyM",
  "Movimientos",
  "Depósitos",
  "Salario",
] as const;

export type Account = (typeof ACCOUNTS)[number];
export type Category = (typeof CATEGORIES)[number];

export type Transaction = {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  account: Account;
  category: Category;
  /** Signed: negative for money out, positive for money in. */
  amount: number;
};
