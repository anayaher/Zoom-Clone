import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"
import { start } from "repl";

export const useGetCalls = ()=>{
    const [calls, setcalls] = useState<Call[]>([]);
    const client  = useStreamVideoClient();
    const [isLoading, setisLoading] = useState(false);

    const {user} = useUser();

    useEffect(() => {
   

        const loadCalls = async()=>
            {
                if(!client || !user?.id) return;
                setisLoading(true);

                try
                {
                    const {calls} = await client.queryCalls({
                        sort:[{field:'starts_at',direction : -1}],
                        filter_conditions:{
                            starts_at:{$exists:true},
                            $or:[
                                {  created_by_user_id:user.id},
                                { members: {$in:[user.id]}}
                            ]
                        }
                    });

                    setcalls(calls);


                }
                catch(e)
                {
                    console.log(e)

                }
                finally
                {
                    setisLoading(false)
                }

            }
    loadCalls();
    
    }, [user?.id,client])

    const now = new Date();
   const endedCalls = calls.filter(({state:{startsAt,endedAt}}:Call)=>{
return(startsAt && new Date(startsAt) < now || !!endedAt)

   })

   const upcomingCalls = calls.filter(({state:{startsAt}}:Call) =>{
    return startsAt && new Date(startsAt)> now
   })

   return{
    endedCalls,
    upcomingCalls,
    CallRecordings:calls,
    isLoading,
   }

}