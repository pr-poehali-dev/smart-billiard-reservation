/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Icon from "@/components/ui/icon";
import { NOTIFICATIONS, PAYMENTS, RATING, RECORDS } from "@/data/mockData";
import { AvatarBadge, Chip, SectionHeader } from "./SharedUI";

// ─── RATING PAGE ──────────────────────────────────────────────────────────────
export function RatingPage() {
  const podiumOrder = [RATING[1], RATING[0], RATING[2]];
  const medals = ["🥈", "🥇", "🥉"];
  const heights = [76, 100, 60];
  return (
    <div className="px-4 pb-4">
      <SectionHeader title="Рейтинг игроков" />
      <div className="flex items-end justify-center gap-5 mb-6 h-36">
        {podiumOrder.map((p, i) => (
          <div key={p.rank} className="flex flex-col items-center" style={{ width: 80 }}>
            <span className="text-xl mb-1">{medals[i]}</span>
            <AvatarBadge initials={p.avatar} size="sm" />
            <div className="text-xs font-medium mt-1 text-center truncate w-full" style={{ color: "var(--text-primary)" }}>
              {p.name.split(" ")[0]}
            </div>
            <div className="w-full rounded-t-xl flex items-center justify-center text-xs font-bold text-white mt-1"
              style={{ background: "var(--emerald)", height: heights[i] * 0.36 }}>
              {p.score}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {RATING.map((p, i) => (
          <div key={p.rank} className={`flex items-center px-4 py-3 ${p.me ? "bg-emerald-50" : ""}`}
            style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : "none" }}>
            <span className="w-6 text-sm font-bold text-gray-400 mr-3">#{p.rank}</span>
            <AvatarBadge initials={p.avatar} size="sm" />
            <div className="flex-1 ml-3">
              <div className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                {p.name}
                {p.me && <Chip text="Вы" />}
              </div>
              <div className="text-xs text-gray-400">{p.wins} побед</div>
            </div>
            <span className="font-bold text-sm" style={{ color: "var(--emerald)" }}>{p.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
export function NotificationsPage() {
  const [items, setItems] = useState(NOTIFICATIONS);
  return (
    <div className="px-4 pb-4">
      <SectionHeader title="Уведомления" action="Прочитать все"
        onAction={() => setItems(items.map(n => ({ ...n, unread: false })))} />
      <div className="space-y-3">
        {items.map((n, i) => (
          <div key={n.id}
            onClick={() => setItems(items.map(x => x.id === n.id ? { ...x, unread: false } : x))}
            className={`flex gap-3 bg-white rounded-3xl p-4 shadow-sm border transition-all animate-slide-up cursor-pointer ${n.unread ? "border-emerald-200" : "border-gray-100"}`}
            style={{ animationDelay: `${i * 50}ms` }}>
            <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center"
              style={{ background: n.unread ? "var(--emerald)" : "#f3f4f6" }}>
              <Icon name={n.icon as any} size={18} style={{ color: n.unread ? "#fff" : "#9ca3af" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{n.title}</span>
                <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{n.time}</span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{n.text}</p>
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: "var(--emerald)" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAYMENTS PAGE ────────────────────────────────────────────────────────────
export function PaymentsPage() {
  return (
    <div className="px-4 pb-4">
      <div className="rounded-3xl p-5 mb-4 text-white animate-fade-in"
        style={{ background: "linear-gradient(135deg, #006048 0%, #00a077 100%)" }}>
        <p className="text-sm text-white/70 mb-1">Баланс</p>
        <p className="text-4xl font-bold mb-4">1 800 ₽</p>
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 rounded-2xl bg-white/20 text-sm font-medium flex items-center justify-center gap-2">
            <Icon name="Plus" size={16} />Пополнить
          </button>
          <button className="flex-1 py-2.5 rounded-2xl bg-white/20 text-sm font-medium flex items-center justify-center gap-2">
            <Icon name="ArrowUpRight" size={16} />Вывести
          </button>
        </div>
      </div>
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--emerald-light)" }}>
            <Icon name="CreditCard" size={18} style={{ color: "var(--emerald)" }} />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>•••• •••• •••• 4242</div>
            <div className="text-xs text-gray-400">Visa · Основная карта</div>
          </div>
          <button className="ml-auto text-xs font-medium" style={{ color: "var(--emerald)" }}>Изменить</button>
        </div>
      </div>
      <SectionHeader title="Операции" />
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {PAYMENTS.map((p, i) => (
          <div key={p.id} className="flex items-center px-4 py-3"
            style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : "none" }}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 ${p.type === "credit" ? "bg-green-100" : "bg-gray-100"}`}>
              <Icon name={p.type === "credit" ? "ArrowDownLeft" : "ArrowUpRight"} size={14}
                style={{ color: p.type === "credit" ? "#16a34a" : "#6b7280" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{p.desc}</div>
              <div className="text-xs text-gray-400">{p.date}</div>
            </div>
            <span className={`font-bold text-sm ml-2 ${p.type === "credit" ? "text-green-600" : ""}`}
              style={p.type === "debit" ? { color: "var(--text-primary)" } : {}}>
              {p.type === "credit" ? "+" : ""}{p.amount.toLocaleString()}₽
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROMO PAGE ───────────────────────────────────────────────────────────────
export function PromoPage() {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const promos = [
    { code: "POOL20", desc: "Скидка 20% на следующее бронирование", expires: "31 мая", used: false },
    { code: "WELCOME", desc: "50₽ на баланс за первую игру", expires: "1 июня", used: true },
  ];
  return (
    <div className="px-4 pb-4">
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-5">
        <p className="text-sm font-medium mb-3" style={{ color: "var(--text-primary)" }}>Введите промокод</p>
        <div className="flex gap-2">
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="НАПРИМЕР: POOL20"
            className="flex-1 bg-gray-50 rounded-2xl px-4 py-2.5 text-sm font-mono outline-none"
            style={{ color: "var(--text-primary)" }} />
          <button onClick={() => { if (code) { setApplied(code); setCode(""); } }}
            className="px-4 py-2.5 rounded-2xl text-white text-sm font-medium"
            style={{ background: "var(--emerald)" }}>
            Применить
          </button>
        </div>
        {applied && (
          <div className="mt-3 flex items-center gap-2 text-sm text-green-600 animate-fade-in">
            <Icon name="CheckCircle" size={16} />
            <span>Промокод «{applied}» активирован!</span>
          </div>
        )}
      </div>
      <SectionHeader title="Мои промокоды" />
      <div className="space-y-3">
        {promos.map((p, i) => (
          <div key={p.code}
            className={`bg-white rounded-3xl p-4 shadow-sm border animate-slide-up ${p.used ? "opacity-60 border-gray-100" : "border-emerald-200"}`}
            style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold font-mono text-base" style={{ color: "var(--emerald)" }}>{p.code}</span>
              <Chip text={p.used ? "Использован" : "Активен"} variant={p.used ? "muted" : "success"} />
            </div>
            <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>{p.desc}</p>
            <p className="text-xs text-gray-400">Действует до {p.expires}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RECORDS PAGE ─────────────────────────────────────────────────────────────
export function RecordsPage() {
  const wins = RECORDS.filter(r => r.result === "win").length;
  return (
    <div className="px-4 pb-4">
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Всего игр", value: RECORDS.length },
          { label: "Побед", value: wins },
          { label: "% побед", value: `${Math.round(wins / RECORDS.length * 100)}%` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold" style={{ color: "var(--emerald)" }}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {RECORDS.map((r, i) => (
          <div key={r.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${r.result === "win" ? "bg-emerald-50" : "bg-orange-50"}`}>
                  <Icon name={r.result === "win" ? "Trophy" : "X"} size={16}
                    style={{ color: r.result === "win" ? "var(--emerald)" : "#f97316" }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>vs {r.opponent}</div>
                  <div className="text-xs text-gray-400">{r.date} · {r.club}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg" style={{ color: r.result === "win" ? "var(--emerald)" : "#f97316" }}>{r.score}</div>
                <div className="text-xs text-gray-400">{r.duration}</div>
              </div>
            </div>
            <button className="w-full py-2 rounded-xl border border-gray-100 text-sm text-gray-500 flex items-center justify-center gap-1">
              <Icon name="Video" size={12} />
              <span>Смотреть запись</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
