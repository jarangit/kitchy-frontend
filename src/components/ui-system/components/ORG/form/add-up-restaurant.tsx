import React from "react";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
}

type Props = {
  _onSubmit?: (data: FormData) => void;
};

const AddUpRestaurantForm = ({_onSubmit}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // Handle form submission
    console.log(data);
    _onSubmit && _onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block font-medium mb-1">
          Restaurant Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: "Name is required" })}
          className="border p-2 w-full rounded"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? "Saving..." : "Create Restaurant"}
      </button>
    </form>
  );
};

export default AddUpRestaurantForm;
