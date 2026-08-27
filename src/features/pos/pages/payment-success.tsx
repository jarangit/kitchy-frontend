import { Navigate, useParams, useSearchParams } from "react-router-dom";

const PaymentSuccessRedirectPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const next = new URLSearchParams(searchParams);

  next.set("view", "success");

  return (
    <Navigate
      to={`/store/${id}/pos${next.toString() ? `?${next.toString()}` : ""}`}
      replace
    />
  );
};

export default PaymentSuccessRedirectPage;
