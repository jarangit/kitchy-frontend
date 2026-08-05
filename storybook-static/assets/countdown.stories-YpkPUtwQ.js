import{r as c,j as T}from"./iframe-Cl5EGQEc.js";import"./preload-helper-Dp1pzeXC.js";const x=({seconds:v,onComplete:n})=>{const[o,h]=c.useState(v);c.useEffect(()=>{if(o<=0){n&&n();return}const e=setInterval(()=>{h(a=>a-1)},1e3);return()=>clearInterval(e)},[o,n]);const y=e=>{const a=Math.floor(e/3600).toString().padStart(2,"0"),M=Math.floor(e%3600/60).toString().padStart(2,"0"),C=(e%60).toString().padStart(2,"0");return`${a}:${M}:${C}`};return T.jsxs("div",{className:"text-title font-mono text-center text-danger",children:["⏳ ",y(o)]})};x.__docgenInfo={description:"",methods:[],displayName:"Countdown",props:{seconds:{required:!0,tsType:{name:"number"},description:""},onComplete:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const _={title:"Shared/Countdown",component:x,parameters:{layout:"centered"},args:{seconds:300,onComplete:()=>{}},argTypes:{seconds:{control:"number"}}},r={args:{seconds:300}},t={args:{seconds:45}},s={args:{seconds:0}};var d,i,m;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    seconds: 300
  }
}`,...(m=(i=r.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};var p,u,l;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    seconds: 45
  }
}`,...(l=(u=t.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};var g,f,S;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    seconds: 0
  }
}`,...(S=(f=s.parameters)==null?void 0:f.docs)==null?void 0:S.source}}};const j=["FiveMinutes","UnderOneMinute","Completed"];export{s as Completed,r as FiveMinutes,t as UnderOneMinute,j as __namedExportsOrder,_ as default};
