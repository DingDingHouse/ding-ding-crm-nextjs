"use client";
import Loader from "@/utils/Load";
import { editGames } from "@/utils/action";
import React, { useState } from "react";
import toast from "react-hot-toast";

const EditGames = ({ id, closeModal, platform, prevData }: any) => {
    const [load, setLoad] = useState(false);
    const [game, setGame] = useState<any>({
        name: prevData.name,
        type: prevData.type,
        category: prevData.category,
        status: prevData.status,
        tagName: prevData.tagName,
        slug: prevData.slug,
        url: prevData.url,
        thumbnail: prevData.thumbnail,
    });

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        setGame({
            ...game,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            game.url === "" ||
            game.name === "" ||
            game.status === "" ||
            game.tagName === "" ||
            game.category === "" ||
            game.slug === "" ||
            game.type === "" ||
            game.thumbnail === null
        ) {
            return toast.error("All fileds are required!");
        }

        const data = new FormData();
        for (const key in game) {
            if (game[key] !== prevData[key]) {
                data.append(key, game[key]);
            }
        }
        data.append("platformName", platform);
        setLoad(true);
        const response = await editGames(data, id);
        setLoad(false);
        if (response?.error) {
            return toast.error(response.error);
        }
        toast.success("Game updated succesfully!");
        closeModal();
    };

    return (
        <>
            <form
                onSubmit={(e)=>handleSubmit(e)}
                className="grid grid-cols-2 gap-y-3 lg:gap-4 overflow-hidden lg:px-5"
            >
                <p className="text-left font-light dark:text-white ">Name :</p>
                <input
                    name="name"
                    onChange={handleChange}
                    value={game.name}
                    className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-[#dfdfdf2e] "
                />
                <p className="text-left font-light dark:text-white">Category :</p>
                <input
                    name="category"
                    onChange={handleChange}
                    value={game.category}
                    className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-[#dfdfdf2e] "
                />
                <p className="text-left font-light dark:text-white">Type :</p>
                <input
                    name="type"
                    onChange={handleChange}
                    value={game.type}
                    className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-[#dfdfdf2e] "
                />
                <p className="text-left font-light dark:text-white">Status :</p>
                <div className="flex gap-5 items-center">
                    <div className="min-w-fit w-[30%] flex gap-2">
                        <input
                            type="radio"
                            id="active"
                            name="status"
                            value="active"
                            className="scale-125"
                            onChange={handleChange}
                        />
                        <label htmlFor="active" className="dark:text-white">Active</label>
                    </div>
                    <div className="min-w-fit w-[30%] flex gap-2">
                        <input
                            type="radio"
                            id="inactive"
                            name="status"
                            value="inactive"
                            className="scale-125"
                            onChange={handleChange}
                        />
                        <label htmlFor="inactive" className="dark:text-white">Inactive</label>
                    </div>
                </div>
                <p className="text-left font-light dark:text-white ">Slug :</p>
                <input
                    name="slug"
                    onChange={handleChange}
                    value={game.slug}
                    className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-[#dfdfdf2e] "
                />
                <p className="text-left font-light dark:text-white ">Tag Name :</p>
                <input
                    name="tagName"
                    onChange={handleChange}
                    value={game.tagName}
                    className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-[#dfdfdf2e] "
                />
                <p className="text-left font-light dark:text-white ">Url :</p>
                <input
                    name="url"
                    onChange={handleChange}
                    value={game.url}
                    className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-[#dfdfdf2e] "
                />
                <p className="text-left font-light dark:text-white ">Thumbnail :</p>
                <input
                    onChange={handleChange}
                    name="thumbnail"
                    type="file"
                    className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-[#dfdfdf2e] "
                    id="fileUpload"
                    accept="image/*"
                />
                <div className="col-span-2 flex justify-center mt-2">
                    <button
                        type="submit"
                        className="text-center flex justify-center px-8 hover:bg-opacity-65 items-center gap-2 mx-auto text-white text-xl rounded-md p-2 font-light bg-[#27a5ff]  transition-all duration-200 ease-in-out"
                    >
                        Submit
                    </button>
                </div>
            </form>
            {load && <Loader />}
        </>
    );
};

export default EditGames;