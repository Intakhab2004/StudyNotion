import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { apiConnector } from '../../../services/apiConnector';
import { contact } from '../../../services/apis';
import toast from 'react-hot-toast';
import countryCode from "../../../Data/countrycode.json"

const {CONTACTUS_API} = contact;

function ContactUsForm() {

    const [loading, setLoading] = useState();

    const { register,
            handleSubmit,
            reset,
            formState: {errors, isSubmitSuccessful}

        } = useForm();

    const submitContactForm = async (data) => {
        console.log("Our form data is", data);
        try{
            setLoading(true)
            const response = await apiConnector("POST", CONTACTUS_API, data)

            toast.success("Your message has been sent successfully");
            setLoading(false)
        }
        catch(error){
            console.log("ERROR MESSAGE - ", error.message)
            toast.error("Something went wrong while sending the message")
            setLoading(false)
        }
    }

    useEffect(() => {
        if(isSubmitSuccessful){
            reset({
                firstName: "",
                lastName: "",
                email: "",
                phoneNo: "",
                message: ""
            })
        }
    }, [reset, isSubmitSuccessful])


    return (
        <form className="flex flex-col gap-7" onSubmit={handleSubmit(submitContactForm)}>
            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor = "firstName" className = "label-style">
                        First Name
                    </label>
                    <input
                       id = "firstName"
                       type = "text"
                       name = "firstName"
                       placeholder = "Enter first name"
                       className = "form-style"
                       {...register("firstName", {required: true})}
                    />
                    {
                        errors.firstName && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please enter your First name.
                            </span>
                        )
                    }
                </div>

                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor = "lastName" className = "label-style">
                        Last Name
                    </label>
                    <input
                       id = "lastName"
                       type = "text"
                       name = "lastName"
                       placeholder = "Enter last name"
                       className = "form-style"
                       {...register("lastName", {required: true})}
                    />
                    {
                        errors.lastName && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please enter your Last name.
                            </span>
                        )
                    }
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className = "label-style" htmlFor = "email">
                    Email Address
                </label>
                <input
                    id = "email"
                    type = "email"
                    name = "email"
                    placeholder = "Enter email address"
                    className = "form-style"
                    {...register("email", {required: true})}
                />
                {
                    errors.email && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your email address.
                        </span>
                    )
                }
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor='phoneNumber' className='label-style'>
                    Phone Number
                </label>
                <div className="flex gap-5">
                    <div className="flex w-[81px] flex-col gap-2">
                        <select name='dropDown' className='form-style' id='dropDown' {...register("dropDown", {required: true})}>
                            {
                                countryCode.map((ele, index) => (
                                    <option key={index} value={ele.code}>
                                        {ele.code} - {ele.country}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                        <input
                           type='text'
                           id='phoneNumber'
                           name='phoneNumber'
                           placeholder='1234567890'
                           className='form-style'
                           {...register("phoneNumber", {required: true, maxLength: { value: 12, message: "Invalid Phone Number" }, minLength: { value: 10, message: "Invalid Phone Number" }})}
                        />
                        {
                            errors.phoneNumber && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    {errors.phoneNumber.message}
                                </span>
                            )
                        }
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor = "message" className = "label-style">
                    Message
                </label>
                <textarea
                    id='message'
                    name='message'
                    placeholder='Enter your message here'
                    rows={7}
                    cols={30}
                    className='form-style'
                    {...register("message", {required: true})}
                />
                {
                    errors.message && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your message.
                        </span>
                    )
                }
            </div>

            <button
              type = "submit"
              disabled = {loading}
              className = {`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]
                            ${
                                !loading && "transition-all duration-200 hover:scale-95 hover:shadow-none"
                            } disabled:bg-richblack-500 sm:text-[16px]`
                        }
            >
                {
                    loading ? <p>Please wait...</p> : <p>Send Message</p>
                }
            </button>
        </form>
    )
}

export default ContactUsForm