import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import { createFileRoute } from "@tanstack/react-router";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { Car, Receipt, IndianRupee, TrendingUp, Ban, ShieldAlert, Sparkles } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  transactions, vehicles,
} from "@/lib/mockData";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SmartToll" },
      { name: "description", content: "Real-time KPIs, revenue analytics and recent toll transactions." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalTransactions: 0,
    totalCollection: 0,
    totalBlacklisted: 0,
  });
  const [monthlyRevenueAmount, setMonthlyRevenueAmount] = useState(0);

  const [monthlyRevenueChart, setMonthlyRevenueChart] = useState([]);

  const [vehicleDistributionData, setVehicleDistributionData] = useState([]);

  const [dailyCrossingsData, setDailyCrossingsData] = useState([]);

  const [peakHoursData, setPeakHoursData] = useState([]);

  const [recentTransactions, setRecentTransactions] = useState([]);

  const recent = recentTransactions;
  const blacklisted = vehicles.filter((v) => v.blacklisted).length;
  const expired = vehicles.filter((v) => v.taxStatus === "Expired").length;

  useEffect(() => {
    fetchDashboard();
    fetchMonthlyRevenue();
    fetchVehicleDistribution();
    fetchRecentTransactions();
    fetchDailyCrossings();
    fetchPeakHours();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      console.log("Dashboard Data:", res.data);

      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMonthlyRevenue = async () => {
    try {
      const res = await api.get("/monthly-report");

      if (res.data.length > 0) {
        setMonthlyRevenueAmount(
          Number(res.data[0].total_collection)
        );
      }

      const chartData = res.data.map((item: any) => ({
        month: `${item.month}/${item.year}`,
        revenue: Number(item.total_collection),
      }));

      setMonthlyRevenueChart(chartData);

    } catch (err) {
      console.error(err);
    }
  };

  const fetchVehicleDistribution = async () => {
    try {
      const res = await api.get(
        "/dashboard/vehicle-distribution"
      );

      const colors = [
        "#818cf8",
        "#14b8a6",
        "#f59e0b",
        "#d946ef",
        "#22c55e",
      ];

      const formatted = res.data.map(
        (item: any, index: number) => ({
          name: item.vehicle_type,
          value: Number(item.total),
          color:
            colors[index % colors.length],
        })
      );

      setVehicleDistributionData(
        formatted
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const res = await api.get("/transactions");

      setRecentTransactions(
        res.data.slice(0, 8)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDailyCrossings = async () => {
    try {
      const res = await api.get(
        "/dashboard/daily-crossings"
      );

      const formatted = res.data.map(
        (item: any) => ({
          day: new Date(item.day)
            .toLocaleDateString("en-US", {
              weekday: "short",
            }),
          crossings: Number(item.crossings),
        })
      );

      setDailyCrossingsData(formatted);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchPeakHours = async () => {
    try {
      const res = await api.get(
        "/dashboard/peak-hours"
      );

      const formatted = res.data.map(
        (item: any) => ({
          hour: `${item.hour}:00`,
          traffic: Number(item.traffic),
        })
      );

      setPeakHoursData(formatted);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Dashboard"
        description="Live overview of every plaza on your network."
        actions={
          <Button className="gradient-primary border-0 shadow-elegant">
            <Sparkles className="h-4 w-4 mr-2" /> AI Insights
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Vehicles" value={stats.totalVehicles} trend={12.4} icon={Car} gradient="primary" />
        <StatCard label="Transactions" value={stats.totalTransactions} trend={8.1} icon={Receipt} gradient="info" />
        <StatCard label="Today's Collection" value={stats.totalCollection} prefix="₹" trend={5.3} icon={IndianRupee} gradient="success" />
        <StatCard label="Monthly Revenue" value={monthlyRevenueAmount} prefix="₹" trend={9.2} icon={TrendingUp} gradient="warning" />
        <StatCard label="Blacklisted" value={Number(stats.totalBlacklisted) || 0} trend={-2.1} icon={Ban} gradient="danger" />
        <StatCard label="Expired Tax" value={expired} trend={3.4} icon={ShieldAlert} gradient="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Revenue Analytics</h3>
              <p className="text-xs text-muted-foreground">Monthly revenue trend</p>
            </div>
            <Badge variant="secondary" className="bg-success/15 text-success">+18.2% YoY</Badge>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyRevenueChart} margin={{ left: -10, right: 10, top: 10 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-1">Vehicle Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">By category</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={vehicleDistributionData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {vehicleDistributionData.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-1">Daily Crossings</h3>
          <p className="text-xs text-muted-foreground mb-4">Last 7 days</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dailyCrossingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Bar dataKey="crossings" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-1">Peak Hour Traffic</h3>
          <p className="text-xs text-muted-foreground mb-4">Today's hourly volume</p>
          <ResponsiveContainer width="100%" height={240}>
              <LineChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="hour" stroke="var(--color-muted-foreground)" fontSize={10} interval={2} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="traffic" stroke="var(--color-chart-4)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="shadow-card">
        <div className="flex items-center justify-between p-6 pb-2">
          <div>
            <h3 className="font-semibold">Recent Transactions</h3>
            <p className="text-xs text-muted-foreground">Latest toll lane activity</p>
          </div>
          <Button variant="outline" size="sm">View all</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Txn ID</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Plaza</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((t) => (
                <TableRow key={t.id} className="hover:bg-muted/40">
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="font-semibold">{t.reg_no}</TableCell>
                  <TableCell>{t.vehicle_type}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">Smart Toll Plaza</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">₹{t.amount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={
                      t.payment_status === "Paid" ? "bg-success/15 text-success border-0"
                      : t.payment_status === "Pending" ? "bg-warning/20 text-warning-foreground border-0"
                      : "bg-destructive/15 text-destructive border-0"
                    }>{t.payment_status}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground tabular-nums">{new Date(t.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
