import { useState } from "react";
import { createContext } from "react";
import { getMe } from "../API/userAPI";
import { useEffect } from "react";

export const authContext = createContext();

export const AuthProvider = ({children}) =>{
    const [user , setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const checkAuth = async () => {
        try{
            const response = await getMe();
            if(!response.data.success){
                console.log("fail to authenticate");
            }
            console.log("user - " , response.data.user);
            setUser(response.data.user);
        }
        catch(err){
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        checkAuth();
    } , []);
    return(
        <authContext.Provider value={{user , setUser , checkAuth , loading , setLoading}}>
            {children}
        </authContext.Provider>
    )
}