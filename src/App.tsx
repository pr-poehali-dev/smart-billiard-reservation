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

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto font-golos relative overflow-hidden"
      style={{ background: "var(--surface-2)" }}>

      {/* Header */}
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

      {/* Content */}
      <main className="flex-1 overflow-y-auto pt-3">
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
      </main>

      {/* Bottom Navigation */}
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
  );
}
