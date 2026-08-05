import{j as t,r as z}from"./iframe-Cl5EGQEc.js";import{c as S}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";const j={sm:"min-h-chip-height-sm px-chip-padding-x text-chip",md:"min-h-chip-height-md px-5 text-chip",lg:"min-h-chip-height-lg px-6 text-body"};function s({active:e=!1,size:o="md",className:p,children:a,...C}){return t.jsx("button",{type:"button",className:S("inline-flex items-center justify-center whitespace-nowrap","rounded-chip","font-chip","transition-colors duration-[var(--motion-fast)]",j[o],e?"bg-chip-active-bg text-chip-active-text":"bg-chip-inactive-bg text-chip-inactive-text hover:bg-chip-inactive-bg-hover",p),...C,children:a})}s.__docgenInfo={description:"",methods:[],displayName:"ChipTab",props:{active:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"",defaultValue:{value:'"md"',computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["ButtonHTMLAttributes"]};const I={title:"UI/ChipTab",component:s,parameters:{layout:"centered"},args:{children:"Today"},argTypes:{active:{control:"boolean"},size:{control:"select",options:["sm","md","lg"]}}},r={args:{active:!0}},i={args:{active:!1}},n={args:{active:!0},render:e=>t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(s,{...e,size:"sm",children:"Small"}),t.jsx(s,{...e,size:"md",children:"Medium"}),t.jsx(s,{...e,size:"lg",children:"Large"})]})},c={render:e=>{const[o,p]=z.useState("today");return t.jsx("div",{className:"flex gap-2",children:["today","week","month"].map(a=>t.jsx(s,{...e,active:o===a,onClick:()=>p(a),children:a.charAt(0).toUpperCase()+a.slice(1)},a))})}};var m,l,d;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    active: true
  }
}`,...(d=(l=r.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var u,h,v;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    active: false
  }
}`,...(v=(h=i.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};var g,x,b;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    active: true
  },
  render: args => <div className="flex items-center gap-3">
      <ChipTab {...args} size="sm">
        Small
      </ChipTab>
      <ChipTab {...args} size="md">
        Medium
      </ChipTab>
      <ChipTab {...args} size="lg">
        Large
      </ChipTab>
    </div>
}`,...(b=(x=n.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var f,y,T;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: args => {
    const [active, setActive] = useState("today");
    return <div className="flex gap-2">
        {["today", "week", "month"].map(key => <ChipTab key={key} {...args} active={active === key} onClick={() => setActive(key)}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </ChipTab>)}
      </div>;
  }
}`,...(T=(y=c.parameters)==null?void 0:y.docs)==null?void 0:T.source}}};const w=["Active","Inactive","Sizes","Interactive"];export{r as Active,i as Inactive,c as Interactive,n as Sizes,w as __namedExportsOrder,I as default};
