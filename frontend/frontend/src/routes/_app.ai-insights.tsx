import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import {
  Car,
  Receipt,
  IndianRupee,
  Ban,
  Brain,
} from "lucide-react";

export const Route = createFileRoute(
  "/_app/ai-insights"
)(
  {
    component: AIInsightsPage,
  }
);

function AIInsightsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAIInsights();
  }, []);

  const fetchAIInsights = async () => {
    try {
      const res = await api.get("/ai");

      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Insights"
        description="Smart analysis generated from toll plaza data"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <Car className="mb-3" />
          <h3>Total Vehicles</h3>
          <p className="text-3xl font-bold">
            {data.totalVehicles}
          </p>
        </Card>

        <Card className="p-5">
          <Receipt className="mb-3" />
          <h3>Transactions</h3>
          <p className="text-3xl font-bold">
            {data.totalTransactions}
          </p>
        </Card>

        <Card className="p-5">
          <IndianRupee className="mb-3" />
          <h3>Total Revenue</h3>
          <p className="text-3xl font-bold">
            ₹{data.totalRevenue}
          </p>
        </Card>

        <Card className="p-5">
          <Ban className="mb-3" />
          <h3>Blacklisted</h3>
          <p className="text-3xl font-bold">
            {data.blacklisted}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="p-6">
          <div className="text-xl mb-3">💰 Revenue Analysis</div>
          <div className="text-sm text-muted-foreground">Total Revenue:</div>
          <p className="text-2xl font-semibold">₹{data.totalRevenue}</p>
          <div className="text-sm text-muted-foreground mt-4">Average Revenue Per Transaction:</div>
          <p className="text-2xl font-semibold">₹{data.avgRevenue}</p>
          <p className="text-sm text-muted-foreground mt-4">Revenue collection is healthy.</p>
        </Card>

        <Card className="p-6">
          <div className="text-xl mb-3">🚗 Traffic Analysis</div>
          <div className="text-sm text-muted-foreground">Most common vehicle:</div>
          <p className="text-2xl font-semibold">{data.mostCommonVehicle}</p>
          <div className="text-sm text-muted-foreground mt-4">Total registered vehicles:</div>
          <p className="text-2xl font-semibold">{data.totalVehicles}</p>
          <p className="text-sm text-muted-foreground mt-4">
            Traffic is dominated by {data.mostCommonVehicle}s.
          </p>
        </Card>

        <Card className="p-6">
          <div className="text-xl mb-3">🚨 Security Analysis</div>
          <div className="text-sm text-muted-foreground">Blacklisted Vehicles:</div>
          <p className="text-2xl font-semibold">{data.blacklisted}</p>
          <p className="text-sm text-muted-foreground mt-4">
            {data.blacklisted === 0
              ? "No suspicious vehicles detected."
              : "Attention required."}
          </p>
        </Card>

        <Card className="p-6">
          <div className="text-xl mb-3">🛡 Tax Compliance</div>
          <div className="text-sm text-muted-foreground">Expired Tax Vehicles:</div>
          <p className="text-2xl font-semibold">{data.expiredTax}</p>
          <p className="text-sm text-muted-foreground mt-4">
            {data.expiredTax === 0
              ? "All vehicles are compliant."
              : "Tax violations detected."}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain />
          <h2 className="font-semibold">AI Recommendation</h2>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Traffic is dominated by {data.mostCommonVehicle}s.
          </p>
          <p>
            Consider adding a dedicated fast lane for {data.mostCommonVehicle}s.
          </p>
          <p>Current toll operations are stable.</p>
          <p>
            Security risk level: {data.blacklisted > 0 ? "Medium" : "Low"}
          </p>
        </div>
      </Card>
    </div>
  );
}
