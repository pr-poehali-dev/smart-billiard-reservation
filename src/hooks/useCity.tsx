/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CITIES, City, nearestCity } from "@/data/mockData";

type GeoStatus = "idle" | "loading" | "granted" | "denied" | "unavailable";

type CityContextValue = {
  city: City;
  setCity: (c: City) => void;
  geoStatus: GeoStatus;
  detectCity: () => void;
  cities: City[];
};

const CityContext = createContext<CityContextValue | null>(null);

const STORAGE_KEY = "sb_city_id";
const ASKED_KEY = "sb_geo_asked";

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCityState] = useState<City>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return CITIES.find((c) => c.id === saved) ?? CITIES[0];
  });
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");

  const setCity = (c: City) => {
    setCityState(c);
    try { localStorage.setItem(STORAGE_KEY, c.id); } catch { /* noop */ }
  };

  const detectCity = () => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("unavailable");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const near = nearestCity(pos.coords.latitude, pos.coords.longitude);
        setCity(near);
        setGeoStatus("granted");
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 5 * 60 * 1000 }
    );
  };

  // Автоопределение при первом запуске (если ещё не спрашивали и город не сохранён)
  useEffect(() => {
    const asked = localStorage.getItem(ASKED_KEY);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!asked && !saved) {
      try { localStorage.setItem(ASKED_KEY, "1"); } catch { /* noop */ }
      detectCity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CityContext.Provider value={{ city, setCity, geoStatus, detectCity, cities: CITIES }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used inside CityProvider");
  return ctx;
}
