import{j as a}from"./iframe-Cl5EGQEc.js";import{c as g}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";const z={sm:"h-8 w-8 rounded-full text-caption",md:"h-12 w-12 rounded-lg text-title"};function t({size:f="md",className:x}){return a.jsx("div",{className:g("inline-flex items-center justify-center border border-border bg-surface font-semibold text-text-primary",z[f],x),"aria-hidden":"true",children:"K"})}t.__docgenInfo={description:"",methods:[],displayName:"BrandMark",props:{size:{required:!1,tsType:{name:"union",raw:'"sm" | "md"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'}]},description:"",defaultValue:{value:'"md"',computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};const v={title:"UI/BrandMark",component:t,parameters:{layout:"centered"},argTypes:{size:{control:"select",options:["sm","md"]}}},e={args:{size:"sm"}},r={args:{size:"md"}},s={render:()=>a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(t,{size:"sm"}),a.jsx(t,{size:"md"})]})};var n,m,o;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    size: "sm"
  }
}`,...(o=(m=e.parameters)==null?void 0:m.docs)==null?void 0:o.source}}};var i,d,c;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    size: "md"
  }
}`,...(c=(d=r.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var l,p,u;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <BrandMark size="sm" />
      <BrandMark size="md" />
    </div>
}`,...(u=(p=s.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};const M=["Small","Medium","Sizes"];export{r as Medium,s as Sizes,e as Small,M as __namedExportsOrder,v as default};
