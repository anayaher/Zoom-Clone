import React, { ReactNode } from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
  

interface modalProps
{
    isOpen: boolean,
    onClose:()=>void,
    title:string,
    className?:string,
    buttonText?:string,
    buttonIcon?:string,
    children?:ReactNode,
    image?:string
    handleClick?:()=>void,
}

const MeetingModal = ({isOpen,onClose,title,buttonIcon,className,buttonText,handleClick,children,image}: modalProps) => {
  return (
  
<Dialog open = {isOpen} onOpenChange={onClose}>
  <DialogContent className='flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white'>
    <div
    className='flex flex-col gap-6'
    >
        {image &&(
            <div
            className=' flex justify-center'>
                <Image 
                src={image}
                alt='Image'
                width={72}
                height={72}/>
            </div>
        )}
        <h1 className={cn('text-3xl font-bold leading-[42px]',className )}>{title}</h1>
        {children}
        <Button  onClick = {handleClick} className='bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0'>

        {buttonIcon&&(
                <Image
                src={buttonIcon}
                alt='buttonIcon'
                width={13}
                height={13}/>
            )}&nbsp;
            {buttonText || 'Shcedule Meeting'}

         

        </Button>

    </div>
  </DialogContent>
</Dialog>



  )
}

export default MeetingModal