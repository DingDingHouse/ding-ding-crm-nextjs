import Loader from '@/utils/Load';
import { addPlatform } from '@/utils/action';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const Add_Platform = ({ closeModal }: any) => {
    const [platform, setPlatform] = useState<string>('')
    const [load, setLoad] = useState(false)
    const handeladdPlatform = async () => {
        if (platform === "") {
            return toast.error("This is a required field");
        }
        setLoad(true);
        const response = await addPlatform({ name: platform });
        setLoad(false);
        if (response?.error) {
            return toast.error(response.error);
        } else if (response?.data?.name) {
            toast.success("Platform added successfuly!");
            closeModal();
            setPlatform("");
        }
    };
    return (
        <>
            <div className="mb-5">
                <input
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    type="text"
                    placeholder="Add platform"
                    id="password"
                    className="rounded-md shadow-lg bg-gray-50 border border-gray-300 outline-none  text-gray-900 text-sm focus:ring-blue-500 focus:border-[#FFD117] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-[#FFD117]"
                    required
                />
            </div>
            <div className=" flex justify-center mt-2">
                <button
                    onClick={handeladdPlatform}
                    className="text-center flex justify-center px-8 items-center gap-2  mx-auto  hover:bg-opacity-65 text-white text-xl rounded-md p-2 font-light bg-[#F08D36]  transition-all duration-200 ease-in-out"
                >
                    Add
                </button>
            </div>
            {load&&<Loader />}
        </>
    )
}

export default Add_Platform
