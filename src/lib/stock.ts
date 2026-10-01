export interface StockRow {
  id: string;
  code: string;
  name: string;
  batchNo: string;
  cmp: string;
  retail: string;
  cpDis: string;
  stock: string;
  bon: string;
  stax: string;
  disc: string;
}

export interface RowCalcs {
  tp: number;
  sPrice: number;
  netUnit: number;
  itemTotal: number;
}

export function num(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function computeRow(row: StockRow): RowCalcs {
  const tp = round2(num(row.retail) * (100 - num(row.cpDis)) / 100);
  const netUnit = round2(tp * (100 - num(row.disc)) / 100);
  return {
    tp,
    sPrice: tp,
    netUnit,
    itemTotal: round2(netUnit * num(row.stock)),
  };
}

export const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtInt = (n: number) => n.toLocaleString("en-US");

export function emptyRow(): StockRow {
  return {
    id: crypto.randomUUID(),
    code: "",
    name: "",
    batchNo: "",
    cmp: "",
    retail: "",
    cpDis: "",
    stock: "",
    bon: "",
    stax: "",
    disc: "",
  };
}
