interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  padding?: number;
  color?: string;
}

function buildLine(data: number[], w: number, h: number, pad: number) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const stepX = (w - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const area = `${pad},${h - pad} ` + pts.join(" ") + ` ${w - pad},${h - pad}`;
  return { line: pts.join(" "), area };
}

export function SparklineChart({
  data,
  width = 560,
  height = 170,
  padding = 10,
  color = "var(--color-accent-violet)",
}: SparklineChartProps) {
  const { line, area } = buildLine(data, width, height, padding);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full block" style={{ height }}>
      <polygon points={area} fill={`color-mix(in oklch, ${color} 14%, transparent)`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
