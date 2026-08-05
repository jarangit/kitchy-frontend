import{r as u,j as e}from"./iframe-Cl5EGQEc.js";import{B as o}from"./button-Cezf315a.js";import{v as T,f as N,e as S,F as B,s as E}from"./index-DWqi9ZMy.js";import{c as g}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";import"./spinner-2pChG3r9.js";const x=new Set,p=new Set,I=()=>`toast-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,C=s=>{const t={id:I(),...s};return x.forEach(i=>i(t)),t.id},c=s=>t=>C({...t,variant:s}),r={show:C,default:c("default"),success:c("success"),warning:c("warning"),error:c("error"),info:c("info"),dismiss:s=>{p.forEach(t=>t(s))},subscribe:s=>(x.add(s),()=>x.delete(s)),subscribeDismiss:s=>(p.add(s),()=>p.delete(s))},L=6e3,M=3,A={default:{shell:"border-border bg-surface ring-border/40",icon:"bg-surface-hover text-text-secondary",iconNode:e.jsx(E,{size:20})},success:{shell:"border-success/30 bg-surface ring-success/10",icon:"bg-success-bg text-success",iconNode:e.jsx(B,{size:20})},warning:{shell:"border-warning/30 bg-surface ring-warning/10",icon:"bg-warning-bg text-warning",iconNode:e.jsx(S,{size:20})},error:{shell:"border-danger/30 bg-surface ring-danger/10",icon:"bg-danger-bg text-danger",iconNode:e.jsx(T,{size:20})},info:{shell:"border-info/30 bg-surface ring-info/10",icon:"bg-info-bg text-info",iconNode:e.jsx(N,{size:20})}};function P({record:s,onDismiss:t}){const i=A[s.variant];return u.useEffect(()=>{if(s.durationMs<=0)return;const n=window.setTimeout(()=>{t(s.id)},s.durationMs);return()=>window.clearTimeout(n)},[s.durationMs,s.id,t]),e.jsx("div",{className:g("rounded-card border p-4 shadow-xl ring-1",i.shell),children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("span",{className:g("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",i.icon),children:i.iconNode}),e.jsxs("div",{className:"min-w-0 flex-1 space-y-1",children:[e.jsx("p",{className:"text-title font-semibold text-text-primary",children:s.title}),s.description&&e.jsx("p",{className:"text-body-sm text-text-secondary",children:s.description}),s.action&&e.jsx("div",{className:"pt-2",children:e.jsx(o,{size:"sm",onClick:()=>{var n;(n=s.action)==null||n.onClick(),t(s.id)},children:s.action.label})})]}),e.jsx("button",{type:"button","aria-label":"Close notification",onClick:()=>t(s.id),className:"rounded-full p-1 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary",children:e.jsx(T,{size:18})})]})})}function m(){const[s,t]=u.useState([]),i=u.useMemo(()=>n=>{t(f=>n?f.filter(a=>a.id!==n):[])},[]);return u.useEffect(()=>{const n=r.subscribe(a=>{const z={...a,variant:a.variant??"default",durationMs:a.durationMs??L};t(k=>[z,...k].slice(0,M))}),f=r.subscribeDismiss(i);return()=>{n(),f()}},[i]),s.length===0?null:e.jsx("div",{className:"fixed inset-x-4 bottom-4 z-[70] flex flex-col gap-3 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-6 sm:w-[360px]",children:s.map(n=>e.jsx(P,{record:n,onDismiss:i},n.id))})}m.__docgenInfo={description:"",methods:[],displayName:"ToastProvider"};const V={title:"UI/Toast",component:m,parameters:{layout:"padded"}},l={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(m,{}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(o,{size:"sm",onClick:()=>r.show({title:"Default toast"}),children:"Default"}),e.jsx(o,{size:"sm",variant:"secondary",onClick:()=>r.success({title:"Saved",description:"Changes were saved successfully."}),children:"Success"}),e.jsx(o,{size:"sm",variant:"ghost",onClick:()=>r.warning({title:"Low paper",description:"Printer 2 is running low on paper."}),children:"Warning"}),e.jsx(o,{size:"sm",variant:"danger",onClick:()=>r.error({title:"Payment failed",description:"The card was declined. Try again."}),children:"Error"}),e.jsx(o,{size:"sm",onClick:()=>r.info({title:"Update available",description:"A new version is ready to install."}),children:"Info"})]})]})},d={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(m,{}),e.jsx(o,{size:"sm",onClick:()=>r.warning({title:"Printer offline",description:"Reconnect printer 1.",durationMs:1e4,action:{label:"Reconnect",onClick:()=>{}}}),children:"Show toast with action"})]})};var h,b,w;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <>
      <ToastProvider />
      <div className="flex flex-wrap gap-3">
        <Button size="sm" onClick={() => toast.show({
        title: "Default toast"
      })}>
          Default
        </Button>
        <Button size="sm" variant="secondary" onClick={() => toast.success({
        title: "Saved",
        description: "Changes were saved successfully."
      })}>
          Success
        </Button>
        <Button size="sm" variant="ghost" onClick={() => toast.warning({
        title: "Low paper",
        description: "Printer 2 is running low on paper."
      })}>
          Warning
        </Button>
        <Button size="sm" variant="danger" onClick={() => toast.error({
        title: "Payment failed",
        description: "The card was declined. Try again."
      })}>
          Error
        </Button>
        <Button size="sm" onClick={() => toast.info({
        title: "Update available",
        description: "A new version is ready to install."
      })}>
          Info
        </Button>
      </div>
    </>
}`,...(w=(b=l.parameters)==null?void 0:b.docs)==null?void 0:w.source}}};var v,j,y;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <>
      <ToastProvider />
      <Button size="sm" onClick={() => toast.warning({
      title: "Printer offline",
      description: "Reconnect printer 1.",
      durationMs: 10000,
      action: {
        label: "Reconnect",
        onClick: () => {}
      }
    })}>
        Show toast with action
      </Button>
    </>
}`,...(y=(j=d.parameters)==null?void 0:j.docs)==null?void 0:y.source}}};const W=["Variants","WithAction"];export{l as Variants,d as WithAction,W as __namedExportsOrder,V as default};
