// src/domain/lens/scoring/decideNext.ts

import type { DerivedFlags } from "./deriveFlags";

export type ExtraMode =
  | "singleFocusChoice"
  | "retina"
  | "haloNight"
  | "premiumCompare";

export type NextDestination =
  | { type: "extra"; mode: ExtraMode }
  | { type: "result" };

export type DecideNextOptions = {
  afterRetina?: boolean;
  afterHaloNight?: boolean;
  overridePremium?: boolean;
  forcePremiumCompare?: boolean;
};

export function decideNext(
  flags: DerivedFlags,
  options: DecideNextOptions = {}
): NextDestination {
  const {
    afterRetina = false,
    afterHaloNight = false,
    overridePremium = false,
    forcePremiumCompare = false,
  } = options;

  if (forcePremiumCompare && flags.requiresExtraByPremiumCompare) {
    return { type: "extra", mode: "premiumCompare" };
  }

  if (flags.requiresExtraByCost) {
    return { type: "extra", mode: "singleFocusChoice" };
  }

  if (flags.requiresExtraByRetina && !afterRetina && !overridePremium) {
    return { type: "extra", mode: "retina" };
  }

  if (flags.requiresExtraByHaloNight && !afterHaloNight && !overridePremium) {
    return { type: "extra", mode: "haloNight" };
  }

  if (flags.requiresExtraByPremiumCompare) {
    return { type: "extra", mode: "premiumCompare" };
  }

  return { type: "result" };
}

export function decideInitialNext(flags: DerivedFlags): NextDestination {
  return decideNext(flags, {});
}
