import Search from '@/components/Search'
import Table from '@/components/Table'
import { GetMyClients } from '@/utils/action'
import React from 'react'

const page = async ({ searchParams }: any) => {
    const query = {
        credits: {
            From: Number(searchParams?.From), To: Number(searchParams?.To)
        }
    }
    const clients = await GetMyClients((searchParams?.search || ''), (searchParams?.page || 1), query, searchParams?.sort, searchParams?.startDate,
        searchParams?.endDate)

    const tableData = {
        Thead: ['username', 'status', 'role', 'redeem', 'recharge', 'credits', 'action'],
        Tbody: ['username', 'status', 'role', 'totalRedeemed', 'totalRecharged', 'credits']
    }


    return (
        <div className='pt-5'>
            <div className='pb-5'>
                <Search page={'client'}/>
            </div>
            <Table paginationData={{
                currentPage: clients?.currentPage, totalPage: clients?.totalPages, search: searchParams?.search, From: searchParams?.From, To: searchParams?.To, sort: searchParams?.sort, startDate: searchParams?.startDate,
                endDate: searchParams?.endDate
            }} data={clients?.subordinates} tableData={tableData} />
        </div>
    )
}

export default page