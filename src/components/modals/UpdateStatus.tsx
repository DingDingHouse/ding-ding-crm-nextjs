"use client";
import Loader from "@/utils/Load";
import { editStatus } from "@/utils/action";
import React, { useState } from "react";
import toast from "react-hot-toast";

const UpdateStatus = ({ id, closeModal,prevStatus }: any) => {

    const [status, setStatus] = useState(prevStatus);
    const [load, setLoad] = useState(false);
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (status === "") {
        return toast.error("Status is required");
      }
      setLoad(true);
      const response = await editStatus(status, id);
      if (response?.error) {
        setLoad(false);
        return toast.error(response.error);
      }
      closeModal();
      toast.success(response?.responseData?.message);
      setLoad(false);
    };

    return (
        <>
            <form
                onSubmit={(e)=>handleSubmit(e)}
                className="grid grid-cols-2 md:gap-4 overflow-hidden lg:px-5"
            >
                <p className="text-left font-light  dark:text-white">Status : </p>
                <div className="flex gap-2 md:gap-5 items-center">
                    <div className="min-w-fit w-[30%] flex gap-2">
                        <input
                            className="cursor-pointer scale-150"
                            type="radio"
                            id="active"
                            name="status"
                            value="active"
                            onChange={(e) => setStatus(e.target.value)}
                        />
                        <label htmlFor="active" className="text-green-500">Active</label>
                    </div>
                    <div className="min-w-fit w-[30%] flex gap-2">
                        <input
                            className="cursor-pointer scale-150"
                            type="radio"
                            id="inactive"
                            name="status"
                            value="inactive"
                            onChange={(e) => setStatus(e.target.value)}
                        />
                        <label htmlFor="inactive" className="text-red-600">Inactive</label>
                    </div>
                </div>
                <div className="col-span-2 flex justify-center mt-4">
                    <button
                        type="submit"
                        className="text-center flex justify-center px-8 hover:bg-opacity-45 items-center gap-2  mx-auto bg-[#F08D36]  text-white text-xl rounded-md p-2 font-light  transition-all duration-200 ease-in-out"
                    >
                        Submit
                    </button>
                </div>
            </form>
            {load&&<Loader />}
        </>
    )
}

export default UpdateStatus
