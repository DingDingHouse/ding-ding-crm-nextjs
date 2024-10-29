
import React, { useEffect, useState } from 'react'
import Search from './Search'
import Table from './Table'
import { getSubordinateClients } from '@/utils/action'
import Loader from '@/utils/Load'

const Subclient = ({ subordinates_id, page }: any) => {
    const [data, setData] = useState<any>([])
    const [load,setLoad]=useState(false)
    const handelSubordinates = async () => {
        try {
            setLoad(true)
            const subordinates = await getSubordinateClients(subordinates_id, page)
            if (subordinates) {
                setData(subordinates?.data)
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
        Thead: ['username', 'status', 'role', 'redeem', 'recharge', 'credits', 'action'],
        Tbody: ['username', 'status', 'role', 'totalRedeemed', 'totalRecharged', 'credits']
    }
    return (
        <div className='pt-5'>
            {load ? <Loader /> : <Table page={'subordinates'} paginationData={{ currentPage: data?.currentPage, totalPage: data?.totalPages }} data={data?.subordinates} tableData={tableData} />}
        </div>
    )
}

export default Subclient
