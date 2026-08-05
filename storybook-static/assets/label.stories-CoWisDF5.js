import{j as e}from"./iframe-Cl5EGQEc.js";import{c as u}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";function s({className:i,children:p,...l}){return e.jsx("label",{className:u("block text-label-comp font-label-comp text-label-comp-text",i),...l,children:p})}s.__docgenInfo={description:"",methods:[],displayName:"Label"};const h={title:"UI/Label",component:s,parameters:{layout:"centered"},args:{children:"Store name",htmlFor:"demo-field"}},r={},a={render:()=>e.jsxs("div",{className:"space-y-2",children:[e.jsxs(s,{htmlFor:"demo-required",children:["Store name ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{id:"demo-required",className:"h-10 w-72 rounded-input border border-input-border bg-input-bg px-3"})]})};var o,t,n;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:"{}",...(n=(t=r.parameters)==null?void 0:t.docs)==null?void 0:n.source}}};var d,c,m;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <Label htmlFor="demo-required">
        Store name <span className="text-danger">*</span>
      </Label>
      <input id="demo-required" className="h-10 w-72 rounded-input border border-input-border bg-input-bg px-3" />
    </div>
}`,...(m=(c=a.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};const N=["Basic","Required"];export{r as Basic,a as Required,N as __namedExportsOrder,h as default};
