import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calculator, CheckCircle2, Printer, Receipt, XCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/calculator")({
  head: () => ({
    meta: [
      { title: "Toll Calculator — SmartToll" },
      { name: "description", content: "Instant toll calculation by registration number." },
    ],
  }),
  component: CalculatorPage,
});

function CalculatorPage() {
  const [reg, setReg] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  const calc = async () => {
    try {
      const res = await api.get(`/toll/${reg}`);

      setResult(res.data);

      setNotFound(false);

      toast.success("Toll calculated successfully");
    } catch (error) {
      console.error(error);

      setResult(null);

      setNotFound(true);

      toast.error("Vehicle not found");
    }
  };
  const txnId = `TXN-${Date.now().toString().slice(-7)}`;

  return (
    <div className="space-y-6">
      <PageHeader title="Toll Calculator" description="Instant lookup and pricing for any registered vehicle" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Lookup vehicle</h3>
          </div>
          <div className="space-y-3">
            <Label>Registration Number</Label>
            <Input value={reg} onChange={(e) => setReg(e.target.value.toUpperCase())} placeholder="e.g. MH12AB1234" className="font-mono uppercase" />
            <div className="flex gap-2">
              <Button onClick={calc} className="gradient-primary border-0 shadow-elegant flex-1">Calculate Toll</Button>
              <Button variant="outline" onClick={() => { setReg(""); setResult(null); setNotFound(false); }}>Clear</Button>
            </div>
            <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
              Enter a registered vehicle number to calculate toll.
            </div>
          </div>
        </Card>

        {notFound && (
          <Card className="p-6 shadow-card border-destructive/30 bg-destructive/5">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">No vehicle found</h3>
                <p className="text-sm text-muted-foreground">Verify the registration number and try again.</p>
              </div>
            </div>
          </Card>
        )}

        {result && (
          <Card className="p-6 shadow-elegant relative overflow-hidden">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full gradient-success opacity-20 blur-2xl" />
            <div className="flex items-center gap-2 mb-4 relative">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h3 className="font-semibold">Payment Summary</h3>
              <Badge className="ml-auto bg-success/15 text-success border-0">Approved</Badge>
            </div>
            <div className="space-y-3 text-sm relative">
              <Row label="Transaction ID"><span className="font-mono">{txnId}</span></Row>
              <Row label="Registration"><span className="font-semibold">{result.reg_no}</span></Row>
              <Row label="Owner">{result.owner_name}</Row>
              <Row label="Vehicle Type">{result.vehicle_type}</Row>
              <Row label="Toll Category"><Badge variant="outline">{result.toll_category ?? result.tollCategory}</Badge></Row>
              <Row label="Tax Status">
                <Badge>
                  {result.tax_status}
                </Badge>
              </Row>
              <Separator />
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Toll Amount</span>
                <span className="text-3xl font-bold tabular-nums">₹{result.amount}</span>
              </div>
              <Button className="w-full mt-2 gradient-primary border-0" onClick={() => toast.success("Receipt sent to printer")}>
                <Printer className="h-4 w-4 mr-2" /> Print Receipt
              </Button>
            </div>
          </Card>
        )}

        {!result && !notFound && (
          <Card className="p-10 shadow-card border-dashed flex flex-col items-center justify-center text-center">
            <Receipt className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="font-semibold">No calculation yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Enter a registration number to view toll details and a printable receipt.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{children}</span>
    </div>
  );
}
