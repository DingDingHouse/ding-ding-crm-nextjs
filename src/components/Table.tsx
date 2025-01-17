'use client'
import React, { useEffect, useState } from 'react'
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
import Arrow_Right from './svg/Arrow_Right'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import GetPlayerGameHistory from './modals/GetPlayerGameHistory'
import { rolesHierarchy } from '@/utils/common'
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useAppDispatch } from '@/utils/hooks'
import { setDragedData } from '@/redux/gameorder/gameorderSlice'
import { ChangeGamesOrder } from '@/utils/action'
import Loader from '@/utils/Load'



const Table = ({ data, tableData, page, gamePlatform, paginationData }: any) => {
    const [openIndex, setOpenIndex] = useState(null); // State to track which dropdown is open
    const [modalType, setModalType] = useState({ Type: "", id: '', prevStatus: '', Username: '', PrevGameData: null, TagName: '', platform: '', gameName: '' })
    const [openmodal, setOpenModal] = useState(false)
    const [range, setRange] = useState({ From: '', To: '' });
    const [openRange, setOpenRange] = useState(false)
    const [roles, setRoles] = useState<any>([])
    const [loading, setLoading] = useState(false);

    interface TableDataItem {
        _id: string;
        order?: number;
        [key: string]: any;
    }

    const [tabledata, setTableData] = useState<TableDataItem[]>([])
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [orderInputs, setOrderInputs] = useState<{ [key: string]: number }>({});

    const router = useRouter();
    const dispatch = useAppDispatch();
    const pathname = usePathname();

    const platform = pathname.match(/game\/([^/]+)/)?.[1] || '';

    const handleOpen = (index: any) => {
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index)); // Toggle the dropdown for the clicked index
    };

    useEffect(() => {
        if (data?.length > 0) {
            setTableData(data);
            const initialOrderInputs = data.reduce((acc: any, item: any, index: number) => {
                acc[item._id] = index + 1;
                return acc;
            }, {});
            setOrderInputs(initialOrderInputs);
        }
    }, [data])


    useEffect(() => {
        const user = Cookies.get("userToken");
        if (user) {
            const decodedUser: any = jwt.decode(user);
            const roles: any = rolesHierarchy(decodedUser.role)
            setRoles(roles)
        }
    }, [])


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


    const handelInputRange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRange({ ...range, [e.target.name]: parseInt(e.target.value) })
    }

    const handelSearchByCreditRange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (!range?.From || !range?.To) {
                toast.error('Enter valid number!')
                router.replace(`${pathname}?page=1&search=`)
            } else {
                router.replace(`${pathname}?page=1&search=&From=${range.From}&To=${range.To}`)
            }
        }
    }


    //Games Order Chaning Logic 

    const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const { value } = e.target;
        setOrderInputs((prev) => ({ ...prev, [id]: parseInt(value) }));
    };

    const handelChangeOrder = async (dragedData: any) => {
        setLoading(true);

        const formattedData = {
            gameOrders: dragedData.map((game: any) => ({
                gameId: game._id,
                order: game.order
            })),
            platformName: platform
        };

        try {
            const response = await ChangeGamesOrder(formattedData);
            if (response.data?.message) {
                toast.success(response.data?.message);
            } else {
                toast.error(response.error || "An unexpected error occurred");
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || "An error occurred");
            } else {
                toast.error("An error occurred");
            }
            console.log(error);
        } finally {
            setLoading(false);
            dispatch(setDragedData([]));
        }
    };

    const handleReorder = async () => {
        const newOrder = Object.entries(orderInputs).map(([id, order]) => ({
            _id: id,
            order,
        }));

        // Create a map of the new order
        const orderMap = new Map(newOrder.map(item => [item._id, item.order]));

        // Update the order of all items and sort them
        const sortedData = [...tabledata]
            .map(item => ({
                ...item,
                order: orderMap.get(item._id) || item.order,
            }))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((item, index) => ({
                ...item,
                order: index + 1,
            }));

        setTableData(sortedData);
        dispatch(setDragedData(sortedData));
        await handelChangeOrder(sortedData); // Call the API function
    };


    return (
        <>
            <div className="relative shadow-md h-[75vh] lg:h-auto overflow-auto lg:overflow-visible rounded">
                <table className="w-full text-sm text-left rtl:text-right rounded text-gray-500 dark:text-gray-400">
                    <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {page === 'game' && <th scope="col" className="px-6 py-3 text-left">Order</th>}

                            {
                                tableData.Thead.map((th: any) => (
                                    <th key={th} scope="col" className="px-6 py-3  text-left">
                                        <div className='flex items-center'>
                                            {th}
                                            {th === 'credits' && page !== 'subordinates' && <div className='relative pt-1 inline-block'>
                                                <button onClick={() => setOpenRange(true)} className='rotate-[90deg]'><Arrow_Right /></button>
                                                <div className={`flex ${openRange ? 'scale-100' : 'scale-0'} z-[51] transition-all items-center p-1 rounded gap-x-2 absolute right-0 bg-gray-300 dark:bg-gray-500 top-[100%]`}>
                                                    <input onKeyDown={(e) => handelSearchByCreditRange(e)} onChange={(e) => handelInputRange(e)} value={range?.From} name='From' type="number" className='p-2 rounded bg-gray-200 dark:bg-gray-400 outline-none dark:text-white placeholder:text-gray-500 ' placeholder='From...' />
                                                    <input onKeyDown={(e) => handelSearchByCreditRange(e)} onChange={(e) => handelInputRange(e)} value={range?.To} name='To' type="number" className='p-2 rounded bg-gray-200 dark:bg-gray-400 outline-none dark:text-white placeholder:text-gray-500 ' placeholder='to...' />
                                                </div>
                                            </div>}
                                        </div>
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {tabledata?.length > 0 ? (
                            tabledata?.map((item: any, ind: number) => (
                                <tr

                                    key={item?._id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    {page === 'game' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-base">
                                            <input
                                                type="number"
                                                value={orderInputs[item._id] || ''}
                                                onChange={(e) => handleOrderChange(e, item._id)}
                                                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 outline-none dark:text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out w-24"
                                                placeholder="Enter order"
                                            />
                                        </td>
                                    )}


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
                                                        : td === 'username' ? <Link href={roles?.includes(item?.role) ? `/clients/${item?._id}` : '#'} className="hover:text-[#FFD117] hover:scale-110 inline-block transition-all">{item[td]}</Link>
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
                                                                    <button onClick={() => handelOpenModal(button, item?._id, item?.status, item?.username, item, item?.tagName, '', '')} className={`block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-start dark:hover:text-white ${button === 'Change Password' ? 'text-blue-600' : ''}`}>
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
            {loading && <Loader />}

            {
                page === "game" && <button
                    onClick={handleReorder}
                    className="fixed bottom-10 right-10 z-50 mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
                >
                    Update Order
                </button>
            }


            {page !== 'game' && !popup?.includes(paginationData?.totalPage) && <Pagination paginationData={paginationData} />}
            {openIndex !== null && <div onClick={() => handleOpen(null)} className='bg-black fixed top-0 bg-opacity-35 left-0 w-full h-screen z-[50]'></div>}
            {openmodal && <Modal closeModal={handelCloseModal} modaltype={modalType} >{ModalContent}</Modal>}
            {openRange && <div onClick={() => setOpenRange(false)} className='bg-black fixed top-0 bg-opacity-35 left-0 w-full h-screen z-[50]'></div>}
        </>

    )
}

export default Table