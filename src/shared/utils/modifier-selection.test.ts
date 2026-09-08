import { describe, expect, it } from "vitest";
import {
  areSelectionsEqual,
  calcFinalUnitPrice,
  calcModifierTotal,
  formatPriceAdjustment,
  selectionsKey,
  snapshotSelections,
  validateModifierSelections,
} from "@/shared/utils/modifier-selection";
import type { ModifierGroupView } from "@/shared/types/modifier";

const groups: ModifierGroupView[] = [
  {
    id: "g-size",
    name: "Size",
    selectionType: "SINGLE",
    minSelect: 1,
    maxSelect: 1,
    sortOrder: 0,
    options: [
      {
        id: "o-s",
        name: "S",
        priceAdjustment: 0,
        sortOrder: 0,
        isAvailable: true,
      },
      {
        id: "o-l",
        name: "L",
        priceAdjustment: 20,
        sortOrder: 1,
        isAvailable: true,
      },
    ],
  },
  {
    id: "g-top",
    name: "Toppings",
    selectionType: "MULTIPLE",
    minSelect: 0,
    maxSelect: 2,
    sortOrder: 1,
    options: [
      {
        id: "o-cheese",
        name: "Cheese",
        priceAdjustment: 15,
        sortOrder: 0,
        isAvailable: true,
      },
      {
        id: "o-egg",
        name: "Egg",
        priceAdjustment: -5,
        sortOrder: 1,
        isAvailable: true,
      },
    ],
  },
];

describe("calcModifierTotal", () => {
  it("sums positive, negative, and zero adjustments", () => {
    expect(
      calcModifierTotal(groups, [
        { modifierGroupId: "g-size", modifierOptionIds: ["o-l"] },
        { modifierGroupId: "g-top", modifierOptionIds: ["o-cheese", "o-egg"] },
      ]),
    ).toBe(30);
  });

  it("ignores unknown option ids", () => {
    expect(
      calcModifierTotal(groups, [
        { modifierGroupId: "g-size", modifierOptionIds: ["nope"] },
      ]),
    ).toBe(0);
  });
});

describe("calcFinalUnitPrice", () => {
  it("adds the modifier total to the base price", () => {
    expect(
      calcFinalUnitPrice(100, groups, [
        { modifierGroupId: "g-size", modifierOptionIds: ["o-l"] },
      ]),
    ).toBe(120);
  });
});

describe("validateModifierSelections", () => {
  it("requires the SINGLE group to be selected", () => {
    const result = validateModifierSelections(groups, []);
    expect(result.valid).toBe(false);
    expect(result.errors["g-size"]).toEqual({ code: "required" });
    expect(result.errors["g-top"]).toBeUndefined();
  });

  it("rejects selections above maxSelect", () => {
    const result = validateModifierSelections(groups, [
      { modifierGroupId: "g-size", modifierOptionIds: ["o-l"] },
      {
        modifierGroupId: "g-top",
        modifierOptionIds: ["o-cheese", "o-egg", "o-extra"],
      },
    ]);
    expect(result.valid).toBe(false);
    expect(result.errors["g-top"]).toEqual({ code: "max", max: 2 });
  });

  it("accepts a complete valid selection", () => {
    const result = validateModifierSelections(groups, [
      { modifierGroupId: "g-size", modifierOptionIds: ["o-s"] },
    ]);
    expect(result).toEqual({ valid: true, errors: {} });
  });
});

describe("selectionsKey / areSelectionsEqual", () => {
  it("is order-insensitive", () => {
    const a = [
      { modifierGroupId: "g-top", modifierOptionIds: ["o-egg", "o-cheese"] },
      { modifierGroupId: "g-size", modifierOptionIds: ["o-l"] },
    ];
    const b = [
      { modifierGroupId: "g-size", modifierOptionIds: ["o-l"] },
      { modifierGroupId: "g-top", modifierOptionIds: ["o-cheese", "o-egg"] },
    ];
    expect(areSelectionsEqual(a, b)).toBe(true);
    expect(selectionsKey(a)).toBe(selectionsKey(b));
  });

  it("distinguishes different selections", () => {
    expect(
      areSelectionsEqual(
        [{ modifierGroupId: "g-size", modifierOptionIds: ["o-s"] }],
        [{ modifierGroupId: "g-size", modifierOptionIds: ["o-l"] }],
      ),
    ).toBe(false);
  });
});

describe("snapshotSelections", () => {
  it("resolves display names", () => {
    expect(
      snapshotSelections(groups, [
        { modifierGroupId: "g-size", modifierOptionIds: ["o-l"] },
      ]),
    ).toEqual([
      {
        modifierGroupId: "g-size",
        modifierGroupName: "Size",
        modifierOptionIds: ["o-l"],
        modifierOptionNames: ["L"],
      },
    ]);
  });
});

describe("formatPriceAdjustment", () => {
  it("formats positive, negative, and zero adjustments", () => {
    expect(formatPriceAdjustment(20)).toBe("+฿20");
    expect(formatPriceAdjustment(-5)).toBe("-฿5");
    expect(formatPriceAdjustment(0)).toBe("");
  });
});
