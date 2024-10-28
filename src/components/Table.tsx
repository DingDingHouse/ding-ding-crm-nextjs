'use client'
import React, { useState } from 'react'
import Threedots from './svg/Threedots'
import Delete from './svg/Delete'
import Modal from './Modal'
import ChangePassword from './modals/ChangePassword'
import Recharge from './modals/Recharge'
import UpdateStatus from './modals/UpdateStatus'
import DeleteUser from './modals/DeleteUser'
import Image from 'next/image'
import EditGames from './modals/EditGames'
import GamePayout from './modals/GamePayout'
import Link from 'next/link'
import Pagination from './Pagination'

const Table = ({ data, tableData, page, gamePlatform, paginationData }: any) => {
    const [openIndex, setOpenIndex] = useState(null); // State to track which dropdown is open
    const [modalType, setModalType] = useState({ Type: "", id: '', prevStatus: '', Username: '', PrevGameData: null, TagName: '', platform: '', gameName: '' })
    const [openmodal, setOpenModal] = useState(false)
    const handleOpen = (index: any) => {
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index)); // Toggle the dropdown for the clicked index
    };

    const buttons = page === 'game' ? ['Edit Game', 'Manage Payout'] : ['Change  Password', 'Recharge', 'Redeem', 'Update Status']

    const handelOpenModal = (type: string, id: string, prevStatus: string, Username: string, prevGameData: any, TagName: string, Platform: string, gameName: string) => {
        setModalType({ Type: type, id: id, prevStatus: prevStatus, Username: Username, PrevGameData: prevGameData, TagName: TagName, platform: Platform, gameName: gameName });
        setOpenModal(true)
        setOpenIndex(null);
    }

    const handelCloseModal = () => {
        setOpenModal(false)
    }

    let ModalContent;
    switch (modalType?.Type) {
        case "Change  Password":
            ModalContent = <ChangePassword id={modalType?.id} closeModal={handelCloseModal} />;
            break;
        case "Recharge":
            ModalContent = <Recharge id={modalType?.id} closeModal={handelCloseModal} modalType={modalType?.Type} />;
            break;
        case "Redeem":
            ModalContent = <Recharge id={modalType?.id} closeModal={handelCloseModal} modalType={modalType?.Type} />;
            break;
        case "Update Status":
            ModalContent = <UpdateStatus id={modalType?.id} closeModal={handelCloseModal} prevStatus={modalType?.prevStatus} />;
            break;
        case "delete_client":
            ModalContent = <DeleteUser id={modalType?.id} closeModal={handelCloseModal} Username={modalType?.Username} platform={modalType?.platform} gameName={modalType?.gameName} />
            break;
        case "Edit Game":
            ModalContent = <EditGames id={modalType?.id} closeModal={handelCloseModal} platform={gamePlatform} prevData={modalType?.PrevGameData} />
            break;
        case "Manage Payout":
            ModalContent = <GamePayout id={modalType?.id} closeModal={handelCloseModal} platform={gamePlatform} tagname={modalType?.TagName} />
            break;
        default:
            ModalContent = null;
    }

    const popup = [0, 1]

    return (
        <>
            <div className="relative shadow-md  overflow-auto lg:overflow-visible rounded">
                <table className="w-full text-sm text-left rtl:text-right rounded text-gray-500 dark:text-gray-400">
                    <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {
                                tableData.Thead.map((th: any) => (
                                    <th key={th} scope="col" className="px-6 py-3 text-left">
                                        {th}
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {data?.length > 0 ? (
                            data.map((item: any, ind: number) => (
                                <tr
                                    key={item?._id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    {tableData?.Tbody?.map((td: any) => {
                                        let tdClass = "px-6 py-4 whitespace-nowrap text-base ";

                                        switch (td) {
                                            case 'status':
                                                tdClass += item[td] === 'active' ? ' text-green-600' : ' text-red-600';
                                                break;

                                            case 'type':
                                                tdClass += item[td] === 'recharge'
                                                    ? ' text-green-600'
                                                    : item[td] === 'redeem'
                                                        ? ' text-red-600'
                                                        : '';
                                                break;

                                            default:
                                                break;
                                        }

                                        return (
                                            <td key={td} className={tdClass}>
                                                {td === "updatedAt" ? new Date(item[td]).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                                                    : td === 'thumbnail' ? <Image src={item[td]} alt={item[td]} quality={100} width={400} height={400} className="w-[80px]" />
                                                        : td === 'username' ? <Link href={`/clients/${item?._id}`} className="hover:text-[#FFD117] hover:scale-110 inline-block transition-all">{item[td]}</Link>
                                                            : item[td]}
                                            </td>
                                        );
                                    })}
                                    {/* Action buttons */}
                                    {tableData.Thead[tableData.Thead?.length - 1] === "action" && (
                                        <td>
                                            <div className="flex items-center justify-start pl-5 space-x-5">
                                                <div className="relative">
                                                    <button onClick={() => handleOpen(ind)} className="hover:bg-gray-200 dark:hover:bg-black transition-all text-[#FFD117] p-1 rounded-lg">
                                                        <Threedots />
                                                    </button>
                                                    <div className={` ${openIndex === ind ? 'scale-100' : 'scale-0'} z-[51] transition-all absolute ${popup?.includes(ind) ? 'top-[100%]' : 'bottom-0'} right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                                                        <ul className="py-2 text-sm text-gray-700 px-2 dark:text-gray-200" aria-labelledby="dropdownDelayButton">
                                                            {buttons.map((button, index) => (
                                                                <li key={index}>
                                                                    <button onClick={() => handelOpenModal(button, item?._id, item?.status, '', item, item?.tagName, '', '')} className={`block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-start dark:hover:text-white ${button === 'Change Password' ? 'text-blue-600' : ''}`}>
                                                                        {button}
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <button onClick={() => handelOpenModal('delete_client', item?._id, '', item?.username, '', '', gamePlatform, (page === 'game' && item?.name))} className="transition-all hover:bg-gray-200 dark:hover:bg-black text-red-600 p-1 rounded-lg">
                                                    <Delete />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={tableData?.Thead?.length} className="py-3 text-center">
                                    Data Not Found!
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
                {/* Pagination */}
            </div>
            {page !== 'game' && !popup?.includes(paginationData?.totalPage) && <Pagination paginationData={paginationData} />}
            {openIndex !== null && <div onClick={() => handleOpen(null)} className='bg-black fixed top-0 bg-opacity-35 left-0 w-full h-screen z-[50]'></div>}
            {openmodal && <Modal closeModal={handelCloseModal} modaltype={modalType} >{ModalContent}</Modal>}
        </>

    )
}

export default Table
