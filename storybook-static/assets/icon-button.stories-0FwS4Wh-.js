import{j as s}from"./iframe-Cl5EGQEc.js";import{q as B,r as z,a as y}from"./index-DWqi9ZMy.js";import{c as L}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";const w={sm:"h-9 w-9",md:"h-button-height-sm w-button-height-sm",lg:"h-button-height-md w-button-height-md"};function r({size:e="md",className:v,type:I="button",children:S,...j}){return s.jsx("button",{type:I,className:L("inline-flex items-center justify-center rounded-full","text-text-secondary transition-colors duration-[var(--motion-fast)]","hover:bg-surface-hover hover:text-text-primary","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg","disabled:cursor-not-allowed disabled:opacity-50",w[e],v),...j,children:S})}r.__docgenInfo={description:"",methods:[],displayName:"IconButton",props:{size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"",defaultValue:{value:'"md"',computed:!1}},type:{defaultValue:{value:'"button"',computed:!1},required:!1}},composes:["ButtonHTMLAttributes"]};const D={title:"UI/IconButton",component:r,parameters:{layout:"centered"},args:{"aria-label":"Settings"},argTypes:{size:{control:"select",options:["sm","md","lg"]}}},t={args:{size:"sm"},render:e=>s.jsx(r,{...e,children:s.jsx(B,{size:16})})},n={args:{size:"md"},render:e=>s.jsx(r,{...e,children:s.jsx(z,{size:18})})},a={args:{size:"lg"},render:e=>s.jsx(r,{...e,children:s.jsx(y,{size:20})})},o={args:{disabled:!0},render:e=>s.jsx(r,{...e,children:s.jsx(z,{size:18})})};var i,c,u;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    size: "sm"
  },
  render: args => <IconButton {...args}>
      <LuSearch size={16} />
    </IconButton>
}`,...(u=(c=t.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var l,d,m;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    size: "md"
  },
  render: args => <IconButton {...args}>
      <LuSettings size={18} />
    </IconButton>
}`,...(m=(d=n.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var g,p,f;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    size: "lg"
  },
  render: args => <IconButton {...args}>
      <LuTrash2 size={20} />
    </IconButton>
}`,...(f=(p=a.parameters)==null?void 0:p.docs)==null?void 0:f.source}}};var h,b,x;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    disabled: true
  },
  render: args => <IconButton {...args}>
      <LuSettings size={18} />
    </IconButton>
}`,...(x=(b=o.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};const E=["Small","Medium","Large","Disabled"];export{o as Disabled,a as Large,n as Medium,t as Small,E as __namedExportsOrder,D as default};
