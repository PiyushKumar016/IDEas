import { useContext } from "react"
import { authContext } from "../contexts/authcontext"

export const useAuth = () => {
    return useContext(authContext);
}