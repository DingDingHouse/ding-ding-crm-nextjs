"use client";
import { editPassword, generatePassword } from "@/utils/action";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { passwordRegex } from "@/utils/regex";
import Loader from "@/utils/Load";

const Password = ({ id,closeModal}:any) => {
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [load, setLoad] = useState(false);

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    if (password !== reEnterPassword) {
      return toast.error("Both the passwords do not match");
    }

    if (!passwordRegex.test(password) || !passwordRegex.test(reEnterPassword)) {
      return toast.error(
        "Password must have at least 8 characters including at least one uppercase letter, 2 digits, and 1 special character!"
      );
    }

    setLoad(true);
    const response:any = await editPassword(password, id);
    setLoad(false);
    if (response?.error) {
      return toast.error(response.error);
    }
    toast.success(response?.responseData?.message);
    closeModal()
  };

  const handleGeneratePassword = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const generatedPassword = await generatePassword();
    setPassword(generatedPassword.password);
    setReEnterPassword(generatedPassword.password);
  };

  return (
    <>
      <form
        onSubmit={(e)=>handleSubmit(e)}
        className="grid grid-cols-2 md:gap-4 overflow-hidden lg:px-5"
      >
        <p className="text-left font-light dark:text-white">New Password :</p>
        <div className="flex justify-between w-full gap-2">
          <input
            name="newPassword"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-500 dark:border-[#dfdfdf2e]"
          />
          <button
            onClick={(e)=>handleGeneratePassword(e)}
            className="px-2 py-1 !rounded-[5px] border-[1px] border-[#27a5ff] text-[#27a5ff] text-sm"
          >
            Generate
          </button>
        </div>
        <p className="text-left font-light dark:text-white">Re-Enter Password :</p>
        <input
          name="reEnterPassword"
          onChange={(e) => {
            setReEnterPassword(e.target.value);
          }}
          value={reEnterPassword}
          className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-500 dark:border-[#dfdfdf2e] "
        />
        <div className="col-span-2 flex justify-center mt-2">
          <button
            type="submit"
            className="text-center flex justify-center px-8 hover:bg-opacity-60 items-center gap-2  mx-auto text-white text-xl rounded-md p-2 font-light bg-[#27a5ff] transition-all duration-200 ease-in-out"
          >
            Submit
          </button>
        </div>
      </form>
    {load&&<Loader />}
    </>
  );
};

export default Password;