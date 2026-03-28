import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Announcement,
  BroadbandPlan,
  ChannelPackage,
  SubscriberProfile,
  UserProfile,
} from "../backend";
import { UserRole } from "../backend";
import { useActor } from "./useActor";

export { UserRole };
export type {
  ChannelPackage,
  BroadbandPlan,
  Announcement,
  SubscriberProfile,
  UserProfile,
};

export function useChannelPackages() {
  const { actor, isFetching } = useActor();
  return useQuery<ChannelPackage[]>({
    queryKey: ["channelPackages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveChannelPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBroadbandPlans() {
  const { actor, isFetching } = useActor();
  return useQuery<BroadbandPlan[]>({
    queryKey: ["broadbandPlans"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveBroadbandPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedAnnouncements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllSubscribers() {
  const { actor, isFetching } = useActor();
  return useQuery<SubscriberProfile[]>({
    queryKey: ["allSubscribers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubscribers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}

export function useSubscribeToPackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (packageId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.subscribeToPackage(packageId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}

export function useUnsubscribeFromPackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (packageId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.unsubscribeFromPackage(packageId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}

export function useSubscribeToPlan() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (planId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.subscribeToPlan(planId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}

export function useUnsubscribeFromPlan() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (planId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.unsubscribeFromPlan(planId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}

// Admin mutations
export function useCreateChannelPackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pkg: ChannelPackage) => {
      if (!actor) throw new Error("Not connected");
      return actor.createChannelPackage(pkg);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["channelPackages"] }),
  });
}

export function useUpdateChannelPackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, pkg }: { id: bigint; pkg: ChannelPackage }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateChannelPackage(id, pkg);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["channelPackages"] }),
  });
}

export function useDeleteChannelPackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteChannelPackage(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["channelPackages"] }),
  });
}

export function useCreateBroadbandPlan() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (plan: BroadbandPlan) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBroadbandPlan(plan);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["broadbandPlans"] }),
  });
}

export function useUpdateBroadbandPlan() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, plan }: { id: bigint; plan: BroadbandPlan }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBroadbandPlan(id, plan);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["broadbandPlans"] }),
  });
}

export function useDeleteBroadbandPlan() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteBroadbandPlan(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["broadbandPlans"] }),
  });
}

export function useCreateAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ann: Announcement) => {
      if (!actor) throw new Error("Not connected");
      return actor.createAnnouncement(ann);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useUpdateAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ann }: { id: bigint; ann: Announcement }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateAnnouncement(id, ann);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteAnnouncement(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useAllAnnouncementsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<Announcement[]>({
    queryKey: ["allAnnouncements"],
    queryFn: async () => {
      if (!actor) return [];
      // Reuse published but admins typically see more; for now use same endpoint
      return actor.getPublishedAnnouncements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllChannelPackagesAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<ChannelPackage[]>({
    queryKey: ["channelPackages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveChannelPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllBroadbandPlansAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<BroadbandPlan[]>({
    queryKey: ["broadbandPlans"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveBroadbandPlans();
    },
    enabled: !!actor && !isFetching,
  });
}
