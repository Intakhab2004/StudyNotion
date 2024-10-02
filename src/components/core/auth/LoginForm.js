import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { login } from "../../../services/operation/AuthAPI";

function LoginForm(){

    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({email: "", password: ""})

    const handleOnChange = (event) => {
        setFormData((prevData) =>  ({
            ...prevData,
            [event.target.name] : event.target.value,
        }))
    }

    const handleOnSubmit = (event) => {
        event.preventDefault();
        dispatch(login(formData.email, formData.password, navigate))
    }

    return(
        <form className="mt-6 flex w-full flex-col gap-y-4" onSubmit={handleOnSubmit}>
            <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                    Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleOnChange}
                  placeholder="Enter email address"
                  className="form-style w-full"
                />
            </label>
                
            <label className="relative">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                    Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
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
                <Link to="/forgot-password">
                    <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
                        Forgot Password
                    </p>
                </Link>
            </label>

            <button className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900" type="submit">
                Sign In
            </button>
        </form>
    )
}

export default LoginForm;