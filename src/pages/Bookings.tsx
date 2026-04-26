import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBookings } from "@/contexts/BookingsContext";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

const Bookings = () => {
  const { t } = useTranslation();
  const { bookings } = useBookings();
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="container py-12 max-w-5xl">
        <h1 className="text-3xl md:text-4xl mb-8">{t("bookings.title")}</h1>
        {bookings.length === 0 ? (
          <Card className="p-12 rounded-3xl text-center">
            <p className="text-muted-foreground mb-4">{t("bookings.empty")}</p>
            <Button onClick={() => navigate("/search")}>{t("profile.browse")}</Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map(b => (
              <Card key={b.id} className="p-4 rounded-2xl flex items-center gap-4 hover:shadow-card transition-smooth">
                <img src={b.image} alt="" className="h-24 w-32 object-cover rounded-xl" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{b.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{b.subtitle}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Calendar className="h-3 w-3" />{b.date} • {b.id}</p>
                </div>
                <div className="text-end">
                  <p className="font-bold text-gradient text-lg">${b.price}</p>
                  <p className="text-xs text-muted-foreground">{b.seatOrRoom}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Bookings;
