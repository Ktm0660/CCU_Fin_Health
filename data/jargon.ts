export type Term = {
  id: string;
  tags: string[];
  term_en: string;
  term_es: string;
  def_en: string;
  def_es: string;
};

const T = (
  id: string, tags: string[],
  en: string, es: string,
  defEN: string, defES: string
): Term => ({ id, tags, term_en: en, term_es: es, def_en: defEN, def_es: defES });

export const terms: Term[] = [
  T(
    "apr", ["borrowing","fees","credit"],
    "APR (Annual Percentage Rate)",
    "APR (Tasa Porcentual Anual)",
    "The total yearly cost of borrowing, including interest and most fees. It lets you compare loans fairly.",
    "El costo total anual de un préstamo, incluyendo intereses y la mayoría de comisiones. Sirve para comparar préstamos."
  ),
  T(
    "nsf", ["checking","fees"],
    "NSF / Overdraft",
    "Fondos insuficientes / Sobregiro",
    "When a payment is higher than your balance. Some accounts charge a fee; alerts and autopay can help prevent it.",
    "Cuando un pago supera tu saldo. Algunas cuentas cobran comisión; alertas y pagos automáticos ayudan a evitarlo."
  ),
  T(
    "secured-loan", ["borrowing","credit-building"],
    "Secured loan",
    "Préstamo con garantía",
    "A loan backed by something you own (like savings). Often easier to get and has a lower rate.",
    "Préstamo respaldado por algo que posees (como ahorros). Suele ser más fácil y con tasa menor."
  ),
  T(
    "itin", ["trust","access"],
    "ITIN",
    "ITIN",
    "A taxpayer ID used if you don’t have a Social Security Number. Many credit unions can lend using an ITIN.",
    "Identificación fiscal para quienes no tienen Seguro Social. Muchas cooperativas pueden prestar con ITIN."
  ),
  T(
    "small-dollar", ["payday-alt","trust"],
    "Small-dollar loan",
    "Préstamo de monto pequeño",
    "Designed for emergencies with lower total cost than payday loans. Clear payments you can budget for.",
    "Diseñado para emergencias con menor costo total que los ‘payday’. Pagos claros que puedes presupuestar."
  ),
];
