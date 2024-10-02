import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import IconBtn from '../../../common/IconBtn';
import { updateProfile } from '../../../../services/operation/SettingAPI';

const ChangeProfileInformation = () => {

    const {user} = useSelector((state) => state.profile);
    const {loading} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {register, handleSubmit, formState: {errors}} = useForm();

    const submitFormData = (data) => {
        try{
            dispatch(updateProfile(token, data));
        }
        catch(error){
            console.log("ERROR MESSAGE - ", error.message)
        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit(submitFormData)}>
                <div className='my-5 rounded-md border border-richblack-700 bg-richblack-800 py-8 px-5 md:px-12'>
                    <h1 className="text-lg mb-6 font-semibold text-richblack-5">Profile Information</h1>

                    <div className='flex flex-col gap-y-6'>
                        <div className='flex flex-col md:flex-row gap-5'>
                            <label className='w-full'>
                                <p className='label-style tracking-wider mb-1'>First Name</p>
                                <input
                                   type='text'
                                   name='firstName'
                                   defaultValue={user?.firstName}
                                   placeholder='Enter First Name'
                                   className='form-style w-full placeholder:text-sm placeholder:tracking-wider'
                                   {...register("firstName", {required: true})}
                                />
                                {
                                    errors.firstName && <p className='input-error-style' >Please enter your first name</p>
                                }
                            </label>

                            <label className='w-full'>
                                <p className='label-style tracking-wider mb-1'>Last Name</p>
                                <input
                                   type='text'
                                   name='lastName'
                                   defaultValue={user?.lastName}
                                   placeholder='Enter Last Name'
                                   className='form-style w-full placeholder:text-sm placeholder:tracking-wider'
                                   {...register("lastName", {required: true})}
                                />
                                {
                                    errors.lastName && <p className="mt-1 text-[12px] text-yellow-100">Please enter your first name</p>
                                }
                            </label>
                        </div>

                        <div className='flex flex-col md:flex-row gap-5'>
                            <label className='w-full'>
                                <p className='label-style tracking-wider mb-1'>Date of Birth</p>
                                <input
                                    type='date'
                                    name='dob'
                                    max={new Date().toISOString().split('T')[0]}
                                    placeholder='Enter DOB'
                                    defaultValue={user?.profile?.dob?.split('T')[0]}
                                    className='form-style w-full '
                                    {...register('dob', {
                                        required: {
                                        value: true,
                                        message: 'Please enter your Date of Birth'
                                        },
                                        max: {
                                        value: new Date().toISOString().split('T')[0],
                                        message: 'Date of Birth cannot be in the future'
                                        }
                                    })}
                                />
                                {
                                    errors.dob && <p className="mt-1 text-[12px] text-yellow-100">{errors.dob.message}</p>
                                }
                            </label>

                            <label className='w-full' >
                                <p className='label-style tracking-wider mb-1' >Gender</p>
                                <select
                                    type='text'
                                    name='gender'
                                    className='form-style w-full'
                                    defaultValue={user?.profile?.gender}
                                    {...register('gender', { required: true })}
                                >
                                    <option className='text-richblack-5' value="Male">Male</option>
                                    <option className='text-richblack-5' value="Female">Female</option>
                                </select>
                            </label>
                        </div>
                        
                        <div className='flex flex-col md:flex-row gap-5'>
                            <label className='w-full' >
                                <p className='label-style tracking-wider mb-1' >Contact Number</p>
                                <input
                                    type='tel'
                                    name='contactNumber'
                                    placeholder='Enter contact number'
                                    defaultValue={user?.profile?.contactNumber}
                                    className='form-style w-full placeholder:text-sm placeholder:tracking-wider'
                                    {...register('contactNumber', {
                                        required: {
                                        value: true,
                                        message: 'Please enter your Contact Number'
                                        },
                                        maxLength: {
                                        value: 12,
                                        message: 'Invalid Contact Number'
                                        },
                                        minLength: {
                                        value: 10,
                                        message: 'Invalid Contact Number'
                                        }
                                    })}
                                />
                                {
                                    errors.contactNumber && <p className="mt-1 text-[12px] text-yellow-100" >{errors.contactNumber.message}</p>
                                }
                            </label>

                            <label className='w-full' >
                                <p className='label-style tracking-wider mb-1' >About</p>
                                <input
                                    type='text'
                                    name='about'
                                    placeholder='Enter Bio Details'
                                    defaultValue={user?.profile?.about}
                                    className='form-style w-full placeholder:text-sm placeholder:tracking-wider'
                                    {...register('about', { required: true })}
                                />

                                {
                                    errors.about && <p className="mt-1 text-[12px] text-yellow-100">Please enter your Bio Details</p>
                                }
                            </label>
                        </div>
                    </div>
                </div>

                <div className='flex justify-end gap-2'>
                    <button onClick={() => navigate("/dashboard/my-profile")} className={`rounded-md bg-richblack-700 lg:py-2 py-1 lg:px-5 px-2 font-semibold text-richblack-50
                            ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        Cancel
                    </button>

                    <IconBtn type={'submit'} disabled={loading} text={loading ? 'Saving...' : 'Save'} customClasses='lg:py-2 lg:px-5'/>

                </div>
            </form>
        </div>
    )
}

export default ChangeProfileInformation