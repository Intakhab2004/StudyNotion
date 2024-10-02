import toast from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlice";
import { apiConnector } from "../apiConnector";
import { auth } from "../apis";
import { setUser } from "../../slices/profileSlice";
import { resetCart } from "../../slices/cartSlice";



const {LOGIN_API,
       SENDOTP_API,
       RESETPASSTOKEN_API, 
       RESETPASS_API,
       SIGNUP_API} = auth

export function login(email, password, navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const result = await apiConnector("POST", LOGIN_API, {email, password})
            console.log("LOGIN API RESPONSE............", result)

            if(!result.data.success){
                throw new Error(result.data.message);
            }
            
            console.log(result)
            toast.success("Login Successful")
            dispatch(setToken(result.data.token))

            const userImage = result.data?.existingUser?.image ? 
                            result.data.existingUser.image
                            : `https://api.dicebear.com/5.x/initials/svg?seed=${result.data.existingUser.firstName} ${result.data.existingUser.lastName}`
            dispatch(setUser({ ...result.data.existingUser, image: userImage }))

            localStorage.setItem("token", JSON.stringify(result.data.token))
            localStorage.setItem("user", JSON.stringify({...result.data.existingUser, image: userImage}))
            navigate("/dashboard/my-profile")
        }
        catch(error){
            console.log("LOGIN API ERROR............", error)
            toast.error("Login Failed")
        }

        dispatch(setLoading(false));
    }
}


export function sendOTP(email, navigate){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true));
        try{
            const result = await apiConnector("POST", SENDOTP_API, {email, checkUserPresent: true})

            console.log("SENDOTP API RESPONSE............", result)
            console.log(result.data.success)

            if (!result.data.success) {
                throw new Error(result.data.message)
            }

            toast.success("OTP Sent Successfully")
            navigate("/verify-email")
        }
        catch(error){
            console.log("SENDOTP API ERROR............", error)
            toast.error("Could Not Send OTP")
        }

        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}


export function logout(navigate){
    return (dispatch) => {
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(resetCart())
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/")
        toast.success("Logged out successfully");
    }
}


export function getResetPasswordToken(email, setEmailSent){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true));

        try{
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {email});
            console.log("RESET PASSWORD TOKEN RESPONSE...", response);

            if(!response){
                throw new Error(response.data.message)
            }

            toast.success("Reset email sent")
            setEmailSent(true);
        }
        catch(error){
            console.log("Reset password token error", error)
            toast.error("Something went wrong in sending email")
        }
        
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}


export function resetPassword(password, confirmPassword, token, navigate){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))

        try{
            const response = await apiConnector("POST", RESETPASS_API, {password, confirmPassword, token})
            console.log("RESET PASSWORD RESPONSE....", response)

            if(!response){
                throw new Error(response.data.message)
            }

            toast.success("Password Reset Successfully")
            navigate("/login")
        }
        catch(error){
            console.log("Something went wrong in resetting the password", error)
            toast.error("Failed To Reset Password")
        }

        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}


export function signUp(userType, firstName, lastName, email, password, confirmPassword, otp, navigate){
    return async(dispatch) => {
        dispatch(setLoading(true))

        try{
            const response = await apiConnector("POST",
                                                 SIGNUP_API, 
                                                 {userType, firstName, lastName, email, password, confirmPassword, otp}
                                                )

            console.log("SIGNUP API RESPONSE............", response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            
            toast.success("Sign up successful")
            navigate("/login")
        }
        catch(error){
            console.log("SIGNUP API ERROR............", error)
            toast.error("Sign Up Failed")
            navigate("/signup")
        }

        dispatch(setLoading(false))
    }    
}