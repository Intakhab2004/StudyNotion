import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { payment } from "../apis";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import {setPaymentLoading} from "../../slices/courseSlice"
import {resetCart} from "../../slices/cartSlice"

const {COURSE_PAYMENT_API, SEND_SUCCESS_PAYMENT_EMAIL_API, VERIFY_SIGNATURE_API} = payment;


// Function for loading the script of the razorpay modal in our index.html body
function loadScript(src){
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }

        script.onerror = () => {
            resolve(false);
        }

        document.body.appendChild(script);
    })
}


export const BuyCourse = async(token, courses, user_details, navigate, dispatch) => {
    const toastId = toast.loading("Loading...");

    try{
        // Loading the script of Razorpay SDK
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res){
            toast.error("Razorpay SDK failed to load. Check your Internet Connection.")
            return
        }

        // Initiating the Order in Backend
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, {courses}, {Authorization: `Bearer ${token}`});

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message)
        }
        console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data);

        // Creating the options for raazorPay modal
        const options = {
            key: "rzp_test_2BL5u1L511ItGN",
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name: "StudyNotion",
            description: "Thank you for Purchasing the Course.",
            image: rzpLogo,
            prefill: {
                name: `${user_details.firstName} ${user_details.lastName}`,
                email: user_details.email,
            },
            handler: function(response){
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token);
                verifyPayment({...response, courses}, token, navigate, dispatch);
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

        paymentObject.on("payment.failed", function(response){
            toast.error("Oops! Payment failed.");
            console.log(response.error);
        })
    }
    catch(error){
        console.log("PAYMENT API ERROR............", error)
        toast.error("Could Not make Payment.")
    }

    toast.dismiss(toastId);
}


// Verify the payment
const verifyPayment = async(bodyData, token, navigate, dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setPaymentLoading(true))

    try{
        const response = await apiConnector("POST", VERIFY_SIGNATURE_API, bodyData, {Authorization: `Bearer ${token}`});
        console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

        if (!response.data.success) {
            throw new Error(response.data.message)
        }

        toast.success("Payment Successful. You are Added to the course ")
        navigate("/dashboard/enrolled-courses")
        dispatch(resetCart());

    }
    catch(error){
        console.log("PAYMENT VERIFY ERROR............", error)
        toast.error("Could Not Verify Payment.")
    }

    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
} 


// Send the Payment Success Email
const sendPaymentSuccessEmail = async(response, amount, token) => {
    try{
        await apiConnector(
            "POST",
            SEND_SUCCESS_PAYMENT_EMAIL_API,
            {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount,
            },
            {
                Authorization: `Bearer ${token}`
            }
        )
    }
    catch(error){
        console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
    }
}