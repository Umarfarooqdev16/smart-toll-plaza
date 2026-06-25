import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { Receipt, IndianRupee, Car, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { monthlyRevenue, dailyCrossings } from "@/lib/mockData";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({
    meta: [
      { title: "Reports — SmartToll" },
      { name: "description", content: "Daily and monthly toll performance reports." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const [summary, setSummary] = useState({
    totalVehicles: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    totalBlacklisted: 0,
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get("/reports/summary");

      console.log("Reports Summary:", res.data);

      setSummary(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Daily and monthly performance overview"
        actions={
          <Button className="gradient-primary border-0" onClick={() => toast.success("Generating report...")}>
            <Download className="h-4 w-4 mr-2" /> Download Report
          </Button>
        }
      />

      <div>
        <h2 className="text-lg font-semibold mb-3">Daily Summary</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Vehicles" value={summary.totalVehicles} icon={Car} gradient="primary" />
          <StatCard label="Total Transactions" value={summary.totalTransactions} icon={Receipt} gradient="success" />
          <StatCard label="Total Revenue" value={summary.totalRevenue} prefix="₹" icon={IndianRupee} gradient="info" />
          <StatCard label="Blacklisted Vehicles" value={summary.totalBlacklisted} icon={TrendingUp} gradient="warning" />
        </div>
      </div>

      <Card className="p-6 shadow-card">
        <h3 className="font-semibold mb-1">Daily Crossings Trend</h3>
        <p className="text-xs text-muted-foreground mb-4">Last 7 days</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dailyCrossings}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
            <Bar dataKey="crossings" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/*
      <div>
        <h2 className="text-lg font-semibold mb-3">Monthly Summary</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Yearly Revenue" value={monthRevenue} prefix="₹" icon={IndianRupee} gradient="success" />
          <StatCard label="Yearly Transactions" value={monthTxns} icon={Receipt} gradient="primary" />
          <StatCard label="Best Month" value={820000} prefix="₹" icon={TrendingUp} gradient="warning" />
          <StatCard label="Growth YoY" value={18} suffix="%" icon={TrendingUp} gradient="info" />
        </div>
      </div>

      <Card className="p-6 shadow-card">
        <h3 className="font-semibold mb-1">Monthly Revenue</h3>
        <p className="text-xs text-muted-foreground mb-4">12-month forecasted trend</p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyRevenue}>
            <defs>
              <linearGradient id="m" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
            <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-2)" strokeWidth={2.5} fill="url(#m)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      */}
    </div>
  );
}
