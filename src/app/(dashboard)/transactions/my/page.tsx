import Search from '@/components/Search'
import Table from '@/components/Table'
import {GetMyTransactions} from '@/utils/action'
import React from 'react'

const page = async ({ searchParams }:any) => {
    const transactions = await GetMyTransactions(searchParams?.search,searchParams?.page,'',searchParams?.sort)
   
    const tableData = {
        Thead: ['status', 'Amount', 'Sender', 'Receiver', 'Transaction Date'],
        Tbody:['type', 'amount', 'debtor', 'creditor','updatedAt']
    }

    return (
        <div className='pt-5'>
            <div className='pb-5'>
                <Search />
            </div>
            <Table paginationData={{ currentPage: transactions?.currentPage, totalPage: transactions?.totalPages, search:searchParams?.search,sort:searchParams?.sort}} data={transactions?.transactions} tableData={tableData} />
        </div>
    )
}

export default page
