import { getPlatform } from '@/utils/action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = async () => {
    const platforms = await getPlatform()
    return (
        <div className='grid grid-cols-12 px-3 lg:px-0 pt-2 gap-4 xl:gap-4'>
            {
                platforms?.map((platform: any, index: number) => (
                    <Link href={`/game/${platform?.name}`} key={platform?._id} className='flex gap-4 cursor-pointer hover:bg-opacity-45 transition-all dark:hover:bg-opacity-65 items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3'>
                        <div className='flex p-4 items-center'>
                            <Image src={'/assets/images/logo.png'} alt={'platform'} width={100} height={100} quality={100} className='w-[60px] xl:w-[80px]' />
                            <div className='dark:text-white text-base xl:text-lg text-black capitalize'>{platform?.name}</div>
                        </div>
                    </Link>
                ))
            }

        </div>
    )
}

export default page
