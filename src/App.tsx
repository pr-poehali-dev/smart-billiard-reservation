/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Tab, SubPage, TABS } from "@/data/mockData";
import { BookingPage, ScanPage, HistoryPage, ProfilePage, MorePage } from "@/components/billiard/MainPages";
import { RatingPage, NotificationsPage, PaymentsPage, PromoPage, RecordsPage } from "@/components/billiard/SubPages";

export default function App() {
  const [tab, setTab] = useState<Tab>("booking");
  const [subPage, setSubPage] = useState<SubPage>(null);

  const subTitles: Record<NonNullable<SubPage>, string> = {
    rating: "Рейтинг игроков",
    notifications: "Уведомления",
    payments: "Платежи и баланс",
    promo: "Промокоды",
    records: "Записи игр",
  };

  const content = (
    <div className="animate-fade-in" key={subPage ?? tab}>
      {subPage === "rating" && <RatingPage />}
      {subPage === "notifications" && <NotificationsPage />}
      {subPage === "payments" && <PaymentsPage />}
      {subPage === "promo" && <PromoPage />}
      {subPage === "records" && <RecordsPage />}
      {!subPage && tab === "booking" && <BookingPage />}
      {!subPage && tab === "scan" && <ScanPage />}
      {!subPage && tab === "history" && <HistoryPage />}
      {!subPage && tab === "profile" && <ProfilePage onNav={setSubPage} />}
      {!subPage && tab === "more" && <MorePage onNav={setSubPage} />}
    </div>
  );

  return (
    <div className="min-h-screen font-golos" style={{ background: "var(--surface-2)" }}>
      {/* ─── MOBILE (< md) ─────────────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col h-screen max-w-md mx-auto relative overflow-hidden">
        <header className="flex items-center px-4 py-3 bg-white border-b border-gray-100 z-10 flex-shrink-0">
          {subPage ? (
            <>
              <button onClick={() => setSubPage(null)} className="w-8 h-8 flex items-center justify-center mr-2 -ml-1">
                <Icon name="ArrowLeft" size={20} style={{ color: "var(--text-primary)" }} />
              </button>
              <h1 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{subTitles[subPage]}</h1>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--emerald)" }}>
                  <Icon name="Table2" size={16} className="text-white" />
                </div>
                <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>SMART BILLIARD</span>
              </div>
              <button className="relative w-8 h-8 flex items-center justify-center"
                onClick={() => setSubPage("notifications")}>
                <Icon name="Bell" size={20} style={{ color: "var(--text-primary)" }} />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full" style={{ background: "var(--emerald)" }} />
              </button>
            </>
          )}
        </header>

        <main className="flex-1 overflow-y-auto pt-3">{content}</main>

        <nav className="bg-white border-t border-gray-100 z-10 flex-shrink-0">
          <div className="flex">
            {TABS.map((t) => {
              const active = !subPage && tab === t.id;
              return (
                <button key={t.id} onClick={() => { setTab(t.id as Tab); setSubPage(null); }}
                  className="flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-all relative">
                  {t.id === "scan" ? (
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg -mt-4 mb-0.5"
                      style={{ background: active ? "var(--emerald)" : "linear-gradient(135deg,#006048,#00a077)" }}>
                      <Icon name={t.icon as any} size={22} className="text-white" />
                    </div>
                  ) : (
                    <Icon name={t.icon as any} size={22} style={{ color: active ? "var(--emerald)" : "#9ca3af" }} />
                  )}
                  <span className="text-[10px] font-medium" style={{ color: active ? "var(--emerald)" : "#9ca3af" }}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* ─── TABLET & DESKTOP (>= md) ─────────────────────────────────────── */}
      <div className="hidden md:flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="flex-shrink-0 bg-white border-r border-gray-100 flex flex-col
          w-20 lg:w-64 transition-all">
          <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--emerald)" }}>
              <Icon name="Table2" size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg hidden lg:block" style={{ color: "var(--text-primary)" }}>
              SMART BILLIARD
            </span>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {TABS.map((t) => {
              const active = !subPage && tab === t.id;
              return (
                <button key={t.id} onClick={() => { setTab(t.id as Tab); setSubPage(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all
                    ${active ? "text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}
                    justify-center lg:justify-start`}
                  style={active ? { background: "var(--emerald)" } : {}}>
                  <Icon name={t.icon as any} size={20} />
                  <span className="text-sm font-medium hidden lg:inline">{t.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="px-3 py-3 border-t border-gray-100 space-y-1">
            <button onClick={() => setSubPage("notifications")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all relative
                ${subPage === "notifications" ? "text-white" : "text-gray-500 hover:bg-gray-50"}
                justify-center lg:justify-start`}
              style={subPage === "notifications" ? { background: "var(--emerald)" } : {}}>
              <div className="relative">
                <Icon name="Bell" size={20} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: "var(--emerald)" }} />
              </div>
              <span className="text-sm font-medium hidden lg:inline">Уведомления</span>
            </button>
            <div className="hidden lg:flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#006048,#00a077)" }}>ВП</div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>Владимир П.</div>
                <div className="text-xs text-gray-400">1 800 ₽</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0">
            {subPage ? (
              <>
                <button onClick={() => setSubPage(null)}
                  className="w-9 h-9 flex items-center justify-center mr-3 -ml-1 rounded-xl hover:bg-gray-50">
                  <Icon name="ArrowLeft" size={20} style={{ color: "var(--text-primary)" }} />
                </button>
                <h1 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>{subTitles[subPage]}</h1>
              </>
            ) : (
              <h1 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                {TABS.find(t => t.id === tab)?.label}
              </h1>
            )}
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-2xl px-3 py-2 w-72">
                <Icon name="Search" size={16} className="text-gray-400" />
                <span className="text-sm text-gray-400">Поиск клубов, столов...</span>
              </div>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-50">
                <Icon name="HelpCircle" size={18} className="text-gray-400" />
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl xl:max-w-6xl mx-auto py-6 px-2">
              {/* На десктопе BookingPage и ScanPage растягиваются; остальные ограничены центрированной шириной */}
              <div className={tab === "booking" || tab === "scan" ? "h-[calc(100vh-9rem)]" : ""}>
                {content}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
