import { Navigate, useParams, useSearchParams } from "react-router-dom";

const PaymentRedirectPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const next = new URLSearchParams(searchParams);

  next.set("view", "payment");

  return (
    <Navigate
      to={`/store/${id}/pos${next.toString() ? `?${next.toString()}` : ""}`}
      replace
    />
  );
};

export default PaymentRedirectPage;
