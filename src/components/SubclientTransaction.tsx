import React, { useEffect, useState } from 'react'
import Search from './Search'
import Table from './Table'
import { getSubordinateTransactions } from '@/utils/action'
import Loader from '@/utils/Load'

const SubclientTransaction = ({ subordinates_id, page }: any) => {
    const [data, setData] = useState<any>([])
    const [load,setLoad]=useState(false)
    const handelSubordinates = async () => {
        try {
            setLoad(true)
            const Transaction = await getSubordinateTransactions(subordinates_id, page)
            if (Transaction) {
                setData(Transaction?.data)
            }
            setLoad(false)
        } catch (error) {
            setLoad(false)
        }   
    }

    useEffect(() => {
       handelSubordinates() 
    }, [subordinates_id, page])
    
    const tableData = {
        Thead: ['status', 'Amount', 'Sender', 'Receiver', 'Transaction Date'],
        Tbody:['type', 'amount', 'debtor', 'creditor','updatedAt']
    }

    return (
        <div className='pt-5'>
           
            {load ? <Loader /> : <Table page={'subordinates'} paginationData={{ currentPage: data?.currentPage, totalPage: data?.totalPages }} data={data?.transactions} tableData={tableData} />}
        </div>
    )
}

export default SubclientTransaction
