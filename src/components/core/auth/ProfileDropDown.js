import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscSignOut, VscDashboard } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../services/operation/AuthAPI";
import useOnClickOutside from "../../../Hooks/useOnClickOutside";
import ConfirmationModal from "../../common/ConfirmationModal";

function ProfileDropDown(){

    const {user} = useSelector((state) => state.profile)

    const [openDropdown, setOpenDropdown] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const ref = useRef(null)

    const modalData = {
        text1: "Are you sure ?",
        text2: "You will be logged out of your account",
        btn1Text: 'Logout',
        btn2Text: 'Cancel',
        btn1Handler: () => dispatch(logout(navigate)),
        btn2Handler: () => setIsModalOpen(false),

    }

    useOnClickOutside(ref, () => setOpenDropdown(false))

    if (!user) return null

    return(
        <button className="relative" onClick={() => setOpenDropdown(true)}>
            <div className="flex items-center gap-x-1">
                <img
                  src={user?.image}
                  alt={`profile-${user?.firstName}`}
                  className="aspect-square w-[30px] rounded-full object-cover"
                />
                <AiOutlineCaretDown className="text-sm text-richblack-100" />
            </div>
            {
                openDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      ref={ref}
                      className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800"
                    >
                        {/* Dashboard button */}
                        <Link to = "/dashboard/my-profile" onClick={() => setOpenDropdown(false)}>
                            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
                                <VscDashboard className="text-lg"/>
                                Dashboard
                            </div>
                        </Link>

                        {/* Logout button */}
                        <div
                          onClick={() => {
                            setIsModalOpen(true)
                          }}
                          className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
                        >
                            <VscSignOut className="text-lg" />
                            Logout
                        </div>
                    </div>
                )
            }

            {
                isModalOpen && (<ConfirmationModal data = {modalData} />)
            }
        </button>
    )
}

export default ProfileDropDown;