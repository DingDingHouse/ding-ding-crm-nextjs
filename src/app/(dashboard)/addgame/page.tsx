"use client";
import { addGame, getPlatform } from "@/utils/action";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import Loader from "@/utils/Load";


const page = () => {
    const [load, setLoad] = useState(false);
    const [platform, setPlatform] = useState([]);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [game, setGame] = useState<any>({
        name: "",
        type: "",
        category: "",
        platform: "",
        status: "",
        tagName: "",
        slug: "",
        url: "",
        thumbnail: null,
        payoutFile: null,
    });

    const [disable, setDisable] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | any) => {
        const { name, value, files } = e.target;
        if (name === "thumbnail") {
            const selectedFile = files[0];
            setGame({
                ...game,
                thumbnail: selectedFile,
            });
            const input: any = document.getElementById("fileUpload");
            const file = input.files;
            if (file) {
                const fileReader: any = new FileReader();
                fileReader.onload = (event: any) => {
                    setThumbnailPreview(event.target.result);
                };
                fileReader.readAsDataURL(file[0]);
            } else {
                setThumbnailPreview(null);
            }
        } else {
            setGame({
                ...game,
                [name]: files ? files[0] : value,
            });
        }
    };

    const handleClearFile = () => {
        setGame({
            ...game,
            thumbnail: null,
        });
        setThumbnailPreview(null);
    };

    useEffect(() => {
        const allFieldsFilled = Object.values(game).every(
            (field) => field !== "" && field !== null
        );
        setDisable(!allFieldsFilled);
    }, [game]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            game.url === "" ||
            game.name === "" ||
            game.status === "" ||
            game.tagName === "" ||
            game.category === "" ||
            game.platform === "" ||
            game.slug === "" ||
            game.type === "" ||
            game.thumbnail === null ||
            game.payoutFile === null
        ) {
            return toast.error("All fields are required!");
        }
        const data = new FormData();
        for (const key in game) {
            data.append(key, game[key]);
        }
        setLoad(true);

        const response = await addGame(data);

        if (response.error) {
            setLoad(false);
            return toast.error(response.error);
        }

        toast.success("Game Added successfully!");
        setGame({
            name: "",
            type: "",
            category: "",
            platform: "",
            status: "",
            tagName: "",
            slug: "",
            url: "",
            thumbnail: null,
            payoutFile: null,
        });

        setDisable(true);
        setThumbnailPreview(null);
        setLoad(false);

    };

    //Get Platforms
    const handelPlatform = async () => {
        const response = await getPlatform();
        if (response?.error) {
            return toast.error(response.error);
        } else if (response?.length > 0) {
            setPlatform(response);
        }
    };

    useEffect(() => {
        handelPlatform();
    }, []);

    return (
        <>
            <div className="h-screen w-full relative">
                <form
                    onSubmit={(e) => handleSubmit(e)}
                    className="grid grid-cols-2 gap-x-2 lg:gap-x-4 gap-y-6 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-hidden w-[98%] md:w-[70%] lg:w-[50%] m-auto px-2 lg:px-8 py-6 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white border-[#FFD117] border-[3px]"
                >
                    <p className="text-left font-light">Name :</p>
                    <input
                        name="name"
                        onChange={(e) => handleChange(e)}
                        value={game.name}
                        className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e] "
                    />
                    <p className="text-left font-light">Category :</p>
                    <input
                        name="category"
                        onChange={(e) => handleChange(e)}
                        value={game.category}
                        className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e]"
                    />
                    <p className="text-left font-light">Platform :</p>
                    <select
                        name="platform"
                        className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e]"
                        onChange={(e) => handleChange(e)}
                        value={game.platform}
                    >
                        <option value={""}>Select Platform</option>
                        {platform?.map((item: any, ind: number) => (
                            <option key={ind} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-left font-light">Type :</p>
                    <input
                        name="type"
                        onChange={(e) => handleChange(e)}
                        value={game.type}
                        className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e]"
                    />
                    <p className="text-left font-light">Tag Name :</p>
                    <input
                        name="tagName"
                        onChange={(e) => handleChange(e)}
                        value={game.tagName}
                        className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e] "
                    />
                    <p className="text-left font-light">Slug :</p>
                    <input
                        name="slug"
                        onChange={(e) => handleChange(e)}
                        value={game.slug}
                        className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e] "
                    />
                    <p className="text-left font-light">Status :</p>
                    <div className="flex gap-5 items-center">
                        <div className="min-w-fit w-[30%] flex gap-2">
                            <input
                                type="radio"
                                id="active"
                                name="status"
                                value="active"
                                className="scale-125"
                                onChange={(e) => handleChange(e)}
                            />
                            <label htmlFor="active" className="text-green-500">Active</label>
                        </div>
                        <div className="min-w-fit w-[30%] flex gap-2">
                            <input
                                type="radio"
                                id="inactive"
                                name="status"
                                value="inactive"
                                className="scale-125"
                                onChange={(e) => handleChange(e)}
                            />
                            <label htmlFor="inactive" className="text-red-500">Inactive</label>
                        </div>
                    </div>
                    <p className="text-left font-light">Url :</p>
                    <input
                        name="url"
                        onChange={(e) => handleChange(e)}
                        value={game.url}
                        className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e] "
                    />
                    <p className="text-left font-light">Thumbnail :</p>
                    {!thumbnailPreview ? (
                        <input
                            onChange={(e) => handleChange(e)}
                            type="file"
                            className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e]"
                            id="fileUpload"
                            accept="image/*"
                            name="thumbnail"
                        />
                    ) : (
                        <div className="ml-3 relative w-fit flex items-start">
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail-Preview"
                                className="h-48 w-auto object-contain"
                            />
                            <button
                                type="button"
                                className="text-lg dark:text-white p-[5px] focus:outline-none absolute -right-4 -top-3 bg-[#dfdfdfec] dark:bg-[#05040488] rounded-md"
                                onClick={handleClearFile}
                            >
                                <RxCross2 />
                            </button>
                        </div>
                    )}
                    <p className="text-left font-light">Payout file :</p>
                    <input
                        name="payoutFile"
                        type="file"
                        id="payoutFile"
                        accept=".json"
                        onChange={(e) => handleChange(e)}
                        required
                        className="text-left font-extralight text-gray-400 focus:outline-none bg-transparent w-full border-b-[1px] border-gray-300 dark:border-[#dfdfdf2e] "
                    />
                    <div className="col-span-2 flex justify-center mt-2">
                        <button
                            disabled={disable ? true : false}
                            type="submit"
                            className={` ${disable ? "opacity-50 " : "opacity-100 "
                                }text-center flex justify-center px-8 items-center gap-2  mx-auto text-white text-xl rounded-md p-2 font-light bg-[#F08D36]  transition-all duration-200 ease-in-out`}
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

export default page;