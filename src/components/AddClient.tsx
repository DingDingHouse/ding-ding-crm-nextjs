"use client";
import { addClient, generatePassword } from "@/utils/action";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import Loader from "@/utils/Load";
import { rolesHierarchy } from "@/utils/common";

const AddClient = () => {
  const [load, setLoad] = useState(false);

  const [userdata, setUserData] = useState<{
    username: string;
    role: string;
    credits: number;
  } | null>(null);

  const roles = rolesHierarchy(userdata?.role);
  const handelGetUser = async () => {
    try {
      const user = await Cookies.get("userToken");
      if (user) {
        const decodedUser: any = jwt.decode(user);
        setUserData(decodedUser);
        setUser({
          username: "",
          name: "",
          password: "",
          role: "",
          credits: 0,
        });
      }
    } catch (error) { }
  };

  useEffect(() => {
    handelGetUser();
  }, []);
  const [user, setUser] = useState({
    username: "",
    name: "",
    password: "",
    role: "",
    credits: 0,
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleGeneratePassword = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const generatedPassword = await generatePassword();

    setUser({
      ...user,
      password: generatedPassword?.password,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      user.username === "" ||
      user.name === "" ||
      user.password === "" ||
      user.role === ""
    ) {
      return toast.error("All fileds are required!");
    }
    if (user.credits < 0) {
      return toast.error("Credit can't be negative");
    }

    setLoad(true);
    const response = await addClient(user);
    if (response?.error) {
      toast.error(response.error);
    } else {
      toast.success("Client Added Successfully!");
    }
    setUser({
      username: "",
      name: "",
      password: "",
      role: "",
      credits: 0,
    });
    setLoad(false);
  };


  return (
    <>
      <div className="absolute top-[50%] left-[50%] w-[95%]  lg:w-[45%] xl:w-[40%] lg:left-[60%] translate-y-[-50%] translate-x-[-50%] ">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="grid grid-cols-2 lg:gap-4 gap-y-10 overflow-hidden w-[99%] md:w-[70%] lg:w-[100%] dark:bg-gray-700 bg-white shadow-xl  m-auto px-4 lg:px-16 py-8 lg:py-12 rounded-2xl text-black dark:text-white border-[#FFD117] border-[3px]"
        >
          <p className="text-left font-light">Username :</p>
          <input
            name="username"
            onChange={(e) => handleChange(e)}
            value={user.username}
            className="text-left font-extralight text-gray-400  focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e] "
          />
          <p className="text-left font-light">Name :</p>
          <input
            name="name"
            onChange={(e) => handleChange(e)}
            value={user.name}
            className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e] "
          />
          <p className="text-left font-light">Password :</p>
          <div className="flex justify-between w-full gap-2">
            <input
              name="password"
              onChange={(e) => handleChange(e)}
              value={user.password}
              className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e] "
            />
            <button
              onClick={(e) => handleGeneratePassword(e)}
              className="px-2 py-1 !rounded-[5px] border-[1px] border-[#FFD117] text-[#FFD117] text-sm"
            >
              Generate
            </button>
          </div>
          <p className="text-left font-light">Role :</p>
          <select
            name="role"
            id="role"
            value={user?.role}
            onChange={(e) => handleChange(e)}
            className="outline-none bg-transparent w-full text-left font-extralight text-gray-400 border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e]"
          >
            <option value="">Select Role</option>
            {
              roles?.map((role, ind) => (
                <option value={role} key={ind}>{role}</option>
              ))
            }
          </select>

          <div className="col-span-2 flex justify-center mt-2">
            <button
              type="submit"
              className="text-center flex justify-center items-center gap-2 bg-[#F08D36] mx-auto text-white text-xl rounded-md hover:bg-opacity-60 py-2 px-10 font-light transition-all duration-200 ease-in-out"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      {load && <Loader />}
    </>
  );
};

export default AddClient;
