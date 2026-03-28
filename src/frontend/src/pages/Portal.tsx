import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  Loader2,
  LogIn,
  Tv,
  User,
  Wifi,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  UserRole,
  useBroadbandPlans,
  useChannelPackages,
  useSaveProfile,
  useSubscribeToPackage,
  useSubscribeToPlan,
  useUnsubscribeFromPackage,
  useUnsubscribeFromPlan,
  useUserProfile,
  useUserRole,
} from "../hooks/useQueries";
import type { UserProfile } from "../hooks/useQueries";

function LoginPrompt() {
  const { login, loginStatus } = useInternetIdentity();
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center"
      data-ocid="portal.login_section"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-sm"
      >
        <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-accent-blue" />
        </div>
        <h2 className="text-2xl font-bold text-navy mb-2">Subscriber Portal</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Log in to manage your subscriptions, view your packages, and update
          your profile.
        </p>
        <Button
          onClick={() => login()}
          disabled={loginStatus === "logging-in"}
          className="bg-accent-blue hover:bg-accent-blue/90 text-white px-8 rounded-full"
          data-ocid="portal.login_button"
        >
          {loginStatus === "logging-in" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging in...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" /> Log In to Your Account
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}

function ProfileSection({ profile }: { profile: UserProfile | null }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: profile?.fullName ?? "",
    address: profile?.address ?? "",
    phoneNumber: profile?.phoneNumber ?? "",
  });
  const saveProfile = useSaveProfile();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfile.mutateAsync({
        ...form,
        subscribedPackageIds: profile?.subscribedPackageIds ?? [],
        subscribedPlanIds: profile?.subscribedPlanIds ?? [],
        joinedAt: profile?.joinedAt ?? BigInt(Date.now() * 1_000_000),
      });
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <Card
      className="rounded-xl shadow-card border-0"
      data-ocid="portal.profile_card"
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-navy">My Profile</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditing(!editing)}
          className="text-accent-blue border-accent-blue/30 hover:bg-accent-blue/5"
          data-ocid="portal.edit_profile_button"
        >
          <Edit2 className="w-3.5 h-3.5 mr-1" /> {editing ? "Cancel" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent>
        {editing ? (
          <form
            onSubmit={handleSave}
            className="space-y-4"
            data-ocid="portal.profile_form"
          >
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, fullName: e.target.value }))
                }
                required
                className="mt-1"
                data-ocid="portal.fullname.input"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                required
                className="mt-1"
                data-ocid="portal.address.input"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phoneNumber: e.target.value }))
                }
                required
                className="mt-1"
                data-ocid="portal.phone.input"
              />
            </div>
            <Button
              type="submit"
              disabled={saveProfile.isPending}
              className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-full"
              data-ocid="portal.save_profile_button"
            >
              {saveProfile.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </form>
        ) : (
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-gray-400 uppercase tracking-wide">
                Full Name
              </dt>
              <dd className="text-gray-800 font-medium">
                {profile?.fullName || (
                  <span className="text-gray-300 italic">Not set</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400 uppercase tracking-wide">
                Address
              </dt>
              <dd className="text-gray-800 font-medium">
                {profile?.address || (
                  <span className="text-gray-300 italic">Not set</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400 uppercase tracking-wide">
                Phone
              </dt>
              <dd className="text-gray-800 font-medium">
                {profile?.phoneNumber || (
                  <span className="text-gray-300 italic">Not set</span>
                )}
              </dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  );
}

function SubscriptionsSection({ profile }: { profile: UserProfile | null }) {
  const { data: packages } = useChannelPackages();
  const { data: plans } = useBroadbandPlans();
  const subPkg = useSubscribeToPackage();
  const unsubPkg = useUnsubscribeFromPackage();
  const subPlan = useSubscribeToPlan();
  const unsubPlan = useUnsubscribeFromPlan();

  const subscribedPkgIds = new Set(
    profile?.subscribedPackageIds.map(String) ?? [],
  );
  const subscribedPlanIds = new Set(
    profile?.subscribedPlanIds.map(String) ?? [],
  );

  const handleTogglePkg = async (id: bigint, subscribed: boolean) => {
    try {
      if (subscribed) {
        await unsubPkg.mutateAsync(id);
        toast.success("Unsubscribed from package.");
      } else {
        await subPkg.mutateAsync(id);
        toast.success("Subscribed to package!");
      }
    } catch {
      toast.error("Action failed. Please try again.");
    }
  };

  const handleTogglePlan = async (id: bigint, subscribed: boolean) => {
    try {
      if (subscribed) {
        await unsubPlan.mutateAsync(id);
        toast.success("Unsubscribed from plan.");
      } else {
        await subPlan.mutateAsync(id);
        toast.success("Subscribed to plan!");
      }
    } catch {
      toast.error("Action failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Channel Packages */}
      <Card
        className="rounded-xl shadow-card border-0"
        data-ocid="portal.packages_card"
      >
        <CardHeader>
          <CardTitle className="text-navy flex items-center gap-2">
            <Tv className="w-5 h-5 text-accent-blue" /> Channel Packages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!packages || packages.length === 0 ? (
            <p
              className="text-gray-400 text-sm"
              data-ocid="portal.packages.empty_state"
            >
              No packages available.
            </p>
          ) : (
            <div className="space-y-3">
              {packages.map((pkg, i) => {
                const subscribed = subscribedPkgIds.has(pkg.id.toString());
                return (
                  <div
                    key={pkg.id.toString()}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                    data-ocid={`portal.package.item.${i + 1}`}
                  >
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {pkg.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {pkg.tier} · ${pkg.priceMonthly.toFixed(2)}/mo
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={subscribed ? "outline" : "default"}
                      className={
                        subscribed
                          ? "border-destructive text-destructive hover:bg-destructive/5"
                          : "bg-accent-blue hover:bg-accent-blue/90 text-white"
                      }
                      onClick={() => handleTogglePkg(pkg.id, subscribed)}
                      data-ocid={`portal.package.toggle.${i + 1}`}
                    >
                      {subscribed ? "Unsubscribe" : "Subscribe"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Broadband Plans */}
      <Card
        className="rounded-xl shadow-card border-0"
        data-ocid="portal.plans_card"
      >
        <CardHeader>
          <CardTitle className="text-navy flex items-center gap-2">
            <Wifi className="w-5 h-5 text-accent-blue" /> Broadband Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!plans || plans.length === 0 ? (
            <p
              className="text-gray-400 text-sm"
              data-ocid="portal.plans.empty_state"
            >
              No plans available.
            </p>
          ) : (
            <div className="space-y-3">
              {plans.map((plan, i) => {
                const subscribed = subscribedPlanIds.has(plan.id.toString());
                return (
                  <div
                    key={plan.id.toString()}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                    data-ocid={`portal.plan.item.${i + 1}`}
                  >
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {plan.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {plan.speedMbps.toString()} Mbps · $
                        {plan.priceMonthly.toFixed(2)}/mo
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={subscribed ? "outline" : "default"}
                      className={
                        subscribed
                          ? "border-destructive text-destructive hover:bg-destructive/5"
                          : "bg-accent-blue hover:bg-accent-blue/90 text-white"
                      }
                      onClick={() => handleTogglePlan(plan.id, subscribed)}
                      data-ocid={`portal.plan.toggle.${i + 1}`}
                    >
                      {subscribed ? "Unsubscribe" : "Subscribe"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function Portal() {
  const { identity } = useInternetIdentity();
  const { data: userRole, isLoading: roleLoading } = useUserRole();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  if (!identity) return <LoginPrompt />;

  if (roleLoading || profileLoading) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center"
        data-ocid="portal.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
      </div>
    );
  }

  if (userRole === UserRole.admin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-accent-blue" />
          <h2 className="text-xl font-bold text-navy mb-2">
            Admin Account Detected
          </h2>
          <p className="text-gray-500 mb-4">
            Please use the Admin Panel to manage the system.
          </p>
          <a href="/admin">
            <Button className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-full">
              Go to Admin Panel
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold mb-1">Subscriber Portal</h1>
          <p className="text-blue-200">Manage your account and subscriptions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProfileSection profile={profile ?? null} />
          </div>
          <div className="lg:col-span-2">
            <SubscriptionsSection profile={profile ?? null} />
          </div>
        </div>
      </div>
    </div>
  );
}
