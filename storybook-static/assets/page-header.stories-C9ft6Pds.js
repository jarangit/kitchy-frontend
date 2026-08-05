import{h as I,j as e}from"./iframe-Cl5EGQEc.js";import{t as M,u as O,L as D}from"./index-DWqi9ZMy.js";import{B as l}from"./button-Cezf315a.js";import{u as U}from"./use-translation-NpqNXtWk.js";import{c as x}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";import"./spinner-2pChG3r9.js";function r({backTo:a,backLabel:m,title:c,subtitle:p,action:u,children:W,className:H,sticky:g=!1}){const h=I(),{t:_}=U(),E=()=>{a===!0?h(-1):typeof a=="string"&&h(a)};return e.jsx("header",{className:x(g&&"sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur-xl",H),children:e.jsxs("div",{className:x("space-y-3",g&&"px-4 py-3 sm:px-5"),children:[a!==void 0&&e.jsxs(l,{variant:"ghost",size:"sm",onClick:E,children:[e.jsx(M,{size:16}),e.jsx("span",{children:m??_("common.back")})]}),e.jsxs("div",{className:"flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",children:[e.jsxs("div",{className:"min-w-0 flex-1 space-y-1",children:[e.jsx("h1",{className:"text-heading font-semibold text-text-primary tracking-tight",children:c}),p&&e.jsx("p",{className:"text-label text-text-tertiary",children:p})]}),u&&e.jsx("div",{className:"min-w-0 lg:shrink-0",children:u})]}),W]})})}r.__docgenInfo={description:"Shared page header for operational screens.\nCalm, editorial anatomy: optional back → title (heading) → subtitle (quieter).\nTrailing `action` slot for CTAs; optional `children` row for tabs/filters.",methods:[],displayName:"PageHeader",props:{backTo:{required:!1,tsType:{name:"union",raw:"string | true",elements:[{name:"string"},{name:"literal",value:"true"}]},description:"Route path to navigate on back. When provided, a back button is rendered.\nUse `true` to navigate -1 in history."},backLabel:{required:!1,tsType:{name:"ReactNode"},description:'Optional custom label for the back button. Defaults to localized "Back".'},title:{required:!0,tsType:{name:"ReactNode"},description:""},subtitle:{required:!1,tsType:{name:"ReactNode"},description:""},action:{required:!1,tsType:{name:"ReactNode"},description:"Right-aligned trailing content (buttons, filters, etc.)"},children:{required:!1,tsType:{name:"ReactNode"},description:"Extra content below the title row (e.g. tabs, stat strip)."},className:{required:!1,tsType:{name:"string"},description:""},sticky:{required:!1,tsType:{name:"boolean"},description:"Render as a sticky app-chrome header with backdrop blur.",defaultValue:{value:"false",computed:!1}}}};const Y={title:"UI/PageHeader",component:r,parameters:{layout:"padded"},args:{title:"Store dashboard"}},s={},t={args:{title:"Products",subtitle:"Manage your menu items and pricing"}},n={args:{title:"Products",subtitle:"Manage your menu items and pricing"},render:a=>e.jsx(r,{...a,action:e.jsxs("div",{className:"flex gap-2",children:[e.jsxs(l,{variant:"secondary",size:"sm",children:[e.jsx(O,{size:16}),"Export"]}),e.jsxs(l,{size:"sm",children:[e.jsx(D,{size:16}),"Add product"]})]})})},i={args:{title:"Product details",subtitle:"Iced Caffè Latte"},render:a=>e.jsx(r,{...a,backTo:"/"})},o={args:{title:"Orders"},render:a=>e.jsx(r,{...a,children:e.jsxs("div",{className:"flex gap-3 text-body-sm text-text-secondary",children:[e.jsx("span",{children:"All"}),e.jsx("span",{children:"Pending"}),e.jsx("span",{children:"Completed"})]})})},d={args:{title:"Transactions",subtitle:"Scrollable page with sticky header"},render:a=>e.jsxs("div",{className:"max-h-64 overflow-y-auto rounded-card border border-border",children:[e.jsx(r,{...a,sticky:!0}),e.jsx("div",{className:"space-y-3 p-4",children:Array.from({length:12}).map((m,c)=>e.jsx("div",{className:"h-10 rounded-md bg-surface-muted"},c))})]})};var b,f,y;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:"{}",...(y=(f=s.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var v,j,N;t.parameters={...t.parameters,docs:{...(v=t.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    title: "Products",
    subtitle: "Manage your menu items and pricing"
  }
}`,...(N=(j=t.parameters)==null?void 0:j.docs)==null?void 0:N.source}}};var k,P,w;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    title: "Products",
    subtitle: "Manage your menu items and pricing"
  },
  render: args => <PageHeader {...args} action={<div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <LuDownload size={16} />
            Export
          </Button>
          <Button size="sm">
            <LuPlus size={16} />
            Add product
          </Button>
        </div>} />
}`,...(w=(P=n.parameters)==null?void 0:P.docs)==null?void 0:w.source}}};var S,T,z;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    title: "Product details",
    subtitle: "Iced Caffè Latte"
  },
  render: args => <PageHeader {...args} backTo="/" />
}`,...(z=(T=i.parameters)==null?void 0:T.docs)==null?void 0:z.source}}};var B,A,L;o.parameters={...o.parameters,docs:{...(B=o.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    title: "Orders"
  },
  render: args => <PageHeader {...args} children={<div className="flex gap-3 text-body-sm text-text-secondary">
          <span>All</span>
          <span>Pending</span>
          <span>Completed</span>
        </div>} />
}`,...(L=(A=o.parameters)==null?void 0:A.docs)==null?void 0:L.source}}};var q,C,R;d.parameters={...d.parameters,docs:{...(q=d.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    title: "Transactions",
    subtitle: "Scrollable page with sticky header"
  },
  render: args => <div className="max-h-64 overflow-y-auto rounded-card border border-border">
      <PageHeader {...args} sticky />
      <div className="space-y-3 p-4">
        {Array.from({
        length: 12
      }).map((_, i) => <div key={i} className="h-10 rounded-md bg-surface-muted" />)}
      </div>
    </div>
}`,...(R=(C=d.parameters)==null?void 0:C.docs)==null?void 0:R.source}}};const Z=["Basic","WithSubtitle","WithAction","WithBack","WithChildren","Sticky"];export{s as Basic,d as Sticky,n as WithAction,i as WithBack,o as WithChildren,t as WithSubtitle,Z as __namedExportsOrder,Y as default};
