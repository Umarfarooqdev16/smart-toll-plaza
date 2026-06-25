import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Ban, Search, AlertOctagon, ShieldCheck, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/blacklist")({
  head: () => ({
    meta: [
      { title: "Blacklist Detection — SmartToll" },
      { name: "description", content: "Detect and review blacklisted vehicles attempting entry." },
    ],
  }),
  component: BlacklistPage,
});

type BlacklistedVehicle = {
  id: number;
  reg_no: string;
  reason: string;
  created_at: string;
};

function BlacklistPage() {
  const [reg, setReg] = useState("");
  const [list, setList] = useState<BlacklistedVehicle[]>([]);
  const [result, setResult] = useState<BlacklistedVehicle | null>(null);
  const [searched, setSearched] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    reg_no: "",
    reason: "",
  });

  useEffect(() => {
    fetchBlacklist();
  }, []);

  const fetchBlacklist = async () => {
    try {
      const res = await api.get("/blacklist");

      console.log(res.data);

      setList(res.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load blacklist");
    }
  };

  const check = () => {
    const v = list.find((x) => x.reg_no.toUpperCase() === reg.toUpperCase());
    setResult(v ?? null);
    setSearched(true);
  };

  const removeBlacklist = async (reg_no: string) => {
    try {
      await api.delete(`/blacklist/${reg_no}`);

      toast.success("Vehicle Removed From Blacklist");

      fetchBlacklist();
    } catch (error) {
      console.error(error);

      toast.error("Failed To Remove Vehicle");
    }
  };

  const addToBlacklist = async () => {
    try {
      await api.post("/blacklist", form);

      toast.success("Vehicle Blacklisted Successfully");

      setOpen(false);

      setForm({
        reg_no: "",
        reason: "",
      });

      fetchBlacklist();
    } catch (error) {
      console.error(error);

      toast.error("Failed To Blacklist Vehicle");
    }
  };

  const blacklisted = list;
  const isBlack = Boolean(result);

  return (
    <div className="space-y-6">
      <PageHeader title="Blacklist Detection" description="Identify and respond to flagged vehicles instantly" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Vehicle To Blacklist</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Registration Number</Label>
              <Input
                value={form.reg_no}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reg_no: e.target.value.toUpperCase(),
                  })
                }
                placeholder="KA01AB1234"
              />
            </div>

            <div className="grid gap-2">
              <Label>Reason</Label>
              <Input
                value={form.reason}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reason: e.target.value,
                  })
                }
                placeholder="Stolen Vehicle"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addToBlacklist}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isBlack && (
        <Card className="border-destructive/50 bg-destructive/10 p-6 shadow-elegant relative overflow-hidden">
          <div className="absolute inset-0 gradient-danger opacity-10" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-danger shadow-glow animate-flash">
              <AlertOctagon className="h-9 w-9 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <Badge className="bg-destructive text-destructive-foreground border-0 mb-1">CRITICAL ALERT</Badge>
              <h2 className="text-2xl font-bold text-destructive">Blacklisted vehicle detected</h2>
              <p className="text-sm text-muted-foreground">
                <span className="font-mono font-semibold">{result?.reg_no}</span> — Reason: {result?.reason}. Deny passage and contact security.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Check vehicle</h3>
          </div>
          <div className="space-y-3">
            <Label>Registration Number</Label>
            <Input value={reg} onChange={(e) => setReg(e.target.value.toUpperCase())} placeholder="e.g. MH12AB1234" className="font-mono uppercase" />
            <Button onClick={check} className="w-full gradient-primary border-0">Check Blacklist Status</Button>
            <Button onClick={() => setOpen(true)} className="w-full border border-border bg-muted/70 text-slate-900">
              + Add To Blacklist
            </Button>
            <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
              Try: <code className="font-mono">{blacklisted[0]?.reg_no ?? "MH12AB1234"}</code>
            </div>
          </div>
        </Card>

        {searched && !result && (
          <Card className="p-6 border-dashed"><p className="text-center text-muted-foreground py-8">No vehicle found.</p></Card>
        )}

      </div>

      <Card className="shadow-card">
        <div className="flex items-center justify-between p-6 pb-2">
          <div>
            <h3 className="font-semibold flex items-center gap-2"><Ban className="h-4 w-4 text-destructive" /> Active Blacklist</h3>
            <p className="text-xs text-muted-foreground">{blacklisted.length} vehicles currently flagged</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blacklisted.map((v) => (
                <TableRow key={v.id} className="hover:bg-destructive/5">
                  <TableCell className="font-semibold font-mono">{v.reg_no}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{v.reason}</TableCell>
                  <TableCell>{new Date(v.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => removeBlacklist(v.reg_no)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
