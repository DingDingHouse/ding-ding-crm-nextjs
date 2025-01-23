import React, { useEffect, useState } from 'react';
import Arrow_Left from './svg/Arrow_Left';
import Arrow_Right from './svg/Arrow_Right';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/utils/hooks';

const Pagination = ({ paginationData }: any) => {
    const pathname = usePathname();
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState<any>(1);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const sort = useAppSelector((state) => state?.globlestate?.isDataSorting)
    // Function to handle previous page
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage: any) => prevPage - 1);
        }
    };

    // Function to handle next page
    const handleNext = () => {
        if (currentPage < paginationData?.totalPage) {
            setCurrentPage((prevPage: any) => prevPage + 1);
        }
    };

    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false);
            return;
        } else {
            const queryParams = new URLSearchParams();

            queryParams.set('page', currentPage);
            queryParams.set('sort', sort ? 'desc' : 'asc');

            if (paginationData?.search) queryParams.set('search', paginationData.search);
            if (paginationData?.From) queryParams.set('From', paginationData.From);
            if (paginationData?.To) queryParams.set('To', paginationData.To);

            const queryString = queryParams.toString();
            const newUrl = `${pathname}?${queryString}`;

            router?.replace(newUrl);
        }

    }, [currentPage, sort]);

    useEffect(() => {
        setCurrentPage(paginationData?.currentPage)
    }, [paginationData?.currentPage])

    return (
        <div className='flex justify-end dark:text-white text-gray-600 pt-3 pb-4 pr-2'>
            <div className='flex items-center transition-all space-x-2'>
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className={`dark:hover:text-[#FFD117] hover:text-[#FFD117] text-black dark:text-white ${currentPage === 1 ? 'opacity-50' : ''}`}
                >
                    <Arrow_Left />
                </button>
                <span className='text-sm'>Page</span>
                <span className='text-[#FFD117]'>{currentPage}</span>
                <span className='text-sm'>Of</span>
                <span className='text-[#FFD117]'>{paginationData?.totalPage}</span>
                <button
                    onClick={handleNext}
                    disabled={currentPage === paginationData?.totalPage}
                    className={`dark:hover:text-[#FFD117] hover:text-[#FFD117] text-black dark:text-white ${currentPage === paginationData?.totalPage ? 'opacity-50' : ''}`}
                >
                    <Arrow_Right />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
