import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — SmartToll" },
      { name: "description", content: "Sign in to the SmartToll plaza management dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [errors, setErrors] = useState<{ u?: string; p?: string }>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const er: typeof errors = {};

    if (!username) er.u = "Username is required";

    if (!password || password.length < 6) er.p = "Password must be at least 6 characters";

    setErrors(er);

    if (Object.keys(er).length) return;

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { username, password });

      setLoading(false);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success("Welcome back");

      navigate({ to: "/dashboard" });
    } catch (error) {
      console.error(error);

      setLoading(false);

      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mesh-bg p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:flex flex-col gap-6 p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">SmartToll</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Plaza Management System</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Operate every lane with <span className="bg-clip-text text-transparent gradient-primary">precision intelligence.</span>
          </h1>
          <p className="text-muted-foreground">
            Real-time traffic insights, tax verification, blacklist alerts and revenue analytics — built for national highway operators.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Plazas", v: "1,240+" },
              { label: "Daily txns", v: "8.4M" },
              { label: "Uptime", v: "99.99%" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-4">
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <Card className="glass p-8 shadow-elegant border-border/50">
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary shadow-glow">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold">SmartToll</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your operator account</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="u">Username</Label>
              <Input id="u" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
              {errors.u && <p className="text-xs text-destructive">{errors.u}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="p">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Input id="p" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.p && <p className="text-xs text-destructive">{errors.p}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="r" defaultChecked />
              <Label htmlFor="r" className="text-sm font-normal cursor-pointer">Remember me for 30 days</Label>
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-primary shadow-elegant border-0 h-11 font-semibold">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in...</> : "Sign in"}
            </Button>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              Protected by enterprise-grade encryption
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
