/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Icon from "@/components/ui/icon";
import { CLUBS, HISTORY, SubPage } from "@/data/mockData";
import { Chip, SectionHeader, YandexMap } from "./SharedUI";

// ─── BOOKING PAGE ─────────────────────────────────────────────────────────────
export function BookingPage() {
  const [view, setView] = useState<"map" | "list">("map");
  const [selectedClub, setSelectedClub] = useState<typeof CLUBS[0] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("Сегодня");

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-2 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl px-3 py-2.5 shadow-sm border border-gray-100">
            <Icon name="Search" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">Найти клуб...</span>
          </div>
          <button className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 bg-white">
            <Icon name="SlidersHorizontal" size={16} style={{ color: "var(--emerald)" }} />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["Сегодня", "Завтра", "23 мая", "24 мая", "25 мая"].map((d) => (
            <button key={d} onClick={() => setDate(d)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${date === d ? "text-white" : "bg-white border border-gray-100 text-gray-500"}`}
              style={date === d ? { background: "var(--emerald)" } : {}}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mb-3">
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100 w-fit">
          {(["map", "list"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${view === v ? "text-white" : "text-gray-400"}`}
              style={view === v ? { background: "var(--emerald)" } : {}}>
              <Icon name={v === "map" ? "Map" : "List"} size={14} />
              {v === "map" ? "Карта" : "Список"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative px-4 pb-2">
        {view === "map" ? (
          <YandexMap onSelect={(c) => { setSelectedClub(c); setShowModal(true); }} />
        ) : (
          <div className="overflow-y-auto h-full space-y-3">
            {CLUBS.map((club, i) => (
              <button key={club.id} onClick={() => { setSelectedClub(club); setShowModal(true); }}
                className="w-full bg-white rounded-3xl p-4 shadow-sm border border-gray-100 text-left animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{club.name}</span>
                      {club.tag && <Chip text={club.tag} />}
                    </div>
                    <span className="text-xs text-gray-400">{club.address}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: "var(--emerald)" }}>{club.price}₽/ч</div>
                    <div className="text-xs text-gray-400">{club.distance}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium">{club.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Table2" size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">{club.tables} столов</span>
                  </div>
                  <div className={`ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${club.free > 0 ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${club.free > 0 ? "bg-emerald-500" : "bg-gray-300"}`} />
                    {club.free > 0 ? `${club.free} свободно` : "Занято"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedClub && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }} />
          <div className="relative w-full bg-white rounded-t-3xl p-5 animate-slide-up max-w-md mx-auto" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{selectedClub.name}</h3>
                <p className="text-sm text-gray-400">{selectedClub.address}</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl">
                <Icon name="Star" size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-amber-600">{selectedClub.rating}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Столов", value: selectedClub.tables, icon: "Table2" },
                { label: "Свободно", value: selectedClub.free, icon: "CheckCircle" },
                { label: "Цена/час", value: `${selectedClub.price}₽`, icon: "Clock" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl p-3 text-center" style={{ background: "var(--emerald-light)" }}>
                  <Icon name={item.icon as any} size={18} className="mx-auto mb-1" style={{ color: "var(--emerald)" }} />
                  <div className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{item.value}</div>
                  <div className="text-xs text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
            <button className="w-full py-3.5 rounded-2xl text-white font-semibold text-base shadow-lg transition-all"
              style={{ background: selectedClub.free > 0 ? "var(--emerald)" : "#d1d5db" }}
              disabled={selectedClub.free === 0}>
              {selectedClub.free > 0 ? "Забронировать стол" : "Все столы заняты"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCAN PAGE ────────────────────────────────────────────────────────────────
export function ScanPage() {
  const [scanned, setScanned] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      {!scanned ? (
        <>
          <div className="mb-8 text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Сканировать QR</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Наведите камеру на QR-код стола или клуба</p>
          </div>
          <div className="relative w-64 h-64 mb-8">
            <div className="absolute inset-0 rounded-3xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1a2e28 0%, #0d1a16 100%)" }}>
              <div className="absolute inset-4 rounded-2xl border-2 border-white/20" />
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-3xl">
                <div className="w-full h-0.5 opacity-80"
                  style={{ background: "linear-gradient(90deg, transparent, #00a077, transparent)", animation: "scanLine 2s ease-in-out infinite" }} />
              </div>
              {[["top-5 left-5", "border-t-2 border-l-2"], ["top-5 right-5", "border-t-2 border-r-2"],
                ["bottom-5 left-5", "border-b-2 border-l-2"], ["bottom-5 right-5", "border-b-2 border-r-2"]].map(([pos, border], i) => (
                <div key={i} className={`absolute ${pos} w-7 h-7 ${border}`} style={{ borderColor: "#00a077", borderRadius: 3 }} />
              ))}
              <Icon name="QrCode" size={52} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15 text-white" />
            </div>
          </div>
          <button onClick={() => setScanned(true)}
            className="px-8 py-3 rounded-2xl text-white font-semibold mb-4 shadow-lg"
            style={{ background: "var(--emerald)" }}>
            Демо — сканировать
          </button>
          <p className="text-xs text-gray-400 mb-3">Или введите код вручную</p>
          <div className="flex gap-2">
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className="w-9 h-11 rounded-xl border-2 border-gray-200 flex items-center justify-center" />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ background: "var(--emerald)" }}>
            <Icon name="Check" size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>QR распознан!</h2>
          <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Пирамида Premium · Стол №3</p>
          <p className="text-xs text-gray-400 mb-6">Продолжительность: 2 часа</p>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-5 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">К оплате</span>
              <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>2 400₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Кэшбэк</span>
              <span className="text-sm font-medium text-green-600">+120₽</span>
            </div>
          </div>
          <button onClick={() => setScanned(false)}
            className="w-full py-3.5 rounded-2xl text-white font-semibold"
            style={{ background: "var(--emerald)" }}>
            Оплатить
          </button>
          <button onClick={() => setScanned(false)} className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>Назад</button>
        </div>
      )}
      <style>{`@keyframes scanLine { 0%,100%{transform:translateY(-90px)} 50%{transform:translateY(90px)} }`}</style>
    </div>
  );
}

// ─── HISTORY PAGE ─────────────────────────────────────────────────────────────
export function HistoryPage() {
  return (
    <div className="px-4 pb-4">
      <SectionHeader title="История броней" />
      <div className="space-y-3">
        {HISTORY.map((item, i) => (
          <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{item.club}</span>
              <Chip text={item.status} variant={item.status === "завершено" ? "success" : "warn"} />
            </div>
            <div className="flex items-center gap-1 mb-2">
              <Icon name="Calendar" size={12} className="text-gray-400" />
              <span className="text-xs text-gray-400">{item.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.table}</span>
              <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{item.amount.toLocaleString()}₽</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-100 text-gray-500">Подробнее</button>
              {item.status === "завершено" && (
                <button className="flex-1 py-2 rounded-xl text-sm font-medium text-white" style={{ background: "var(--emerald)" }}>Повторить</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
export function ProfilePage({ onNav }: { onNav: (p: SubPage) => void }) {
  return (
    <div className="px-4 pb-4">
      <div className="rounded-3xl p-5 mb-4 text-white animate-fade-in"
        style={{ background: "linear-gradient(135deg, #006048 0%, #00a077 100%)" }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold bg-white/20">ВП</div>
          <div>
            <h2 className="text-lg font-bold">Владимир Петров</h2>
            <p className="text-sm text-white/70">+7 (999) 123-45-67</p>
          </div>
          <button className="ml-auto w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Icon name="Edit2" size={14} className="text-white" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{ label: "Игр", value: "34" }, { label: "Рейтинг", value: "#4" }, { label: "Баланс", value: "1 800₽" }].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/15 p-2.5 text-center">
              <div className="font-bold text-lg">{s.value}</div>
              <div className="text-xs text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        {[
          { icon: "Trophy", label: "Рейтинг игроков", sub: "rating" as SubPage, badge: "" },
          { icon: "Bell", label: "Уведомления", sub: "notifications" as SubPage, badge: "2" },
          { icon: "CreditCard", label: "Платежи и баланс", sub: "payments" as SubPage, badge: "" },
          { icon: "Tag", label: "Промокоды", sub: "promo" as SubPage, badge: "" },
          { icon: "Video", label: "Записи игр", sub: "records" as SubPage, badge: "" },
        ].map((item, i) => (
          <button key={item.label} onClick={() => onNav(item.sub)}
            className="w-full flex items-center px-4 py-3.5 hover:bg-gray-50 transition-colors"
            style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : "none" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-3" style={{ background: "var(--emerald-light)" }}>
              <Icon name={item.icon as any} size={16} style={{ color: "var(--emerald)" }} />
            </div>
            <span className="flex-1 text-sm font-medium text-left" style={{ color: "var(--text-primary)" }}>{item.label}</span>
            {item.badge && (
              <span className="w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center mr-2"
                style={{ background: "var(--emerald)" }}>{item.badge}</span>
            )}
            <Icon name="ChevronRight" size={16} className="text-gray-300" />
          </button>
        ))}
      </div>
      <button className="w-full py-3 rounded-2xl text-sm font-medium border border-red-100 text-red-400">
        Выйти из аккаунта
      </button>
    </div>
  );
}

// ─── MORE PAGE ────────────────────────────────────────────────────────────────
export function MorePage({ onNav }: { onNav: (p: SubPage) => void }) {
  return (
    <div className="px-4 pb-4">
      <SectionHeader title="Ещё" />
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {[
          { icon: "Trophy", label: "Рейтинг игроков", sub: "rating" as SubPage },
          { icon: "CreditCard", label: "Платежи", sub: "payments" as SubPage },
          { icon: "Tag", label: "Промокоды", sub: "promo" as SubPage },
          { icon: "Video", label: "Записи игр", sub: "records" as SubPage },
          { icon: "HelpCircle", label: "Поддержка", sub: null },
          { icon: "Settings", label: "Настройки", sub: null },
        ].map((item, i) => (
          <button key={item.label} onClick={() => item.sub && onNav(item.sub)}
            className="w-full flex items-center px-4 py-3.5 hover:bg-gray-50 transition-colors"
            style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : "none" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-3" style={{ background: "var(--emerald-light)" }}>
              <Icon name={item.icon as any} size={16} style={{ color: "var(--emerald)" }} />
            </div>
            <span className="flex-1 text-sm font-medium text-left" style={{ color: "var(--text-primary)" }}>{item.label}</span>
            <Icon name="ChevronRight" size={16} className="text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
