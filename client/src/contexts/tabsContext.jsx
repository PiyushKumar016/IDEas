import { createContext, useState } from "react";

export const tabsContext = createContext()

export function TabsContextProvider({children}){
    const [tabs , setTabs] = useState([]);
    return(
        <tabsContext.Provider value={{tabs , setTabs}}>
            {children}
        </tabsContext.Provider>
    )
}