export type LifePhase =
  | "childhood"
  | "youth"
  | "youngAdulthood"
  | "adulthood"
  | "oldAge";

export type AbilityKey =
  | "body"
  | "mind"
  | "craft"
  | "social"
  | "spirit";

export type SocialClass = "lower" | "worker" | "middle" | "upper" | "special";

export type EducationLevel =
  | "none"
  | "primary"
  | "secondary"
  | "vocational"
  | "higher"
  | "nightSchool";

export type CareerCategory =
  | "none"
  | "labor"
  | "clerical"
  | "academic"
  | "religious"
  | "state"
  | "underground"
  | "mercantile";

export type Region =
  | "capital"
  | "industrial"
  | "academic"
  | "religious"
  | "frontier";

export type OrganizationKind =
  | "state"
  | "corporation"
  | "academia"
  | "religion"
  | "underground";

export type Stats = Record<AbilityKey, number>;
