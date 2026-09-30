import type { ReactNode } from 'react';

type ActivityPoint = {
  date: string;
  label: string;
  messages: number;
  collected: number;
};

type GiftSummary = {
  received: number;
  waiting: number;
  missed: number;
  collected: number;
  available: number;
};

type DashboardStats = {
  messages?: { total?: number; unread?: number; read?: number; archived?: number };
  gifts?: GiftSummary;
  activity?: ActivityPoint[];
  categories?: Array<{ label: string; count: number }>;
  blogPosts?: number;
  programs?: number;
  teamRoles?: number;
  socialLinks?: number;
};

const cardClass = 'rounded-[1.75rem] border border-[#e6e8f0] bg-white p-5 shadow-[0_10px_40px_rgba(29,30,44,0.06)] sm:p-6';

function money(value: number) {
  return `${Number(value || 0).toLocaleString()} RWF`;
}

function TrendChart({
  title,
  subtitle,
  total,
  points,
  color,
  empty,
  footer,
}: {
  title: string;
  subtitle: string;
  total: string;
  points: Array<{ label: string; value: number }>;
  color: string;
  empty: string;
  footer?: ReactNode;
}) {
  const width = 640;
  const height = 188;
  const padBottom = 28;
  const padTop = 12;
  const max = Math.max(1, ...points.map((point) => point.value));
  const gap = 8;
  const barWidth = (width - gap * (points.length - 1)) / points.length;
  const innerHeight = height - padTop - padBottom;
  const hasData = points.some((point) => point.value > 0);

  return (
    <article className={cardClass}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#1d1e2c]">{title}</h2>
          <p className="mt-1 text-sm text-[#6b7280]">{subtitle}</p>
        </div>
        <p className="text-right text-2xl font-bold tracking-tight text-[#1d1e2c]">{total}</p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 w-full" role="img" aria-label={title}>
        {points.map((point, index) => {
          const barHeight = (point.value / max) * innerHeight;
          const x = index * (barWidth + gap);
          const y = padTop + innerHeight - barHeight;
          return (
            <g key={`${point.label}-${index}`}>
              <title>{`${point.label}: ${point.value}`}</title>
              <rect
                x={x}
                y={point.value ? y : padTop + innerHeight - 3}
                width={barWidth}
                height={point.value ? Math.max(barHeight, 6) : 3}
                rx="6"
                fill={point.value ? color : '#e6e8f0'}
              />
              <text
                x={x + barWidth / 2}
                y={height - 8}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="11"
              >
                {index % 2 === 0 ? point.label.split(' ')[0] : ''}
              </text>
            </g>
          );
        })}
      </svg>
      {!hasData && <p className="text-sm text-[#6b7280]">{empty}</p>}
      {footer}
    </article>
  );
}

function Donut({
  title,
  slices,
}: {
  title: string;
  slices: Array<{ label: string; value: number; color: string }>;
}) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <article className={cardClass}>
      <h2 className="text-lg font-semibold text-[#1d1e2c]">{title}</h2>
      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
        <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0" role="img" aria-label={title}>
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#eef0f6" strokeWidth="18" />
          {total > 0 &&
            slices.map((slice) => {
              const length = (slice.value / total) * circumference;
              const dash = `${length} ${circumference - length}`;
              const circle = (
                <circle
                  key={slice.label}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth="18"
                  strokeDasharray={dash}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                  transform="rotate(-90 80 80)"
                />
              );
              offset += length;
              return circle;
            })}
          <text x="80" y="76" textAnchor="middle" fill="#1d1e2c" fontSize="28" fontWeight="700">
            {total}
          </text>
          <text x="80" y="96" textAnchor="middle" fill="#6b7280" fontSize="11">
            total
          </text>
        </svg>
        <ul className="w-full space-y-3">
          {slices.map((slice) => (
            <li key={slice.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-[#1d1e2c]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: slice.color }} />
                {slice.label}
              </span>
              <span className="font-semibold">{slice.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Bars({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: Array<{ label: string; value: number; color: string; display?: string }>;
}) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  return (
    <article className={cardClass}>
      <h2 className="text-lg font-semibold text-[#1d1e2c]">{title}</h2>
      <p className="mt-1 text-sm text-[#6b7280]">{subtitle}</p>
      <ul className="mt-5 space-y-4">
        {rows.map((row) => (
          <li key={row.label}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-[#1d1e2c]">{row.label}</span>
              <span className="font-semibold text-[#1d1e2c]">{row.display ?? row.value}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#eef0f6]">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.max((row.value / max) * 100, row.value ? 6 : 0)}%`, background: row.color }}
              />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function OverviewCharts({ stats }: { stats: Record<string, unknown> | null }) {
  const data = (stats || {}) as DashboardStats;
  const activity = Array.isArray(data.activity) ? data.activity : [];
  const messages = data.messages || {};
  const gifts = data.gifts || { received: 0, waiting: 0, missed: 0, collected: 0, available: 0 };
  const messageTotal = activity.reduce((sum, point) => sum + Number(point.messages || 0), 0);
  const collectedTotal = activity.reduce((sum, point) => sum + Number(point.collected || 0), 0);
  const categories = (data.categories || []).filter((item) => item.count > 0);

  return (
    <section className="mt-6 grid gap-4 xl:grid-cols-2" data-testid="admin-overview-charts">
      <TrendChart
        title="People reaching out"
        subtitle="Messages saved over the last 14 days"
        total={String(messageTotal)}
        color="#6c5ce7"
        empty="No new messages in this period."
        points={activity.map((point) => ({ label: point.label, value: Number(point.messages || 0) }))}
      />
      <TrendChart
        title="Gifts received"
        subtitle="Completed gifts over the last 14 days"
        total={money(collectedTotal)}
        color="#1dd1a1"
        empty="No completed gifts in this period."
        points={activity.map((point) => ({ label: point.label, value: Number(point.collected || 0) }))}
        footer={
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              ['Received', gifts.received, '#1dd1a1'],
              ['Waiting', gifts.waiting, '#f2b857'],
              ['Not completed', gifts.missed, '#ff6b81'],
            ].map(([label, value, color]) => (
              <div key={String(label)} className="rounded-2xl bg-[#f8f9fc] px-2 py-3">
                <p className="text-lg font-bold text-[#1d1e2c]">{value}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[.06em]" style={{ color: String(color) }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        }
      />
      <Donut
        title="Contact status"
        slices={[
          { label: 'New', value: Number(messages.unread || 0), color: '#6c5ce7' },
          { label: 'Read', value: Number(messages.read || 0), color: '#54a0ff' },
          { label: 'Archived', value: Number(messages.archived || 0), color: '#d5d8e2' },
        ]}
      />
      <Bars
        title="What is published"
        subtitle={`${money(gifts.available)} is available to withdraw`}
        rows={[
          { label: 'Articles', value: Number(data.blogPosts || 0), color: '#6c5ce7' },
          { label: 'Programs', value: Number(data.programs || 0), color: '#54a0ff' },
          { label: 'Team roles', value: Number(data.teamRoles || 0), color: '#1dd1a1' },
          { label: 'Social channels', value: Number(data.socialLinks || 0), color: '#f2b857' },
          ...categories.slice(0, 3).map((item) => ({
            label: item.label,
            value: Number(item.count || 0),
            color: '#a29bfe',
          })),
        ]}
      />
    </section>
  );
}
