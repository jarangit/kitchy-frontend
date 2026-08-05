import{j as e}from"./iframe-Cl5EGQEc.js";import{c as _}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";const U={default:"border-border bg-surface-muted text-text-secondary",danger:"border-danger/30 bg-danger/10 text-danger",warning:"border-warning/30 bg-warning-bg text-warning",success:"border-success/30 bg-success-bg text-success",info:"border-info/30 bg-info-bg text-info"};function n({tone:D="default",className:T,children:N,...W}){return e.jsx("div",{className:_("rounded-card border px-3 py-2 text-body-sm",U[D],T),...W,children:N})}n.__docgenInfo={description:"",methods:[],displayName:"InlineAlert",props:{tone:{required:!1,tsType:{name:"union",raw:'"danger" | "warning" | "success" | "info" | "default"',elements:[{name:"literal",value:'"danger"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"success"'},{name:"literal",value:'"info"'},{name:"literal",value:'"default"'}]},description:"",defaultValue:{value:'"default"',computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["HTMLAttributes"]};const P={title:"UI/InlineAlert",component:n,parameters:{layout:"padded"},args:{children:"A short inline message."},argTypes:{tone:{control:"select",options:["default","danger","warning","success","info"]}}},r={args:{tone:"default"}},a={args:{tone:"danger",children:"Unable to save changes. Try again."}},s={args:{tone:"warning",children:"Printer is running low on paper."}},t={args:{tone:"success",children:"Changes saved successfully."}},o={args:{tone:"info",children:"New update available."}},c={render:()=>e.jsxs("div",{className:"max-w-sm space-y-3",children:[e.jsx(n,{tone:"default",children:"Default tone"}),e.jsx(n,{tone:"danger",children:"Danger tone"}),e.jsx(n,{tone:"warning",children:"Warning tone"}),e.jsx(n,{tone:"success",children:"Success tone"}),e.jsx(n,{tone:"info",children:"Info tone"})]})};var l,i,d;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    tone: "default"
  }
}`,...(d=(i=r.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};var u,g,m;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    tone: "danger",
    children: "Unable to save changes. Try again."
  }
}`,...(m=(g=a.parameters)==null?void 0:g.docs)==null?void 0:m.source}}};var p,f,h;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    tone: "warning",
    children: "Printer is running low on paper."
  }
}`,...(h=(f=s.parameters)==null?void 0:f.docs)==null?void 0:h.source}}};var b,x,I;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    tone: "success",
    children: "Changes saved successfully."
  }
}`,...(I=(x=t.parameters)==null?void 0:x.docs)==null?void 0:I.source}}};var w,A,v;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    tone: "info",
    children: "New update available."
  }
}`,...(v=(A=o.parameters)==null?void 0:A.docs)==null?void 0:v.source}}};var y,S,j;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className="max-w-sm space-y-3">
      <InlineAlert tone="default">Default tone</InlineAlert>
      <InlineAlert tone="danger">Danger tone</InlineAlert>
      <InlineAlert tone="warning">Warning tone</InlineAlert>
      <InlineAlert tone="success">Success tone</InlineAlert>
      <InlineAlert tone="info">Info tone</InlineAlert>
    </div>
}`,...(j=(S=c.parameters)==null?void 0:S.docs)==null?void 0:j.source}}};const R=["Default","Danger","Warning","Success","Info","AllTones"];export{c as AllTones,a as Danger,r as Default,o as Info,t as Success,s as Warning,R as __namedExportsOrder,P as default};
