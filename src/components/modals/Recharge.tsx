"use client";
import Loader from "@/utils/Load";
import { editCredits } from "@/utils/action";
import React, { useState } from "react";
import toast from "react-hot-toast";


const Recharge = ({ id, closeModal,modalType }: any) => {
    const [amount, setAmount] = useState();
    const [load, setLoad] = useState(false);
    const credits = {
        type: modalType?.toLowerCase(),
        amount: amount,
    };

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!amount || amount <= 0) {
            return toast.error("Enter a valid amount");
        }
        setLoad(true);
        const response = await editCredits(credits, id);
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
                className="grid grid-cols-2 space-x-2 md:space-x-0 md:gap-4 overflow-hidden lg:px-5"
            >
                <p className="text-left font-light dark:text-white">{modalType} Amount : </p>
                <input
                    type="number"
                    name="recharge"
                    onChange={(e:any) => setAmount(e.target.value)}
                    value={amount}
                    className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-500 dark:border-[#dfdfdf2e]"
                />
                <div className="col-span-2 flex justify-center mt-2">
                    <button
                        type="submit"
                        className="text-center flex justify-center px-8 hover:bg-opacity-45 items-center gap-2 bg-[#F08D36]   mx-auto text-white text-xl rounded-md p-2 font-light  transition-all duration-200 ease-in-out"
                    >
                        Submit
                    </button>
                </div>
            </form>
            {load && <Loader />}
        </>
    )
}

export default Recharge
