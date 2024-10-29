import Search from '@/components/Search'
import Table from '@/components/Table'
import { getGames } from '@/utils/action'
import React from 'react'

const page = async ({ params,searchParams }: any) => {
  const games: any = await getGames("milkyway", params?.plateform)
  const tableData = {
    Thead: ['Thumbnail', 'Game Name', 'Category', 'Type', 'Status', 'Slug', 'action'],
    Tbody: ['thumbnail', 'name', 'category', 'type', 'status', 'slug']
  }

  const filteredGames = games?.length>0&&games?.filter((game: any) =>
    game.name?.toLowerCase().includes(searchParams?.search?.toLowerCase())
  );
  
  const finalGames = filteredGames.length > 0 ? filteredGames : games;
  
  return (
    <div className='pt-5'>
      <div className='pb-5'>
        <Search />
      </div>
      <Table page={'game'} gamePlatform={params?.plateform} data={finalGames} tableData={tableData} />
    </div>
  )
}

export default page
