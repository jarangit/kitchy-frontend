import{j as t,r as h}from"./iframe-Cl5EGQEc.js";import{q as f,v as y}from"./index-DWqi9ZMy.js";import{c as u}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";function o({value:e,onValueChange:r,placeholder:a="Search...",className:g,...v}){return t.jsxs("div",{className:u("relative",g),children:[t.jsx(f,{size:18,className:"absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"}),t.jsx("input",{type:"text",value:e,onChange:x=>r(x.target.value),placeholder:a,className:u("w-full h-input-height","bg-input-bg","border border-input-border","rounded-full pl-10 pr-10","text-input text-input-text","placeholder:text-input-placeholder","outline-none","transition-colors duration-[var(--motion-fast)]","focus:border-input-border-focus focus:ring-2 focus:ring-input-border-focus/10"),...v}),e&&t.jsx("button",{type:"button",onClick:()=>r(""),className:"absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-text-tertiary transition-colors duration-[var(--motion-fast)] hover:text-text-primary","aria-label":"Clear search",children:t.jsx(y,{size:16})})]})}o.__docgenInfo={description:"",methods:[],displayName:"SearchInput",props:{value:{required:!0,tsType:{name:"string"},description:""},onValueChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},placeholder:{defaultValue:{value:'"Search..."',computed:!1},required:!1}},composes:["Omit"]};const I={title:"UI/SearchInput",component:o,parameters:{layout:"centered"},args:{placeholder:"Search products..."}},n={render:e=>{const[r,a]=h.useState("");return t.jsx(o,{...e,value:r,onValueChange:a})}},s={args:{value:"Iced latte"},render:e=>{const[r,a]=h.useState(e.value??"");return t.jsx(o,{...e,value:r,onValueChange:a})}};var l,i,c;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = useState("");
    return <SearchInput {...args} value={value} onValueChange={setValue} />;
  }
}`,...(c=(i=n.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var p,d,m;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    value: "Iced latte"
  },
  render: args => {
    const [value, setValue] = useState(args.value ?? "");
    return <SearchInput {...args} value={value} onValueChange={setValue} />;
  }
}`,...(m=(d=s.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};const C=["Empty","WithValue"];export{n as Empty,s as WithValue,C as __namedExportsOrder,I as default};
