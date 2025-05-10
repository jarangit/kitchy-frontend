// import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
}
export default function HeaderSection({ title }: Props) {
  // const navigate = useNavigate();
  // const onChangePage = (path: string) => {
  //   navigate(path);
  // };
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="space-x-2">
        {/* <button
          className="border px-4 py-1 rounded-md"
          onClick={() => onChangePage("/")}
        >
          Back to home
        </button> */}
      </div>
    </div>
  );
}
