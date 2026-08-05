import{r as p,j as e}from"./iframe-Cl5EGQEc.js";import{B as a}from"./button-Cezf315a.js";import{c as s}from"./cn-1hUxb5He.js";import"./preload-helper-Dp1pzeXC.js";import"./spinner-2pChG3r9.js";import"./index-DWqi9ZMy.js";function c({open:n,onClose:t,children:o,className:T}){const d=p.useRef(null);return p.useEffect(()=>{const r=d.current;r&&(n?r.showModal():r.close())},[n]),e.jsx("dialog",{ref:d,onClose:t,onClick:r=>{r.target===d.current&&t()},className:s("backdrop:bg-dialog-overlay","bg-dialog-bg","border border-dialog-border","rounded-dialog","p-dialog-padding","w-full max-w-md m-auto","max-h-[90vh] overflow-y-auto","",T),children:n&&o})}function g({className:n,children:t}){return e.jsx("div",{className:s("mb-5",n),children:t})}function u({className:n,children:t}){return e.jsx("h2",{className:s("text-dialog-title font-dialog-title text-text-primary",n),children:t})}function m({className:n,children:t}){return e.jsx("p",{className:s("text-dialog-desc text-text-secondary mt-1",n),children:t})}function x({className:n,children:t}){return e.jsx("div",{className:s("mt-6 flex justify-end gap-4",n),children:t})}c.__docgenInfo={description:"",methods:[],displayName:"Dialog",props:{open:{required:!0,tsType:{name:"boolean"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};g.__docgenInfo={description:"",methods:[],displayName:"DialogHeader",props:{className:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};u.__docgenInfo={description:"",methods:[],displayName:"DialogTitle",props:{className:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};m.__docgenInfo={description:"",methods:[],displayName:"DialogDescription",props:{className:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};x.__docgenInfo={description:"",methods:[],displayName:"DialogFooter",props:{className:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const w={title:"UI/Dialog",component:c,parameters:{layout:"centered"},args:{open:!0,onClose:()=>{}},argTypes:{open:{control:"boolean"}}},i={render:n=>e.jsxs(c,{...n,children:[e.jsxs(g,{children:[e.jsx(u,{children:"Confirm action"}),e.jsx(m,{children:"This action cannot be undone."})]}),e.jsx("p",{className:"text-body text-text-secondary",children:"Are you sure you want to continue?"}),e.jsxs(x,{children:[e.jsx(a,{variant:"ghost",children:"Cancel"}),e.jsx(a,{variant:"danger",children:"Confirm"})]})]})},l={args:{open:!1},render:n=>{const[t,o]=p.useState(n.open);return e.jsxs(e.Fragment,{children:[e.jsx(a,{onClick:()=>o(!0),children:"Open dialog"}),e.jsxs(c,{open:t,onClose:()=>o(!1),children:[e.jsxs(g,{children:[e.jsx(u,{children:"Edit store details"}),e.jsx(m,{children:"Update the information shown to customers."})]}),e.jsx("p",{className:"text-body text-text-secondary",children:"Dialog content goes here."}),e.jsxs(x,{children:[e.jsx(a,{variant:"ghost",onClick:()=>o(!1),children:"Cancel"}),e.jsx(a,{onClick:()=>o(!1),children:"Save"})]})]})]})}};var f,h,D;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: args => <Dialog {...args}>
      <DialogHeader>
        <DialogTitle>Confirm action</DialogTitle>
        <DialogDescription>
          This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <p className="text-body text-text-secondary">
        Are you sure you want to continue?
      </p>
      <DialogFooter>
        <Button variant="ghost">Cancel</Button>
        <Button variant="danger">Confirm</Button>
      </DialogFooter>
    </Dialog>
}`,...(D=(h=i.parameters)==null?void 0:h.docs)==null?void 0:D.source}}};var y,j,N;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    open: false
  },
  render: args => {
    const [open, setOpen] = useState(args.open);
    return <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit store details</DialogTitle>
            <DialogDescription>
              Update the information shown to customers.
            </DialogDescription>
          </DialogHeader>
          <p className="text-body text-text-secondary">
            Dialog content goes here.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </DialogFooter>
        </Dialog>
      </>;
  }
}`,...(N=(j=l.parameters)==null?void 0:j.docs)==null?void 0:N.source}}};const O=["Basic","Interactive"];export{i as Basic,l as Interactive,O as __namedExportsOrder,w as default};
