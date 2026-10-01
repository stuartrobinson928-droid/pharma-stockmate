import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  computeRow,
  emptyRow,
  fmt,
  fmtInt,
  num,
  type StockRow,
} from "@/lib/stock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stock Addition Calculator — Pharma Ledger Pad" },
      {
        name: "description",
        content:
          "Stock addition calculator for pharma distributors: per-item TP, sale price, net unit price and item totals, computed live as you type.",
      },
      { property: "og:title", content: "Stock Addition Calculator — Pharma Ledger Pad" },
      {
        property: "og:description",
        content:
          "Add medicine stock lines and get live TP, sale price, net unit price and grand totals — ready to print.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STORAGE_KEY = "stock-addition-rows-v1";

const seedRows = (): StockRow[] => {
  const base = emptyRow();
  return [
    {
      ...base,
      code: "AMX-0412",
      name: "Amoxicillin 500mg",
      batchNo: "B24-0917",
      cmp: "MediCore",
      retail: "314",
      cpDis: "15",
      stock: "600",
      disc: "43",
    },
  ];
};

function loadRows(): StockRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedRows();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].hasOwnProperty("id")) {
      return parsed as StockRow[];
    }
  } catch {
    // ignore corrupt storage
  }
  return seedRows();
}

function Index() {
  const [rows, setRows] = useState<StockRow[]>(loadRows);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch {
      // storage unavailable — in-memory only
    }
  }, [rows]);

  const calcs = useMemo(() => rows.map(computeRow), [rows]);

  const totals = useMemo(() => {
    const stock = rows.reduce((sum, r) => sum + num(r.stock), 0);
    const grand = calcs.reduce((sum, c) => sum + c.itemTotal, 0);
    return { stock, grand };
  }, [rows, calcs]);

  const updateRow = (id: string, field: keyof StockRow, value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const deleteRow = (id: string) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : [emptyRow()]));

  const clearAll = () => setRows([emptyRow()]);

  const resetToSample = () => setRows(seedRows());

  const textCell = (
    id: string,
    row: StockRow,
    field: keyof StockRow,
    label: string,
    placeholder: string,
    extra?: string,
  ) => (
    <td className="px-1 py-1">
      <input
        className={`cell-input font-mono text-[13px] ${extra ?? ""}`}
        value={row[field]}
        placeholder={placeholder}
        aria-label={label}
        onChange={(e) => updateRow(id, field, e.target.value)}
      />
    </td>
  );

  const numCell = (id: string, row: StockRow, field: keyof StockRow, label: string, w: string) =>
    textCell(id, row, field, label, "0", `${w} text-right`);

  return (
    <div className="min-h-screen bg-paper text-ink font-display antialiased">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4 pb-5">
          <div className="flex items-center gap-4">
            <div className="grid size-12 place-items-center rounded-xl bg-ink font-display text-lg font-semibold tracking-tight text-paper">
              Rx
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold leading-none tracking-tight sm:text-3xl">
                Stock Addition Calculator
              </h1>
              <p className="mt-1 text-sm text-inksoft">
                Distributor carbon-copy pad · batch entry &amp; live totals
              </p>
            </div>
          </div>
          <div className="stamp hidden rounded-lg border-2 border-branddeep px-4 py-2 text-center text-branddeep sm:block no-print">
            <span className="block font-display text-sm font-semibold uppercase tracking-[0.2em]">
              Live calc
            </span>
            <span className="block text-[10px] uppercase tracking-[0.15em] text-inksoft">
              {rows.length} {rows.length === 1 ? "line" : "lines"}
            </span>
          </div>
        </header>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pb-4 no-print">
          <button
            onClick={addRow}
            className="inline-flex items-center gap-2 rounded-lg bg-branddeep px-3 py-2 text-sm font-medium text-paper ring-1 ring-branddeep/40 transition-colors hover:bg-brand"
          >
            <span aria-hidden className="relative block size-3.5">
              <span className="absolute top-1/2 block h-px w-3.5 -translate-y-1/2 bg-paper" />
              <span className="absolute left-1/2 block h-3.5 w-px -translate-x-1/2 bg-paper" />
            </span>
            Add row
          </button>
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-2 rounded-lg bg-sheet px-3 py-2 text-sm font-medium text-ink ring-1 ring-ink/10 transition-colors hover:bg-muted"
          >
            Clear sheet
          </button>
          <button
            onClick={resetToSample}
            className="inline-flex items-center gap-2 rounded-lg bg-sheet px-3 py-2 text-sm font-medium text-ink ring-1 ring-ink/10 transition-colors hover:bg-muted"
          >
            Reset sample
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-medium text-paper ring-1 ring-ink/40 transition-colors hover:bg-inksoft"
          >
            <span aria-hidden className="block size-3 border-t-2 border-r-2 border-paper" />
            Print sheet
          </button>
          <span className="ml-auto font-mono text-xs text-inksoft">
            {rows.length} {rows.length === 1 ? "line" : "lines"} · auto-calculated · saved locally
          </span>
        </div>

        {/* Table card */}
        <div className="print-sheet overflow-hidden rounded-2xl bg-sheet ring-1 ring-ink/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1220px] border-collapse text-sm">
              <thead>
                <tr className="bg-ink text-paper">
                  <th className="w-8 px-3 py-3 text-left text-[11px] font-medium uppercase tracking-[0.12em]">#</th>
                  <th className="px-3 py-3 text-left text-[11px] font-medium uppercase tracking-[0.12em]">Code</th>
                  <th className="px-3 py-3 text-left text-[11px] font-medium uppercase tracking-[0.12em]">Name</th>
                  <th className="px-3 py-3 text-left text-[11px] font-medium uppercase tracking-[0.12em]">Batch No</th>
                  <th className="px-3 py-3 text-left text-[11px] font-medium uppercase tracking-[0.12em]">Cmp</th>
                  <th className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-[0.12em]">Retail</th>
                  <th className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-[0.12em]">Cp Dis %</th>
                  <th className="bg-branddeep px-3 py-3 text-right text-[11px] font-medium uppercase tracking-[0.12em]">TP</th>
                  <th className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-[0.12em]">Stock</th>
                  <th className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-[0.12em]">Bon</th>
                  <th className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-[0.12em]">STax %</th>
                  <th className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-[0.12em]">Disc %</th>
                  <th className="bg-branddeep px-3 py-3 text-right text-[11px] font-medium uppercase tracking-[0.12em]">S.Price</th>
                  <th className="bg-branddeep px-3 py-3 text-right text-[11px] font-medium uppercase tracking-[0.12em]">Item Total</th>
                  <th className="w-10 no-print" />
                </tr>
              </thead>
              <tbody className="font-mono text-[13px]">
                {rows.map((row, i) => {
                  const c = computeRow(row);
                  return (
                    <tr key={row.id} className="border-b border-rule/70">
                      <td className="select-none px-3 py-2 text-inksoft">
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      {textCell(row.id, row, "code", `Code (row ${i + 1})`, "Code")}
                      {textCell(row.id, row, "name", `Medicine name (row ${i + 1})`, "Medicine name", "font-display")}
                      {textCell(row.id, row, "batchNo", `Batch No (row ${i + 1})`, "Batch")}
                      {textCell(row.id, row, "cmp", `Company (row ${i + 1})`, "Company", "font-display")}
                      {numCell(row.id, row, "retail", `Retail (row ${i + 1})`, "w-24")}
                      {numCell(row.id, row, "cpDis", `Cp Dis % (row ${i + 1})`, "w-16")}
                      <td className="cell-calc px-3 py-2 text-right font-semibold text-gold">
                        {fmt(c.tp)}
                      </td>
                      {numCell(row.id, row, "stock", `Stock (row ${i + 1})`, "w-20")}
                      {numCell(row.id, row, "bon", `Bon (row ${i + 1})`, "w-14")}
                      {numCell(row.id, row, "stax", `STax % (row ${i + 1})`, "w-14")}
                      {numCell(row.id, row, "disc", `Disc % (row ${i + 1})`, "w-16")}
                      <td className="cell-calc px-3 py-2 text-right font-semibold text-gold">
                        {fmt(c.sPrice)}
                      </td>
                      <td className="cell-calc px-3 py-2 text-right">
                        <span className="block text-[10px] leading-tight text-inksoft">
                          net {fmt(c.netUnit)}/unit
                        </span>
                        <span className="block font-semibold text-gold">{fmt(c.itemTotal)}</span>
                      </td>
                      <td className="no-print px-1 py-1 text-center">
                        <button
                          onClick={() => deleteRow(row.id)}
                          aria-label={`Delete row ${i + 1}`}
                          className="inline-grid size-6 place-items-center text-inksoft transition-colors hover:text-destructive"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Sticky totals strip */}
          <div className="sticky bottom-0 bg-ink text-paper">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.15em] text-paper/50">
                    Total stock
                  </span>
                  <span className="font-mono text-lg font-semibold tabular-nums">
                    {fmtInt(totals.stock)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.15em] text-paper/50">
                    Lines
                  </span>
                  <span className="font-mono text-lg font-semibold tabular-nums">
                    {rows.length}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase tracking-[0.15em] text-paper/50">
                  Grand total
                </span>
                <span className="font-mono text-2xl font-semibold tracking-tight tabular-nums text-goldsoft sm:text-3xl">
                  {fmt(totals.grand)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 font-mono text-xs text-pretty text-inksoft">
          TP = Retail × (100 − Cp Dis %) / 100 · S.Price = TP · Net Unit = TP × (100 − Disc %) / 100 · Item Total = Net Unit × Stock
        </p>
      </div>
    </div>
  );
}
