import {
    addPayout,
    deletePayout,
    fetchPayoutversion,
    setPayoutActive,
} from "@/utils/action";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineCloudDone, MdOutlineDriveFolderUpload } from "react-icons/md";
import toast from "react-hot-toast";
import Modal from "../Modal";
import { FaCircle } from "react-icons/fa6";
import Threedots from "../svg/Threedots";
import Loader from "@/utils/Load";
import DeleteUser from "./DeleteUser";

const GamePayout = ({ tagname, platform, closeModal }: any) => {
    const [payoutData, setPayoutData] = useState<any>();
    const [payout, setPayout] = useState(null);
    const [submodalOpen, setSubmodalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);
    const fileInputRef: any = useRef(null);
    const [openIndex, setOpenIndex] = useState(null); // State to track which dropdown is open
    const [modalType, setModalType] = useState({ Type: "", TagName: '', RowData: '' })


    const handleChange = (e: any) => {
        setPayout(e.target.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (payout == null) {
            return toast.error("Payout is required");
        }
        const data = new FormData();
        data.append("tagName", tagname);
        data.append("platform", platform);
        data.append("payoutFile", payout);
        setLoad(true);
        const response = await addPayout(data);
        setLoad(false);
        if (response?.error) {
            return toast.error(response.error);
        }
        fileInputRef.current.value = null;
        setPayout(null);
        toast.success(response.message);
        fetchPayoutData(tagname, platform);
    };

    const handleDelete = async () => {
        setLoad(true);
        const response = await deletePayout(modalType?.TagName, modalType?.RowData);
        setLoad(false);
        if (response?.error) {
            return toast.error(response.error);
        }
        toast.success(response.message);
        setSubmodalOpen(false);
        fetchPayoutData(tagname, platform);
    };

    const handelCloseModal = () => {
        setSubmodalOpen(false);
    }

    let ModalContent;
    switch (modalType?.Type) {
        case "Delete_Payout":
            ModalContent = <DeleteUser deletePayout={handleDelete} closeModal={handelCloseModal} />;
            break;
        default:
            ModalContent = null;
    }


    const handleActive = async (version: any) => {
        setLoad(true);
        const response = await setPayoutActive(tagname, version, platform);
        setLoad(false);
        if (response?.error) {
            return toast.error(response.error);
        }
        toast.success(response.message);
        fetchPayoutData(tagname, platform);
        setOpenIndex(null)
    };

    const fetchPayoutData = async (tagname: string, platform: string) => {
        setLoading(true);
        const response = await fetchPayoutversion(tagname, platform);
        setLoading(false);
        if (response?.error) {
            return toast.error(response.error);
        }
        setPayoutData(response);
    };

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const options: any = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        };
        return new Intl.DateTimeFormat("en-US", options).format(date);
    }

    useEffect(() => {
        fetchPayoutData(tagname, platform);
    }, [tagname]);

    const handleOpen = (index: any) => {
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index)); // Toggle the dropdown for the clicked index
    };


    const handelOpenModal = (type: string, TagName: string, RowData: string) => {
        setModalType({ Type: type, TagName: TagName, RowData: RowData })
        setSubmodalOpen(true)
        setOpenIndex(null);
    }
    const buttons = ['Make Active', 'Delete']
    const indexs=[0,1]
    return (
        <div className="flex flex-col gap-4">
            <form
                onSubmit={(e) => handleSubmit(e)}
                className="w-full items-center flex flex-col justify-center gap-4"
            >
                <label
                    htmlFor="file-upload"
                    className={`border-[2px] border-gray-300  hover:border-black hover:text-black  dark:border-[#dfdfdf4a] dark:text-[#dfdfdf4a] dark:hover:text-white transition-all duration-150 dark:hover:border-white rounded-xl w-full text-center py-8 cursor-pointer font-light flex justify-center`}
                >
                    {payout ? (
                        <span className="flex text-gray-700 dark:text-white">
                            <span className="my-auto mr-2 t text-2xl">
                                <MdOutlineCloudDone />
                            </span>
                            file Uploaded
                        </span>
                    ) : (
                        <span className="flex text-gray-700 dark:text-white">
                            <span className="my-auto mr-2 text-2xl">
                                <MdOutlineDriveFolderUpload />
                            </span>
                            Upload a version
                        </span>
                    )}
                </label>
                <input
                    name="payoutFile"
                    id="file-upload"
                    accept=".json"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleChange(e)}
                    ref={fileInputRef}
                />
                {payout && (
                    <button className="px-6 py-2 bg-[#27a5ff] rounded-lg hover:opacity-60 text-white">
                        Submit
                    </button>
                )}
            </form>
            <div className="flex flex-col gap-2">
                <h4 className="text-xl font-md py-2 dark:text-white">Payouts Versions: </h4>
                <div className="max-h-[200px] min-h-[200px] overflow-auto flex flex-col gap-2">
                    {payoutData ? (
                        payoutData?.length > 0 &&
                        payoutData?.map((item: any, index: number) => (
                            <div
                                key={index}
                                className="flex w-full justify-between px-4 py-1 text-md bg-gray-100 hover:bg-gray-200 dark:bg-[#5d535324] rounded-md"
                            >
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`text-[8px] ${item.isActive === true
                                                ? "text-[#70ef44]"
                                                : "text-[#ef4444]"
                                                }`}
                                        >
                                            <FaCircle size={12}/>
                                        </span>
                                        <div>
                                            <p className="dark:text-white">{item.name}</p>
                                            <p className="text-[#1914148e] dark:text-[#cfc6c686] text-[12px]">
                                                {formatDate(item.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {(
                                    <div className={`flex items-center ${item?.isActive&&'hidden'} justify-start pl-5 space-x-5`}>
                                        <div className='relative'>
                                            <button onClick={() => handleOpen(index)} className=' hover:bg-gray-200 dark:hover:bg-black transition-all text-[#27a5ff] p-1 rounded-lg '>
                                                <Threedots />
                                            </button>
                                            <div className={` ${openIndex === index ? 'scale-100' : 'scale-0'} z-[51] transition-all absolute   ${indexs?.includes(index) ? 'top-[100%]' : 'bottom-0'} right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                                                <ul className="py-2 text-sm text-gray-700 px-2 dark:text-gray-200" aria-labelledby="dropdownDelayButton">
                                                    {
                                                        buttons?.map((button, index) => (
                                                            <li key={index}>
                                                                <button onClick={() => button === "Make Active" ? handleActive(item?.name) : handelOpenModal('Delete_Payout', tagname, item?.name)} className={`block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-start dark:hover:text-white ${button === 'Change Password' ? 'text-blue-600' : ''}`}>
                                                                    {button}
                                                                </button>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <Loader />
                    )}
                </div>
            </div>
            {submodalOpen && <Modal closeModal={handelCloseModal} modaltype={modalType} >{ModalContent}</Modal>}
            {openIndex !== null && <div onClick={() => handleOpen(null)} className='bg-black rounded-xl fixed top-0 bg-opacity-35 left-0 w-full h-full z-[50]'></div>}
            {load && <Loader />}
        </div>
    );
};

export default GamePayout;
