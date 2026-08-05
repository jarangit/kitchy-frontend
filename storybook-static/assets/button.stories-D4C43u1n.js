import{j as g}from"./iframe-Cl5EGQEc.js";import{L as N,a as Q}from"./index-DWqi9ZMy.js";import{B as p}from"./button-Cezf315a.js";import"./preload-helper-Dp1pzeXC.js";import"./spinner-2pChG3r9.js";import"./cn-1hUxb5He.js";const er={title:"UI/Button",component:p,parameters:{layout:"centered"},args:{children:"Button"},argTypes:{variant:{control:"select",options:["primary","secondary","danger","ghost"]},size:{control:"select",options:["sm","md","lg","icon"]},loading:{control:"boolean"},disabled:{control:"boolean"},onClick:{action:"clicked"}}},r={args:{variant:"primary"}},e={args:{variant:"secondary"}},a={args:{variant:"danger"}},s={args:{variant:"ghost"}},n={args:{size:"sm",children:"Small"}},o={args:{size:"lg",children:"Large"}},t={args:{children:"Add item"},render:l=>g.jsxs(p,{...l,children:[g.jsx(N,{size:16}),"Add item"]})},c={args:{variant:"danger",children:"Delete"},render:l=>g.jsxs(p,{...l,children:[g.jsx(Q,{size:16}),"Delete"]})},i={args:{loading:!0}},d={args:{loading:!0,loadingText:"Saving...",children:"Save"}},m={args:{disabled:!0}};var u,h,S;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: "primary"
  }
}`,...(S=(h=r.parameters)==null?void 0:h.docs)==null?void 0:S.source}}};var v,L,x;e.parameters={...e.parameters,docs:{...(v=e.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    variant: "secondary"
  }
}`,...(x=(L=e.parameters)==null?void 0:L.docs)==null?void 0:x.source}}};var y,D,z;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    variant: "danger"
  }
}`,...(z=(D=a.parameters)==null?void 0:D.docs)==null?void 0:z.source}}};var B,b,T;s.parameters={...s.parameters,docs:{...(B=s.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    variant: "ghost"
  }
}`,...(T=(b=s.parameters)==null?void 0:b.docs)==null?void 0:T.source}}};var j,W,I;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    size: "sm",
    children: "Small"
  }
}`,...(I=(W=n.parameters)==null?void 0:W.docs)==null?void 0:I.source}}};var f,A,P;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    size: "lg",
    children: "Large"
  }
}`,...(P=(A=o.parameters)==null?void 0:A.docs)==null?void 0:P.source}}};var k,E,G;t.parameters={...t.parameters,docs:{...(k=t.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    children: "Add item"
  },
  render: args => <Button {...args}>
      <LuPlus size={16} />
      Add item
    </Button>
}`,...(G=(E=t.parameters)==null?void 0:E.docs)==null?void 0:G.source}}};var _,C,O;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    variant: "danger",
    children: "Delete"
  },
  render: args => <Button {...args}>
      <LuTrash2 size={16} />
      Delete
    </Button>
}`,...(O=(C=c.parameters)==null?void 0:C.docs)==null?void 0:O.source}}};var R,U,q;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...(q=(U=i.parameters)==null?void 0:U.docs)==null?void 0:q.source}}};var w,F,H;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    loading: true,
    loadingText: "Saving...",
    children: "Save"
  }
}`,...(H=(F=d.parameters)==null?void 0:F.docs)==null?void 0:H.source}}};var J,K,M;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...(M=(K=m.parameters)==null?void 0:K.docs)==null?void 0:M.source}}};const ar=["Primary","Secondary","Danger","Ghost","Small","Large","WithIcon","DangerWithIcon","Loading","LoadingWithText","Disabled"];export{a as Danger,c as DangerWithIcon,m as Disabled,s as Ghost,o as Large,i as Loading,d as LoadingWithText,r as Primary,e as Secondary,n as Small,t as WithIcon,ar as __namedExportsOrder,er as default};
