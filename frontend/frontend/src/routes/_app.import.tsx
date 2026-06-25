import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { FileSpreadsheet, Upload, CheckCircle2, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { vehicles } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/import")({
  head: () => ({
    meta: [
      { title: "Excel Import — SmartToll" },
      { name: "description", content: "Bulk-import vehicles from XLSX or XLS files." },
    ],
  }),
  component: ImportPage,
});

function ImportPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [drag, setDrag] = useState(false);

  const handle = async (
    f: File | null | undefined
  ) => {
    if (!f) return;

    if (!/\.(xlsx|xls)$/i.test(f.name)) {
      toast.error(
        "Only XLSX or XLS files are supported"
      );
      return;
    }

    try {
      setFile(f);
      setDone(false);
      setProgress(30);

      const formData = new FormData();

      formData.append("file", f);

      const res = await api.post(
        "/excel/import",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setProgress(100);
      setDone(true);

      toast.success(
        `${res.data.records} records imported successfully`
      );

    } catch (error) {
      console.error(error);

      toast.error(
        "Excel import failed"
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Excel Import" description="Bulk-import vehicle records from XLSX or XLS spreadsheets" />

      <Card
        className={`p-10 border-2 border-dashed transition-all shadow-card ${drag ? "border-primary bg-primary/5 scale-[1.01]" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0]); }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow mb-4">
            <Upload className="h-8 w-8 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Drop your spreadsheet here</h3>
          <p className="text-sm text-muted-foreground mt-1">or click to browse — supports XLSX, XLS up to 10MB</p>
          <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => handle(e.target.files?.[0])} />
          <Button className="mt-4 gradient-primary border-0" onClick={() => inputRef.current?.click()}>
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Browse files
          </Button>
        </div>
      </Card>

      {file && (
        <Card className="p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15 text-success">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            {done ? (
              <Badge className="bg-success/15 text-success border-0"><CheckCircle2 className="h-3 w-3 mr-1" /> Imported</Badge>
            ) : (
              <Badge variant="secondary">{Math.round(progress)}%</Badge>
            )}
            <Button size="icon" variant="ghost" onClick={() => { setFile(null); setProgress(0); setDone(false); }}><X className="h-4 w-4" /></Button>
          </div>
          {!done && <Progress value={progress} className="mt-4" />}
        </Card>
      )}

      {done && (
        <Card className="shadow-card">
          <div className="p-6 pb-2">
            <h3 className="font-semibold">Imported Records Preview</h3>
            <p className="text-xs text-muted-foreground">First 8 of 42 records</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tax Status</TableHead>
                  <TableHead>Toll Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.slice(0, 8).map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-semibold">{v.registration}</TableCell>
                    <TableCell>{v.owner}</TableCell>
                    <TableCell>{v.type}</TableCell>
                    <TableCell>
                      <Badge className={v.taxStatus === "Active" ? "bg-success/15 text-success border-0" : "bg-destructive/15 text-destructive border-0"}>
                        {v.taxStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{v.tollCategory}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
