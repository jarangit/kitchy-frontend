import{j as e,r as H}from"./iframe-Cl5EGQEc.js";import{T as o,a as d,b as l,c as n,d as i,e as a}from"./table-vUaX3G80.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DWqi9ZMy.js";import"./cn-1hUxb5He.js";const B={title:"UI/Table",component:o,parameters:{layout:"padded"}},s={render:()=>e.jsxs(o,{children:[e.jsx(d,{children:e.jsxs(l,{children:[e.jsx(n,{children:"Product"}),e.jsx(n,{align:"right",children:"Price"}),e.jsx(n,{align:"center",children:"Qty"})]})}),e.jsxs(i,{children:[e.jsxs(l,{children:[e.jsx(a,{children:"Iced Caffè Latte"}),e.jsx(a,{align:"right",children:"฿120.00"}),e.jsx(a,{align:"center",children:"2"})]}),e.jsxs(l,{children:[e.jsx(a,{children:"Matcha Croissant"}),e.jsx(a,{align:"right",children:"฿95.00"}),e.jsx(a,{align:"center",children:"1"})]})]})]})},c={render:()=>{const[r,w]=H.useState(null);return e.jsxs(o,{children:[e.jsx(d,{children:e.jsxs(l,{children:[e.jsx(n,{sortable:!0,sortDirection:r,onSort:()=>w(b=>b==="asc"?"desc":b==="desc"?null:"asc"),children:"Product"}),e.jsx(n,{children:"Status"})]})}),e.jsxs(i,{children:[e.jsxs(l,{children:[e.jsx(a,{children:"Iced Caffè Latte"}),e.jsx(a,{children:e.jsx("span",{className:"text-success",children:"Available"})})]}),e.jsxs(l,{children:[e.jsx(a,{children:"Matcha Croissant"}),e.jsx(a,{children:e.jsx("span",{className:"text-warning",children:"Low stock"})})]})]})]})}},t={render:()=>e.jsxs(o,{children:[e.jsx(d,{children:e.jsx(l,{children:e.jsx(n,{children:"Store"})})}),e.jsx(i,{children:["Kitchy Coffee","Kitchy Bakery","Kitchy Cafe"].map(r=>e.jsx(l,{clickable:!0,onClick:()=>{},children:e.jsx(a,{children:r})},r))})]})};var T,h,x;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead align="right">Price</TableHead>
          <TableHead align="center">Qty</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Iced Caffè Latte</TableCell>
          <TableCell align="right">฿120.00</TableCell>
          <TableCell align="center">2</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Matcha Croissant</TableCell>
          <TableCell align="right">฿95.00</TableCell>
          <TableCell align="center">1</TableCell>
        </TableRow>
      </TableBody>
    </Table>
}`,...(x=(h=s.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var C,j,u;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    const [sort, setSort] = useState<"asc" | "desc" | null>(null);
    return <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection={sort} onSort={() => setSort(current => current === "asc" ? "desc" : current === "desc" ? null : "asc")}>
              Product
            </TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Iced Caffè Latte</TableCell>
            <TableCell>
              <span className="text-success">Available</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Matcha Croissant</TableCell>
            <TableCell>
              <span className="text-warning">Low stock</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>;
  }
}`,...(u=(j=c.parameters)==null?void 0:j.docs)==null?void 0:u.source}}};var m,p,g;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Store</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {["Kitchy Coffee", "Kitchy Bakery", "Kitchy Cafe"].map(name => <TableRow key={name} clickable onClick={() => {}}>
            <TableCell>{name}</TableCell>
          </TableRow>)}
      </TableBody>
    </Table>
}`,...(g=(p=t.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};const K=["Basic","SortableHeader","ClickableRows"];export{s as Basic,t as ClickableRows,c as SortableHeader,K as __namedExportsOrder,B as default};
