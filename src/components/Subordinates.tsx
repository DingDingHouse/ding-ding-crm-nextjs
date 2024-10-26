"use client"
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { IoChevronBackOutline } from 'react-icons/io5';
import Dashboard from './Dashboard';
import Subclient from './Subclient';
import SubclientTransaction from './SubclientTransaction';

const Subordinates = ({ subordinateData, id ,page}: any) => {
    const [option, setOption] = React.useState("report");
    const router = useRouter()
    const pathname = usePathname()

    let ModalContent;
    switch (option) {
        case "report":
            ModalContent = <Dashboard subordinates_id={id} />;
            break;
        case "subordinates":
            ModalContent = <Subclient subordinates_id={id} page={page} />;
            break;
        case "transactions":
            ModalContent = <SubclientTransaction subordinates_id={id} page={page}/>;
            break;
        default:
            ModalContent = null;
    }
    return (
        <>
            <div className="min-h-full h-auto ">
                <div className="md:w-[100%] m-auto py-6 flex flex-col md:flex-row justify-between">
                    <div className="flex lg:space-x-2">
                        <div
                            onClick={() => {
                                router.back();
                            }}
                            className="dark:text-white cursor-pointer text-3xl lg:text-4xl my-auto opacity-40"
                        >
                            <IoChevronBackOutline />
                        </div>
                        <div>
                            <h1 className="text-xl lg:text-2xl text-black font-semibold dark:text-white capitalize">
                                {subordinateData?.username}
                            </h1>
                            <p className="text-sm lg:text-md font-extralight text-black dark:text-gray-400 capitalize">
                                <span>{subordinateData?.role}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2  text-sm md:text-base lg:gap-5 mt-5 ">
                        <button
                            onClick={() => {
                                setOption("report");
                            }}
                            className={`px-4  rounded-full ${option === "report"
                                ? "text-white bg-opacity-80 border-[#27a5ff] bg-[#27a5ff]"
                                : "dark:text-[#f4f2f2ac] border-gray-700"
                                } border-[3px] `}
                        >
                            Report
                        </button>
                        {subordinateData?.role !== "player" && (
                            <button
                                onClick={() => {
                                    setOption("subordinates");
                                    router.push(`${pathname}?page=1`);
                                }}
                                className={`px-4  rounded-full ${option === "subordinates"
                                    ? "text-white bg-opacity-80 border-[3px] border-[#27a5ff] bg-[#27a5ff]"
                                    : "dark:text-[#f4f2f2ac] border-gray-700"
                                    } border-[3px]  transition-all`}
                            >
                                Subordinates
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setOption("transactions");
                                router.push(`${pathname}?page=1`);
                            }}
                            className={`px-4  rounded-full ${option === "transactions"
                                ? "text-white bg-opacity-80 border-[3px] border-[#27a5ff] bg-[#27a5ff]"
                                : "dark:text-[#f4f2f2ac] border-gray-700"
                                } border-[3px] transition-all`}
                        >
                            Transactions
                        </button>
                    </div>
                </div>
            </div>
            {ModalContent}
        </>
    )
}

export default Subordinates
