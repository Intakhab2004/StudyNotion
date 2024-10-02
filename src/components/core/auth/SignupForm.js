import React, { useState } from "react";
import { ACCOUNT_TYPE } from "../../../Util/constants";
import Tab from "../../common/Tab";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSignupData } from "../../../slices/authSlice";
import { sendOTP } from "../../../services/operation/AuthAPI";

function SignupForm(){

    const tabData = [
        {
          id: 1,
          tabName: "Student",
          type: ACCOUNT_TYPE.STUDENT,
        },
        {
          id: 2,
          tabName: "Instructor",
          type: ACCOUNT_TYPE.INSTRUCTOR,
        },
    ]

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({f_name: "", l_name: "", email: "", password: "", confirmPassword: ""})
    const {f_name, l_name, email, password, confirmPassword} = formData

    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleOnChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            [event.target.name] : event.target.value
        }))
    }

    const handleOnSubmit = (event) => {
        event.preventDefault();

        if(password !== confirmPassword){
            toast.error("Make sure to enter the both password same")
            return
        }

        const data = {
            ...formData,
            accountType
        }

        dispatch(setSignupData(data));
        dispatch(sendOTP(formData.email, navigate));  

        // Reseting the form or making the form empty
    setFormData({
        f_name: "",
        l_name: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
      setAccountType(ACCOUNT_TYPE.STUDENT)
    }

    return(
        <div>
            <Tab data = {tabData} userType = {accountType} setUserType = {setAccountType} />
            <form className="flex w-full flex-col gap-y-4" onSubmit={handleOnSubmit}>
                <div className="flex gap-x-4">
                    <label>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            First Name <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                          required
                          type="text"
                          name="f_name"
                          value={f_name}
                          onChange={handleOnChange}
                          placeholder="Enter First Name"
                          className="form-style w-full"
                        />
                    </label>
                    <label>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Last Name <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                          required
                          type="text"
                          name="l_name"
                          value={l_name}
                          onChange={handleOnChange}
                          placeholder="Enter Last Name"
                          className="form-style w-full"
                        />
                    </label>
                </div>

                <label>
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                        Email Address <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                        required
                        type="text"
                        name="email"
                        value={email}
                        onChange={handleOnChange}
                        placeholder="Enter Email Address"
                        className="form-style w-full"
                    />
                </label>

                <div className="flex gap-x-4">
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Create Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={handleOnChange}
                            placeholder="Enter Password"
                            className="form-style w-full !pr-10"
                        />

                        <span onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                        { 
                            showPassword ?
                            (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />) :
                            (<AiOutlineEye fontSize={24} fill="#AFB2BF" />)
                        }
                        </span>
                    </label>

                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Confirm Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleOnChange}
                            placeholder="Enter Password"
                            className="form-style w-full !pr-10"
                        />

                        <span onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                        { 
                            showConfirmPassword ?
                            (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />) :
                            (<AiOutlineEye fontSize={24} fill="#AFB2BF" />)
                        }
                        </span>
                    </label>
                </div>

                <button className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900" type="submit">
                    Create Account
                </button>
            </form>
        </div>
        
    )
}

export default SignupForm;