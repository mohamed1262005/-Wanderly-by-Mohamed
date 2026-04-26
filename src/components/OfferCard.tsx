import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Sparkles, MapPin } from "lucide-react";
import { Offer } from "@/data/offers";
import { useBookings } from "@/contexts/BookingsContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props { offer: Offer; cheapest?: boolean }

export const OfferCard = ({ offer, cheapest }: Props) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useBookings();
  const fav = isFavorite(offer.id);
  const title = i18n.language === "ar" ? offer.titleAr : offer.titleEn;
  const subtitle = i18n.language === "ar" ? offer.subtitleAr : offer.subtitleEn;

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleFavorite(offer.id);
    toast(added ? t("common.addedToFavorites") : t("common.removedFromFavorites"));
  };

  return (
    <Card className="group overflow-hidden rounded-3xl border-border/60 bg-gradient-card shadow-soft hover:shadow-card transition-smooth animate-fade-in">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={offer.image} alt={title} loading="lazy" className="h-full w-full object-cover transition-smooth group-hover:scale-105" />
        <div className="absolute top-3 start-3 flex gap-2">
          {cheapest && <Badge className="bg-success text-success-foreground gap-1"><Sparkles className="h-3 w-3" />{t("search.highlightCheap")}</Badge>}
          {offer.special && <Badge className="bg-accent text-accent-foreground gap-1"><Sparkles className="h-3 w-3" />{t("common.specialOffer")}</Badge>}
        </div>
        <button onClick={handleFav} aria-label="favorite"
          className="absolute top-3 end-3 grid place-items-center h-9 w-9 rounded-full bg-background/80 backdrop-blur transition-smooth hover:scale-110">
          <Heart className={cn("h-4 w-4", fav ? "fill-primary text-primary" : "text-foreground")} />
        </button>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg leading-tight">{title}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />{offer.city}, {offer.country}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Star className="h-4 w-4 fill-accent text-accent" />{offer.rating}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <div className="flex items-end justify-between pt-2">
          <div>
            <div className="text-2xl font-extrabold text-gradient">{t("common.currency")}{offer.price}</div>
            <div className="text-xs text-muted-foreground">{offer.type === "hotel" ? t("common.night") : t("common.perPerson")}</div>
          </div>
          <Button onClick={() => navigate(`/booking/${offer.id}`)} className="rounded-xl">{t("common.book")}</Button>
        </div>
      </div>
    </Card>
  );
};
