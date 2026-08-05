import{j as e}from"./iframe-Cl5EGQEc.js";import{S as o}from"./spinner-2pChG3r9.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DWqi9ZMy.js";import"./cn-1hUxb5He.js";const E={title:"UI/Spinner",component:o,parameters:{layout:"centered"},args:{label:"Loading"},argTypes:{size:{control:"select",options:["sm","md","lg"]}}},r={args:{size:"sm"}},s={args:{size:"md"}},a={args:{size:"lg"}},t={render:n=>e.jsxs("div",{className:"flex items-center gap-4 text-text-primary",children:[e.jsx(o,{...n,size:"sm"}),e.jsx(o,{...n,size:"md"}),e.jsx(o,{...n,size:"lg"})]})};var m,i,c;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    size: "sm"
  }
}`,...(c=(i=r.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var p,d,l;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    size: "md"
  }
}`,...(l=(d=s.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};var g,u,z;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    size: "lg"
  }
}`,...(z=(u=a.parameters)==null?void 0:u.docs)==null?void 0:z.source}}};var x,S,j;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: args => <div className="flex items-center gap-4 text-text-primary">
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
    </div>
}`,...(j=(S=t.parameters)==null?void 0:S.docs)==null?void 0:j.source}}};const M=["Small","Medium","Large","AllSizes"];export{t as AllSizes,a as Large,s as Medium,r as Small,M as __namedExportsOrder,E as default};
