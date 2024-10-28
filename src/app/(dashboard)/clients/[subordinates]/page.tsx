import Subordinates from '@/components/Subordinates';
import { getUserReport } from '@/utils/action'
import React from 'react'

const page = async ({ params,searchParams }: any) => {
    const response = await getUserReport(params?.subordinates,'daily');
    return (
        <>
            <Subordinates  page={searchParams?.page} subordinateData={response} id={params?.subordinates} />    
      </>
  )
}

export default page
