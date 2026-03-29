import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Edit2,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Plus,
  Trash2,
  Tv,
  Users,
  Wifi,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  UserRole,
  useAllAnnouncementsAdmin,
  useAllBroadbandPlansAdmin,
  useAllChannelPackagesAdmin,
  useAllSubscribers,
  useCreateAnnouncement,
  useCreateBroadbandPlan,
  useCreateChannelPackage,
  useDeleteAnnouncement,
  useDeleteBroadbandPlan,
  useDeleteChannelPackage,
  useUpdateAnnouncement,
  useUpdateBroadbandPlan,
  useUpdateChannelPackage,
  useUserRole,
} from "../hooks/useQueries";
import type {
  Announcement,
  BroadbandPlan,
  ChannelPackage,
} from "../hooks/useQueries";

// ---- Channel Packages Tab ----
const defaultPkg: ChannelPackage = {
  id: BigInt(0),
  name: "",
  tier: "Basic",
  description: "",
  channels: [],
  isActive: true,
  priceMonthly: 0,
};

function PackagesTab() {
  const { data: packages } = useAllChannelPackagesAdmin();
  const createPkg = useCreateChannelPackage();
  const updatePkg = useUpdateChannelPackage();
  const deletePkg = useDeleteChannelPackage();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ChannelPackage | null>(null);
  const [form, setForm] = useState<ChannelPackage>(defaultPkg);
  const [channelsText, setChannelsText] = useState("");

  const openCreate = () => {
    setEditing(null);
    setForm(defaultPkg);
    setChannelsText("");
    setOpen(true);
  };
  const openEdit = (pkg: ChannelPackage) => {
    setEditing(pkg);
    setForm(pkg);
    setChannelsText(pkg.channels.join(", "));
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const channels = channelsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const data = { ...form, channels };
    try {
      if (editing) {
        await updatePkg.mutateAsync({ id: editing.id, pkg: data });
        toast.success("Package updated!");
      } else {
        await createPkg.mutateAsync(data);
        toast.success("Package created!");
      }
      setOpen(false);
    } catch {
      toast.error("Failed to save package.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deletePkg.mutateAsync(id);
      toast.success("Package deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div data-ocid="admin.packages_panel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-navy">Channel Packages</h2>
        <Button
          onClick={openCreate}
          className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-full"
          data-ocid="admin.packages.open_modal_button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Package
        </Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table data-ocid="admin.packages.table">
          <TableHeader className="bg-secondary/60">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Price/mo</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages?.map((pkg, i) => (
              <TableRow
                key={pkg.id.toString()}
                data-ocid={`admin.packages.row.${i + 1}`}
              >
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{pkg.tier}</Badge>
                </TableCell>
                <TableCell>${pkg.priceMonthly.toFixed(2)}</TableCell>
                <TableCell className="text-sm text-gray-500">
                  {pkg.channels.length} channels
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(pkg)}
                      data-ocid={`admin.packages.edit_button.${i + 1}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive/5"
                          data-ocid={`admin.packages.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent data-ocid="admin.packages.delete.dialog">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Package?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-ocid="admin.packages.delete.cancel_button">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(pkg.id)}
                            className="bg-destructive text-destructive-foreground"
                            data-ocid="admin.packages.delete.confirm_button"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" data-ocid="admin.packages.dialog">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Package" : "New Channel Package"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
                className="mt-1"
                data-ocid="admin.packages.name.input"
              />
            </div>
            <div>
              <Label>Tier</Label>
              <select
                value={form.tier}
                onChange={(e) =>
                  setForm((p) => ({ ...p, tier: e.target.value }))
                }
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm"
                data-ocid="admin.packages.tier.select"
              >
                <option>Basic</option>
                <option>Standard</option>
                <option>Premium</option>
              </select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                className="mt-1"
                data-ocid="admin.packages.description.textarea"
              />
            </div>
            <div>
              <Label>Price/Month ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.priceMonthly}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    priceMonthly: Number.parseFloat(e.target.value),
                  }))
                }
                required
                className="mt-1"
                data-ocid="admin.packages.price.input"
              />
            </div>
            <div>
              <Label>Channels (comma-separated)</Label>
              <Textarea
                value={channelsText}
                onChange={(e) => setChannelsText(e.target.value)}
                placeholder="CNN, BBC, ESPN, ..."
                className="mt-1"
                data-ocid="admin.packages.channels.textarea"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="admin.packages.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-accent-blue text-white"
                disabled={createPkg.isPending || updatePkg.isPending}
                data-ocid="admin.packages.submit_button"
              >
                {createPkg.isPending || updatePkg.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : null}
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Broadband Plans Tab ----
const defaultPlan: BroadbandPlan = {
  id: BigInt(0),
  name: "",
  speedMbps: BigInt(25),
  description: "",
  isUnlimited: false,
  isActive: true,
  priceMonthly: 0,
};

function BroadbandTab() {
  const { data: plans } = useAllBroadbandPlansAdmin();
  const createPlan = useCreateBroadbandPlan();
  const updatePlan = useUpdateBroadbandPlan();
  const deletePlan = useDeleteBroadbandPlan();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BroadbandPlan | null>(null);
  const [form, setForm] = useState<BroadbandPlan>(defaultPlan);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultPlan);
    setOpen(true);
  };
  const openEdit = (plan: BroadbandPlan) => {
    setEditing(plan);
    setForm(plan);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updatePlan.mutateAsync({ id: editing.id, plan: form });
        toast.success("Plan updated!");
      } else {
        await createPlan.mutateAsync(form);
        toast.success("Plan created!");
      }
      setOpen(false);
    } catch {
      toast.error("Failed to save plan.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deletePlan.mutateAsync(id);
      toast.success("Plan deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div data-ocid="admin.broadband_panel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-navy">Broadband Plans</h2>
        <Button
          onClick={openCreate}
          className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-full"
          data-ocid="admin.broadband.open_modal_button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Plan
        </Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table data-ocid="admin.broadband.table">
          <TableHeader className="bg-secondary/60">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Speed</TableHead>
              <TableHead>Price/mo</TableHead>
              <TableHead>Unlimited</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans?.map((plan, i) => (
              <TableRow
                key={plan.id.toString()}
                data-ocid={`admin.broadband.row.${i + 1}`}
              >
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>{plan.speedMbps.toString()} Mbps</TableCell>
                <TableCell>${plan.priceMonthly.toFixed(2)}</TableCell>
                <TableCell>
                  {plan.isUnlimited ? (
                    <Badge className="bg-accent-blue text-white border-0">
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(plan)}
                      data-ocid={`admin.broadband.edit_button.${i + 1}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive/5"
                          data-ocid={`admin.broadband.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent data-ocid="admin.broadband.delete.dialog">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Plan?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-ocid="admin.broadband.delete.cancel_button">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(plan.id)}
                            className="bg-destructive text-destructive-foreground"
                            data-ocid="admin.broadband.delete.confirm_button"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" data-ocid="admin.broadband.dialog">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Plan" : "New Broadband Plan"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
                className="mt-1"
                data-ocid="admin.broadband.name.input"
              />
            </div>
            <div>
              <Label>Speed (Mbps)</Label>
              <Input
                type="number"
                value={form.speedMbps.toString()}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    speedMbps: BigInt(e.target.value || "0"),
                  }))
                }
                required
                className="mt-1"
                data-ocid="admin.broadband.speed.input"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                className="mt-1"
                data-ocid="admin.broadband.description.textarea"
              />
            </div>
            <div>
              <Label>Price/Month ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.priceMonthly}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    priceMonthly: Number.parseFloat(e.target.value),
                  }))
                }
                required
                className="mt-1"
                data-ocid="admin.broadband.price.input"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isUnlimited}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, isUnlimited: v }))
                }
                id="unlimited"
                data-ocid="admin.broadband.unlimited.switch"
              />
              <Label htmlFor="unlimited">Unlimited Data</Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="admin.broadband.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-accent-blue text-white"
                disabled={createPlan.isPending || updatePlan.isPending}
                data-ocid="admin.broadband.submit_button"
              >
                {createPlan.isPending || updatePlan.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : null}
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Announcements Tab ----
const defaultAnn: Announcement = {
  id: BigInt(0),
  title: "",
  content: "",
  isPublished: false,
  createdAt: BigInt(0),
};

function AnnouncementsTab() {
  const { data: announcements } = useAllAnnouncementsAdmin();
  const createAnn = useCreateAnnouncement();
  const updateAnn = useUpdateAnnouncement();
  const deleteAnn = useDeleteAnnouncement();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<Announcement>(defaultAnn);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultAnn);
    setOpen(true);
  };
  const openEdit = (ann: Announcement) => {
    setEditing(ann);
    setForm(ann);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        createdAt: form.createdAt || BigInt(Date.now() * 1_000_000),
      };
      if (editing) {
        await updateAnn.mutateAsync({ id: editing.id, ann: data });
        toast.success("Announcement updated!");
      } else {
        await createAnn.mutateAsync(data);
        toast.success("Announcement created!");
      }
      setOpen(false);
    } catch {
      toast.error("Failed to save announcement.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteAnn.mutateAsync(id);
      toast.success("Announcement deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div data-ocid="admin.announcements_panel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-navy">Announcements</h2>
        <Button
          onClick={openCreate}
          className="bg-accent-blue hover:bg-accent-blue/90 text-white rounded-full"
          data-ocid="admin.announcements.open_modal_button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Announcement
        </Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table data-ocid="admin.announcements.table">
          <TableHeader className="bg-secondary/60">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements?.map((ann, i) => (
              <TableRow
                key={ann.id.toString()}
                data-ocid={`admin.announcements.row.${i + 1}`}
              >
                <TableCell className="font-medium">{ann.title}</TableCell>
                <TableCell>
                  {ann.isPublished ? (
                    <Badge className="bg-green-100 text-green-700 border-0">
                      <Eye className="w-3 h-3 mr-1" />
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-400">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Draft
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-400">
                  {new Date(
                    Number(ann.createdAt) / 1_000_000,
                  ).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(ann)}
                      data-ocid={`admin.announcements.edit_button.${i + 1}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive/5"
                          data-ocid={`admin.announcements.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent data-ocid="admin.announcements.delete.dialog">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Announcement?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-ocid="admin.announcements.delete.cancel_button">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(ann.id)}
                            className="bg-destructive text-destructive-foreground"
                            data-ocid="admin.announcements.delete.confirm_button"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md"
          data-ocid="admin.announcements.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Announcement" : "New Announcement"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                required
                className="mt-1"
                data-ocid="admin.announcements.title.input"
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={form.content}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content: e.target.value }))
                }
                rows={4}
                required
                className="mt-1"
                data-ocid="admin.announcements.content.textarea"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isPublished}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, isPublished: v }))
                }
                id="published"
                data-ocid="admin.announcements.published.switch"
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="admin.announcements.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-accent-blue text-white"
                disabled={createAnn.isPending || updateAnn.isPending}
                data-ocid="admin.announcements.submit_button"
              >
                {createAnn.isPending || updateAnn.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : null}
                {editing ? "Update" : "Publish"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Subscribers Tab ----
function SubscribersTab() {
  const { data: subscribers } = useAllSubscribers();

  return (
    <div data-ocid="admin.subscribers_panel">
      <h2 className="text-lg font-bold text-navy mb-4">All Subscribers</h2>
      {!subscribers || subscribers.length === 0 ? (
        <div
          className="text-center py-12 text-gray-400"
          data-ocid="admin.subscribers.empty_state"
        >
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No subscribers yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <Table data-ocid="admin.subscribers.table">
            <TableHeader className="bg-secondary/60">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Packages</TableHead>
                <TableHead>Plans</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((sub, i) => (
                <TableRow
                  key={`${sub.fullName}-${i}`}
                  data-ocid={`admin.subscribers.row.${i + 1}`}
                >
                  <TableCell className="font-medium">
                    {sub.fullName || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {sub.phoneNumber || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {sub.address || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {sub.subscribedPackageIds.length}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {sub.subscribedPlanIds.length}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ---- Main Admin Page ----
export function Admin() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userRole, isLoading } = useUserRole();

  if (!identity) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-accent-blue" />
          </div>
          <h2 className="text-2xl font-bold text-navy mb-2">Admin Panel</h2>
          <p className="text-gray-500 mb-5 text-sm">
            Please log in with your admin account to access the panel.
          </p>
          <Button
            onClick={() => login()}
            disabled={loginStatus === "logging-in"}
            className="bg-accent-blue hover:bg-accent-blue/90 text-white px-8 rounded-full"
            data-ocid="admin.login_button"
          >
            {loginStatus === "logging-in" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4 mr-2" />
            )}
            Log In
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
      </div>
    );
  }

  if (userRole !== UserRole.admin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-navy mb-2">Access Denied</h2>
          <p className="text-gray-500">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-navy text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold mb-1">Admin Panel</h1>
          <p className="text-blue-200">
            Manage Saikiran Cable TV Network content and subscribers
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Tabs defaultValue="packages" data-ocid="admin.tabs">
            <TabsList className="mb-6 bg-secondary/60 rounded-xl p-1">
              <TabsTrigger
                value="packages"
                className="rounded-lg"
                data-ocid="admin.packages.tab"
              >
                <Tv className="w-4 h-4 mr-1.5" />
                Packages
              </TabsTrigger>
              <TabsTrigger
                value="broadband"
                className="rounded-lg"
                data-ocid="admin.broadband.tab"
              >
                <Wifi className="w-4 h-4 mr-1.5" />
                Broadband
              </TabsTrigger>
              <TabsTrigger
                value="announcements"
                className="rounded-lg"
                data-ocid="admin.announcements.tab"
              >
                <Bell className="w-4 h-4 mr-1.5" />
                Announcements
              </TabsTrigger>
              <TabsTrigger
                value="subscribers"
                className="rounded-lg"
                data-ocid="admin.subscribers.tab"
              >
                <Users className="w-4 h-4 mr-1.5" />
                Subscribers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="packages">
              <PackagesTab />
            </TabsContent>
            <TabsContent value="broadband">
              <BroadbandTab />
            </TabsContent>
            <TabsContent value="announcements">
              <AnnouncementsTab />
            </TabsContent>
            <TabsContent value="subscribers">
              <SubscribersTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
