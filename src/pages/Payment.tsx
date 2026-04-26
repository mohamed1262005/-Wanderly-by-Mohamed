import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { OFFERS } from "@/data/offers";
import { useBookings } from "@/contexts/BookingsContext";
import { Loader2, ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react";

const playSuccessSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "sine"; o.frequency.value = freq;
      const t = ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.start(t); o.stop(t + 0.3);
    });
  } catch {}
};

const Payment = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { add } = useBookings();
  const [pending, setPending] = useState<any>(null);
  const [phase, setPhase] = useState<"form" | "processing" | "success">("form");
  const [form, setForm] = useState({ name: "", number: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const raw = sessionStorage.getItem("wanderly_pending_booking");
    if (!raw) { navigate("/"); return; }
    setPending(JSON.parse(raw));
  }, [navigate]);

  if (!pending) return null;
  const offer = OFFERS.find(o => o.id === pending.offerId)!;
  const total = offer.price + 45;
  const title = i18n.language === "ar" ? offer.titleAr : offer.titleEn;
  const subtitle = i18n.language === "ar" ? offer.subtitleAr : offer.subtitleEn;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (form.name.trim().length < 2) er.name = t("validation.required");
    if (form.number.replace(/\s/g, "").length !== 16) er.number = t("validation.card");
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) er.expiry = t("validation.expiry");
    if (!/^\d{3}$/.test(form.cvc)) er.cvc = t("validation.cvc");
    setErrors(er);
    if (Object.keys(er).length) return;

    setPhase("processing");
    setTimeout(() => {
      const booking = add({
        type: offer.type, title, subtitle, image: offer.image,
        price: total, date: new Date().toISOString().slice(0, 10),
        travelerName: pending.name, seatOrRoom: pending.seat,
      });
      playSuccessSound();
      setPhase("success");
      sessionStorage.removeItem("wanderly_pending_booking");
      sessionStorage.setItem("wanderly_last_booking", booking.id);
      setTimeout(() => navigate("/confirmation"), 1600);
    }, 1800);
  };

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  if (phase === "success") {
    return (
      <Layout>
        <div className="container min-h-[70vh] flex items-center justify-center">
          <div className="text-center animate-scale-in">
            <div className="mx-auto h-24 w-24 rounded-full bg-success grid place-items-center mb-6 animate-check shadow-glow">
              <CheckCircle2 className="h-14 w-14 text-success-foreground" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl md:text-4xl mb-2">{t("payment.success")}</h1>
            <p className="text-muted-foreground">{t("payment.successSub")}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (phase === "processing") {
    return (
      <Layout>
        <div className="container min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-14 w-14 mx-auto animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">{t("payment.processing")}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2"><ArrowLeft className="h-4 w-4 rtl:rotate-180" />{t("common.back")}</Button>
        <h1 className="text-3xl md:text-4xl mb-8">{t("payment.title")}</h1>
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <Card className="p-6 md:p-8 rounded-3xl">
            <div className="flex items-center gap-2 text-sm text-success mb-6">
              <ShieldCheck className="h-4 w-4" />{t("payment.secure")}
            </div>
            <form onSubmit={submit} className="space-y-4">
              <Field label={t("payment.cardName")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} />
              <Field label={t("payment.cardNumber")} value={form.number} onChange={(v) => setForm({ ...form, number: formatCard(v) })} error={errors.number} placeholder="4242 4242 4242 4242" />
              <div className="grid grid-cols-2 gap-4">
                <Field label={t("payment.expiry")} value={form.expiry} onChange={(v) => {
                  const d = v.replace(/\D/g, "").slice(0, 4);
                  setForm({ ...form, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d });
                }} error={errors.expiry} placeholder="12/26" />
                <Field label={t("payment.cvc")} value={form.cvc} onChange={(v) => setForm({ ...form, cvc: v.replace(/\D/g, "").slice(0, 3) })} error={errors.cvc} placeholder="123" />
              </div>
              <Button type="submit" size="lg" className="w-full mt-4 rounded-2xl shadow-glow">{t("payment.pay", { amount: `$${total}` })}</Button>
            </form>
          </Card>
          <Card className="p-6 rounded-3xl bg-gradient-card h-fit shadow-card">
            <img src={offer.image} alt="" className="rounded-2xl aspect-video object-cover w-full mb-4" />
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{offer.city}, {offer.country}</p>
            <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
              <span>Total</span><span className="text-gradient">${total}</span>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

const Field = ({ label, value, onChange, error, placeholder }: { label: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string }) => (
  <div className="space-y-1.5">
    <Label>{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`h-12 rounded-xl ${error ? "border-destructive" : ""}`} />
    {error && <p className="text-destructive text-xs">{error}</p>}
  </div>
);

export default Payment;
