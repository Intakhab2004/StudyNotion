import React from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '../../../../services/operation/SettingAPI';

const DeleteAccount = () => {

    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDeleteAccount = () => {
        dispatch(deleteAccount(token, navigate))
    }


    return (
        <div className=' mt-7 rounded-md border border-pink-700 bg-pink-900 p-8 px-5 md:px-12'>
            <div className='flex gap-x-5 w-8/12'>
                <div className='w-28 h-16 rounded-full flex justify-center items-center bg-pink-700'>
                    <FiTrash2 className='text-3xl text-pink-200' />
                </div>

                <div className='flex flex-col space-y-2 ' >
                    <h2 className='text-lg font-semibold text-richblack-5'>Delete Account</h2>
                    <div className='lg:w-full text-pink-25 space-y-1 lg:text-lg text-md' >
                        <p>Would you like to delete account?</p>
                        <p className='lg:text-base text-md'>
                            This account may contain paid courses. Deleting your account is permanent and will remove all the contain associated with it.
                        </p>
                    </div>

                    <button
                        type='button'
                        onClick={() => handleDeleteAccount()}
                        className='hidden md:block tracking-wider w-fit cursor-pointer italic bg-none py-1 text-pink-200'>
                        I want to delete my account
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteAccount