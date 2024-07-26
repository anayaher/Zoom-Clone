'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { useToast } from './ui/use-toast'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input'
import { link } from 'fs'



const MeetingTypeList = () => {

    const router = useRouter();
    const{toast} = useToast();
    const{user} = useUser();
    const  client = useStreamVideoClient()
    const [values, setvalues] = useState({
      dateTime:new Date(),
      decsription:'',
      link:''
    });

    const [callDetails, setcallDetails] = useState<Call>()

    const createMeeting = async()=>
    {
      if(!user || !client) return;

      try{
        const id = crypto.randomUUID();
        const call = client.call('default',id);

        if(!call) throw Error('Failed to create a Call!');
        const startsAt =values.dateTime.toISOString() || new Date(Date.now()).toISOString();
        const desc = values.decsription || 'Instant Meeting';
        

        await call.getOrCreate(
          {
            data:{
              starts_at:startsAt,
              custom:{
                description:desc,
              }
            }
          });
          setcallDetails(call);

          if(!values.decsription)
            {
              router.push(`/meeting/${call.id}`);
              toast({title:"Attention",description:"Meeting Created SuccessFully!"})
            }


      }catch(e)
      {
        console.log(e);
      }
    }
    

const [meetingState, setmeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();

const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
  <section
   className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

    <HomeCard
    img='/icons/add-meeting.svg'
    title='New Meeting'
    description='Start an insant meeting'
  handleClick={()=>{setmeetingState('isInstantMeeting')}}
    className='bg-orange-1'

    />
  
  <HomeCard
    img='/icons/schedule.svg'
    title='Schedule Meeting'
    description='Plan your meeting'
    handleClick={()=>{
        setmeetingState('isScheduleMeeting');
        
    }}
    className='bg-blue-1'

    />
  
  <HomeCard
    img='/icons/recordings.svg'
    title='View Recorings'
    description='Check out your meeting'
    handleClick={()=>router.push('/recording')
       
        
    }
    className='bg-purple-1'

    />
  
  <HomeCard
    img='/icons/join-meeting.svg'
    title='Join Meeting'
    description='via Invitation Link'
    handleClick={()=>{
        setmeetingState('isJoiningMeeting');
        
    }}
    className='bg-yellow-1'

    />


  { !callDetails ?(
     <MeetingModal
     isOpen = {meetingState === 'isScheduleMeeting'}
     title='Schedule Meeting'
     handleClick={createMeeting}
     onClose={()=>setmeetingState(undefined)}>
      <div className='flex flex-col gap-2.5 '>
        <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
        <Textarea 
        onChange={(e)=>{setvalues({...values,decsription:e.target.value})}}
        className='bg-dark-3 border-none focus-visible:ring-0 focus-visible:ring-offset-0'>

        </Textarea>
      </div>
      <div className='flex w-full flex-col gap-2.5'>
      <label className='text-base text-normal leading-[22px] text-sky-2'>Select date and time</label>
      <ReactDatePicker
      timeFormat='HH:mm'
      selected={values.dateTime}
      showTimeSelect
      timeIntervals={15}
      timeCaption='Time'
      className='w-full rounded bg-dark-3 p-2 focus:outline-none'
      dateFormat="MMMM d, yyyy h:mm aa"
      onChange={(date)=>setvalues({...values,dateTime:date!})}/>
      </div>
     </MeetingModal>
  ):
  <MeetingModal
  isOpen = {meetingState === 'isScheduleMeeting'}
  title='Meeting Created'
  handleClick={()=>{
    navigator.clipboard.writeText(meetingLink);
   toast({title:'Link Copied'})
  }}
  image="/icons/checked.svg"
  buttonIcon='/icons/copy.svg'
  buttonText='Copy Meeting Link'

  onClose={()=>setmeetingState(undefined)}/>
  
  
  }
  <MeetingModal
  isOpen = {meetingState === 'isInstantMeeting'}
  title='Start An Insant Meeting'
  className='text-center'
  buttonText='Start Meeting'
  handleClick={createMeeting}
  onClose={()=>setmeetingState(undefined)}/>
   

   <MeetingModal
  isOpen = {meetingState === 'isJoiningMeeting'}
  title='Type the link here'
  className='text-center'
  buttonText='Join Meeting'
  handleClick={()=>{
    router.push(values.link)
  }}
  onClose={()=>setmeetingState(undefined)}>
    <Input onChange={(e)=>{
      setvalues({...values,link:e.target.value})
    }}  placeholder= 'Meeting Link' className='bg-dark-3 focus-visible:ring-offset-0 focus-visible:ring-0  border-none ' ></Input>

  </MeetingModal>
   
   </section>
  )
}

export default MeetingTypeList