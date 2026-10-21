import React, { createContext, useState } from "react";

export const EditorContext = createContext();

export const EditorContextProvider = ({children}) => {
    const [editorInfo,setEditorInfo] = useState({
        id:"",
        fileName:"",
        content:"" ,
        language:"",
        used:false
    })
    return(
        <EditorContext.Provider value={{editorInfo , setEditorInfo}}>
            {children}
        </EditorContext.Provider>
    )
}