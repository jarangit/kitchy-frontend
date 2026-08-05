import{j as e}from"./iframe-Cl5EGQEc.js";import{B as F,C as D}from"./index-DWqi9ZMy.js";import{I as z}from"./icon-tile-8g4SUeSS.js";import{C as g}from"./card-Z8DvZem5.js";import{c as h}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";const E={default:"text-text-primary",success:"text-success",warning:"text-warning",danger:"text-danger",info:"text-info"};function c({label:a,value:U,hint:d,trailing:u,tone:_="default",className:B,onClick:l}){const p=e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"min-w-0 flex-1 space-y-0.5",children:[e.jsx("p",{className:"text-caption text-text-tertiary",children:a}),e.jsx("p",{className:h("text-title font-semibold tabular-nums",E[_]),children:U}),d&&e.jsx("p",{className:"text-caption text-text-tertiary",children:d})]}),u&&e.jsx("div",{className:"shrink-0",children:u})]}),m=h("flex w-full items-center gap-3 px-4 py-3 text-left","transition-colors duration-[var(--motion-fast)]",l&&"cursor-pointer hover:bg-card-bg-hover",B);return l?e.jsx(g,{as:"button",type:"button",onClick:l,padding:"none",className:m,children:p}):e.jsx(g,{padding:"none",className:m,children:p})}c.__docgenInfo={description:`Compact metric tile for dashboards, list headers, and reports.
Uses component tokens; keep content minimal (label + number + optional hint).`,methods:[],displayName:"StatCard",props:{label:{required:!0,tsType:{name:"ReactNode"},description:""},value:{required:!0,tsType:{name:"ReactNode"},description:""},hint:{required:!1,tsType:{name:"ReactNode"},description:"Optional small hint below the value (e.g. comparison, unit)."},trailing:{required:!1,tsType:{name:"ReactNode"},description:"Optional trailing visual (icon tile, sparkline)."},tone:{required:!1,tsType:{name:"union",raw:'"default" | "success" | "warning" | "danger" | "info"',elements:[{name:"literal",value:'"default"'},{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"danger"'},{name:"literal",value:'"info"'}]},description:"Accent the value color (for status-flavored stats).",defaultValue:{value:'"default"',computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const M={title:"UI/StatCard",component:c,parameters:{layout:"centered"},args:{label:"Today's revenue",value:"฿12,480"},argTypes:{tone:{control:"select",options:["default","success","warning","danger","info"]}}},r={},t={args:{hint:"+12.5% vs yesterday"}},s={args:{hint:"+12.5% vs yesterday"},render:a=>e.jsx(c,{...a,trailing:e.jsx(z,{tone:"success",children:e.jsx(F,{size:20})})})},n={args:{label:"Orders completed",value:"342",tone:"success",hint:"This month"}},o={args:{label:"Failed payments",value:"4",tone:"danger",hint:"Last 7 days"}},i={args:{hint:"Tap to view report",onClick:()=>{}},render:a=>e.jsx(c,{...a,trailing:e.jsx(z,{tone:"neutral",children:e.jsx(D,{size:20})})})};var f,x,v;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:"{}",...(v=(x=r.parameters)==null?void 0:x.docs)==null?void 0:v.source}}};var y,T,b;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    hint: "+12.5% vs yesterday"
  }
}`,...(b=(T=t.parameters)==null?void 0:T.docs)==null?void 0:b.source}}};var j,N,C;s.parameters={...s.parameters,docs:{...(j=s.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    hint: "+12.5% vs yesterday"
  },
  render: args => <StatCard {...args} trailing={<IconTile tone="success">
          <LuTrendingUp size={20} />
        </IconTile>} />
}`,...(C=(N=s.parameters)==null?void 0:N.docs)==null?void 0:C.source}}};var S,w,I;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    label: "Orders completed",
    value: "342",
    tone: "success",
    hint: "This month"
  }
}`,...(I=(w=n.parameters)==null?void 0:w.docs)==null?void 0:I.source}}};var k,q,L;o.parameters={...o.parameters,docs:{...(k=o.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: "Failed payments",
    value: "4",
    tone: "danger",
    hint: "Last 7 days"
  }
}`,...(L=(q=o.parameters)==null?void 0:q.docs)==null?void 0:L.source}}};var W,O,R;i.parameters={...i.parameters,docs:{...(W=i.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    hint: "Tap to view report",
    onClick: () => {}
  },
  render: args => <StatCard {...args} trailing={<IconTile tone="neutral">
          <LuWallet size={20} />
        </IconTile>} />
}`,...(R=(O=i.parameters)==null?void 0:O.docs)==null?void 0:R.source}}};const P=["Basic","WithHint","WithTrailingIcon","SuccessTone","DangerTone","Clickable"];export{r as Basic,i as Clickable,o as DangerTone,n as SuccessTone,t as WithHint,s as WithTrailingIcon,P as __namedExportsOrder,M as default};
