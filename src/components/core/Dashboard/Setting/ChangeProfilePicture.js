import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn';
import { FiUpload } from 'react-icons/fi';
import { GrInProgress } from 'react-icons/gr';
import { updateDisplayPicture } from '../../../../services/operation/SettingAPI';

const ChangeProfilePicture = () => {

    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const [imageFile, setImageFile] = useState(null);
    const [previewSource, setPreviewSource] = useState(null)

    const fileInputRef = useRef(null);


    const handleClick = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        // console.log(file)
        if(file){
            setImageFile(file)
            previewFile(file)
        }
    }

    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }


    const handleFileUpload = () => {
        try{
            setLoading(true);
            const formData = new FormData();
            formData.append("image", imageFile);

            dispatch(updateDisplayPicture(token, formData))
            setLoading(false);
        }
        catch(error){
            console.log("ERROR MESSAGE - ", error.message)
        }
    }

    return (
        <div className='flex items-center justify-between rounded-md border border-richblack-700 bg-richblack-800 p-8 px-2 md:px-12'>
            <div className='flex gap-x-4 items-center '>
                <div>
                    <img
                       src = {previewSource || user?.image}
                       alt = {`profile-${user?.firstName}`}
                       className = "aspect-square w-[60px] md:w-[78px] rounded-full object-cover"
                    />
                </div>

                <div className = "space-y-2">
                    <p className='lg:text-lg text-md text-richblack-5'>
                        Change Profile Picture
                    </p>

                    <div className='flex gap-x-3'>
                        <input type = "file" onChange={handleFileChange} ref={fileInputRef} accept = "image/jpeg, image/gif image/jpg image/png" className = "hidden" />

                        <button
                          onClick = {handleClick} disabled = {loading} 
                          className = {`bg-richblack-600 text-richblack-50 lg:py-2 py-1 lg:px-5 px-2 font-semibold rounded-md ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            Select
                        </button>

                        <IconBtn
                           text = {loading ? "Uploading..." : "Upload"}
                           disabled = {loading}
                           customClasses='lg:py-2 lg:px-5'
                           onClickHandler = {handleFileUpload}
                        >
                            {
                                !loading ? <FiUpload className='text-lg text-richblack-900' /> : <GrInProgress className='text-lg text-richblack-900' />
                            }
                        </IconBtn>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangeProfilePicture