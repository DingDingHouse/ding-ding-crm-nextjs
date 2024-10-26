import Search from '@/components/Search'
import Table from '@/components/Table'
import { getAllClients } from '@/utils/action'
import React from 'react'

const page = async ({ searchParams }:any) => {
    const clients=await getAllClients(searchParams?.page)
    const tableData = {
        Thead: ['username', 'status', 'role', 'redeem', 'recharge', 'credits', 'action'],
        Tbody:['username', 'status', 'role', 'totalRedeemed','totalRecharged','credits']
    }



    return (
        <div className='pt-5'>
            <div className='pb-5'>
                <Search />
            </div>
            <Table paginationData={{currentPage:clients?.data?.currentPage,totalPage:clients?.data?.totalPages}} data={clients?.data?.subordinates} tableData={tableData} />
        </div>
    )
}

export default page
