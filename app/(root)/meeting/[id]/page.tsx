

"use client"
import MeetingRoom from '@/components/MeetingRoom';


import MeetingSetup from '@/components/MeetingSetup';
import Loader from '@/components/loader';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'



const Meeting = ({params:{id}}: {params:{id:string}}) => {
  //to get the reactive user
  const{user,isLoaded} = useUser();

  const {call ,isCallLoading} = useGetCallById(id);

  //state 
  const [isSetupLoaded, setIsSetupLoaded] = useState(false);


  if(!isLoaded || isCallLoading) return <Loader/>

  

  return (

   
  <main className='h-screen w-full'>
    <StreamCall call={call}>
      <StreamTheme >
       {!isSetupLoaded?(
      
      <MeetingSetup setIsSetupLoaded={setIsSetupLoaded}></MeetingSetup>
       
       ):(<MeetingRoom/>)}
      </StreamTheme>
    </StreamCall>
  </main>
  )
}

export default Meeting