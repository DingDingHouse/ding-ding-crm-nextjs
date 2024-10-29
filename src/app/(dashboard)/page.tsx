import Dashboard from '@/components/Dashboard'
import { getUserData } from '@/utils/action'
import React from 'react'

const page = async () => {
  const userData=await getUserData()
  return (<Dashboard userDetail={userData} />)
}

export default page
