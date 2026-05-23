import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useCity } from "@/hooks/useCity";

export function CitySelector({ compact = false }: { compact?: boolean }) {
  const { city, setCity, cities, detectCity, geoStatus } = useCity();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const filtered = cities.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-xl transition-colors ${compact ? "px-2 py-1" : "px-3 py-2 hover:bg-gray-50"}`}>
        <Icon name="MapPin" size={compact ? 14 : 16} style={{ color: "var(--emerald)" }} />
        <span className={`font-semibold ${compact ? "text-xs" : "text-sm"}`} style={{ color: "var(--text-primary)" }}>
          {city.name}
        </span>
        <Icon name="ChevronDown" size={compact ? 12 : 14} className="text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 md:hidden" style={{ background: "rgba(0,0,0,0.3)" }}
            onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-2 left-0 md:left-0
            w-[calc(100vw-2rem)] max-w-sm md:w-80
            bg-white rounded-3xl shadow-2xl border border-gray-100
            animate-scale-in origin-top-left overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-3 py-2">
                <Icon name="Search" size={14} className="text-gray-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  placeholder="Поиск города..."
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "var(--text-primary)" }} />
              </div>
            </div>

            <button
              onClick={() => { detectCity(); setOpen(false); }}
              disabled={geoStatus === "loading"}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--emerald-light)" }}>
                <Icon name={geoStatus === "loading" ? "Loader2" : "Locate"} size={16}
                  className={geoStatus === "loading" ? "animate-spin" : ""}
                  style={{ color: "var(--emerald)" }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {geoStatus === "loading" ? "Определяем..." :
                   geoStatus === "denied" ? "Доступ запрещён" :
                   geoStatus === "unavailable" ? "Геолокация недоступна" :
                   "Определить автоматически"}
                </div>
                <div className="text-xs text-gray-400">По геолокации устройства</div>
              </div>
            </button>

            <div className="max-h-72 overflow-y-auto">
              {filtered.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-gray-400">Ничего не найдено</div>
              )}
              {filtered.map((c) => (
                <button key={c.id}
                  onClick={() => { setCity(c); setOpen(false); setQuery(""); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left
                    ${city.id === c.id ? "bg-emerald-50" : ""}`}>
                  <Icon name="MapPin" size={14} style={{ color: city.id === c.id ? "var(--emerald)" : "#9ca3af" }} />
                  <div className="flex-1">
                    <div className={`text-sm ${city.id === c.id ? "font-bold" : "font-medium"}`}
                      style={{ color: "var(--text-primary)" }}>
                      {c.name}
                    </div>
                    <div className="text-xs text-gray-400">{c.clubs} {c.clubs === 1 ? "клуб" : c.clubs < 5 ? "клуба" : "клубов"}</div>
                  </div>
                  {city.id === c.id && (
                    <Icon name="Check" size={16} style={{ color: "var(--emerald)" }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
