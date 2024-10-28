"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import { setSidebarshow } from "@/redux/ReduxSlice";
import Profile from "../svg/Profile";
import Logo from "../svg/Logo";

const Sidebar = () => {
  const isSidebar = useAppSelector((state) => state.globlestate?.showSideBar)
  const dispatch = useAppDispatch()
  const pathname = usePathname();
  const [user, setUser] = useState<{
    username: string;
    role: string;
    credits: number;
  } | null>(null);
  const handelGetUser = async () => {
    try {
      const user = await Cookies.get("userToken");
      if (user) {
        const decodedUser: any = jwt.decode(user);
        setUser(decodedUser);
      }
    } catch (error) { }
  };
  useEffect(() => {
    handelGetUser();
  }, []);

  const [openDropdown, setOpenDropdown] = useState<number[]>([1]);
  const router = useRouter();
  const SideBarLink =
    user?.role === "company"
      ? [
        {
          LinkName: "Dashboard",
          Link: "/",
          icon: (
            <svg
              className="w-9  h-9  transition duration-75 text-[#FFD117] group-hover:text-[#FFD117] group-hover:bg-[#F08D36] rounded-2xl group-hover:bg-opacity-20 p-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 21"
            >
              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
          ),
        },
        {
          LinkName: "Clients",
          icon: (
            <svg
              className="w-9  h-9  transition duration-75 text-[#FFD117] group-hover:text-[#FFD117] group-hover:bg-[#F08D36] rounded-2xl group-hover:bg-opacity-20 p-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
            </svg>
          ),
          Link: "",
          showDropDown: true,
          nested: [
            {
              LinkName: "My Clients",
              Link: `/clients/my`,
              icon: "",
            },
            {
              LinkName: "All Clients",
              Link: "/clients/all",
              icon: "",
            },
            {
              LinkName: "Active Players",
              Link: "/clients/active-player",
              icon: "",
            },
            {
              LinkName: "Add Client",
              Link: "/clients/add",
              icon: "",
            },

          ],
        },
        {
          LinkName: "Transaction",
          Link: "",
          icon: (
            <svg
              className="w-9  h-9  transition duration-75 text-[#FFD117] group-hover:text-[#FFD117] group-hover:bg-[#F08D36] rounded-2xl group-hover:bg-opacity-20 p-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
              <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
              <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
            </svg>
          ),
          showDropDown: true,
          nested: [
            {
              LinkName: "My Transaction",
              Link: "/transactions/my",
              icon: "",
            },
            {
              LinkName: "All Transaction",
              Link: "/transactions/all",
              icon: "",
            },
          ],
        },
        {
          LinkName: "Games",
          Link: "",
          icon: (
            <svg
              className="w-9  h-9  transition duration-75 text-[#FFD117] group-hover:text-[#FFD117] group-hover:bg-[#F08D36] rounded-2xl group-hover:bg-opacity-20 p-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 21 21"
            >
              <path d="m5.4 2.736 3.429 3.429A5.046 5.046 0 0 1 10.134 6c.356.01.71.06 1.056.147l3.41-3.412c.136-.133.287-.248.45-.344A9.889 9.889 0 0 0 10.269 1c-1.87-.041-3.713.44-5.322 1.392a2.3 2.3 0 0 1 .454.344Zm11.45 1.54-.126-.127a.5.5 0 0 0-.706 0l-2.932 2.932c.029.023.049.054.078.077.236.194.454.41.65.645.034.038.078.067.11.107l2.927-2.927a.5.5 0 0 0 0-.707Zm-2.931 9.81c-.024.03-.057.052-.081.082a4.963 4.963 0 0 1-.633.639c-.041.036-.072.083-.115.117l2.927 2.927a.5.5 0 0 0 .707 0l.127-.127a.5.5 0 0 0 0-.707l-2.932-2.931Zm-1.442-4.763a3.036 3.036 0 0 0-1.383-1.1l-.012-.007a2.955 2.955 0 0 0-1-.213H10a2.964 2.964 0 0 0-2.122.893c-.285.29-.509.634-.657 1.013l-.01.016a2.96 2.96 0 0 0-.21 1 2.99 2.99 0 0 0 .489 1.716c.009.014.022.026.032.04a3.04 3.04 0 0 0 1.384 1.1l.012.007c.318.129.657.2 1 .213.392.015.784-.05 1.15-.192.012-.005.02-.013.033-.018a3.011 3.011 0 0 0 1.676-1.7v-.007a2.89 2.89 0 0 0 0-2.207 2.868 2.868 0 0 0-.27-.515c-.007-.012-.02-.025-.03-.039Zm6.137-3.373a2.53 2.53 0 0 1-.35.447L14.84 9.823c.112.428.166.869.16 1.311-.01.356-.06.709-.147 1.054l3.413 3.412c.132.134.249.283.347.444A9.88 9.88 0 0 0 20 11.269a9.912 9.912 0 0 0-1.386-5.319ZM14.6 19.264l-3.421-3.421c-.385.1-.781.152-1.18.157h-.134c-.356-.01-.71-.06-1.056-.147l-3.41 3.412a2.503 2.503 0 0 1-.443.347A9.884 9.884 0 0 0 9.732 21H10a9.9 9.9 0 0 0 5.044-1.388 2.519 2.519 0 0 1-.444-.348ZM1.735 15.6l3.426-3.426a4.608 4.608 0 0 1-.013-2.367L1.735 6.4a2.507 2.507 0 0 1-.35-.447 9.889 9.889 0 0 0 0 10.1c.1-.164.217-.316.35-.453Zm5.101-.758a4.957 4.957 0 0 1-.651-.645c-.033-.038-.077-.067-.11-.107L3.15 17.017a.5.5 0 0 0 0 .707l.127.127a.5.5 0 0 0 .706 0l2.932-2.933c-.03-.018-.05-.053-.078-.076ZM6.08 7.914c.03-.037.07-.063.1-.1.183-.22.384-.423.6-.609.047-.04.082-.092.129-.13L3.983 4.149a.5.5 0 0 0-.707 0l-.127.127a.5.5 0 0 0 0 .707L6.08 7.914Z" />
            </svg>
          ),

          showDropDown: true,
          nested: [
            {
              LinkName: "Platform",
              Link: "/game",
              icon: "",
            },
            {
              LinkName: "Add Game",
              Link: "/addgame",
              icon: "",
            },
          ],
        },
      ]
      : [
        {
          LinkName: "Dashboard",
          Link: "/",
          icon: (
            <svg
              className="w-9  h-9  transition duration-75 text-[#FFD117] group-hover:text-[#FFD117] group-hover:bg-[#F08D36] rounded-2xl group-hover:bg-opacity-20 p-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 21"
            >
              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
          ),
        },
        {
          LinkName: "Clients",
          icon: (
            <svg
              className="w-9  h-9  transition duration-75 text-[#FFD117] group-hover:text-[#FFD117] group-hover:bg-[#F08D36] rounded-2xl group-hover:bg-opacity-20 p-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
            </svg>
          ),
          Link: "",
          showDropDown: true,
          nested: [
            {
              LinkName: "My Clients",
              Link: `/clients/my?page=1`,
              icon: "",
            },
            {
              LinkName: "Add Client",
              Link: "/clients/add",
              icon: "",
            },
          ],
        },
        {
          LinkName: "Transaction",
          Link: "",
          icon: (
            <svg
              className="w-9  h-9  transition duration-75 text-[#FFD117] group-hover:text-[#FFD117] group-hover:bg-[#F08D36] rounded-2xl group-hover:bg-opacity-20 p-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
              <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
              <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
            </svg>
          ),
          showDropDown: true,
          nested: [
            {
              LinkName: "My Transaction",
              Link: "/transactions/my?page=1",
              icon: "",
            },
          ],
        },
      ];

  const toggleDropdown = (index: number) => {
    const currentIndex = openDropdown.indexOf(index);
    if (currentIndex === -1) {
      setOpenDropdown([...openDropdown, index]);
    } else {
      const newOpenDropdown = [...openDropdown];
      newOpenDropdown.splice(currentIndex, 1);
      setOpenDropdown(newOpenDropdown);
    }
  };

  //Logout Dispatch
  const handelLogout = () => {
    router.push("/logout");
    toast.success("Logout Successfully!");
  };

  return (
    <>
      <aside
        className={`fixed lg:sticky top-0  ${isSidebar ? 'left-0' : 'left-[-100%]'} w-[60%] lg:w-full z-40 h-screen transition-all  sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col justify-between px-3  overflow-y-auto bg-gray-100 dark:bg-gray-800">
          <div>
            <div className="flex p-2 gap-x-2 items-center">
              <div><Logo/></div>
              <div className="font-semibold font-mono text-black   dark:text-white tracking-wide">Ding Ding</div>
            </div>

            <ul className="space-y-2 pt-3 font-medium">
              {SideBarLink?.map((item, ind) => (
                <li key={ind}>
                  <Link href={item?.Link}>
                    <button
                      onClick={() => toggleDropdown(ind == 0 ? -1 : ind)}
                      type="button"
                      className={`flex items-center w-full p-2 text-base ${pathname===item?.Link&&'bg-gray-200 dark:bg-gray-700'} text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700`}
                    >
                      {item?.icon}
                      <span className={`flex-1 ${pathname===item?.Link&&'text-[#FFD117]'} ms-3 text-left group-hover:text-[#FFD117] rtl:text-right whitespace-nowrap`}>
                        {item?.LinkName}
                      </span>
                      <svg
                        className={`w-3 h-3 ${ind == 0 && "hidden"}`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </button>
                  </Link>
                  <ul
                    className={`py-2 space-y-2  transition-all ${ind == 0 ? "hidden" : "block"
                      } ${!openDropdown?.includes(ind)
                        ? "hidden h-0"
                        : "min-h-[100px] opacity-100"
                      }`}
                  >
                    {item?.nested?.map((subitem, subind) => (
                      <li key={subind} onClick={()=>dispatch(setSidebarshow(false))}>
                        <Link
                          href={subitem?.Link}
                          className={`flex items-center w-full p-2  ${pathname===subitem?.Link?'text-[#FFD117] dark:bg-gray-700 bg-gray-200':'text-gray-600 dark:text-white'} dark:hover:text-[#FFD117] hover:text-[#FFD117] transition duration-75 rounded-lg pl-11  hover:bg-gray-200 dark:hover:bg-gray-700`}
                        >
                          {subitem?.LinkName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full space-y-5 pb-2">
            {user && <div className="flex justify-center lg:hidden items-center space-x-1.5">
              <Profile />
              <div>
                <span className="dark:text-white tracking-wide block">{user?.username}</span>
                <span className="text-sm dark:text-gray-300 font-normal">({user?.role})</span>
              </div>
            </div>}
            <button
              onClick={handelLogout}
              className="flex mb-2 items-center w-full justify-center p-2  border-[#F08D36] border-[3px] hover:bg-opacity-45 transition-all  rounded-lg text-gray-800 dark:text-white bg-[#FFD117] bg-opacity-25 group"
            >
              <span className=" ms-3 pr-3 whitespace-nowrap">Logout</span>
              <svg
                className="flex-shrink-0 w-5 h-5 rotate-180  transition duration-75 text-gray-800 dark:text-white "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                />
              </svg>
            </button>
          </div>

        </div>
      </aside>
      {isSidebar && <div onClick={() => dispatch(setSidebarshow(false))} className="fixed top-0 lg:hidden transition-all left-0 h-screen w-full bg-black z-20 bg-opacity-50"></div>}
    </>
  );
};

export default Sidebar;
