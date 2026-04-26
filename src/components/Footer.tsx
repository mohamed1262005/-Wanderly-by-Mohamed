import { useTranslation } from "react-i18next";
import { Plane } from "lucide-react";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/60 bg-secondary/30 mt-24">
      <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <Plane className="h-4 w-4" /> {t("brand")}
        </div>
        <p>{t("footer.tagline")}</p>
        <p>© {new Date().getFullYear()} {t("brand")}. {t("footer.rights")}</p>
      </div>
    </footer>
  );
};
