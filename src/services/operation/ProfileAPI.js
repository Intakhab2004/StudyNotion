import { apiConnector } from "../apiConnector";
import { profile } from "../apis"
import toast from "react-hot-toast";

const {ENROLLED_COURSES_API, GET_INSTRUCTOR_DATA_API} = profile;

export const getEnrolledCourses = async(token) => {
    const toastId = toast.loading("Loading...")
    let result = []

    try{
        const response = await apiConnector("GET", ENROLLED_COURSES_API, null, {Authorization: `Bearer ${token}`});
        console.log("ENROLLED COURSES API RESPONSE.....", response)

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result = response.data.data;
    }
    catch(error){
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
        toast.error("Could Not Get Enrolled Courses")
    }

    toast.dismiss(toastId)
    return result
}


export async function getInstructorData(token) {

    const toastId = toast.loading("Loading...")

    let result = []
    try {
        const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {Authorization: `Bearer ${token}`,});

        console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)

        result = response?.data?.data
    } 
    catch (error) {
        console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
        toast.error("Could Not Get Instructor Data")
    }

    toast.dismiss(toastId)
    return result
}