import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { SearchHero } from "@/components/SearchHero";
import { OfferCard } from "@/components/OfferCard";
import { OFFERS } from "@/data/offers";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Search = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const initialType = (params.get("type") as "flights" | "hotels" | "trips") || null;
  const typeFilter = initialType === "flights" ? "flight" : initialType === "hotels" ? "hotel" : initialType === "trips" ? "trip" : null;

  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<"cheap" | "best" | "rating">("best");

  useEffect(() => { setMaxPrice(2000); setMinRating(0); }, [typeFilter]);

  const filtered = useMemo(() => {
    let r = OFFERS.filter(o => (!typeFilter || o.type === typeFilter) && o.price <= maxPrice && o.rating >= minRating);
    if (sort === "cheap") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    else r = [...r].sort((a, b) => (b.special ? 1 : 0) - (a.special ? 1 : 0));
    return r;
  }, [typeFilter, maxPrice, minRating, sort]);

  const cheapestId = useMemo(() => filtered.reduce<string | null>((acc, o) => !acc || o.price < (filtered.find(x => x.id === acc)!.price) ? o.id : acc, null), [filtered]);

  return (
    <Layout>
      <section className="bg-gradient-to-b from-secondary/40 to-transparent">
        <div className="container py-8">
          <SearchHero compact />
        </div>
      </section>
      <section className="container py-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6 bg-card border border-border/60 rounded-3xl p-6 h-fit shadow-soft">
          <div>
            <h3 className="font-bold text-lg mb-4">{t("common.filters")}</h3>
            <div className="space-y-6">
              <div>
                <Label className="flex justify-between mb-3"><span>{t("common.price")}</span><span className="font-semibold">${maxPrice}</span></Label>
                <Slider value={[maxPrice]} onValueChange={(v) => setMaxPrice(v[0])} min={100} max={2000} step={50} />
              </div>
              <div>
                <Label className="flex justify-between mb-3"><span>{t("common.rating")}</span><span className="font-semibold">{minRating}+</span></Label>
                <Slider value={[minRating]} onValueChange={(v) => setMinRating(v[0])} min={0} max={5} step={0.5} />
              </div>
              <Button variant="outline" className="w-full" onClick={() => { setMaxPrice(2000); setMinRating(0); }}>
                {t("common.clearFilters")}
              </Button>
            </div>
          </div>
        </aside>
        <div>
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <p className="text-muted-foreground">{t("search.results", { count: filtered.length })}</p>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">{t("common.sortBy")}</Label>
              <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="best">{t("common.best")}</SelectItem>
                  <SelectItem value="cheap">{t("common.cheapest")}</SelectItem>
                  <SelectItem value="rating">{t("common.rating")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground bg-card rounded-3xl border border-border/60">{t("common.noResults")}</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {filtered.map(o => <OfferCard key={o.id} offer={o} cheapest={o.id === cheapestId} />)}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Search;
