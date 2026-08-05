import{j as e,r as f}from"./iframe-Cl5EGQEc.js";import"./preload-helper-Dp1pzeXC.js";function ee(){const[t,s]=f.useState(0);return f.useEffect(()=>{const l=new MutationObserver(()=>s(o=>o+1));return l.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),()=>l.disconnect()},[]),t}function H(t){ee();const s=getComputedStyle(document.documentElement),l={};for(const o of t)l[o]=s.getPropertyValue(o).trim();return l}function n({title:t,description:s,children:l}){return e.jsxs("section",{className:"space-y-3",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-title text-text-primary",children:t}),s?e.jsx("p",{className:"text-body-sm text-text-secondary",children:s}):null]}),l]})}function $(t){return t.replace(/^--/,"")}function i({tokens:t}){const s=t.map(o=>o.name),l=H(s);return e.jsx("div",{className:"grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",children:t.map(o=>e.jsxs("div",{className:"overflow-hidden rounded-lg border border-border bg-surface",children:[e.jsx("div",{className:"h-16 w-full border-b border-border",style:{backgroundColor:`var(${o.name})`}}),e.jsxs("div",{className:"space-y-0.5 p-2.5",children:[e.jsx("p",{className:"text-label text-text-primary",children:o.label??$(o.name)}),e.jsx("p",{className:"font-mono text-xs text-text-tertiary",children:o.name}),e.jsx("p",{className:"font-mono text-xs text-text-secondary",children:l[o.name]})]})]},o.name))})}function c({rows:t}){const s=t.map(o=>o.name),l=H(s);return e.jsx("div",{className:"overflow-hidden rounded-lg border border-border bg-surface",children:t.map(o=>e.jsxs("div",{className:"flex items-center gap-4 border-b border-border px-3.5 py-2 last:border-b-0",children:[e.jsx("div",{className:"flex w-28 shrink-0 items-center justify-center",children:o.sample(l[o.name])}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx("p",{className:"truncate text-label text-text-primary",children:o.label??$(o.name)}),e.jsx("p",{className:"truncate font-mono text-xs text-text-tertiary",children:o.name})]}),e.jsx("p",{className:"shrink-0 font-mono text-xs text-text-secondary",children:l[o.name]})]},o.name))})}function Y({items:t}){return e.jsx("div",{className:"space-y-2",children:t.map(s=>e.jsxs("div",{className:"rounded-lg border border-border bg-surface px-4 py-3",children:[e.jsx("p",{className:`${s.className} text-text-primary`,children:"The quick brown fox jumps over the lazy dog"}),e.jsx("p",{className:"mt-1 font-mono text-xs text-text-tertiary",children:s.name})]},s.name))})}const a=(t=8)=>s=>e.jsx("span",{className:"inline-block rounded-full bg-accent",style:{width:s,height:t,minWidth:2}}),m=(t=32)=>s=>e.jsx("span",{className:"inline-block border border-border bg-surface-muted",style:{width:t,height:t,borderRadius:s}}),X=t=>e.jsx("span",{className:"inline-block h-9 w-16 rounded-md bg-surface",style:{boxShadow:t}}),Z=t=>e.jsx("span",{className:"inline-block h-3.5 w-3.5 animate-pulse rounded-full bg-accent",style:{animationDuration:t}}),r=t=>e.jsx("span",{className:"leading-none text-text-primary",style:{fontSize:t},children:"Ag"}),d=t=>e.jsx("span",{className:"text-base text-text-primary",style:{fontWeight:t},children:"Ag"}),J=t=>e.jsx("span",{className:"inline-block w-32 text-body-sm text-text-primary",style:{lineHeight:t},children:"The quick brown fox jumps over the lazy dog"}),Q=t=>e.jsx("span",{className:"text-body-sm text-text-primary",style:{letterSpacing:t},children:"Tracking"}),k=t=>e.jsx("span",{className:"text-body-sm text-text-primary",style:{fontFamily:t},children:"Ag"});n.__docgenInfo={description:"",methods:[],displayName:"TokenGroup",props:{title:{required:!0,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};i.__docgenInfo={description:"",methods:[],displayName:"ColorSwatches",props:{tokens:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ name: string; label?: string }",signature:{properties:[{key:"name",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!1}}]}}],raw:"Token[]"},description:""}}};c.__docgenInfo={description:"",methods:[],displayName:"TokenTable",props:{rows:{required:!0,tsType:{name:"Array",elements:[{name:"intersection",raw:`Token & {
  sample: (value: string) => ReactNode;
}`,elements:[{name:"signature",type:"object",raw:"{ name: string; label?: string }",signature:{properties:[{key:"name",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!1}}]}},{name:"signature",type:"object",raw:`{
  sample: (value: string) => ReactNode;
}`,signature:{properties:[{key:"sample",value:{name:"signature",type:"function",raw:"(value: string) => ReactNode",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"ReactNode"}},required:!0}}]}}]}],raw:"TokenRow[]"},description:""}}};Y.__docgenInfo={description:"",methods:[],displayName:"CompositeTypeScale",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ className: string; name: string }",signature:{properties:[{key:"className",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}}]}}],raw:"{ className: string; name: string }[]"},description:""}}};X.__docgenInfo={description:"",methods:[],displayName:"shadowSample"};Z.__docgenInfo={description:"",methods:[],displayName:"motionSample"};r.__docgenInfo={description:"",methods:[],displayName:"fontSample"};d.__docgenInfo={description:"",methods:[],displayName:"weightSample"};J.__docgenInfo={description:"",methods:[],displayName:"leadingSample"};Q.__docgenInfo={description:"",methods:[],displayName:"trackingSample"};k.__docgenInfo={description:"",methods:[],displayName:"familySample"};const ve={title:"Design Tokens",parameters:{layout:"fullscreen"}};function p({children:t}){return e.jsx("div",{className:"min-h-screen bg-bg px-5 py-6 sm:px-6",children:e.jsx("div",{className:"mx-auto max-w-5xl space-y-8",children:t})})}const te=["--gray-0","--gray-50","--gray-100","--gray-200","--gray-300","--gray-400","--gray-500","--gray-600","--gray-700","--gray-800","--gray-900"].map(t=>({name:t})),ne=[...["50","100","500","600","700"].map(t=>({name:`--green-${t}`})),...["50","100","500","600","700"].map(t=>({name:`--red-${t}`})),...["50","100","500","600","700"].map(t=>({name:`--yellow-${t}`})),...["50","100","500","600","700"].map(t=>({name:`--blue-${t}`}))],oe=[{name:"--color-bg",label:"Page background"},{name:"--color-surface",label:"Surface"},{name:"--color-surface-hover",label:"Surface hover"},{name:"--color-surface-muted",label:"Surface muted"},{name:"--color-surface-muted-hover",label:"Surface muted hover"},{name:"--color-overlay",label:"Overlay"}],ae=[{name:"--color-text-primary",label:"Text primary"},{name:"--color-text-secondary",label:"Text secondary"},{name:"--color-text-tertiary",label:"Text tertiary"},{name:"--color-text-inverse",label:"Text inverse"}],se=[{name:"--color-border",label:"Border"},{name:"--color-border-hover",label:"Border hover"}],re=[{name:"--color-primary",label:"Primary"},{name:"--color-primary-hover",label:"Primary hover"},{name:"--color-primary-bg",label:"Primary bg"}],ie=[{name:"--color-accent",label:"Accent"},{name:"--color-accent-hover",label:"Accent hover"},{name:"--color-accent-bg",label:"Accent bg"},{name:"--color-accent-border",label:"Accent border"},{name:"--color-accent-text",label:"Accent text"}],le=[{name:"--color-success",label:"Success"},{name:"--color-success-bg",label:"Success bg"},{name:"--color-danger",label:"Danger"},{name:"--color-danger-hover",label:"Danger hover"},{name:"--color-danger-bg",label:"Danger bg"},{name:"--color-warning",label:"Warning"},{name:"--color-warning-bg",label:"Warning bg"},{name:"--color-info",label:"Info"},{name:"--color-info-bg",label:"Info bg"},{name:"--color-bumped",label:"Bumped"},{name:"--color-bumped-bg",label:"Bumped bg"}],g={render:()=>e.jsx(p,{children:e.jsxs(n,{title:"Primitive Colors",description:"Layer 1 — raw values. Never used directly in components.",children:[e.jsx(n,{title:"Gray scale",description:"Apple Newsroom warm gray palette.",children:e.jsx(i,{tokens:te})}),e.jsx(n,{title:"Status primitives",description:"Green, red, yellow, blue — base hues for status colors.",children:e.jsx(i,{tokens:ne})})]})})},u={render:()=>e.jsx(p,{children:e.jsxs(n,{title:"Semantic Colors",description:"Layer 2 — meaning-based tokens mapped from primitives. Toggle the theme toolbar to see dark mode.",children:[e.jsx(n,{title:"Surfaces",children:e.jsx(i,{tokens:oe})}),e.jsx(n,{title:"Text",children:e.jsx(i,{tokens:ae})}),e.jsx(n,{title:"Borders",children:e.jsx(i,{tokens:se})}),e.jsx(n,{title:"Action",children:e.jsx(i,{tokens:re})}),e.jsx(n,{title:"Accent",children:e.jsx(i,{tokens:ie})}),e.jsx(n,{title:"Status",children:e.jsx(i,{tokens:le})})]})})},ce=[{name:"--font-sans",label:"Sans",sample:k},{name:"--font-mono",label:"Mono",sample:k}],me=["--size-xs","--size-sm","--size-base","--size-lg","--size-xl","--size-2xl","--size-3xl","--size-4xl","--size-5xl"].map(t=>({name:t,sample:r})),de=["--weight-regular","--weight-medium","--weight-semibold","--weight-bold"].map(t=>({name:t,sample:d})),pe=["--leading-tight","--leading-snug","--leading-normal","--leading-relaxed"].map(t=>({name:t,sample:J})),ge=["--tracking-tight","--tracking-normal","--tracking-wide"].map(t=>({name:t,sample:Q})),b={render:()=>e.jsx(p,{children:e.jsxs(n,{title:"Typography",description:"Font families, scales, and the composite text utilities.",children:[e.jsx(n,{title:"Font families",children:e.jsx(c,{rows:ce})}),e.jsx(n,{title:"Size scale",description:"Primitive type sizes used by semantic text styles.",children:e.jsx(c,{rows:me})}),e.jsx(n,{title:"Weights",children:e.jsx(c,{rows:de})}),e.jsx(n,{title:"Line heights",children:e.jsx(c,{rows:pe})}),e.jsx(n,{title:"Letter spacing",children:e.jsx(c,{rows:ge})}),e.jsx(n,{title:"Composite text styles",description:"Semantic utilities bundling size + weight + leading.",children:e.jsx(Y,{items:[{className:"text-display",name:"text-display"},{className:"text-heading",name:"text-heading"},{className:"text-title",name:"text-title"},{className:"text-subtitle",name:"text-subtitle"},{className:"text-body",name:"text-body"},{className:"text-body-sm",name:"text-body-sm"},{className:"text-label",name:"text-label"},{className:"text-caption",name:"text-caption"}]})})]})})},ue=["--space-1","--space-2","--space-3","--space-4","--space-5","--space-6","--space-7","--space-8","--space-9","--space-10","--space-11"].map(t=>({name:t,sample:a()})),x={render:()=>e.jsx(p,{children:e.jsx(n,{title:"Spacing",description:"Layer 1 — the 4px-based spacing scale.",children:e.jsx(c,{rows:ue})})})},be=["--radius-xs","--radius-sm","--radius-md","--radius-lg","--radius-xl","--radius-full"].map(t=>({name:t,sample:m()})),h={render:()=>e.jsx(p,{children:e.jsx(n,{title:"Radius",description:"Corner rounding scale. Component radii reference these.",children:e.jsx(c,{rows:be})})})},xe=["--shadow-xs","--shadow-sm","--shadow-md","--shadow-lg","--shadow-xl","--shadow-soft"].map(t=>({name:t,sample:X})),T={render:()=>e.jsx(p,{children:e.jsx(n,{title:"Shadows",description:"Very soft, Newsroom-inspired elevation. Darkens in dark mode.",children:e.jsx(c,{rows:xe})})})},he=["--motion-fast","--motion-normal","--motion-slow"].map(t=>({name:t,sample:Z})),y={render:()=>e.jsx(p,{children:e.jsxs(n,{title:"Motion",description:"Duration tokens for transitions and micro-interactions.",children:[e.jsx(c,{rows:he}),e.jsx(n,{title:"Easing",children:e.jsx(c,{rows:[{name:"--ease-standard",sample:t=>e.jsx("span",{className:"font-mono text-xs text-text-secondary",children:t})}]})})]})})},Te=["--color-button-primary-bg","--color-button-primary-bg-hover","--color-button-primary-text","--color-button-secondary-bg","--color-button-secondary-bg-hover","--color-button-secondary-text","--color-button-secondary-border","--color-button-danger-bg","--color-button-danger-bg-hover","--color-button-danger-text","--color-button-ghost-bg","--color-button-ghost-bg-hover","--color-button-ghost-text"].map(t=>({name:t})),ye=["--color-input-bg","--color-input-border","--color-input-border-hover","--color-input-border-focus","--color-input-text","--color-input-placeholder"].map(t=>({name:t})),Se=["--color-badge-default-bg","--color-badge-default-text","--color-badge-success-bg","--color-badge-success-text","--color-badge-warning-bg","--color-badge-warning-text","--color-badge-danger-bg","--color-badge-danger-text","--color-badge-info-bg","--color-badge-info-text","--color-badge-accent-bg","--color-badge-accent-text"].map(t=>({name:t})),ke=["--color-chip-active-bg","--color-chip-active-text","--color-chip-inactive-bg","--color-chip-inactive-bg-hover","--color-chip-inactive-text","--color-segment-bg","--color-segment-border","--color-segment-active-bg","--color-segment-active-text","--color-segment-inactive-text","--color-segment-inactive-text-hover","--color-selection-border","--color-selection-border-hover","--color-selection-text","--color-selection-active-border","--color-selection-active-bg","--color-selection-active-text"].map(t=>({name:t})),fe=["--color-card-bg","--color-card-bg-hover","--color-card-border","--color-card-border-hover","--color-toggle-bg","--color-toggle-bg-active","--color-toggle-knob","--color-skeleton-bg","--color-skeleton-shimmer","--color-dialog-bg","--color-dialog-border","--color-dialog-overlay","--color-on-accent","--color-label-comp-text","--color-sidebar-bg","--color-sidebar-border","--color-sidebar-active-bg","--color-sidebar-active-text","--color-sidebar-text","--color-sidebar-hover-bg","--color-select-bg","--color-select-border","--color-select-border-focus","--color-select-text"].map(t=>({name:t})),Ne=[{name:"--radius-button",sample:m(28)},{name:"--radius-card",sample:m(28)},{name:"--radius-input",sample:m(28)},{name:"--radius-badge",sample:m(28)},{name:"--radius-chip",sample:m(28)},{name:"--radius-segment",sample:m(28)},{name:"--radius-selection",sample:m(28)},{name:"--radius-dialog",sample:m(28)},{name:"--radius-select",sample:m(28)},{name:"--spacing-button-height-sm",sample:a()},{name:"--spacing-button-height-md",sample:a()},{name:"--spacing-button-height-lg",sample:a()},{name:"--spacing-button-padding-x",sample:a()},{name:"--spacing-card-padding",sample:a()},{name:"--spacing-input-height",sample:a()},{name:"--spacing-input-padding-x",sample:a()},{name:"--spacing-toggle-width",sample:a()},{name:"--spacing-toggle-height",sample:a()},{name:"--spacing-toggle-knob-size",sample:a()},{name:"--spacing-select-height",sample:a()},{name:"--spacing-selection-height",sample:a()},{name:"--spacing-badge-padding-x",sample:a(4)},{name:"--spacing-badge-padding-y",sample:a(4)},{name:"--spacing-chip-height-sm",sample:a()},{name:"--spacing-chip-height-md",sample:a()},{name:"--spacing-chip-height-lg",sample:a()},{name:"--spacing-chip-padding-x",sample:a()},{name:"--spacing-dialog-padding",sample:a()},{name:"--spacing-sidebar-width",sample:a()},{name:"--font-size-button-sm",sample:r},{name:"--font-size-button-md",sample:r},{name:"--font-size-button-lg",sample:r},{name:"--font-size-card-title",sample:r},{name:"--font-size-card-desc",sample:r},{name:"--font-size-input",sample:r},{name:"--font-size-badge",sample:r},{name:"--font-size-chip",sample:r},{name:"--font-size-segment",sample:r},{name:"--font-size-selection",sample:r},{name:"--font-size-dialog-title",sample:r},{name:"--font-size-dialog-desc",sample:r},{name:"--font-size-select",sample:r},{name:"--font-size-label-comp",sample:r},{name:"--font-weight-button",sample:d},{name:"--font-weight-card-title",sample:d},{name:"--font-weight-badge",sample:d},{name:"--font-weight-chip",sample:d},{name:"--font-weight-segment",sample:d},{name:"--font-weight-selection",sample:d},{name:"--font-weight-dialog-title",sample:d},{name:"--font-weight-label-comp",sample:d}],S={render:()=>e.jsx(p,{children:e.jsxs(n,{title:"Component Tokens",description:"Layer 3 — the only tokens UI components access. Grouped by component.",children:[e.jsx(n,{title:"Button",children:e.jsx(i,{tokens:Te})}),e.jsx(n,{title:"Input & Select",children:e.jsx(i,{tokens:ye})}),e.jsx(n,{title:"Badge",children:e.jsx(i,{tokens:Se})}),e.jsx(n,{title:"Chip / Segment / Selection",children:e.jsx(i,{tokens:ke})}),e.jsx(n,{title:"Card, Toggle, Skeleton, Dialog, Sidebar, Label",children:e.jsx(i,{tokens:fe})}),e.jsx(n,{title:"Component metrics",description:"Radii, spacings, font sizes and weights per component.",children:e.jsx(c,{rows:Ne})})]})})};var N,j,w;g.parameters={...g.parameters,docs:{...(N=g.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <Page>
      <TokenGroup title="Primitive Colors" description="Layer 1 — raw values. Never used directly in components.">
        <TokenGroup title="Gray scale" description="Apple Newsroom warm gray palette.">
          <ColorSwatches tokens={GRAY_SCALE} />
        </TokenGroup>
        <TokenGroup title="Status primitives" description="Green, red, yellow, blue — base hues for status colors.">
          <ColorSwatches tokens={STATUS_PRIMITIVES} />
        </TokenGroup>
      </TokenGroup>
    </Page>
}`,...(w=(j=g.parameters)==null?void 0:j.docs)==null?void 0:w.source}}};var v,G,C;u.parameters={...u.parameters,docs:{...(v=u.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <Page>
      <TokenGroup title="Semantic Colors" description="Layer 2 — meaning-based tokens mapped from primitives. Toggle the theme toolbar to see dark mode.">
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
}`,...(C=(G=u.parameters)==null?void 0:G.docs)==null?void 0:C.source}}};var O,_,R;b.parameters={...b.parameters,docs:{...(O=b.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <Page>
      <TokenGroup title="Typography" description="Font families, scales, and the composite text utilities.">
        <TokenGroup title="Font families">
          <TokenTable rows={FAMILY_ROWS} />
        </TokenGroup>
        <TokenGroup title="Size scale" description="Primitive type sizes used by semantic text styles.">
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
        <TokenGroup title="Composite text styles" description="Semantic utilities bundling size + weight + leading.">
          <CompositeTypeScale items={[{
          className: "text-display",
          name: "text-display"
        }, {
          className: "text-heading",
          name: "text-heading"
        }, {
          className: "text-title",
          name: "text-title"
        }, {
          className: "text-subtitle",
          name: "text-subtitle"
        }, {
          className: "text-body",
          name: "text-body"
        }, {
          className: "text-body-sm",
          name: "text-body-sm"
        }, {
          className: "text-label",
          name: "text-label"
        }, {
          className: "text-caption",
          name: "text-caption"
        }]} />
        </TokenGroup>
      </TokenGroup>
    </Page>
}`,...(R=(_=b.parameters)==null?void 0:_.docs)==null?void 0:R.source}}};var I,E,A;x.parameters={...x.parameters,docs:{...(I=x.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <Page>
      <TokenGroup title="Spacing" description="Layer 1 — the 4px-based spacing scale.">
        <TokenTable rows={SPACING_ROWS} />
      </TokenGroup>
    </Page>
}`,...(A=(E=x.parameters)==null?void 0:E.docs)==null?void 0:A.source}}};var P,z,L;h.parameters={...h.parameters,docs:{...(P=h.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <Page>
      <TokenGroup title="Radius" description="Corner rounding scale. Component radii reference these.">
        <TokenTable rows={RADIUS_ROWS} />
      </TokenGroup>
    </Page>
}`,...(L=(z=h.parameters)==null?void 0:z.docs)==null?void 0:L.source}}};var W,D,M;T.parameters={...T.parameters,docs:{...(W=T.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <Page>
      <TokenGroup title="Shadows" description="Very soft, Newsroom-inspired elevation. Darkens in dark mode.">
        <TokenTable rows={SHADOW_ROWS} />
      </TokenGroup>
    </Page>
}`,...(M=(D=T.parameters)==null?void 0:D.docs)==null?void 0:M.source}}};var B,q,K;y.parameters={...y.parameters,docs:{...(B=y.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <Page>
      <TokenGroup title="Motion" description="Duration tokens for transitions and micro-interactions.">
        <TokenTable rows={MOTION_ROWS} />
        <TokenGroup title="Easing">
          <TokenTable rows={[{
          name: "--ease-standard",
          sample: value => <span className="font-mono text-xs text-text-secondary">{value}</span>
        }]} />
        </TokenGroup>
      </TokenGroup>
    </Page>
}`,...(K=(q=y.parameters)==null?void 0:q.docs)==null?void 0:K.source}}};var U,F,V;S.parameters={...S.parameters,docs:{...(U=S.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <Page>
      <TokenGroup title="Component Tokens" description="Layer 3 — the only tokens UI components access. Grouped by component.">
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
        <TokenGroup title="Component metrics" description="Radii, spacings, font sizes and weights per component.">
          <TokenTable rows={COMPONENT_METRICS} />
        </TokenGroup>
      </TokenGroup>
    </Page>
}`,...(V=(F=S.parameters)==null?void 0:F.docs)==null?void 0:V.source}}};const Ge=["PrimitiveColors","SemanticColors","Typography","Spacing","Radius","Shadows","Motion","ComponentTokens"];export{S as ComponentTokens,y as Motion,g as PrimitiveColors,h as Radius,u as SemanticColors,T as Shadows,x as Spacing,b as Typography,Ge as __namedExportsOrder,ve as default};
