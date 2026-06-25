import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, ShieldAlert, Search, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/tax")({
  head: () => ({
    meta: [
      { title: "Tax Verification — SmartToll" },
      { name: "description", content: "Verify vehicle tax status by registration number." },
    ],
  }),
  component: TaxPage,
});

function TaxPage() {
  const [reg, setReg] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const verify = async () => {
    try {
      const res = await api.get(`/tax/${reg}`);

      setResult(res.data);

      setSearched(true);
    } catch (error) {
      console.error(error);

      setResult(null);

      setSearched(true);

      toast.error("Vehicle Not Found");
    }
  };

  const isExpired = result?.tax_status === "EXPIRED";

  return (
    <div className="space-y-6">
      <PageHeader title="Tax Verification" description="Check vehicle tax compliance in real time" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Verify by registration</h3>
          </div>
          <div className="space-y-3">
            <Label>Registration Number</Label>
            <Input value={reg} onChange={(e) => setReg(e.target.value.toUpperCase())} placeholder="e.g. MH12AB1234" className="font-mono uppercase" />
            <Button onClick={verify} className="w-full gradient-primary border-0">Verify Tax Status</Button>
            
          </div>
        </Card>

        {searched && !result && (
          <Card className="p-6 shadow-card border-dashed">
            <p className="text-center text-muted-foreground py-8">No vehicle found with that registration.</p>
          </Card>
        )}

        {result && (
          <div className="space-y-4">
            {isExpired && (
              <Card className="p-4 border-destructive/40 bg-destructive/10 shadow-card">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-destructive shrink-0" />
                  <div>
                    <p className="font-semibold text-destructive">Warning: Tax has expired</p>
                    <p className="text-xs text-muted-foreground">This vehicle is not compliant. Issue a notice or block the lane.</p>
                  </div>
                </div>
              </Card>
            )}
            <Card className="p-6 shadow-elegant relative overflow-hidden">
              <div className={`absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-20 blur-2xl ${isExpired ? "gradient-danger" : "gradient-success"}`} />
              <div className="flex items-center gap-2 relative">
                {isExpired ? <ShieldAlert className="h-5 w-5 text-destructive" /> : <ShieldCheck className="h-5 w-5 text-success" />}
                <h3 className="font-semibold">Tax verification result</h3>
                <Badge className={`ml-auto border-0 ${isExpired ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"}`}>
                  {result.tax_status}
                </Badge>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm relative">
                <Row label="Registration"><span className="font-semibold">{result.reg_no}</span></Row>
                <Row label="Owner Name">{result.owner_name}</Row>
                <Row label="Vehicle Type">{result.vehicle_type}</Row>
                <Row label="Tax Expiry Date" className={isExpired ? "text-destructive font-semibold" : ""}>{new Date(result.tax_expiry_date).toLocaleDateString()}</Row>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={className}>{children}</span>
    </div>
  );
}
