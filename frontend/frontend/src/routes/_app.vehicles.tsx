import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  Plus,
  Search,
  Download,
  Upload,
  Pencil,
  Trash2,
  Eye,
  RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
type Vehicle = {
  id: number;
  reg_no: string;
  owner_name: string;
  vehicle_type: string;
  tax_status: string;
  toll_category: string;
  tax_expiry_date: string | null;
};
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/vehicles")({
  head: () => ({
    meta: [
      { title: "Vehicle Management — SmartToll" },
      { name: "description", content: "Add, edit and manage every vehicle registered across your plazas." },
    ],
  }),
  component: VehiclesPage,
});

const empty = {
  reg_no: "",
  owner_name: "",
  vehicle_type: "Car" as Vehicle["vehicle_type"],
  tax_status: "Active" as Vehicle["tax_status"],
  tax_expiry_date: "",
  toll_category: "Light" as Vehicle["toll_category"],
};

function VehiclesPage() {
  const [list, setList] = useState<Vehicle[]>([]);
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const perPage = 10;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/vehicles");

      console.log("Vehicles:", res.data);

      setList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteVehicle = async (reg_no: string) => {
    try {
      await api.delete(`/vehicles/${reg_no}`);

      toast.success("Vehicle Deleted Successfully");

      fetchVehicles(); // Refresh table
    } catch (error) {
      console.error(error);

      toast.error("Failed to Delete Vehicle");
    }
  };

  const updateVehicle = async () => {
    try {
      if (!editingVehicle) return;

      await api.put(`/vehicles/${editingVehicle.reg_no}`, {
        owner_name: editingVehicle.owner_name,
        vehicle_type: editingVehicle.vehicle_type,
        tax_status: editingVehicle.tax_status,
        toll_category: editingVehicle.toll_category,
      });

      toast.success("Vehicle Updated Successfully");

      fetchVehicles();

      setEditOpen(false);
    } catch (error) {
      console.error(error);

      toast.error("Failed To Update Vehicle");
    }
  };

  const filtered = useMemo(() => list.filter((v) =>
    (filterType === "all" || v.vehicle_type === filterType) &&
    (v.reg_no.toLowerCase().includes(q.toLowerCase()) || v.owner_name.toLowerCase().includes(q.toLowerCase()))
  ), [list, q, filterType]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice((page - 1) * perPage, page * perPage);

  const reset = () => setForm(empty);
  const add = async () => {
    try {
      if (!form.reg_no || !form.owner_name || !form.tax_expiry_date) {
        toast.error("Please fill all required fields");
        return;
      }

      await api.post("/vehicles", {
        reg_no: form.reg_no,
        owner_name: form.owner_name,
        vehicle_type: form.vehicle_type,
        tax_status: form.tax_status,
        toll_category: form.toll_category,
        tax_expiry_date: form.tax_expiry_date,
      });

      toast.success("Vehicle Added Successfully");

      fetchVehicles();

      reset();

      setOpen(false);
    } catch (error) {
      console.error(error);

      toast.error("Failed to Add Vehicle");
    }
  };

  const exportCsv = () => {
    const headers = ["Registration", "Owner", "Type", "Tax Status", "Tax Expiry", "Toll Category"];
    const rows = filtered.map((v) => [v.reg_no, v.owner_name, v.vehicle_type, v.tax_status, v.tax_expiry_date, v.toll_category].join(","));
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "vehicles.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const uploadExcel = async () => {
    if (!excelFile) {
      toast.error("Please select an Excel file");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", excelFile as any);

      await api.post("/excel/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Excel Imported Successfully");

      fetchVehicles();

      setExcelFile(null);
    } catch (error) {
      console.error(error);

      toast.error("Failed to Import Excel");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Management"
        description={`${list.length} vehicles registered across your network`}
        actions={
          <>
            <input id="excel-upload" type="file" accept=".xlsx,.xls" hidden onChange={(e) => setExcelFile(e.target.files?.[0] || null)} />
            <Button variant="outline" onClick={() => document.getElementById("excel-upload")?.click()}>Choose Excel</Button>
            <Button variant="outline" onClick={uploadExcel}><Upload className="h-4 w-4 mr-2" /> Upload Excel</Button>
            <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary border-0 shadow-elegant"><Plus className="h-4 w-4 mr-2" /> Add Vehicle</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Add new vehicle</DialogTitle></DialogHeader>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Registration Number *</Label>
                    <Input value={form.reg_no} onChange={(e) => setForm({ ...form, reg_no: e.target.value.toUpperCase() })} placeholder="MH12AB1234" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Owner Name *</Label>
                    <Input value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <Select value={form.vehicle_type} onValueChange={(v: Vehicle["vehicle_type"]) => setForm({ ...form, vehicle_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Car", "Truck", "Bus", "Motorcycle", "Van"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Toll Category</Label>
                    <Select value={form.toll_category} onValueChange={(v: Vehicle["toll_category"]) => setForm({ ...form, toll_category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Two-Wheeler", "Light", "Medium", "Heavy"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Status</Label>
                    <Select value={form.tax_status} onValueChange={(v: Vehicle["tax_status"]) => setForm({ ...form, tax_status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Expiry *</Label>
                    <Input type="date" value={form.tax_expiry_date} onChange={(e) => setForm({ ...form, tax_expiry_date: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4 mr-2" /> Reset</Button>
                  <Button onClick={add} className="gradient-primary border-0">Save vehicle</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <Card className="p-4 shadow-card">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="pl-9" placeholder="Search by registration or owner" />
          </div>
          <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {["Car", "Truck", "Bus", "Motorcycle", "Van"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Toll Category</TableHead>
                <TableHead>Tax Status</TableHead>
                <TableHead>Tax Expiry</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slice.map((v) => (
                <TableRow key={v.id} className="hover:bg-muted/40">
                  <TableCell className="font-semibold">{v.reg_no}</TableCell>
                  <TableCell>{v.owner_name}</TableCell>
                  <TableCell>{v.vehicle_type}</TableCell>
                  <TableCell><Badge variant="outline">{v.toll_category}</Badge></TableCell>
                  <TableCell>
                    <Badge className={v.tax_status === "Active" ? "bg-success/15 text-success border-0" : "bg-destructive/15 text-destructive border-0"}>
                      {v.tax_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums">{v.tax_expiry_date ? new Date(v.tax_expiry_date).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => toast.info(`Viewing ${v.reg_no}`)}><Eye className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => {
                        setEditingVehicle(v);
                        setEditOpen(true);
                      }}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteVehicle(v.reg_no)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!slice.length && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-12">No vehicles match your filters</TableCell></TableRow>
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
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>

          {editingVehicle && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-2">
                <Label>Registration Number</Label>
                <Input value={editingVehicle.reg_no} disabled />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Owner Name</Label>
                <Input value={editingVehicle.owner_name ?? ""} onChange={(e) => setEditingVehicle((prev) => prev ? { ...prev, owner_name: e.target.value } : prev)} />
              </div>
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Select value={editingVehicle.vehicle_type} onValueChange={(v) => setEditingVehicle((prev) => prev ? { ...prev, vehicle_type: v } : prev)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Car", "Truck", "Bus", "Motorcycle", "Van"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Toll Category</Label>
                <Select value={editingVehicle.toll_category} onValueChange={(v) => setEditingVehicle((prev) => prev ? { ...prev, toll_category: v } : prev)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Two-Wheeler", "Light", "Medium", "Heavy"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={updateVehicle} className="gradient-primary border-0">Update Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
