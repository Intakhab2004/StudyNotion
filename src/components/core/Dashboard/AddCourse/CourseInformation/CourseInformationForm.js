import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseCategories } from '../../../../../services/operation/courseDetailsAPI';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { MdNavigateNext } from 'react-icons/md';
import IconBtn from "../../../../common/IconBtn"
import {setStep, setCourse} from "../../../../../slices/courseSlice"
import RequirementsField from './RequirementsField';
import Upload from '../Upload';
import ChipInput from './ChipInput';
import toast from 'react-hot-toast';
import {COURSE_STATUS} from "../../../../../Util/constants"
import { addCourseDetails, editCourseDetails } from '../../../../../services/operation/courseDetailsAPI';

const CourseInformationForm = () => {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: {errors},
    } = useForm();

    const {course, editCourse} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([]);

    useEffect(() => {
        const getCategories = async() => {
            setLoading(true);

            const response = await fetchCourseCategories();

            if(response.length > 0){
                setCourseCategories(response);
            }

            setLoading(false);
        }
        
        if(editCourse){
            setValue("courseTitle", course.courseName)
            setValue("courseShortDesc", course.courseDescription)
            setValue("coursePrice", course.price)
            setValue("courseTags", course.tag)
            setValue("courseBenefits", course.whatYouLearn)
            setValue("courseCategory", course.category)
            setValue("courseRequirements", course.instructions)
            setValue("courseImage", course.thumbnail)
        }

        getCategories();
    }, [])

    const isFormUpdated = () => {
        const currentValues = getValues()
    
        if (
          currentValues.courseTitle !== course.courseName ||
          currentValues.courseShortDesc !== course.courseDescription ||
          currentValues.coursePrice !== course.price ||
          currentValues.courseTags.toString() !== course.tag.toString() ||
          currentValues.courseBenefits !== course.whatYouLearn ||
          currentValues.courseCategory._id !== course.category._id ||
          currentValues.courseRequirements.toString() !== course.instructions.toString() ||
          currentValues.courseImage !== course.thumbnail
        ){
            return true
          
        }

        return false
    }

    const onSubmit = async(data) => {
        if(editCourse){
            if(isFormUpdated()){
                const currentValues = getValues();
                const formData = new FormData();

                formData.append("courseId", course._id)
                if(currentValues.courseTitle !== course.courseName){
                    formData.append("courseName", data.courseTitle)
                }
                
                if(currentValues.courseShortDesc !== course.courseDescription){
                    formData.append("courseDescription", data.courseShortDesc)
                }

                if(currentValues.coursePrice !== course.price){
                    formData.append("price", data.coursePrice)
                }

                if(currentValues.courseTags.toString() !== course.tag.toString()){
                    formData.append("tag", JSON.stringify(data.courseTags))
                }

                if(currentValues.courseBenefits !== course.whatYouLearn){
                    formData.append("whatYouLearn", data.courseBenefits)
                }

                if (currentValues.courseCategory._id !== course.category._id) {
                    formData.append("category", data.courseCategory)
                }

                if(currentValues.courseRequirements.toString() !== course.instructions.toString()){
                    formData.append("instructions", JSON.stringify(data.courseRequirements))
                }

                if(currentValues.courseImage !== course.thumbnail){
                    formData.append("thumbnailImage", data.courseImage)
                }


                setLoading(true);
                const result = await editCourseDetails(formData, token)
                setLoading(false)
                if(result){
                    dispatch(setStep(2))
                    dispatch(setCourse(result))
                }
                
            }

            else{
                toast.error("No changes made to the form")
            }

            return;
        }

        const formData = new FormData()
        formData.append("courseName", data.courseTitle)
        formData.append("courseDescription", data.courseShortDesc)
        formData.append("price", data.coursePrice)
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatYouLearn", data.courseBenefits)
        formData.append("category", data.courseCategory)
        formData.append("status", COURSE_STATUS.DRAFT)
        formData.append("instructions", JSON.stringify(data.courseRequirements))
        formData.append("thumbnailImage", data.courseImage)

        setLoading(true)
        const result = await addCourseDetails(formData, token);

        if(result){
            dispatch(setStep(2));
            dispatch(setCourse(result))
        }
        
        setLoading(false);
    }

    return (
        <form className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseTitle">
                    Course Title <sup className='text-pink-200'>*</sup>
                </label>
                <input
                    type='text'
                    id='courseTitle'
                    placeholder='Enter Course Title'
                    className="form-style w-full placeholder:text-sm"
                    {...register("courseTitle", {required: true})}
                />
                {
                    errors.courseTitle && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">
                            Course Title is Required
                        </span>
                    )
                }
            </div>

            <div className='flex flex-col space-y-2'>
                <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
                    Course Short Description <sup className='text-pink-200'>*</sup>
                </label>
                <textarea
                    id='courseShortDesc'
                    placeholder='Enter Description'
                    className="form-style resize-x-none min-h-[130px] w-full placeholder:text-sm"
                    {...register("courseShortDesc", {required: true})}
                />
                {
                    errors.courseShortDesc && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">
                            Course Descrption is required
                        </span>
                    )
                }
            </div>

            <div className='flex flex-col space-y-2'>
                <label className="text-sm text-richblack-5" htmlFor="coursePrice">
                    Course Price <sup className="text-pink-200">*</sup>
                </label>
                <div className='relative'>
                    <input
                        id='coursePrice'
                        placeholder='Enter Course Price'
                        className='form-style w-full !pl-12 placeholder:text-sm'
                        {...register("coursePrice", {required: true, valueAsNumber: true, pattern: {value: /^(0|[1-9]\d*)(\.\d+)?$/,}})}
                    />
                    <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
                    {
                        errors.coursePrice && (
                            <span className="ml-2 text-xs tracking-wide text-pink-200">
                                Course Price is required
                            </span>
                        )
                    }
                </div>
            </div>

            <div className='flex flex-col space-y-2'>
                <label className="text-sm text-richblack-5" htmlFor="courseCategory">
                    Course Category <sup className='text-pink-200'>*</sup>
                </label>
                <select
                    id='courseCategory'
                    className="form-style w-full"
                    defaultValue=""
                    {...register("courseCategory", {required: true})}
                >
                    <option value="" disabled>Choose a Category</option>
                    {
                        !loading && courseCategories.map((item, index) => (
                            <option key={index} value={item._id}>
                                {item.name}
                            </option>
                        ))
                    }
                </select>
                {
                    errors.courseCategory && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">
                            Course category is required
                        </span>
                    )
                }
            </div>

            {/* Custom components for tags */}
            <ChipInput
                label = "Tags"
                name = "courseTags"
                placeholder = "Enter tags and press enter"
                register = {register}
                errors = {errors}
                setValue = {setValue}
                getValues = {getValues}
            />

            {/* Custom components for uplaoding thumbnail */}
            <Upload
                name="courseImage"
                label="Course Thumbnail"
                register={register}
                errors={errors}
                setValue={setValue}
                editData={editCourse ? course?.thumbnail : null}
            />

            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
                    Benefits of the course <sup className="text-pink-200">*</sup>
                </label>
                <textarea
                    id="courseBenefits"
                    placeholder="Enter benefits of the course"
                    {...register("courseBenefits", { required: true })}
                    className="form-style resize-x-none min-h-[130px] w-full placeholder:text-sm"
                />
                {errors.courseBenefits && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Benefits of the course is required
                    </span>
                )}
            </div>
            
            {/* Custom components for Requirements/Instructions */}
            <RequirementsField
                name="courseRequirements"
                label="Requirements/Instructions"
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
            />

            <div className="flex justify-end gap-x-2">
                {
                    editCourse && (
                        <button
                            onClick={() => dispatch(setStep(2))}
                            disabled = {loading}
                            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[4px] px-[15px] font-semibold text-richblack-900`}
                        >
                            Continue Without Saving
                        </button>
                    )
                }

                <IconBtn 
                    disabled={loading}
                    text={!editCourse ? "Next" : "Save Changes"}
                    customClasses = {"flex items-center"}
                >
                    <MdNavigateNext />
                </IconBtn>
            </div>
        </form>
    )
}

export default CourseInformationForm