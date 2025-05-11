// import { useNavigate } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { toggleSound } from "../../../store/slices/notice-slice";
import { Volume2, VolumeX } from "lucide-react";

interface Props {
  title: string;
}
export default function HeaderSection({ title }: Props) {
  const dispatch = useAppDispatch();
  const isSoundOn = useAppSelector((state) => state.sound.isSoundOn);
  const navigate = useNavigate();
  const onChangePage = (path: string) => {
    navigate(path);
  };
  return (
    <div className="flex justify-between items-center py-6 border-b border-gray-300">
      <h1 className="text-lg md:text-3xl font-bold">{title}</h1>
      <div className="flex gap-2">
        <button
          onClick={() => dispatch(toggleSound())}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          title={isSoundOn ? "Sound On" : "Sound Off"}
        >
          {isSoundOn ? (
            <Volume2 className="text-green-600" />
          ) : (
            <VolumeX className="text-red-500" />
          )}
        </button>
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
