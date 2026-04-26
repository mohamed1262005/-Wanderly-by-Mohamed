import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { SearchHero } from "@/components/SearchHero";
import { OfferCard } from "@/components/OfferCard";
import { OFFERS } from "@/data/offers";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Globe2, HeadphonesIcon, ArrowRight } from "lucide-react";
import hero from "@/assets/hero-travel.jpg";

const Index = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          <img src={hero} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        <div className="container py-20 md:py-32">
          <div className="max-w-2xl text-primary-foreground animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">{t("home.heroTitle")}</h1>
            <p className="mt-4 text-lg md:text-xl text-primary-foreground/90 drop-shadow">{t("home.heroSubtitle")}</p>
          </div>
          <div className="mt-10 max-w-5xl">
            <SearchHero />
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl">{t("home.featured")}</h2>
            <p className="text-muted-foreground mt-2">{t("home.featuredSubtitle")}</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex gap-1">
            <Link to="/search">{t("common.viewAll")} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERS.map(o => <OfferCard key={o.id} offer={o} />)}
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl text-center mb-12">{t("home.whyTitle")}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, k: "why1" },
            { icon: Globe2, k: "why2" },
            { icon: HeadphonesIcon, k: "why3" },
          ].map(({ icon: Icon, k }) => (
            <div key={k} className="bg-card border border-border/60 rounded-3xl p-8 shadow-soft text-center">
              <div className="mx-auto h-14 w-14 grid place-items-center rounded-2xl bg-gradient-warm text-primary-foreground shadow-glow mb-4">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl mb-2">{t(`home.${k}`)}</h3>
              <p className="text-muted-foreground">{t(`home.${k}d`)}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
