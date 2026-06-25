import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Download, FileText, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { Receipt, IndianRupee, CheckCircle2, XCircle } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";

type Transaction = {
  id: number;
  reg_no: string;
  vehicle_type: string;
  amount: number;
  payment_status: string;
  created_at: string;
};
import { toast } from "sonner";

export const Route = createFileRoute("/_app/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — SmartToll" },
      { name: "description", content: "Complete transaction history with filters and export." },
    ],
  }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    reg_no: "",
    vehicle_type: "Car",
    amount: "",
    payment_status: "Paid",
  });
  const perPage = 12;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions");

      console.log(res.data);

      setTransactions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createTransaction = async () => {
    try {
      await api.post("/transactions", {
        reg_no: form.reg_no,
        vehicle_type: form.vehicle_type,
        amount: Number(form.amount),
        payment_status: form.payment_status,
      });

      toast.success("Transaction Created");

      setOpen(false);

      setForm({
        reg_no: "",
        vehicle_type: "Car",
        amount: "",
        payment_status: "Paid",
      });

      fetchTransactions();
    } catch (error) {
      console.error(error);

      toast.error("Failed to create transaction");
    }
  };

  const filtered = useMemo(() => transactions.filter((t) =>
    (status === "all" || t.payment_status === status) &&
    (t.reg_no.toLowerCase().includes(q.toLowerCase()) || t.id.toString().includes(q))
  ), [q, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice((page - 1) * perPage, page * perPage);

  const total = transactions.reduce((s, t) => s + (t.payment_status === "Paid" ? Number(t.amount) : 0), 0);
  const success = transactions.filter((t) => t.payment_status === "Paid").length;
  const failed = transactions.filter((t) => t.payment_status === "Failed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Complete transaction ledger across all plazas"
        actions={
          <>
            <Button className="gradient-primary border-0" onClick={() => setOpen(true)}>+ New Transaction</Button>
            <Button variant="outline" onClick={() => toast.success("Exporting PDF...")}><FileText className="h-4 w-4 mr-2" /> Export PDF</Button>
            <Button className="gradient-primary border-0" onClick={() => toast.success("Exporting Excel...")}><Download className="h-4 w-4 mr-2" /> Export Excel</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Transactions" value={transactions.length} icon={Receipt} gradient="primary" />
        <StatCard label="Revenue Collected" value={total} prefix="₹" icon={IndianRupee} gradient="success" />
        <StatCard label="Successful" value={success} icon={CheckCircle2} gradient="info" />
        <StatCard label="Failed" value={failed} icon={XCircle} gradient="danger" />
      </div>

      <Card className="p-4 shadow-card">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="pl-9" placeholder="Search by registration or txn ID" />
          </div>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Transaction</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-1">
            <div className="space-y-2">
              <Label>Registration Number</Label>
              <Input value={form.reg_no} onChange={(e) => setForm({ ...form, reg_no: e.target.value.toUpperCase() })} placeholder="MH12AB1234" />
            </div>

            <div className="space-y-2">
              <Label>Vehicle Type</Label>
              <Select value={form.vehicle_type} onValueChange={(value) => setForm({ ...form, vehicle_type: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amount</Label>
              <Input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" />
            </div>

            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select value={form.payment_status} onValueChange={(value) => setForm({ ...form, payment_status: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={createTransaction}>Save Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Txn ID</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slice.map((t) => (
                <TableRow key={t.id} className="hover:bg-muted/40">
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="font-semibold">{t.reg_no}</TableCell>
                  <TableCell>{t.vehicle_type}</TableCell>
                  <TableCell className="tabular-nums text-sm">{new Date(t.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="tabular-nums text-sm">{new Date(t.created_at).toLocaleTimeString()}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">₹{t.amount}</TableCell>
                  <TableCell>
                    <Badge className={
                      t.payment_status === "Paid" ? "bg-success/15 text-success border-0"
                      : t.payment_status === "Pending" ? "bg-warning/20 text-warning-foreground border-0"
                      : "bg-destructive/15 text-destructive border-0"
                    }>{t.payment_status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!slice.length && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-12">No transactions match your filters</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm">
          <p className="text-muted-foreground">Page {page} of {pages} · {filtered.length} results</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
