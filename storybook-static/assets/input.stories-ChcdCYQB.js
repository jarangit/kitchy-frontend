import{j as e,r as I}from"./iframe-Cl5EGQEc.js";import{I as r}from"./input-D66xobRL.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DWqi9ZMy.js";import"./button-Cezf315a.js";import"./spinner-2pChG3r9.js";import"./cn-1hUxb5He.js";const B={title:"UI/Input",component:r,parameters:{layout:"centered"},args:{placeholder:"Type something..."},argTypes:{type:{control:"select",options:["text","email","tel","password","number"]}}},s={render:a=>{const[d,c]=I.useState("");return e.jsx("div",{className:"w-80",children:e.jsx(r,{...a,value:d,onChange:u=>c(u.target.value)})})}},t={render:a=>{const[d,c]=I.useState("");return e.jsx("div",{className:"w-80",children:e.jsx(r,{...a,label:"Store name",value:d,onChange:u=>c(u.target.value)})})}},n={args:{label:"Email",defaultValue:"not-an-email",error:"Please enter a valid email address."},render:a=>e.jsx("div",{className:"w-80",children:e.jsx(r,{...a})})},l={args:{label:"Order number",placeholder:"e.g. 0042"},render:a=>e.jsx("div",{className:"w-80",children:e.jsx(r,{...a,keyboardToggle:!0})})},o={args:{label:"Store name",defaultValue:"Kitchy Coffee",disabled:!0},render:a=>e.jsx("div",{className:"w-80",children:e.jsx(r,{...a})})};var i,m,p;s.parameters={...s.parameters,docs:{...(i=s.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = useState("");
    return <div className="w-80">
        <Input {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>;
  }
}`,...(p=(m=s.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var g,v,b;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = useState("");
    return <div className="w-80">
        <Input {...args} label="Store name" value={value} onChange={e => setValue(e.target.value)} />
      </div>;
  }
}`,...(b=(v=t.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var h,x,S;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    label: "Email",
    defaultValue: "not-an-email",
    error: "Please enter a valid email address."
  },
  render: args => <div className="w-80">
      <Input {...args} />
    </div>
}`,...(S=(x=n.parameters)==null?void 0:x.docs)==null?void 0:S.source}}};var j,f,w;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    label: "Order number",
    placeholder: "e.g. 0042"
  },
  render: args => <div className="w-80">
      <Input {...args} keyboardToggle />
    </div>
}`,...(w=(f=l.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};var y,N,V;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    label: "Store name",
    defaultValue: "Kitchy Coffee",
    disabled: true
  },
  render: args => <div className="w-80">
      <Input {...args} />
    </div>
}`,...(V=(N=o.parameters)==null?void 0:N.docs)==null?void 0:V.source}}};const D=["Basic","WithLabel","WithError","WithKeyboardToggle","Disabled"];export{s as Basic,o as Disabled,n as WithError,l as WithKeyboardToggle,t as WithLabel,D as __namedExportsOrder,B as default};
