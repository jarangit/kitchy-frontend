import{j as e}from"./iframe-Cl5EGQEc.js";import{B as a}from"./badge-C0pXbfBg.js";import"./preload-helper-Dp1pzeXC.js";import"./cn-1hUxb5He.js";const U={title:"UI/Badge",component:a,parameters:{layout:"centered"},args:{children:"Badge"},argTypes:{variant:{control:"select",options:["default","success","danger","warning","info","accent"]},size:{control:"select",options:["sm","md","lg"]}}},r={args:{variant:"default",children:"Default"}},n={args:{variant:"success",children:"Completed"}},s={args:{variant:"danger",children:"Failed"}},c={args:{variant:"warning",children:"Pending"}},t={args:{variant:"info",children:"Info"}},i={args:{variant:"accent",children:"Popular"}},o={args:{children:"Badge"},render:g=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(a,{...g,size:"sm"}),e.jsx(a,{...g,size:"md"}),e.jsx(a,{...g,size:"lg"})]})},d={args:{},render:()=>e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(a,{variant:"default",children:"Default"}),e.jsx(a,{variant:"success",children:"Success"}),e.jsx(a,{variant:"danger",children:"Danger"}),e.jsx(a,{variant:"warning",children:"Warning"}),e.jsx(a,{variant:"info",children:"Info"}),e.jsx(a,{variant:"accent",children:"Accent"})]})};var l,m,p;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    variant: "default",
    children: "Default"
  }
}`,...(p=(m=r.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var u,f,v;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: "success",
    children: "Completed"
  }
}`,...(v=(f=n.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};var h,x,B;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    variant: "danger",
    children: "Failed"
  }
}`,...(B=(x=s.parameters)==null?void 0:x.docs)==null?void 0:B.source}}};var S,j,D;c.parameters={...c.parameters,docs:{...(S=c.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    variant: "warning",
    children: "Pending"
  }
}`,...(D=(j=c.parameters)==null?void 0:j.docs)==null?void 0:D.source}}};var z,w,I;t.parameters={...t.parameters,docs:{...(z=t.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    variant: "info",
    children: "Info"
  }
}`,...(I=(w=t.parameters)==null?void 0:w.docs)==null?void 0:I.source}}};var A,N,P;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    variant: "accent",
    children: "Popular"
  }
}`,...(P=(N=i.parameters)==null?void 0:N.docs)==null?void 0:P.source}}};var W,y,C;o.parameters={...o.parameters,docs:{...(W=o.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    children: "Badge"
  },
  render: args => <div className="flex items-center gap-3">
      <Badge {...args} size="sm" />
      <Badge {...args} size="md" />
      <Badge {...args} size="lg" />
    </div>
}`,...(C=(y=o.parameters)==null?void 0:y.docs)==null?void 0:C.source}}};var E,F,V;d.parameters={...d.parameters,docs:{...(E=d.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex flex-wrap items-center gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="accent">Accent</Badge>
    </div>
}`,...(V=(F=d.parameters)==null?void 0:F.docs)==null?void 0:V.source}}};const b=["Default","Success","Danger","Warning","Info","Accent","Sizes","AllVariants"];export{i as Accent,d as AllVariants,s as Danger,r as Default,t as Info,o as Sizes,n as Success,c as Warning,b as __namedExportsOrder,U as default};
