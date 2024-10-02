import { setLoading } from "../../slices/profileSlice"
import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { setUser } from "../../slices/profileSlice"
import { settings } from "../apis"
import {logout} from "./AuthAPI"


const {UPDATE_DISPLAY_PICTURE_API, UPDATE_PROFILE_API, UPDATE_PASSWORD_API, DELETE_ACCOUNT_API} = settings



export const updateDisplayPicture = (token, formData) => {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        try{
            const response = await apiConnector("PUT", UPDATE_DISPLAY_PICTURE_API, formData, {"Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`})
            console.log("RESPONSE");
            console.log("Update Display Picture API response....", response);

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Display Picture Updated Successfully")
            dispatch(setUser(response.data.data))
            localStorage.setItem("user", JSON.stringify(response.data.data))
            console.log(response.data.data);
        }
        catch(error){
            console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
            toast.error("Could Not Update Display Picture")
        }
        toast.dismiss(toastId);
    }
}


export const updateProfile = (token, formData) => {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {Authorization: `Bearer ${token}`});
            console.log("UPDATE_PROFILE_API API RESPONSE............", response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            localStorage.setItem("user", JSON.stringify(response.data.data));
            toast.success("Profile Updated Successfully")

            dispatch(setUser(response.data.data));
        }
        catch(error){
            console.log("UPDATE_PROFILE_API API ERROR............", error)
            toast.error("Could Not Update Profile")
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}


export const changePassword = async(token, formData) => {
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("POST", UPDATE_PASSWORD_API, formData, {
                                            Authorization: `Bearer ${token}`})
        console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

        if(!response.data.success){
            throw new Error(response.data.message)
        }

        toast.success("Password Changed Successfully")
    } 
    catch(error){
        console.log("CHANGE_PASSWORD_API API ERROR............", error)
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
}


export const deleteAccount = (token, navigate) => {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        try{
            const response = await apiConnector("DELETE", DELETE_ACCOUNT_API, null, {
                                                Authorization: `Bearer ${token}`})

            console.log("DELETE_PROFILE_API API RESPONSE............", response)
    
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Profile Deleted Successfully")
            dispatch(logout(navigate))
        } 
        catch(error){
            console.log("DELETE_PROFILE_API API ERROR............", error)
            toast.error("Could Not Delete Profile")
        }
        toast.dismiss(toastId)
    }
}

