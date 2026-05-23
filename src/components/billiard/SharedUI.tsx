/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { CLUBS } from "@/data/mockData";
import { useCity } from "@/hooks/useCity";

declare global {
  interface Window { ymaps: any }
}

export function AvatarBadge({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-16 h-16 text-xl" };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ background: "linear-gradient(135deg,#006048,#00a077)" }}>
      {initials}
    </div>
  );
}

export function Chip({ text, variant = "default" }: { text: string; variant?: "default" | "success" | "warn" | "muted" }) {
  const s = { default: "bg-emerald-50 text-emerald-700", success: "bg-green-100 text-green-700", warn: "bg-orange-100 text-orange-700", muted: "bg-gray-100 text-gray-500" };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s[variant]}`}>{text}</span>;
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2>
      {action && <button onClick={onAction} className="text-sm font-medium" style={{ color: "var(--emerald)" }}>{action}</button>}
    </div>
  );
}

// ─── Yandex Map ───────────────────────────────────────────────────────────────
export function YandexMap({ onSelect }: { onSelect: (c: typeof CLUBS[0]) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const { city, detectCity } = useCity();

  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    const buildMap = () => {
      if (cancelled || !mapRef.current) return;
      const ymaps = window.ymaps;

      if (mapInstance.current) {
        try { mapInstance.current.destroy(); } catch { /* noop */ }
        mapInstance.current = null;
      }

      const map = new ymaps.Map(mapRef.current, {
        center: [city.lat, city.lng],
        zoom: 12,
        controls: [],
      }, {
        suppressMapOpenBlock: true,
        yandexMapDisablePoiInteractivity: true,
      });
      mapInstance.current = map;

      CLUBS.forEach((club) => {
        const layout = `
          <div style="position:relative;transform:translate(-50%,-100%);">
            <div style="display:flex;align-items:center;gap:6px;background:#fff;border-radius:999px;padding:3px 10px 3px 3px;box-shadow:0 4px 12px rgba(0,0,0,0.18);border:2px solid #fff;white-space:nowrap;cursor:pointer;font-family:'Golos Text',sans-serif;">
              <div style="width:22px;height:22px;border-radius:50%;background:${club.free > 0 ? "#006048" : "#9ca3af"};color:#fff;font-weight:700;font-size:10px;display:flex;align-items:center;justify-content:center;">${club.free > 0 ? club.free : "—"}</div>
              <span style="font-size:11px;font-weight:600;color:#0d1a16;">${club.price}₽</span>
            </div>
            <div style="position:absolute;left:50%;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid #fff;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.1));"></div>
          </div>
        `;
        const PinLayout = ymaps.templateLayoutFactory.createClass(layout);

        const placemark = new ymaps.Placemark([club.lat, club.lng], {
          hintContent: club.name,
        }, {
          iconLayout: PinLayout,
          iconShape: { type: "Rectangle", coordinates: [[-40, -40], [40, 0]] },
        });

        placemark.events.add("click", () => onSelect(club));
        map.geoObjects.add(placemark);
      });

      // "You are here" — центр выбранного города
      const meLayout = ymaps.templateLayoutFactory.createClass(`
        <div style="position:relative;width:18px;height:18px;transform:translate(-50%,-50%);">
          <div style="position:absolute;inset:-12px;border-radius:50%;background:radial-gradient(circle,rgba(0,160,119,0.35) 0%,transparent 70%);animation:ymPulse 2.5s ease-in-out infinite;"></div>
          <div style="width:18px;height:18px;border-radius:50%;background:#00a077;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,96,72,0.4);"></div>
        </div>
      `);
      const mePlacemark = new ymaps.Placemark([city.lat, city.lng], {}, {
        iconLayout: meLayout,
        iconShape: { type: "Circle", coordinates: [0, 0], radius: 9 },
      });
      map.geoObjects.add(mePlacemark);
    };

    const tryInit = () => {
      if (window.ymaps && window.ymaps.ready) {
        window.ymaps.ready(buildMap);
      } else {
        setTimeout(tryInit, 150);
      }
    };
    tryInit();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        try { mapInstance.current.destroy(); } catch { /* noop */ }
        mapInstance.current = null;
      }
    };
  }, [onSelect, city]);

  const zoom = (delta: number) => {
    const m = mapInstance.current;
    if (m) m.setZoom(m.getZoom() + delta, { duration: 200 });
  };
  const locate = () => {
    detectCity();
    mapInstance.current?.setCenter([city.lat, city.lng], 13, { duration: 300 });
  };

  return (
    <div className="relative h-full rounded-3xl overflow-hidden shadow-sm border border-gray-100">
      <div ref={mapRef} className="absolute inset-0 z-0" style={{ background: "#eef4f1" }} />

      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur rounded-full px-2.5 py-1 shadow text-[10px] font-medium text-gray-500 flex items-center gap-1 z-[400]">
        <Icon name="Compass" size={11} style={{ color: "var(--emerald)" }} />
        <span>{city.name}</span>
      </div>

      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-[400]">
        <button onClick={() => zoom(1)} className="w-9 h-9 rounded-xl bg-white shadow flex items-center justify-center active:scale-95">
          <Icon name="Plus" size={16} style={{ color: "var(--text-primary)" }} />
        </button>
        <button onClick={() => zoom(-1)} className="w-9 h-9 rounded-xl bg-white shadow flex items-center justify-center active:scale-95">
          <Icon name="Minus" size={16} style={{ color: "var(--text-primary)" }} />
        </button>
        <button onClick={locate} className="w-9 h-9 rounded-xl bg-white shadow flex items-center justify-center mt-1 active:scale-95">
          <Icon name="Locate" size={15} style={{ color: "var(--emerald)" }} />
        </button>
      </div>

      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur rounded-2xl px-3 py-2 shadow-lg flex items-center gap-3 text-xs z-[400]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--emerald)" }} />
          <span className="text-gray-600 font-medium">Свободно</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          <span className="text-gray-600 font-medium">Занято</span>
        </div>
        <span className="ml-auto font-bold" style={{ color: "var(--emerald)" }}>{CLUBS.length} клубов</span>
      </div>
      <style>{`
        @keyframes ymPulse { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.4); opacity: 0.4 } }
        .ymaps-2-1-79-map, ymaps { font-family: 'Golos Text', sans-serif !important; }
        .ymaps-2-1-79-copyrights-pane { display: none !important; }
      `}</style>
    </div>
  );
}