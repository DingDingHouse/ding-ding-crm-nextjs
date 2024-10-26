import { Poppins } from "next/font/google";
import "../../app/globals.css";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import StoreProvider from "@/redux/Providers";
import { SocketProvider } from "@/socket/SocketProvider";
import { getCookie } from "@/utils/cookie";

const inter = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

export const metadata = {
    title: "Ding-Ding-Crm",
    description: "Ding-Ding-Crm",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const token = await getCookie();
    return (
        <StoreProvider>
            <SocketProvider token={token as string}>
            <div className={`flex flex-1 dark:bg-black bg-white   ${inter.className}`}>
                <div className="lg:flex-.2 lg:w-full">
                    <Sidebar />
                </div>
                <div className="w-full flex-1  lg:flex-.9">
                    <div className="w-full">
                            <Header />
                            <div className="px-3 pt-1">
                            {children}
                            </div>
                    </div>
                </div>
                </div>
                </SocketProvider>
        </StoreProvider>
    );
}