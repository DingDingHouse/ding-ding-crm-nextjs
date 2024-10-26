import Search from '@/components/Search'
import Table from '@/components/Table'
import {getTransactions } from '@/utils/action'
import React from 'react'

const page = async ({ searchParams }:any) => {
    const MyTransaction:any = await getTransactions(searchParams?.page,'')
    const tableData = {
        Thead: ['status', 'Amount', 'Sender', 'Receiver', 'Transaction Date'],
        Tbody:['type', 'amount', 'debtor', 'creditor','updatedAt']
    }

    return (
        <div className='pt-5'>
            <div className='pb-5'>
                <Search />
            </div>
            <Table paginationData={{currentPage:MyTransaction?.data?.currentPage,totalPage:MyTransaction?.data?.totalPages}} data={MyTransaction?.data?.transactions} tableData={tableData} />
        </div>
    )
}

export default page
