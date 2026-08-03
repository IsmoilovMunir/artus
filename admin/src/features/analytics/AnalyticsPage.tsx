import { useAdminStore } from "@/store/useAdminStore";
import { Card } from "@/components/ui/Card";
import { ProgressBarRow } from "@/components/ui/ProgressBar";
import { SparklineChart } from "@/components/charts/SparklineChart";

const BRAND_COLORS: Record<string, string> = {
  Samsung: "var(--color-accent-violet)",
  LG: "var(--color-accent-orange)",
  Sony: "var(--color-accent-cyan)",
  Xiaomi: "var(--color-accent-green)",
  TCL: "var(--color-accent-amber)",
  Aston: "var(--color-accent-purple)",
};

export function AnalyticsPage() {
  const breakdown = useAdminStore((s) => s.analyticsBreakdown);

  return (
    <div>
      <Card className="p-5.5 mb-4">
        <div className="text-[15px] font-bold mb-3.5">Динамика выручки, 14 дней</div>
        <SparklineChart data={breakdown.salesTrendBig} width={1080} height={220} />
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="text-[15px] font-bold mb-3.5">Продажи по категориям</div>
          <div className="flex flex-col gap-3">
            {breakdown.categoryBreakdown.map((c) => (
              <ProgressBarRow key={c.name} label={c.name} value={c.value} pct={c.pct} color="var(--color-accent-violet)" />
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-[15px] font-bold mb-3.5">Доля брендов в продажах</div>
          <div className="flex flex-col gap-3">
            {breakdown.brandBreakdown.map((b) => (
              <ProgressBarRow
                key={b.name}
                label={b.name}
                value={`${b.pct}%`}
                pct={b.pct * 2.5}
                color={BRAND_COLORS[b.name] ?? "var(--color-accent-violet)"}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
