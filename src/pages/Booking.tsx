import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { OFFERS } from "@/data/offers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

const Booking = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const offer = OFFERS.find(o => o.id === id);

  const [seat, setSeat] = useState<string | null>(null);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!offer) return <Layout><div className="container py-20 text-center">Not found</div></Layout>;

  const isHotel = offer.type === "hotel";
  const seats = isHotel
    ? ["Deluxe 101", "Deluxe 102", "Suite 201", "Suite 202", "Villa 301", "Villa 302"]
    : Array.from({ length: 24 }, (_, i) => `${Math.floor(i / 6) + 1}${"ABCDEF"[i % 6]}`);
  const taken = new Set(isHotel ? ["Deluxe 102"] : ["1B", "2D", "3A", "4F"]);

  const title = i18n.language === "ar" ? offer.titleAr : offer.titleEn;

  const submit = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t("validation.required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t("validation.email");
    if (phone.length < 6) e.phone = t("validation.min", { n: 6 });
    if (!seat) e.seat = t("validation.required");
    setErrors(e);
    if (Object.keys(e).length) return;
    sessionStorage.setItem("wanderly_pending_booking", JSON.stringify({
      offerId: offer.id, name, email, phone, seat,
    }));
    navigate("/payment");
  };

  return (
    <Layout>
      <div className="container py-10 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2"><ArrowLeft className="h-4 w-4 rtl:rotate-180" />{t("common.back")}</Button>
        <h1 className="text-3xl md:text-4xl mb-8">{t("booking.title")}</h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-8">
            <Card className="p-6 rounded-3xl">
              <h2 className="text-xl mb-5">{t("booking.traveler")}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t("booking.fullName")} value={name} onChange={setName} error={errors.name} />
                <Field label={t("booking.email")} type="email" value={email} onChange={setEmail} error={errors.email} />
                <Field label={t("booking.phone")} value={phone} onChange={setPhone} error={errors.phone} />
              </div>
            </Card>

            <Card className="p-6 rounded-3xl">
              <h2 className="text-xl mb-5">{isHotel ? t("booking.selectRoom") : t("booking.selectSeat")}</h2>
              <div className={isHotel ? "grid sm:grid-cols-2 gap-3" : "grid grid-cols-6 gap-2"}>
                {seats.map(s => {
                  const isTaken = taken.has(s);
                  const isSel = seat === s;
                  return (
                    <button key={s} disabled={isTaken} onClick={() => setSeat(s)}
                      className={cn(
                        "rounded-xl font-medium text-sm transition-smooth border-2",
                        isHotel ? "p-4 text-start" : "aspect-square grid place-items-center",
                        isTaken ? "bg-muted text-muted-foreground/50 border-transparent cursor-not-allowed line-through"
                          : isSel ? "bg-primary text-primary-foreground border-primary shadow-glow scale-105"
                            : "bg-secondary border-transparent hover:border-primary/40 hover:bg-primary/10"
                      )}>
                      {s}
                    </button>
                  );
                })}
              </div>
              {errors.seat && <p className="text-destructive text-sm mt-3">{errors.seat}</p>}
              <div className="flex gap-4 mt-5 text-xs text-muted-foreground">
                <Legend color="bg-secondary" label={t("booking.available")} />
                <Legend color="bg-primary" label={t("booking.selected")} />
                <Legend color="bg-muted" label={t("booking.taken")} />
              </div>
            </Card>
          </div>

          <Card className="p-6 rounded-3xl bg-gradient-card h-fit sticky top-24 shadow-card">
            <h2 className="text-xl mb-4">{t("booking.summary")}</h2>
            <img src={offer.image} alt="" className="rounded-2xl aspect-video object-cover w-full mb-4" />
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{offer.city}, {offer.country} • {offer.duration}</p>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <Row label={t("common.price")} value={`$${offer.price}`} />
              <Row label="Taxes" value="$45" />
              <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
                <span>Total</span><span className="text-gradient">${offer.price + 45}</span>
              </div>
            </div>
            <Button onClick={submit} size="lg" className="w-full mt-6 rounded-2xl shadow-glow">{t("booking.proceedPayment")}</Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

const Field = ({ label, value, onChange, error, type = "text" }: { label: string; value: string; onChange: (v: string) => void; error?: string; type?: string }) => (
  <div className="space-y-1.5">
    <Label>{label}</Label>
    <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={error ? "border-destructive" : ""} />
    {error && <p className="text-destructive text-xs">{error}</p>}
  </div>
);

const Legend = ({ color, label }: { color: string; label: string }) => (
  <span className="flex items-center gap-1.5"><span className={`h-3 w-3 rounded ${color}`} />{label}</span>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-muted-foreground"><span>{label}</span><span className="text-foreground font-medium">{value}</span></div>
);

export default Booking;
