import{j as n,r as m}from"./iframe-Cl5EGQEc.js";import{S as c}from"./spinner-2pChG3r9.js";import{u as l}from"./useLoading-kySIobok.js";import{u as p}from"./use-translation-NpqNXtWk.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DWqi9ZMy.js";import"./cn-1hUxb5He.js";import"./hooks-BV4gm7oS.js";function t(){const{isLoading:o}=l(),{t:e}=p();return o?n.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-dialog-overlay backdrop-blur-sm",children:n.jsxs("div",{className:"flex flex-col items-center space-y-4 text-text-inverse",children:[n.jsx(c,{size:"lg",label:e("common.loading")}),n.jsx("p",{className:"text-subtitle font-medium",children:e("common.loadingLong")})]})}):null}t.__docgenInfo={description:"",methods:[],displayName:"LoadingOverlay"};const b={title:"Shared/LoadingOverlay",component:t,parameters:{layout:"padded"}},r={render:()=>{const{isLoading:o,startLoading:e,stopLoading:a}=l();return m.useEffect(()=>(e(),()=>a()),[e,a]),o?n.jsx(t,{}):null}};var s,i,d;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => {
    const {
      isLoading,
      startLoading,
      stopLoading
    } = useLoading();
    useEffect(() => {
      startLoading();
      return () => stopLoading();
    }, [startLoading, stopLoading]);
    if (!isLoading) return null;
    return <LoadingOverlay />;
  }
}`,...(d=(i=r.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};const h=["Loading"];export{r as Loading,h as __namedExportsOrder,b as default};
