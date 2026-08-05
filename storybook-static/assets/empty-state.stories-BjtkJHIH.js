import{j as r}from"./iframe-Cl5EGQEc.js";import{b as l}from"./index-DWqi9ZMy.js";import{B as y}from"./button-Cezf315a.js";import{E as a}from"./empty-state-jC_yaZad.js";import"./preload-helper-Dp1pzeXC.js";import"./spinner-2pChG3r9.js";import"./cn-1hUxb5He.js";const b={title:"UI/EmptyState",component:a,parameters:{layout:"centered"},args:{title:"No items yet",description:"Get started by creating your first item."}},e={},t={render:o=>r.jsx(a,{...o,icon:r.jsx(l,{size:48})})},s={args:{icon:r.jsx(l,{size:48})},render:o=>r.jsx(a,{...o,action:r.jsx(y,{size:"sm",children:"Add item"})})};var i,n,c;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:"{}",...(c=(n=e.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};var m,p,d;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: args => <EmptyState {...args} icon={<LuInbox size={48} />} />
}`,...(d=(p=t.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var u,x,g;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    icon: <LuInbox size={48} />
  },
  render: args => <EmptyState {...args} action={<Button size="sm">Add item</Button>} />
}`,...(g=(x=s.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};const h=["Basic","WithIcon","WithAction"];export{e as Basic,s as WithAction,t as WithIcon,h as __namedExportsOrder,b as default};
