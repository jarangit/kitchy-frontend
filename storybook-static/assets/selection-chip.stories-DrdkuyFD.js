import{j as e,r as w}from"./iframe-Cl5EGQEc.js";import{w as j,x as C}from"./index-DWqi9ZMy.js";import{c as I}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";function o({active:t=!1,className:c,children:l,...d}){return e.jsx("button",{type:"button",className:I("inline-flex h-selection-height w-full items-center justify-center gap-2 rounded-selection px-5","border text-selection font-selection","transition-colors duration-[var(--motion-fast)]",t?"border-selection-active-border bg-selection-active-bg text-selection-active-text":"border-selection-border bg-surface-hover text-selection-text hover:border-selection-border-hover hover:bg-surface",c),...d,children:l})}o.__docgenInfo={description:"",methods:[],displayName:"SelectionChip",props:{active:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["ButtonHTMLAttributes"]};const T={title:"UI/SelectionChip",component:o,parameters:{layout:"centered"},args:{children:"Dine in"},argTypes:{active:{control:"boolean"}}},r={args:{active:!1}},n={args:{active:!0}},a={args:{active:!0},render:t=>e.jsx("div",{className:"w-72",children:e.jsxs(o,{...t,children:[e.jsx(j,{size:18}),"Dine in"]})})},i={render:t=>{const[c,l]=w.useState("dine-in"),d=[{key:"dine-in",label:"Dine in",icon:e.jsx(j,{size:18})},{key:"takeaway",label:"Takeaway",icon:e.jsx(C,{size:18})}];return e.jsx("div",{className:"grid w-72 grid-cols-2 gap-3",children:d.map(s=>e.jsxs(o,{...t,active:c===s.key,onClick:()=>l(s.key),children:[s.icon,s.label]},s.key))})}};var p,m,u;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    active: false
  }
}`,...(u=(m=r.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var v,g,h;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    active: true
  }
}`,...(h=(g=n.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var b,y,x;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    active: true
  },
  render: args => <div className="w-72">
      <SelectionChip {...args}>
        <LuGlassWater size={18} />
        Dine in
      </SelectionChip>
    </div>
}`,...(x=(y=a.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};var f,k,S;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: args => {
    const [selected, setSelected] = useState("dine-in");
    const items = [{
      key: "dine-in",
      label: "Dine in",
      icon: <LuGlassWater size={18} />
    }, {
      key: "takeaway",
      label: "Takeaway",
      icon: <LuDessert size={18} />
    }];
    return <div className="grid w-72 grid-cols-2 gap-3">
        {items.map(item => <SelectionChip key={item.key} {...args} active={selected === item.key} onClick={() => setSelected(item.key)}>
            {item.icon}
            {item.label}
          </SelectionChip>)}
      </div>;
  }
}`,...(S=(k=i.parameters)==null?void 0:k.docs)==null?void 0:S.source}}};const W=["Inactive","Active","WithIcon","Interactive"];export{n as Active,r as Inactive,i as Interactive,a as WithIcon,W as __namedExportsOrder,T as default};
