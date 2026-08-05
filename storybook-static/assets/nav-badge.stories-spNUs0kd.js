import{r as c,j as r}from"./iframe-Cl5EGQEc.js";import{s as l}from"./index-DWqi9ZMy.js";import{c as D}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";const a=({count:e,max:m=99,pulseOnIncrease:d=!0,className:T,...S})=>{const[w,p]=c.useState(!1),o=c.useRef(e);if(c.useEffect(()=>{if(d){if(e>o.current){p(!0);const L=setTimeout(()=>p(!1),1200);return o.current=e,()=>clearTimeout(L)}o.current=e}},[e,d]),e<=0)return null;const q=e>m?`${m}+`:String(e);return r.jsx("span",{"aria-label":S["aria-label"]??`${e}`,className:D("pointer-events-none absolute right-0.5 top-0.5 z-10 flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-danger px-1.5 text-caption font-semibold leading-none text-text-inverse ring-2 ring-sidebar-bg",w&&"animate-pulse",T),children:q})};a.__docgenInfo={description:"Facebook-style notification badge: a small red pill with a number,\ndesigned to sit at the top-right corner of a nav icon.\n\nThe parent element must have `position: relative` for correct placement.\nRenders nothing when `count <= 0`.",methods:[],displayName:"NavBadge",props:{count:{required:!0,tsType:{name:"number"},description:""},max:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"99",computed:!1}},pulseOnIncrease:{required:!1,tsType:{name:"boolean"},description:"When true, the badge briefly pulses whenever `count` increases.\nUseful for drawing attention to new incoming activity.",defaultValue:{value:"true",computed:!1}},"aria-label":{required:!1,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const I={title:"UI/NavBadge",component:a,parameters:{layout:"centered"},args:{count:3},argTypes:{count:{control:"number"},max:{control:"number"}}},s={args:{count:1},render:e=>r.jsxs("div",{className:"relative inline-flex p-2",children:[r.jsx(l,{size:28,className:"text-text-primary"}),r.jsx(a,{...e})]})},t={args:{count:24},render:e=>r.jsxs("div",{className:"relative inline-flex p-2",children:[r.jsx(l,{size:28,className:"text-text-primary"}),r.jsx(a,{...e})]})},n={args:{count:145,max:99},render:e=>r.jsxs("div",{className:"relative inline-flex p-2",children:[r.jsx(l,{size:28,className:"text-text-primary"}),r.jsx(a,{...e})]})},i={args:{count:0},render:e=>r.jsxs("div",{className:"relative inline-flex p-2",children:[r.jsx(l,{size:28,className:"text-text-primary"}),r.jsx(a,{...e})]})};var u,g,x;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    count: 1
  },
  render: args => <div className="relative inline-flex p-2">
      <LuBell size={28} className="text-text-primary" />
      <NavBadge {...args} />
    </div>
}`,...(x=(g=s.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var f,v,N;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    count: 24
  },
  render: args => <div className="relative inline-flex p-2">
      <LuBell size={28} className="text-text-primary" />
      <NavBadge {...args} />
    </div>
}`,...(N=(v=t.parameters)==null?void 0:v.docs)==null?void 0:N.source}}};var b,y,h;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    count: 145,
    max: 99
  },
  render: args => <div className="relative inline-flex p-2">
      <LuBell size={28} className="text-text-primary" />
      <NavBadge {...args} />
    </div>
}`,...(h=(y=n.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};var j,B,z;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    count: 0
  },
  render: args => <div className="relative inline-flex p-2">
      <LuBell size={28} className="text-text-primary" />
      <NavBadge {...args} />
    </div>
}`,...(z=(B=i.parameters)==null?void 0:B.docs)==null?void 0:z.source}}};const U=["Single","DoubleDigit","Capped","Zero"];export{n as Capped,t as DoubleDigit,s as Single,i as Zero,U as __namedExportsOrder,I as default};
