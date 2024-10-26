import Search from '@/components/Search'
import Table from '@/components/Table'
import {getTransactions } from '@/utils/action'
import React from 'react'

const page = async ({ searchParams }:any) => {
    const AllTransaction:any = await getTransactions(searchParams?.page,'all')
    const tableData = {
        Thead: ['status', 'Amount', 'Sender', 'Receiver', 'Transaction Date'],
        Tbody:['type', 'amount', 'debtor', 'creditor','updatedAt']
    }

    return (
        <div className='pt-5'>
            <div className='pb-5'>
                <Search />
            </div>
            <Table paginationData={{currentPage:AllTransaction?.data?.currentPage,totalPage:AllTransaction?.data?.totalPages}} data={AllTransaction?.data?.transactions} tableData={tableData} />
        </div>
    )
}

export default page
