import {useSSO} from "@clerk/clerk-expo";
import {useState} from "react";
import {Alert } from "react-native";

export const useSocialAuth = ()=>{
    const [loadingStrategy, setloadingStrategy] = useState(false);
    const {startSSOFlow} = useSSO();

    const handleSocialAuth = async (strategy)=>{
        if(loadingStrategy) return;
        setloadingStrategy(strategy);
        try {
            const {createdSessionId , setActive} = await startSSOFlow({strategy});

                if(!createdSessionId || !setActive){
                    console.log("Sign-in incomplete", "Sign-in did not complete. Please try again ")
                        
                    return
                }

                await setActive({ session: createdSessionId });
        } catch (error) {
            console.log("Error", error.message);
        }finally{
            setloadingStrategy(null)
        }
    }

    return {handleSocialAuth , loadingStrategy}
}