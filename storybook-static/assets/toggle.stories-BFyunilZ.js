import{r as y,j as t}from"./iframe-Cl5EGQEc.js";import{T as k}from"./toggle-CE93-BSa.js";import"./preload-helper-Dp1pzeXC.js";import"./cn-1hUxb5He.js";const N={title:"UI/Toggle",component:k,parameters:{layout:"centered"},args:{label:"Notifications"},argTypes:{checked:{control:"boolean"}}},e={args:{checked:!1}},r={args:{checked:!0}},s={args:{checked:!0,disabled:!0}},a={render:O=>{const[c,b]=y.useState(!1);return t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(k,{...O,checked:c,onChange:b}),t.jsx("span",{className:"text-body text-text-secondary",children:c?"On":"Off"})]})}};var n,o,d;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    checked: false
  }
}`,...(d=(o=e.parameters)==null?void 0:o.docs)==null?void 0:d.source}}};var m,p,i;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    checked: true
  }
}`,...(i=(p=r.parameters)==null?void 0:p.docs)==null?void 0:i.source}}};var l,u,g;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    checked: true,
    disabled: true
  }
}`,...(g=(u=s.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var h,f,x;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: args => {
    const [checked, setChecked] = useState(false);
    return <div className="flex items-center gap-3">
        <Toggle {...args} checked={checked} onChange={setChecked} />
        <span className="text-body text-text-secondary">
          {checked ? "On" : "Off"}
        </span>
      </div>;
  }
}`,...(x=(f=a.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};const T=["Off","On","Disabled","Interactive"];export{s as Disabled,a as Interactive,e as Off,r as On,T as __namedExportsOrder,N as default};
