import{j as e}from"./iframe-Cl5EGQEc.js";import{c as T}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";const D={default:"border border-border bg-surface-muted",interactive:"border border-border bg-surface-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted-hover",dashed:"border border-dashed border-border bg-surface-muted text-text-secondary transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted-hover hover:text-text-primary"},N={md:"px-4 py-3",sm:"p-3",lg:"px-4 py-8",none:"p-0"};function a({as:x,variant:y="default",padding:b="md",className:I,children:P,...S}){const j=x??"div";return e.jsx(j,{className:T("rounded-md",D[y],N[b],I),...S,children:P})}a.__docgenInfo={description:"",methods:[],displayName:"InsetPanel",props:{as:{required:!1,tsType:{name:"T"},description:""},variant:{required:!1,tsType:{name:"union",raw:'"default" | "interactive" | "dashed"',elements:[{name:"literal",value:'"default"'},{name:"literal",value:'"interactive"'},{name:"literal",value:'"dashed"'}]},description:"",defaultValue:{value:'"default"',computed:!1}},padding:{required:!1,tsType:{name:"union",raw:'"md" | "sm" | "lg" | "none"',elements:[{name:"literal",value:'"md"'},{name:"literal",value:'"sm"'},{name:"literal",value:'"lg"'},{name:"literal",value:'"none"'}]},description:"",defaultValue:{value:'"md"',computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const _={title:"UI/InsetPanel",component:a,parameters:{layout:"padded"},args:{children:"Inset panel content"},argTypes:{variant:{control:"select",options:["default","interactive","dashed"]},padding:{control:"select",options:["md","sm","lg","none"]}}},r={},n={args:{variant:"interactive",children:"Hover me"}},s={args:{variant:"dashed",children:"Drop files here"}},t={render:()=>e.jsxs("div",{className:"max-w-md space-y-3",children:[e.jsx(a,{padding:"sm",children:"Small padding"}),e.jsx(a,{padding:"md",children:"Medium padding"}),e.jsx(a,{padding:"lg",children:"Large padding"})]})};var d,o,i;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:"{}",...(i=(o=r.parameters)==null?void 0:o.docs)==null?void 0:i.source}}};var l,c,m;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    variant: "interactive",
    children: "Hover me"
  }
}`,...(m=(c=n.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var p,u,g;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    variant: "dashed",
    children: "Drop files here"
  }
}`,...(g=(u=s.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var v,f,h;t.parameters={...t.parameters,docs:{...(v=t.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="max-w-md space-y-3">
      <InsetPanel padding="sm">Small padding</InsetPanel>
      <InsetPanel padding="md">Medium padding</InsetPanel>
      <InsetPanel padding="lg">Large padding</InsetPanel>
    </div>
}`,...(h=(f=t.parameters)==null?void 0:f.docs)==null?void 0:h.source}}};const E=["Default","Interactive","Dashed","PaddingVariants"];export{s as Dashed,r as Default,n as Interactive,t as PaddingVariants,E as __namedExportsOrder,_ as default};
