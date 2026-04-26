import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Feedback = () => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [msg, setMsg] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return toast.error(t("validation.required"));
    toast.success(t("feedback.thanks"));
    setRating(0); setMsg("");
  };

  return (
    <Layout>
      <div className="container py-12 max-w-2xl">
        <h1 className="text-3xl md:text-4xl mb-2">{t("feedback.title")}</h1>
        <p className="text-muted-foreground mb-8">{t("feedback.subtitle")}</p>
        <Card className="p-6 md:p-8 rounded-3xl">
          <form onSubmit={submit} className="space-y-6">
            <div>
              <p className="font-semibold mb-3">{t("feedback.rating")}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
                    className="transition-smooth hover:scale-110">
                    <Star className={`h-9 w-9 ${(hover || rating) >= n ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold mb-2">{t("feedback.message")}</p>
              <Textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={5} className="rounded-xl" />
            </div>
            <Button type="submit" size="lg" className="rounded-2xl shadow-glow">{t("feedback.submit")}</Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Feedback;
