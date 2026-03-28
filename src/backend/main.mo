import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Order "mo:core/Order";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // TYPES

  public type ChannelPackage = {
    id : Nat;
    name : Text;
    description : Text;
    priceMonthly : Float;
    channels : [Text];
    isActive : Bool;
    tier : Text;
  };

  public type BroadbandPlan = {
    id : Nat;
    name : Text;
    description : Text;
    speedMbps : Nat;
    priceMonthly : Float;
    isUnlimited : Bool;
    isActive : Bool;
  };

  public type Announcement = {
    id : Nat;
    title : Text;
    content : Text;
    createdAt : Int;
    isPublished : Bool;
  };

  public type SubscriberProfile = {
    fullName : Text;
    address : Text;
    phoneNumber : Text;
    subscribedPackageIds : [Nat];
    subscribedPlanIds : [Nat];
    joinedAt : Int;
  };

  public type UserProfile = SubscriberProfile;

  module ChannelPackage {
    public func compare(a : ChannelPackage, b : ChannelPackage) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module BroadbandPlan {
    public func compare(a : BroadbandPlan, b : BroadbandPlan) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Announcement {
    public func compare(a : Announcement, b : Announcement) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  // STATE
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let channelPackages = Map.empty<Nat, ChannelPackage>();
  let broadbandPlans = Map.empty<Nat, BroadbandPlan>();
  let announcements = Map.empty<Nat, Announcement>();
  let subscriberProfiles = Map.empty<Principal, SubscriberProfile>();

  var nextChannelPackageId = 1;
  var nextBroadbandPlanId = 1;
  var nextAnnouncementId = 1;

  // PUBLIC QUERIES (accessible to everyone including guests)

  public query ({ caller }) func getActiveChannelPackages() : async [ChannelPackage] {
    channelPackages.values().toArray().filter(func(pkg) { pkg.isActive }).sort();
  };

  public query ({ caller }) func getActiveBroadbandPlans() : async [BroadbandPlan] {
    broadbandPlans.values().toArray().filter(func(plan) { plan.isActive }).sort();
  };

  public query ({ caller }) func getPublishedAnnouncements() : async [Announcement] {
    announcements.values().toArray().filter(func(ann) { ann.isPublished }).sort();
  };

  // REQUIRED USER PROFILE FUNCTIONS (for frontend)

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    subscriberProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let existing = subscriberProfiles.get(caller);
    let newProfile : SubscriberProfile = switch (existing) {
      case (null) {
        {
          profile with
          subscribedPackageIds = [];
          subscribedPlanIds = [];
          joinedAt = Time.now();
        };
      };
      case (?existing) {
        {
          profile with
          subscribedPackageIds = existing.subscribedPackageIds;
          subscribedPlanIds = existing.subscribedPlanIds;
          joinedAt = existing.joinedAt;
        };
      };
    };
    subscriberProfiles.add(caller, newProfile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    subscriberProfiles.get(user);
  };

  // ADMIN FUNCTIONS (admin-only)

  public shared ({ caller }) func createChannelPackage(input : ChannelPackage) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let newId = nextChannelPackageId;
    nextChannelPackageId += 1;
    let newPackage : ChannelPackage = {
      input with
      id = newId;
    };
    channelPackages.add(newId, newPackage);
    newId;
  };

  public shared ({ caller }) func updateChannelPackage(id : Nat, input : ChannelPackage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not channelPackages.containsKey(id)) {
      Runtime.trap("Channel package not found");
    };
    let updatedPackage : ChannelPackage = {
      input with
      id;
    };
    channelPackages.add(id, updatedPackage);
  };

  public shared ({ caller }) func deleteChannelPackage(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not channelPackages.containsKey(id)) {
      Runtime.trap("Channel package not found");
    };
    channelPackages.remove(id);
  };

  public shared ({ caller }) func createBroadbandPlan(input : BroadbandPlan) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let newId = nextBroadbandPlanId;
    nextBroadbandPlanId += 1;
    let newPlan : BroadbandPlan = {
      input with
      id = newId;
    };
    broadbandPlans.add(newId, newPlan);
    newId;
  };

  public shared ({ caller }) func updateBroadbandPlan(id : Nat, input : BroadbandPlan) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not broadbandPlans.containsKey(id)) {
      Runtime.trap("Broadband plan not found");
    };
    let updatedPlan : BroadbandPlan = {
      input with
      id;
    };
    broadbandPlans.add(id, updatedPlan);
  };

  public shared ({ caller }) func deleteBroadbandPlan(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not broadbandPlans.containsKey(id)) {
      Runtime.trap("Broadband plan not found");
    };
    broadbandPlans.remove(id);
  };

  public shared ({ caller }) func createAnnouncement(input : Announcement) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let newId = nextAnnouncementId;
    nextAnnouncementId += 1;
    let newAnnouncement : Announcement = {
      input with
      id = newId;
      createdAt = Time.now();
    };
    announcements.add(newId, newAnnouncement);
    newId;
  };

  public shared ({ caller }) func updateAnnouncement(id : Nat, input : Announcement) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let existing = announcements.get(id);
    switch (existing) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?existing) {
        let updatedAnnouncement : Announcement = {
          input with
          id;
          createdAt = existing.createdAt;
        };
        announcements.add(id, updatedAnnouncement);
      };
    };
  };

  public shared ({ caller }) func deleteAnnouncement(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not announcements.containsKey(id)) {
      Runtime.trap("Announcement not found");
    };
    announcements.remove(id);
  };

  public query ({ caller }) func getAllSubscribers() : async [SubscriberProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    subscriberProfiles.values().toArray();
  };

  // SUBSCRIBER FUNCTIONS (user-only)

  public shared ({ caller }) func createOrUpdateProfile(profile : SubscriberProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let existing = subscriberProfiles.get(caller);
    let newProfile : SubscriberProfile = switch (existing) {
      case (null) {
        {
          profile with
          subscribedPackageIds = [];
          subscribedPlanIds = [];
          joinedAt = Time.now();
        };
      };
      case (?existing) {
        {
          profile with
          subscribedPackageIds = existing.subscribedPackageIds;
          subscribedPlanIds = existing.subscribedPlanIds;
          joinedAt = existing.joinedAt;
        };
      };
    };
    subscriberProfiles.add(caller, newProfile);
  };

  public query ({ caller }) func getProfile() : async ?SubscriberProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    subscriberProfiles.get(caller);
  };

  public shared ({ caller }) func subscribeToPackage(packageId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let existing = subscriberProfiles.get(caller);
    switch (existing) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        if (profile.subscribedPackageIds.find(func(id) { id == packageId }) != null) {
          Runtime.trap("Already subscribed to package");
        };
        let newProfile : SubscriberProfile = {
          profile with
          subscribedPackageIds = profile.subscribedPackageIds.concat([packageId]);
        };
        subscriberProfiles.add(caller, newProfile);
      };
    };
  };

  public shared ({ caller }) func unsubscribeFromPackage(packageId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let existing = subscriberProfiles.get(caller);
    switch (existing) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        if (profile.subscribedPackageIds.find(func(id) { id == packageId }) == null) {
          Runtime.trap("Not subscribed to package");
        };
        let newProfile : SubscriberProfile = {
          profile with
          subscribedPackageIds = profile.subscribedPackageIds.filter(func(id) { id != packageId });
        };
        subscriberProfiles.add(caller, newProfile);
      };
    };
  };

  public shared ({ caller }) func subscribeToPlan(planId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let existing = subscriberProfiles.get(caller);
    switch (existing) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        if (profile.subscribedPlanIds.find(func(id) { id == planId }) != null) {
          Runtime.trap("Already subscribed to plan");
        };
        let newProfile : SubscriberProfile = {
          profile with
          subscribedPlanIds = profile.subscribedPlanIds.concat([planId]);
        };
        subscriberProfiles.add(caller, newProfile);
      };
    };
  };

  public shared ({ caller }) func unsubscribeFromPlan(planId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    let existing = subscriberProfiles.get(caller);
    switch (existing) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        if (profile.subscribedPlanIds.find(func(id) { id == planId }) == null) {
          Runtime.trap("Not subscribed to plan");
        };
        let newProfile : SubscriberProfile = {
          profile with
          subscribedPlanIds = profile.subscribedPlanIds.filter(func(id) { id != planId });
        };
        subscriberProfiles.add(caller, newProfile);
      };
    };
  };

  // SEED DATA (admin-only)

  public shared ({ caller }) func seedSampleData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (channelPackages.size() > 0 or broadbandPlans.size() > 0) {
      Runtime.trap("Already seeded");
    };

    // Seed Channel Packages
    let basicPackage : ChannelPackage = {
      id = nextChannelPackageId;
      name = "Basic Package";
      description = "30 channels incl. news, sports, and entertainment";
      priceMonthly = 10.0;
      channels = [
        "CNN",
        "BBC",
        "ESPN",
        "Discovery",
      ];
      isActive = true;
      tier = "Basic";
    };
    nextChannelPackageId += 1;

    let standardPackage : ChannelPackage = {
      id = nextChannelPackageId;
      name = "Standard Package";
      description = "60 channels + HD";
      priceMonthly = 20.0;
      channels = [
        "NatGeo",
        "HBO",
        "Star Sports",
      ];
      isActive = true;
      tier = "Standard";
    };
    nextChannelPackageId += 1;

    let premiumPackage : ChannelPackage = {
      id = nextChannelPackageId;
      name = "Premium Package";
      description = "100+ channels, 50+ HD channels";
      priceMonthly = 30.0;
      channels = [
        "Zee TV",
        "Sony Movies",
        "Disney Channel",
      ];
      isActive = true;
      tier = "Premium";
    };
    nextChannelPackageId += 1;

    channelPackages.add(basicPackage.id, basicPackage);
    channelPackages.add(standardPackage.id, standardPackage);
    channelPackages.add(premiumPackage.id, premiumPackage);

    // Seed Broadband Plans
    let plan10Mbps : BroadbandPlan = {
      id = nextBroadbandPlanId;
      name = "10Mbps Plan";
      description = "Unlimited 10Mbps plan";
      speedMbps = 10;
      priceMonthly = 5.0;
      isUnlimited = true;
      isActive = true;
    };
    nextBroadbandPlanId += 1;

    let plan50Mbps : BroadbandPlan = {
      id = nextBroadbandPlanId;
      name = "50Mbps Plan";
      description = "50Mbps high-speed plan";
      speedMbps = 50;
      priceMonthly = 15.0;
      isUnlimited = true;
      isActive = true;
    };
    nextBroadbandPlanId += 1;

    let plan100Mbps : BroadbandPlan = {
      id = nextBroadbandPlanId;
      name = "100Mbps Plan";
      description = "100Mbps ultra-fast plan";
      speedMbps = 100;
      priceMonthly = 25.0;
      isUnlimited = true;
      isActive = true;
    };
    nextBroadbandPlanId += 1;

    broadbandPlans.add(plan10Mbps.id, plan10Mbps);
    broadbandPlans.add(plan50Mbps.id, plan50Mbps);
    broadbandPlans.add(plan100Mbps.id, plan100Mbps);
  };
};
