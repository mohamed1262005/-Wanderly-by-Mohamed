import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string, remember: boolean) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const KEY_USER = "wanderly_user";
const KEY_USERS = "wanderly_users";

interface StoredUser extends User { password: string }

const readUsers = (): StoredUser[] => {
  try { return JSON.parse(localStorage.getItem(KEY_USERS) || "[]"); } catch { return []; }
};
const writeUsers = (u: StoredUser[]) => localStorage.setItem(KEY_USERS, JSON.stringify(u));

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(KEY_USER) || sessionStorage.getItem(KEY_USER);
    if (raw) try { setUser(JSON.parse(raw)); } catch {}
  }, []);

  const persist = (u: User | null, remember: boolean) => {
    setUser(u);
    sessionStorage.removeItem(KEY_USER);
    localStorage.removeItem(KEY_USER);
    if (u) (remember ? localStorage : sessionStorage).setItem(KEY_USER, JSON.stringify(u));
  };

  const login = async (email: string, password: string, remember: boolean) => {
    const found = readUsers().find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const safe: User = { id: found.id, name: found.name, email: found.email };
    persist(safe, remember);
    return safe;
  };

  const signup = async (name: string, email: string, password: string) => {
    const users = readUsers();
    if (users.some(u => u.email === email)) throw new Error("Email already exists");
    const newUser: StoredUser = { id: crypto.randomUUID(), name, email, password };
    writeUsers([...users, newUser]);
    const safe: User = { id: newUser.id, name, email };
    persist(safe, true);
    return safe;
  };

  const logout = () => persist(null, false);

  const updateProfile = (patch: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...patch };
    setUser(updated);
    const store = localStorage.getItem(KEY_USER) ? localStorage : sessionStorage;
    store.setItem(KEY_USER, JSON.stringify(updated));
    const users = readUsers().map(u => u.id === user.id ? { ...u, ...patch } : u);
    writeUsers(users);
  };

  return <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
