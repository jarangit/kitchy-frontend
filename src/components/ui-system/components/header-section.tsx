// import { useNavigate } from "react-router-dom";

import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
}
export default function HeaderSection({ title }: Props) {
  const navigate = useNavigate();
  const onChangePage = (path: string) => {
    navigate(path);
  };
  return (
    <div className="flex justify-between items-center py-6 border-b border-gray-300">
      <h1 className="text-lg md:text-3xl font-bold">{title}</h1>
      <div className="space-x-2">
        <button
          className="border px-6 py-2 rounded-md cursor-pointer"
          onClick={() => onChangePage("/")}
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
