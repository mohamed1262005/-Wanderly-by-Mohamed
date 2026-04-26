import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/contexts/BookingsContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const { bookings } = useBookings();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [editing, setEditing] = useState(false);

  const save = () => {
    updateProfile({ name, email });
    setEditing(false);
    toast.success(t("profile.saved"));
  };

  return (
    <Layout>
      <div className="container py-12 max-w-5xl space-y-8">
        <h1 className="text-3xl md:text-4xl">{t("profile.title")}</h1>
        <Card className="p-6 md:p-8 rounded-3xl">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-xl">{t("profile.info")}</h2>
            {!editing && <Button variant="outline" onClick={() => setEditing(true)}>{t("profile.edit")}</Button>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t("auth.name")}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!editing} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("auth.email")}</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editing} />
            </div>
          </div>
          {editing && (
            <div className="flex gap-2 mt-5">
              <Button onClick={save}>{t("common.save")}</Button>
              <Button variant="ghost" onClick={() => { setEditing(false); setName(user?.name || ""); setEmail(user?.email || ""); }}>{t("common.cancel")}</Button>
            </div>
          )}
        </Card>

        <div>
          <h2 className="text-xl mb-4">{t("profile.myBookings")}</h2>
          {bookings.length === 0 ? (
            <Card className="p-10 rounded-3xl text-center">
              <p className="text-muted-foreground mb-4">{t("profile.noBookings")}</p>
              <Button onClick={() => navigate("/search")}>{t("profile.browse")}</Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {bookings.map(b => (
                <Card key={b.id} className="p-4 rounded-2xl flex items-center gap-4">
                  <img src={b.image} alt="" className="h-20 w-28 object-cover rounded-xl" />
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
      </div>
    </Layout>
  );
};

export default Profile;
