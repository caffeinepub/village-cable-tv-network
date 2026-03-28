import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SubscriberProfile {
    subscribedPackageIds: Array<bigint>;
    joinedAt: bigint;
    fullName: string;
    address: string;
    phoneNumber: string;
    subscribedPlanIds: Array<bigint>;
}
export interface Announcement {
    id: bigint;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: bigint;
}
export interface BroadbandPlan {
    id: bigint;
    name: string;
    speedMbps: bigint;
    description: string;
    isUnlimited: boolean;
    isActive: boolean;
    priceMonthly: number;
}
export interface UserProfile {
    subscribedPackageIds: Array<bigint>;
    joinedAt: bigint;
    fullName: string;
    address: string;
    phoneNumber: string;
    subscribedPlanIds: Array<bigint>;
}
export interface ChannelPackage {
    id: bigint;
    name: string;
    tier: string;
    description: string;
    channels: Array<string>;
    isActive: boolean;
    priceMonthly: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAnnouncement(input: Announcement): Promise<bigint>;
    createBroadbandPlan(input: BroadbandPlan): Promise<bigint>;
    createChannelPackage(input: ChannelPackage): Promise<bigint>;
    createOrUpdateProfile(profile: SubscriberProfile): Promise<void>;
    deleteAnnouncement(id: bigint): Promise<void>;
    deleteBroadbandPlan(id: bigint): Promise<void>;
    deleteChannelPackage(id: bigint): Promise<void>;
    getActiveBroadbandPlans(): Promise<Array<BroadbandPlan>>;
    getActiveChannelPackages(): Promise<Array<ChannelPackage>>;
    getAllSubscribers(): Promise<Array<SubscriberProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProfile(): Promise<SubscriberProfile | null>;
    getPublishedAnnouncements(): Promise<Array<Announcement>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedSampleData(): Promise<void>;
    subscribeToPackage(packageId: bigint): Promise<void>;
    subscribeToPlan(planId: bigint): Promise<void>;
    unsubscribeFromPackage(packageId: bigint): Promise<void>;
    unsubscribeFromPlan(planId: bigint): Promise<void>;
    updateAnnouncement(id: bigint, input: Announcement): Promise<void>;
    updateBroadbandPlan(id: bigint, input: BroadbandPlan): Promise<void>;
    updateChannelPackage(id: bigint, input: ChannelPackage): Promise<void>;
}
