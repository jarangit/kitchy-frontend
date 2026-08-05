import{j as e}from"./iframe-Cl5EGQEc.js";import{c as D}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";function r({color:x,size:j="md",className:v=""}){const z={sm:"w-3 h-3",md:"w-4 h-4",lg:"w-6 h-6"};return e.jsx("div",{className:D("rounded-full",z[j],v),style:{backgroundColor:x}})}r.__docgenInfo={description:"",methods:[],displayName:"ColorDot",props:{color:{required:!0,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"",defaultValue:{value:'"md"',computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'""',computed:!1}}}};const h={title:"UI/ColorDot",component:r,parameters:{layout:"centered"},args:{color:"#FF3B6F"},argTypes:{color:{control:"color"},size:{control:"select",options:["sm","md","lg"]}}},o={args:{size:"sm"}},s={args:{size:"md"}},a={args:{size:"lg"}},t={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(r,{color:"#FF3B6F"}),e.jsx(r,{color:"#0A84FF"}),e.jsx(r,{color:"#34C759"}),e.jsx(r,{color:"#FF9F0A"}),e.jsx(r,{color:"#BF5AF2"})]})};var l,n,c;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    size: "sm"
  }
}`,...(c=(n=o.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};var m,i,d;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    size: "md"
  }
}`,...(d=(i=s.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};var p,u,g;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    size: "lg"
  }
}`,...(g=(u=a.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var F,f,C;t.parameters={...t.parameters,docs:{...(F=t.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <ColorDot color="#FF3B6F" />
      <ColorDot color="#0A84FF" />
      <ColorDot color="#34C759" />
      <ColorDot color="#FF9F0A" />
      <ColorDot color="#BF5AF2" />
    </div>
}`,...(C=(f=t.parameters)==null?void 0:f.docs)==null?void 0:C.source}}};const B=["Small","Medium","Large","StationColors"];export{a as Large,s as Medium,o as Small,t as StationColors,B as __namedExportsOrder,h as default};
