import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBookings } from "@/contexts/BookingsContext";
import { CheckCircle2, Download, Calendar, MapPin, User } from "lucide-react";
import jsPDF from "jspdf";

const Confirmation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookings } = useBookings();
  const lastId = sessionStorage.getItem("wanderly_last_booking");
  const booking = bookings.find(b => b.id === lastId) || bookings[0];

  if (!booking) {
    return <Layout><div className="container py-20 text-center"><Button onClick={() => navigate("/")}>{t("common.back")}</Button></div></Layout>;
  }

  const downloadTicket = () => {
    const doc = new jsPDF();
    doc.setFontSize(22); doc.text("Wanderly E-Ticket", 20, 25);
    doc.setFontSize(11); doc.setTextColor(100);
    doc.text(`Booking ID: ${booking.id}`, 20, 35);
    doc.setDrawColor(220); doc.line(20, 40, 190, 40);
    doc.setTextColor(20); doc.setFontSize(14);
    doc.text(booking.title, 20, 52);
    doc.setFontSize(11); doc.setTextColor(100);
    doc.text(booking.subtitle, 20, 60);
    doc.setTextColor(20); doc.setFontSize(11);
    const rows = [
      ["Traveler", booking.travelerName],
      ["Type", booking.type.toUpperCase()],
      ["Seat / Room", booking.seatOrRoom],
      ["Date", booking.date],
      ["Total paid", `$${booking.price}`],
    ];
    rows.forEach(([k, v], i) => { doc.text(`${k}:`, 20, 75 + i * 9); doc.text(String(v), 70, 75 + i * 9); });
    doc.setFontSize(9); doc.setTextColor(150);
    doc.text("Thank you for booking with Wanderly.", 20, 140);
    doc.save(`wanderly-${booking.id}.pdf`);
  };

  return (
    <Layout>
      <div className="container py-12 max-w-3xl">
        <div className="text-center mb-10 animate-fade-in">
          <div className="mx-auto h-20 w-20 rounded-full bg-success grid place-items-center mb-5 shadow-glow animate-check">
            <CheckCircle2 className="h-12 w-12 text-success-foreground" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl md:text-4xl mb-2">{t("confirm.title")}</h1>
          <p className="text-muted-foreground">{t("confirm.thanks")}</p>
        </div>

        <Card className="rounded-3xl overflow-hidden shadow-card animate-scale-in">
          <div className="relative h-48">
            <img src={booking.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 start-4 end-4 text-primary-foreground">
              <h2 className="text-2xl font-bold">{booking.title}</h2>
              <p className="opacity-90 text-sm">{booking.subtitle}</p>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-5">
            <div className="bg-secondary/60 rounded-2xl p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("confirm.id")}</p>
              <p className="text-2xl font-bold text-gradient mt-1">{booking.id}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <Info icon={User} label="Traveler" value={booking.travelerName} />
              <Info icon={Calendar} label="Date" value={booking.date} />
              <Info icon={MapPin} label="Seat / Room" value={booking.seatOrRoom} />
              <Info icon={CheckCircle2} label="Paid" value={`$${booking.price}`} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={downloadTicket} size="lg" className="flex-1 rounded-2xl gap-2 shadow-glow">
                <Download className="h-4 w-4" />{t("confirm.download")}
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/bookings")} className="flex-1 rounded-2xl">
                {t("confirm.viewBookings")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

const Info = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border/60">
    <Icon className="h-4 w-4 mt-0.5 text-primary" />
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export default Confirmation;
