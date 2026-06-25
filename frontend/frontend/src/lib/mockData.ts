export type Vehicle = {
  id: string;
  registration: string;
  owner: string;
  type: "Car" | "Truck" | "Bus" | "Motorcycle" | "Van";
  taxStatus: "Active" | "Expired";
  taxExpiry: string;
  tollCategory: "Light" | "Medium" | "Heavy" | "Two-Wheeler";
  blacklisted?: boolean;
  blacklistReason?: string;
};

export type Transaction = {
  id: string;
  registration: string;
  vehicleType: string;
  amount: number;
  status: "Success" | "Pending" | "Failed";
  date: string;
  time: string;
  plaza: string;
};

const owners = ["Aarav Sharma", "Priya Patel", "Rahul Verma", "Sneha Iyer", "Vikram Singh", "Anika Reddy", "Karan Mehta", "Divya Nair", "Rohan Khan", "Meera Joshi"];
const types: Vehicle["type"][] = ["Car", "Truck", "Bus", "Motorcycle", "Van"];
const cats: Record<Vehicle["type"], Vehicle["tollCategory"]> = {
  Car: "Light", Van: "Light", Truck: "Heavy", Bus: "Heavy", Motorcycle: "Two-Wheeler",
};
const tollRates: Record<Vehicle["tollCategory"], number> = {
  "Two-Wheeler": 25, Light: 80, Medium: 160, Heavy: 280,
};

const rand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};
const r = rand(42);

export const vehicles: Vehicle[] = Array.from({ length: 42 }, (_, i) => {
  const t = types[Math.floor(r() * types.length)];
  const expired = r() > 0.78;
  const black = r() > 0.92;
  const year = 2024 + Math.floor(r() * 3);
  const month = String(1 + Math.floor(r() * 12)).padStart(2, "0");
  const day = String(1 + Math.floor(r() * 28)).padStart(2, "0");
  return {
    id: `V-${1000 + i}`,
    registration: `MH${String(1 + Math.floor(r() * 50)).padStart(2, "0")}${String.fromCharCode(65 + Math.floor(r() * 26))}${String.fromCharCode(65 + Math.floor(r() * 26))}${String(1000 + Math.floor(r() * 9000))}`,
    owner: owners[Math.floor(r() * owners.length)],
    type: t,
    taxStatus: expired ? "Expired" : "Active",
    taxExpiry: `${year}-${month}-${day}`,
    tollCategory: cats[t],
    blacklisted: black,
    blacklistReason: black ? ["Unpaid tolls", "Stolen vehicle report", "Suspicious activity", "Court order"][Math.floor(r() * 4)] : undefined,
  };
});

export const transactions: Transaction[] = Array.from({ length: 60 }, (_, i) => {
  const v = vehicles[Math.floor(r() * vehicles.length)];
  const statusRoll = r();
  const status: Transaction["status"] = statusRoll > 0.9 ? "Failed" : statusRoll > 0.82 ? "Pending" : "Success";
  const h = Math.floor(r() * 24);
  const m = Math.floor(r() * 60);
  return {
    id: `TXN-${100000 + i}`,
    registration: v.registration,
    vehicleType: v.type,
    amount: tollRates[v.tollCategory],
    status,
    date: `2026-06-${String(1 + Math.floor(r() * 22)).padStart(2, "0")}`,
    time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    plaza: ["NH-48 Plaza A", "NH-66 Plaza B", "NH-44 Plaza C", "NH-19 Plaza D"][Math.floor(r() * 4)],
  };
}).sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));

export const monthlyRevenue = [
  { month: "Jan", revenue: 482000, transactions: 6021 },
  { month: "Feb", revenue: 521000, transactions: 6510 },
  { month: "Mar", revenue: 498000, transactions: 6230 },
  { month: "Apr", revenue: 612000, transactions: 7650 },
  { month: "May", revenue: 689000, transactions: 8612 },
  { month: "Jun", revenue: 742000, transactions: 9277 },
  { month: "Jul", revenue: 801000, transactions: 10012 },
  { month: "Aug", revenue: 765000, transactions: 9562 },
  { month: "Sep", revenue: 712000, transactions: 8900 },
  { month: "Oct", revenue: 698000, transactions: 8725 },
  { month: "Nov", revenue: 752000, transactions: 9400 },
  { month: "Dec", revenue: 820000, transactions: 10250 },
];

export const vehicleDistribution = [
  { name: "Car", value: 4820, color: "var(--color-chart-1)" },
  { name: "Truck", value: 2120, color: "var(--color-chart-2)" },
  { name: "Bus", value: 980, color: "var(--color-chart-3)" },
  { name: "Motorcycle", value: 1640, color: "var(--color-chart-4)" },
  { name: "Van", value: 1240, color: "var(--color-chart-5)" },
];

export const dailyCrossings = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
  day: d,
  crossings: [2410, 2680, 2520, 2890, 3210, 3680, 2980][i],
}));

export const peakHours = Array.from({ length: 24 }, (_, h) => ({
  hour: `${String(h).padStart(2, "0")}:00`,
  traffic: Math.round(200 + 800 * Math.exp(-((h - 9) ** 2) / 18) + 700 * Math.exp(-((h - 18) ** 2) / 12)),
}));

export const tollRatesMap = tollRates;
