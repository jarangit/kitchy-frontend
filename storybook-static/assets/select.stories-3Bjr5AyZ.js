import{j as e,r as d}from"./iframe-Cl5EGQEc.js";import{c as w}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";function l({label:r,options:s,placeholder:a,className:t,...j}){return e.jsxs("div",{children:[r&&e.jsx("label",{className:"mb-1 block text-label-comp font-label-comp text-label-comp-text",children:r}),e.jsxs("select",{className:w("w-full h-select-height","bg-select-bg","border border-select-border","rounded-select","px-input-padding-x","text-select-text text-select","outline-none","transition-colors duration-[var(--motion-fast)]","focus:border-select-border-focus focus:ring-2 focus:ring-select-border-focus/10",t),...j,children:[a&&e.jsx("option",{value:"",disabled:!0,children:a}),s.map(i=>e.jsx("option",{value:i.value,children:i.label},i.value))]})]})}l.__docgenInfo={description:"",methods:[],displayName:"Select",props:{label:{required:!1,tsType:{name:"string"},description:""},options:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}],raw:"{ value: string; label: string }[]"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:""}},composes:["SelectHTMLAttributes"]};const C={title:"UI/Select",component:l,parameters:{layout:"centered"},args:{options:[{value:"TOGO",label:"Takeaway (TOGO)"},{value:"DINE_IN",label:"Dine in"},{value:"DELIVERY",label:"Delivery"}]},argTypes:{options:{control:!1}}},n={render:r=>{const[s,a]=d.useState("TOGO");return e.jsx("div",{className:"w-72",children:e.jsx(l,{...r,value:s,onChange:t=>a(t.target.value)})})}},o={args:{label:"Order type"},render:r=>{const[s,a]=d.useState("DINE_IN");return e.jsx("div",{className:"w-72",children:e.jsx(l,{...r,value:s,onChange:t=>a(t.target.value)})})}},c={args:{label:"Order type",placeholder:"Choose an order type"},render:r=>{const[s,a]=d.useState("");return e.jsx("div",{className:"w-72",children:e.jsx(l,{...r,value:s,onChange:t=>a(t.target.value)})})}},u={args:{label:"Order type",value:"TOGO",disabled:!0},render:r=>e.jsx("div",{className:"w-72",children:e.jsx(l,{...r})})};var p,m,g;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = useState("TOGO");
    return <div className="w-72">
        <Select {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>;
  }
}`,...(g=(m=n.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var v,b,h;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    label: "Order type"
  },
  render: args => {
    const [value, setValue] = useState("DINE_IN");
    return <div className="w-72">
        <Select {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>;
  }
}`,...(h=(b=o.parameters)==null?void 0:b.docs)==null?void 0:h.source}}};var x,y,O;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    label: "Order type",
    placeholder: "Choose an order type"
  },
  render: args => {
    const [value, setValue] = useState("");
    return <div className="w-72">
        <Select {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>;
  }
}`,...(O=(y=c.parameters)==null?void 0:y.docs)==null?void 0:O.source}}};var S,N,f;u.parameters={...u.parameters,docs:{...(S=u.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    label: "Order type",
    value: "TOGO",
    disabled: true
  },
  render: args => <div className="w-72">
      <Select {...args} />
    </div>
}`,...(f=(N=u.parameters)==null?void 0:N.docs)==null?void 0:f.source}}};const D=["Basic","WithLabel","WithPlaceholder","Disabled"];export{n as Basic,u as Disabled,o as WithLabel,c as WithPlaceholder,D as __namedExportsOrder,C as default};
