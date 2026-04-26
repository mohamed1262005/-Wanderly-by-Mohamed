import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Globe, Moon, Sun, User as UserIcon, Plane, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const items = [
    { to: "/", label: t("nav.home") },
    { to: "/search", label: t("nav.search") },
    { to: "/bookings", label: t("nav.bookings") },
    { to: "/feedback", label: t("nav.feedback") },
  ];

  const setLang = (lng: "en" | "ar") => i18n.changeLanguage(lng);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-warm text-primary-foreground shadow-glow">
            <Plane className="h-5 w-5" />
          </span>
          <span className="text-gradient">{t("brand")}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {items.map(it => (
            <NavLink key={it.to} to={it.to} end={it.to === "/"}
              className={({ isActive }) => cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-smooth",
                isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}>
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("nav.language")}>
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLang("en")} className={i18n.language === "en" ? "font-semibold" : ""}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("ar")} className={i18n.language === "ar" ? "font-semibold" : ""}>العربية</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggle} aria-label={t("nav.theme")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t("nav.profile")}>
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/profile")}>{t("nav.profile")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/bookings")}>{t("nav.bookings")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate("/"); }}>{t("nav.logout")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2 ms-1">
              <Button variant="ghost" onClick={() => navigate("/login")}>{t("nav.login")}</Button>
              <Button onClick={() => navigate("/signup")}>{t("nav.signup")}</Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(o => !o)} aria-label="menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container py-3 flex flex-col gap-1">
            {items.map(it => (
              <NavLink key={it.to} to={it.to} end={it.to === "/"} onClick={() => setOpen(false)}
                className={({ isActive }) => cn("px-3 py-2 rounded-lg text-sm", isActive ? "bg-secondary" : "hover:bg-secondary/60")}>
                {it.label}
              </NavLink>
            ))}
            {!user && (
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => { setOpen(false); navigate("/login"); }}>{t("nav.login")}</Button>
                <Button className="flex-1" onClick={() => { setOpen(false); navigate("/signup"); }}>{t("nav.signup")}</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
