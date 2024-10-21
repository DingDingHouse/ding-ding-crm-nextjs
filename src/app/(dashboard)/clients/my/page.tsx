import Search from '@/components/Search'
import Table from '@/components/Table'
import { getMyClients } from '@/utils/action'
import React from 'react'

const page = async ({ searchParams }: any) => {
    const clients = await getMyClients(searchParams?.page)
    const tableData = {
        Thead: ['username', 'status', 'role', 'redeem', 'recharge', 'credits', 'action'],
        Tbody: ['username', 'status', 'role', 'totalRedeemed', 'totalRecharged', 'credits']
    }



    return (
        <div className='pt-5'>
            <div className='pb-5'>
                <Search />
            </div>
            <Table data={clients?.data?.subordinates} tableData={tableData} />
        </div>
    )
}

export default page