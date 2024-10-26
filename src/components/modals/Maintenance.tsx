import Loader from "@/utils/Load";
import { UpdateMaintenance, getToggle } from "@/utils/action";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../Modal";

const Maintenance = ({ closeModal, fetchDate }: any) => {
    const [startDate, setStartDate] = useState("");
    const [ismaintennence, setIsMaintenance] = useState(false)
    const [countdown, setCountdown] = useState({ day: 0, hour: 0, minute: 0, second: 0 })
    const [load, setLoad] = useState(false)
    const [openmodal, setOpenModal] = useState(false)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
    };

    const fetchAvilableDate = async () => {
        setLoad(true)
        const response = await getToggle();
        if (response) {
            console.log(response, "asdfasd")
            const today = new Date();
            today?.setHours(0, 0, 0, 0);

            const availableDate = new Date(response.availableAt);
            setIsMaintenance(response?.underMaintenance)
            if (availableDate) {
                startCountdown(new Date(availableDate));
            }
            if (availableDate?.getTime() === today.getTime()) {
                updateToggleValue("null");
            }
        }
        setLoad(false)

    };

    useEffect(() => {
        fetchAvilableDate()
    }, [fetchDate])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!startDate) {
            return toast.error("Please select a valid date");
        } else {
            updateToggleValue(startDate);
        }
        setStartDate("");
    };




    const updateToggleValue = async (startDate: string) => {
        let availableAt = "null";
        if (startDate !== "null") {
            availableAt = new Date(startDate).toISOString();
        }
        setLoad(true)
        const response: any = await UpdateMaintenance(availableAt);
        if (response?.error) {
            toast.error(response?.error);
            closeModal();
        }
        if (response?.availableAt) {
            closeModal()
            toast.success("Maintenance scheduled successfully");
        } else {
            closeModal(); 
        }
        setLoad(false)
    };

    function startCountdown(targetDate: Date) {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const targetTime = targetDate.getTime();

            // Calculate the difference in milliseconds
            const difference = targetTime - now;

            // If the countdown is over, clear the interval and return
            if (difference <= 0) {
                clearInterval(interval);
                fetchAvilableDate();
                return;
            }

            // Calculate the remaining time
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Output or return the remaining time
            setCountdown({ day: days, hour: hours, minute: minutes, second: seconds });

            return () => clearInterval(interval);
        }, 1000);
    }

    const handelCloseModal = () => {
        setOpenModal(false)
    }

    const HandelStopTimer = () => {
        updateToggleValue('null');
        closeModal();
    }

    const ModalContent = (
        <div>
            <div className="text-gray-600 dark:text-white text-center text-base">Are You Sure You Want to Stop Countdown?</div>
            <div className="flex items-center justify-center space-x-10 pt-5">
                <button onClick={handelCloseModal} className="bg-gray-400 px-6 py-1.5 hover:bg-opacity-65 transition-all rounded-md">No</button>
                <button onClick={HandelStopTimer} className="bg-red-600 px-6 py-1.5 hover:bg-opacity-65 text-white transition-all rounded-md">Yes</button>
            </div>
        </div>
    )

    return (
        <div>
            {!ismaintennence ? <div className="flex items-center justify-center">
                <form onSubmit={(e) => handleSubmit(e)} className="flex gap-5 items-center">
                    {(
                        <input
                            id="m-input"
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => handleChange(e)}
                            className="appearance-none bg-[#dfdfdf] dark:bg-[#4e4c4cea] dark:text-white text-black px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                        />
                    )}
                    <button
                        className="text-center flex justify-center px-6 hover:bg-opacity-65 items-center gap-2  mx-auto text-white text-xl rounded-md p-2 font-light bg-[#27a5ff] transition-all duration-200 ease-in-out"
                        type="submit"
                    >
                        {"Submit"}
                    </button>
                </form>
            </div> :
                <div>
                    <div>
                        <p className="pb-8 text-center text-white text-xl font-bold">
                            Site Is In Maintenance
                        </p>
                    </div>
                    <div className="flex items-center justify-center space-x-3 text-2xl">
                        <span className="bg-[#27a5ff] px-4 rounded-xl text-white bg-opacity-50 border-[3px] border-[#27a5ff] py-2">{countdown?.day} </span>
                        <span className="text-white">:</span>
                        <span className="bg-[#27a5ff] px-4 rounded-xl text-white bg-opacity-50 border-[3px] border-[#27a5ff] py-2">{countdown?.hour} </span>
                        <span className="text-white">:</span>
                        <span className="bg-[#27a5ff] px-4 rounded-xl text-white bg-opacity-50 border-[3px] border-[#27a5ff] py-2">{countdown?.minute} </span>
                        <span className="text-white">:</span>
                        <span className="bg-[#27a5ff] px-4 rounded-xl text-white bg-opacity-50 border-[3px] border-[#27a5ff] py-2">{countdown?.second}</span>
                    </div>
                    <div className="pt-8">
                        <button
                            onClick={() => setOpenModal(true)}
                            className="text-center flex justify-center px-4 items-center gap-2  mx-auto text-white text-xl rounded-md p-2 font-light bg-[#27a5ff] hover:bg-opacity-65 transition-all duration-200 ease-in-out"
                        >
                            Stop Countdown
                        </button>
                    </div>
                </div>
            }
            {openmodal && <Modal closeModal={handelCloseModal}>{ModalContent}</Modal>}
            {load && <Loader />}
        </div>
    );
};

export default Maintenance;