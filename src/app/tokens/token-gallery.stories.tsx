import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import {
  CompositeTypeScale,
  familySample,
  fontSample,
  ColorSwatches,
  leadingSample,
  motionSample,
  radiusSample,
  shadowSample,
  spacingSample,
  TokenGroup,
  TokenTable,
  trackingSample,
  weightSample,
} from "./token-gallery";

const meta = {
  title: "Design Tokens",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Page({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg px-5 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">{children}</div>
    </div>
  );
}

const GRAY_SCALE = [
  "--gray-0",
  "--gray-50",
  "--gray-100",
  "--gray-200",
  "--gray-300",
  "--gray-400",
  "--gray-500",
  "--gray-600",
  "--gray-700",
  "--gray-800",
  "--gray-900",
].map((name) => ({ name }));

const STATUS_PRIMITIVES = [
  ...["50", "100", "500", "600", "700"].map((step) => ({
    name: `--green-${step}`,
  })),
  ...["50", "100", "500", "600", "700"].map((step) => ({
    name: `--red-${step}`,
  })),
  ...["50", "100", "500", "600", "700"].map((step) => ({
    name: `--yellow-${step}`,
  })),
  ...["50", "100", "500", "600", "700"].map((step) => ({
    name: `--blue-${step}`,
  })),
];

const SURFACE_TOKENS = [
  { name: "--color-bg", label: "Page background" },
  { name: "--color-surface", label: "Surface" },
  { name: "--color-surface-hover", label: "Surface hover" },
  { name: "--color-surface-muted", label: "Surface muted" },
  { name: "--color-surface-muted-hover", label: "Surface muted hover" },
  { name: "--color-overlay", label: "Overlay" },
];

const TEXT_TOKENS = [
  { name: "--color-text-primary", label: "Text primary" },
  { name: "--color-text-secondary", label: "Text secondary" },
  { name: "--color-text-tertiary", label: "Text tertiary" },
  { name: "--color-text-inverse", label: "Text inverse" },
];

const BORDER_TOKENS = [
  { name: "--color-border", label: "Border" },
  { name: "--color-border-hover", label: "Border hover" },
];

const ACTION_TOKENS = [
  { name: "--color-primary", label: "Primary" },
  { name: "--color-primary-hover", label: "Primary hover" },
  { name: "--color-primary-bg", label: "Primary bg" },
];

const ACCENT_TOKENS = [
  { name: "--color-accent", label: "Accent" },
  { name: "--color-accent-hover", label: "Accent hover" },
  { name: "--color-accent-bg", label: "Accent bg" },
  { name: "--color-accent-border", label: "Accent border" },
  { name: "--color-accent-text", label: "Accent text" },
];

const STATUS_TOKENS = [
  { name: "--color-success", label: "Success" },
  { name: "--color-success-bg", label: "Success bg" },
  { name: "--color-danger", label: "Danger" },
  { name: "--color-danger-hover", label: "Danger hover" },
  { name: "--color-danger-bg", label: "Danger bg" },
  { name: "--color-warning", label: "Warning" },
  { name: "--color-warning-bg", label: "Warning bg" },
  { name: "--color-info", label: "Info" },
  { name: "--color-info-bg", label: "Info bg" },
  { name: "--color-bumped", label: "Bumped" },
  { name: "--color-bumped-bg", label: "Bumped bg" },
];

export const PrimitiveColors: Story = {
  render: () => (
    <Page>
      <TokenGroup
        title="Primitive Colors"
        description="Layer 1 — raw values. Never used directly in components."
      >
        <TokenGroup
          title="Gray scale"
          description="Apple Newsroom warm gray palette."
        >
          <ColorSwatches tokens={GRAY_SCALE} />
        </TokenGroup>
        <TokenGroup
          title="Status primitives"
          description="Green, red, yellow, blue — base hues for status colors."
        >
          <ColorSwatches tokens={STATUS_PRIMITIVES} />
        </TokenGroup>
      </TokenGroup>
    </Page>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <Page>
      <TokenGroup
        title="Semantic Colors"
        description="Layer 2 — meaning-based tokens mapped from primitives. Toggle the theme toolbar to see dark mode."
      >
        <TokenGroup title="Surfaces">
          <ColorSwatches tokens={SURFACE_TOKENS} />
        </TokenGroup>
        <TokenGroup title="Text">
          <ColorSwatches tokens={TEXT_TOKENS} />
        </TokenGroup>
        <TokenGroup title="Borders">
          <ColorSwatches tokens={BORDER_TOKENS} />
        </TokenGroup>
        <TokenGroup title="Action">
          <ColorSwatches tokens={ACTION_TOKENS} />
        </TokenGroup>
        <TokenGroup title="Accent">
          <ColorSwatches tokens={ACCENT_TOKENS} />
        </TokenGroup>
        <TokenGroup title="Status">
          <ColorSwatches tokens={STATUS_TOKENS} />
        </TokenGroup>
      </TokenGroup>
    </Page>
  ),
};

const FAMILY_ROWS = [
  { name: "--font-sans", label: "Sans", sample: familySample },
  { name: "--font-mono", label: "Mono", sample: familySample },
];

const SIZE_ROWS = [
  "--size-xs",
  "--size-sm",
  "--size-base",
  "--size-lg",
  "--size-xl",
  "--size-2xl",
  "--size-3xl",
  "--size-4xl",
  "--size-5xl",
].map((name) => ({ name, sample: fontSample }));

const WEIGHT_ROWS = [
  "--weight-regular",
  "--weight-medium",
  "--weight-semibold",
  "--weight-bold",
].map((name) => ({ name, sample: weightSample }));

const LEADING_ROWS = [
  "--leading-tight",
  "--leading-snug",
  "--leading-normal",
  "--leading-relaxed",
].map((name) => ({ name, sample: leadingSample }));

const TRACKING_ROWS = [
  "--tracking-tight",
  "--tracking-normal",
  "--tracking-wide",
].map((name) => ({ name, sample: trackingSample }));

export const Typography: Story = {
  render: () => (
    <Page>
      <TokenGroup
        title="Typography"
        description="Font families, scales, and the composite text utilities."
      >
        <TokenGroup title="Font families">
          <TokenTable rows={FAMILY_ROWS} />
        </TokenGroup>
        <TokenGroup
          title="Size scale"
          description="Primitive type sizes used by semantic text styles."
        >
          <TokenTable rows={SIZE_ROWS} />
        </TokenGroup>
        <TokenGroup title="Weights">
          <TokenTable rows={WEIGHT_ROWS} />
        </TokenGroup>
        <TokenGroup title="Line heights">
          <TokenTable rows={LEADING_ROWS} />
        </TokenGroup>
        <TokenGroup title="Letter spacing">
          <TokenTable rows={TRACKING_ROWS} />
        </TokenGroup>
        <TokenGroup
          title="Composite text styles"
          description="Semantic utilities bundling size + weight + leading."
        >
          <CompositeTypeScale
            items={[
              { className: "text-display", name: "text-display" },
              { className: "text-heading", name: "text-heading" },
              { className: "text-title", name: "text-title" },
              { className: "text-subtitle", name: "text-subtitle" },
              { className: "text-body", name: "text-body" },
              { className: "text-body-sm", name: "text-body-sm" },
              { className: "text-label", name: "text-label" },
              { className: "text-caption", name: "text-caption" },
            ]}
          />
        </TokenGroup>
      </TokenGroup>
    </Page>
  ),
};

const SPACING_ROWS = [
  "--space-1",
  "--space-2",
  "--space-3",
  "--space-4",
  "--space-5",
  "--space-6",
  "--space-7",
  "--space-8",
  "--space-9",
  "--space-10",
  "--space-11",
].map((name) => ({ name, sample: spacingSample() }));

export const Spacing: Story = {
  render: () => (
    <Page>
      <TokenGroup
        title="Spacing"
        description="Layer 1 — the 4px-based spacing scale."
      >
        <TokenTable rows={SPACING_ROWS} />
      </TokenGroup>
    </Page>
  ),
};

const RADIUS_ROWS = [
  "--radius-xs",
  "--radius-sm",
  "--radius-md",
  "--radius-lg",
  "--radius-xl",
  "--radius-full",
].map((name) => ({ name, sample: radiusSample() }));

export const Radius: Story = {
  render: () => (
    <Page>
      <TokenGroup
        title="Radius"
        description="Corner rounding scale. Component radii reference these."
      >
        <TokenTable rows={RADIUS_ROWS} />
      </TokenGroup>
    </Page>
  ),
};

const SHADOW_ROWS = [
  "--shadow-xs",
  "--shadow-sm",
  "--shadow-md",
  "--shadow-lg",
  "--shadow-xl",
  "--shadow-soft",
].map((name) => ({ name, sample: shadowSample }));

export const Shadows: Story = {
  render: () => (
    <Page>
      <TokenGroup
        title="Shadows"
        description="Very soft, Newsroom-inspired elevation. Darkens in dark mode."
      >
        <TokenTable rows={SHADOW_ROWS} />
      </TokenGroup>
    </Page>
  ),
};

const MOTION_ROWS = ["--motion-fast", "--motion-normal", "--motion-slow"].map(
  (name) => ({ name, sample: motionSample }),
);

export const Motion: Story = {
  render: () => (
    <Page>
      <TokenGroup
        title="Motion"
        description="Duration tokens for transitions and micro-interactions."
      >
        <TokenTable rows={MOTION_ROWS} />
        <TokenGroup title="Easing">
          <TokenTable
            rows={[
              {
                name: "--ease-standard",
                sample: (value) => (
                  <span className="font-mono text-xs text-text-secondary">
                    {value}
                  </span>
                ),
              },
            ]}
          />
        </TokenGroup>
      </TokenGroup>
    </Page>
  ),
};

const BUTTON_COLORS = [
  "--color-button-primary-bg",
  "--color-button-primary-bg-hover",
  "--color-button-primary-text",
  "--color-button-secondary-bg",
  "--color-button-secondary-bg-hover",
  "--color-button-secondary-text",
  "--color-button-secondary-border",
  "--color-button-danger-bg",
  "--color-button-danger-bg-hover",
  "--color-button-danger-text",
  "--color-button-ghost-bg",
  "--color-button-ghost-bg-hover",
  "--color-button-ghost-text",
].map((name) => ({ name }));

const INPUT_COLORS = [
  "--color-input-bg",
  "--color-input-border",
  "--color-input-border-hover",
  "--color-input-border-focus",
  "--color-input-text",
  "--color-input-placeholder",
].map((name) => ({ name }));

const BADGE_COLORS = [
  "--color-badge-default-bg",
  "--color-badge-default-text",
  "--color-badge-success-bg",
  "--color-badge-success-text",
  "--color-badge-warning-bg",
  "--color-badge-warning-text",
  "--color-badge-danger-bg",
  "--color-badge-danger-text",
  "--color-badge-info-bg",
  "--color-badge-info-text",
  "--color-badge-accent-bg",
  "--color-badge-accent-text",
].map((name) => ({ name }));

const INTERACTION_COLORS = [
  "--color-chip-active-bg",
  "--color-chip-active-text",
  "--color-chip-inactive-bg",
  "--color-chip-inactive-bg-hover",
  "--color-chip-inactive-text",
  "--color-segment-bg",
  "--color-segment-border",
  "--color-segment-active-bg",
  "--color-segment-active-text",
  "--color-segment-inactive-text",
  "--color-segment-inactive-text-hover",
  "--color-selection-border",
  "--color-selection-border-hover",
  "--color-selection-text",
  "--color-selection-active-border",
  "--color-selection-active-bg",
  "--color-selection-active-text",
].map((name) => ({ name }));

const CHROME_COLORS = [
  "--color-card-bg",
  "--color-card-bg-hover",
  "--color-card-border",
  "--color-card-border-hover",
  "--color-toggle-bg",
  "--color-toggle-bg-active",
  "--color-toggle-knob",
  "--color-skeleton-bg",
  "--color-skeleton-shimmer",
  "--color-dialog-bg",
  "--color-dialog-border",
  "--color-dialog-overlay",
  "--color-on-accent",
  "--color-label-comp-text",
  "--color-sidebar-bg",
  "--color-select-bg",
  "--color-select-border",
  "--color-select-border-focus",
  "--color-select-text",
].map((name) => ({ name }));

const COMPONENT_METRICS = [
  { name: "--radius-button", sample: radiusSample(28) },
  { name: "--radius-card", sample: radiusSample(28) },
  { name: "--radius-input", sample: radiusSample(28) },
  { name: "--radius-badge", sample: radiusSample(28) },
  { name: "--radius-chip", sample: radiusSample(28) },
  { name: "--radius-segment", sample: radiusSample(28) },
  { name: "--radius-selection", sample: radiusSample(28) },
  { name: "--radius-dialog", sample: radiusSample(28) },
  { name: "--radius-select", sample: radiusSample(28) },
  { name: "--spacing-button-height-sm", sample: spacingSample() },
  { name: "--spacing-button-height-md", sample: spacingSample() },
  { name: "--spacing-button-height-lg", sample: spacingSample() },
  { name: "--spacing-button-padding-x", sample: spacingSample() },
  { name: "--spacing-card-padding", sample: spacingSample() },
  { name: "--spacing-input-height", sample: spacingSample() },
  { name: "--spacing-input-padding-x", sample: spacingSample() },
  { name: "--spacing-toggle-width", sample: spacingSample() },
  { name: "--spacing-toggle-height", sample: spacingSample() },
  { name: "--spacing-toggle-knob-size", sample: spacingSample() },
  { name: "--spacing-select-height", sample: spacingSample() },
  { name: "--spacing-selection-height", sample: spacingSample() },
  { name: "--spacing-badge-padding-x", sample: spacingSample(4) },
  { name: "--spacing-badge-padding-y", sample: spacingSample(4) },
  { name: "--spacing-chip-height-sm", sample: spacingSample() },
  { name: "--spacing-chip-height-md", sample: spacingSample() },
  { name: "--spacing-chip-height-lg", sample: spacingSample() },
  { name: "--spacing-chip-padding-x", sample: spacingSample() },
  { name: "--spacing-dialog-padding", sample: spacingSample() },
  { name: "--spacing-sidebar-width", sample: spacingSample() },
  { name: "--font-size-button-sm", sample: fontSample },
  { name: "--font-size-button-md", sample: fontSample },
  { name: "--font-size-button-lg", sample: fontSample },
  { name: "--font-size-card-title", sample: fontSample },
  { name: "--font-size-card-desc", sample: fontSample },
  { name: "--font-size-input", sample: fontSample },
  { name: "--font-size-badge", sample: fontSample },
  { name: "--font-size-chip", sample: fontSample },
  { name: "--font-size-segment", sample: fontSample },
  { name: "--font-size-selection", sample: fontSample },
  { name: "--font-size-dialog-title", sample: fontSample },
  { name: "--font-size-dialog-desc", sample: fontSample },
  { name: "--font-size-select", sample: fontSample },
  { name: "--font-size-label-comp", sample: fontSample },
  { name: "--font-weight-button", sample: weightSample },
  { name: "--font-weight-card-title", sample: weightSample },
  { name: "--font-weight-badge", sample: weightSample },
  { name: "--font-weight-chip", sample: weightSample },
  { name: "--font-weight-segment", sample: weightSample },
  { name: "--font-weight-selection", sample: weightSample },
  { name: "--font-weight-dialog-title", sample: weightSample },
  { name: "--font-weight-label-comp", sample: weightSample },
];

export const ComponentTokens: Story = {
  render: () => (
    <Page>
      <TokenGroup
        title="Component Tokens"
        description="Layer 3 — the only tokens UI components access. Grouped by component."
      >
        <TokenGroup title="Button">
          <ColorSwatches tokens={BUTTON_COLORS} />
        </TokenGroup>
        <TokenGroup title="Input & Select">
          <ColorSwatches tokens={INPUT_COLORS} />
        </TokenGroup>
        <TokenGroup title="Badge">
          <ColorSwatches tokens={BADGE_COLORS} />
        </TokenGroup>
        <TokenGroup title="Chip / Segment / Selection">
          <ColorSwatches tokens={INTERACTION_COLORS} />
        </TokenGroup>
        <TokenGroup title="Card, Toggle, Skeleton, Dialog, Sidebar, Label">
          <ColorSwatches tokens={CHROME_COLORS} />
        </TokenGroup>
        <TokenGroup
          title="Component metrics"
          description="Radii, spacings, font sizes and weights per component."
        >
          <TokenTable rows={COMPONENT_METRICS} />
        </TokenGroup>
      </TokenGroup>
    </Page>
  ),
};
