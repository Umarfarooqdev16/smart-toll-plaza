import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/lib/theme";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SmartToll" },
      { name: "description", content: "Profile, security and system preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account, theme and notification preferences" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 shadow-card lg:col-span-2">
          <h3 className="font-semibold mb-4">Profile</h3>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16"><AvatarFallback className="gradient-primary text-primary-foreground text-lg">AD</AvatarFallback></Avatar>
            <div>
              <p className="font-semibold">Admin User</p>
              <p className="text-sm text-muted-foreground">admin@smarttoll.gov.in</p>
              <Badge variant="outline" className="mt-1">NHAI Operator</Badge>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Full name</Label><Input defaultValue="Admin User" /></div>
            <div className="space-y-2"><Label>Email</Label><Input defaultValue="admin@smarttoll.gov.in" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
            <div className="space-y-2"><Label>Plaza Assigned</Label><Input defaultValue="NH-48 Plaza A" /></div>
          </div>
          <Button className="mt-4 gradient-primary border-0" onClick={() => toast.success("Profile updated")}>Save changes</Button>
        </Card>

        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-4">Change password</h3>
          <div className="space-y-3">
            <div className="space-y-2"><Label>Current</Label><Input type="password" /></div>
            <div className="space-y-2"><Label>New password</Label><Input type="password" /></div>
            <div className="space-y-2"><Label>Confirm new</Label><Input type="password" /></div>
            <Button variant="outline" className="w-full" onClick={() => toast.success("Password updated")}>Update password</Button>
          </div>
        </Card>

        <Card className="p-6 shadow-card lg:col-span-2">
          <h3 className="font-semibold mb-4">Preferences</h3>
          <div className="space-y-4">
            <PrefRow label="Dark mode" description="Switch between light and dark themes">
              <Switch checked={theme === "dark"} onCheckedChange={toggle} />
            </PrefRow>
            <Separator />
            <PrefRow label="Email notifications" description="Daily revenue summary at 11:00 PM">
              <Switch defaultChecked />
            </PrefRow>
            <Separator />
            <PrefRow label="Blacklist alerts" description="Instant SMS when blacklisted vehicle is detected">
              <Switch defaultChecked />
            </PrefRow>
            <Separator />
            <PrefRow label="Auto-export reports" description="Auto-email monthly reports on the 1st">
              <Switch />
            </PrefRow>
          </div>
        </Card>

        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-4">System Information</h3>
          <div className="space-y-2 text-sm">
            <Info label="Version" value="v2.6.1" />
            <Info label="Build" value="prod.20260623" />
            <Info label="Environment" value="Production" />
            <Info label="API Status" value={<Badge className="bg-success/15 text-success border-0">Operational</Badge>} />
            <Info label="Last Sync" value="2 min ago" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function PrefRow({ label, description, children }: { label: string; description: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex items-center justify-between"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}
