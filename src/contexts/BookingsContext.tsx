import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Booking {
  id: string;
  type: "flight" | "hotel" | "trip";
  title: string;
  subtitle: string;
  image: string;
  price: number;
  date: string;
  travelerName: string;
  seatOrRoom: string;
  createdAt: string;
}

const KEY = "wanderly_bookings";

interface Ctx {
  bookings: Booking[];
  add: (b: Omit<Booking, "id" | "createdAt">) => Booking;
  favorites: string[];
  toggleFavorite: (id: string) => boolean;
  isFavorite: (id: string) => boolean;
}

const BookingsContext = createContext<Ctx | undefined>(undefined);

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("wanderly_favs") || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem("wanderly_favs", JSON.stringify(favorites)); }, [favorites]);

  const add: Ctx["add"] = (b) => {
    const full: Booking = { ...b, id: "WND-" + Math.random().toString(36).slice(2, 8).toUpperCase(), createdAt: new Date().toISOString() };
    setBookings(prev => [full, ...prev]);
    return full;
  };

  const toggleFavorite = (id: string) => {
    let added = false;
    setFavorites(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      added = true;
      return [...prev, id];
    });
    return added;
  };

  return (
    <BookingsContext.Provider value={{ bookings, add, favorites, toggleFavorite, isFavorite: (id) => favorites.includes(id) }}>
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
};
