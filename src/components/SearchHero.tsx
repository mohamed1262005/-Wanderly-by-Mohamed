import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plane, Hotel, MapPin, Search } from "lucide-react";

export const SearchHero = ({ compact = false }: { compact?: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"flights" | "hotels" | "trips">("flights");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams({ type: tab });
    fd.forEach((v, k) => v && params.set(k, String(v)));
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className={compact ? "" : "relative"}>
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
        <TabsList className="bg-secondary/80 backdrop-blur p-1 rounded-full h-auto">
          <TabsTrigger value="flights" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-soft px-5 py-2 gap-2">
            <Plane className="h-4 w-4" /> {t("tabs.flights")}
          </TabsTrigger>
          <TabsTrigger value="hotels" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-soft px-5 py-2 gap-2">
            <Hotel className="h-4 w-4" /> {t("tabs.hotels")}
          </TabsTrigger>
          <TabsTrigger value="trips" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-soft px-5 py-2 gap-2">
            <MapPin className="h-4 w-4" /> {t("tabs.trips")}
          </TabsTrigger>
        </TabsList>

        <form onSubmit={submit} className="mt-4 bg-card rounded-3xl shadow-card p-4 md:p-6 grid gap-4 md:grid-cols-5 border border-border/60">
          <TabsContent value="flights" className="contents">
            <Field label={t("common.from")} name="from" placeholder="JFK" />
            <Field label={t("common.to")} name="to" placeholder="DXB" />
            <Field label={t("common.date")} name="date" type="date" />
            <Field label={t("common.class")} name="class" placeholder={t("classOptions.economy")} />
          </TabsContent>
          <TabsContent value="hotels" className="contents">
            <Field label={t("common.location")} name="location" placeholder="Paris" className="md:col-span-2" />
            <Field label={t("common.checkIn")} name="checkin" type="date" />
            <Field label={t("common.checkOut")} name="checkout" type="date" />
          </TabsContent>
          <TabsContent value="trips" className="contents">
            <Field label={t("common.destination")} name="destination" placeholder="Bali" className="md:col-span-2" />
            <Field label={t("common.budget")} name="budget" type="number" placeholder="1500" />
            <Field label={t("common.duration")} name="duration" placeholder="5 nights" />
          </TabsContent>
          <div className="flex items-end">
            <Button type="submit" size="lg" className="w-full h-12 rounded-2xl gap-2 shadow-glow">
              <Search className="h-4 w-4" />
              {t("common.search")}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
};

const Field = ({ label, name, type = "text", placeholder, className = "" }: { label: string; name: string; type?: string; placeholder?: string; className?: string }) => (
  <div className={`space-y-1.5 ${className}`}>
    <Label htmlFor={name} className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</Label>
    <Input id={name} name={name} type={type} placeholder={placeholder} className="h-12 rounded-xl bg-background" />
  </div>
);
