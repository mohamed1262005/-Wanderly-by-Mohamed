import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Props { mode: "login" | "signup" }

const Auth = ({ mode }: Props) => {
  const { t } = useTranslation();
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!isLogin && name.trim().length < 2) er.name = t("validation.required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) er.email = t("validation.email");
    if (password.length < 6) er.password = t("validation.min", { n: 6 });
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    try {
      const u = isLogin ? await login(email, password, remember) : await signup(name, email, password);
      toast.success(isLogin ? t("auth.loggedIn", { name: u.name }) : t("auth.signedUp"));
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="container py-16 max-w-md">
        <Card className="p-8 rounded-3xl shadow-card">
          <h1 className="text-3xl mb-2">{isLogin ? t("auth.loginTitle") : t("auth.signupTitle")}</h1>
          <p className="text-muted-foreground mb-6">{isLogin ? t("auth.loginSub") : t("auth.signupSub")}</p>
          <form onSubmit={submit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <Label>{t("auth.name")}</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className={errors.name ? "border-destructive" : ""} />
                {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
              </div>
            )}
            <div className="space-y-1.5">
              <Label>{t("auth.email")}</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={errors.email ? "border-destructive" : ""} />
              {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t("auth.password")}</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={errors.password ? "border-destructive" : ""} />
              {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
            </div>
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                  {t("auth.remember")}
                </label>
                <button type="button" className="text-sm text-primary hover:underline">{t("auth.forgot")}</button>
              </div>
            )}
            <Button type="submit" size="lg" disabled={loading} className="w-full rounded-2xl shadow-glow">
              {loading ? t("common.loading") : (isLogin ? t("auth.loginCta") : t("auth.signupCta"))}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-6">
            {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
            <Link to={isLogin ? "/signup" : "/login"} className="text-primary font-semibold hover:underline">
              {isLogin ? t("auth.signupCta") : t("auth.loginCta")}
            </Link>
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default Auth;
