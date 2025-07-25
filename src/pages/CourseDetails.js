import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RatingStars from "../components/common/RatingStars"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import Footer from "../components/common/Footer"
import ConfirmationModal from '../components/common/ConfirmationModal'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourseDetails } from '../services/operation/courseDetailsAPI'
import {formatDate} from "../services/formatDate"
import GetAvgRating from '../Util/avgRating'
import Error from "../pages/Error"
import { BuyCourse } from '../services/operation/studentFeaturesApi'
import CourseAccordionBar from '../components/core/Course/CourseAccordionBar'
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard'

const CourseDetails = () => {

    const {paymentLoading} = useSelector((state) => state.course);
    const {user} = useSelector((state) => state.profile);
    const {loading} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);
    const {courseId} = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [response, setResponse] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);
    
    
    useEffect(() => {
        const fetchCourseDetails = async() => {
            try{
                const res = await getCourseDetails(courseId);
                console.log(res);
                setResponse(res);
            }
            catch(error){
                console.log("Could not fetch Course Details")
            }
        }
        
        fetchCourseDetails();
        
    }, [courseId])
    
    
    const [avgReviewCount, setAvgReviewCount] = useState(0)
    useEffect(() => {
        const count = GetAvgRating(response?.data?.courseDetails.ratingReviews)
        setAvgReviewCount(count)
        
    }, [response])
    
    
    const [isActive, setIsActive] = useState(Array(0))
    const handleActive = (id) => {
        
        setIsActive(
            !isActive.includes(id)
            ? isActive.concat([id])
            : isActive.filter((e) => e !== id)
        )
    }
    
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
    useEffect(() => {
        let lectures = 0
        response?.data?.courseDetails?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length || 0
        })
        
        setTotalNoOfLectures(lectures)
        
    }, [response])
    
    
    if (loading || !response) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="loader"></div>
            </div>
        )
    }
    
    if (!response.success) {
        return <Error />
    }
    

    const {
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouLearn,
        courseContent,
        ratingReviews,
        instructor,
        studentEnrolled,
        createdAt

    } = response?.data?.courseDetails

    const handleBuyCourse = () => {
        if(token){
            BuyCourse(token, [courseId], user, navigate, dispatch);
            return 
        }

        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to Purchase Course.",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        })
    }


    if(paymentLoading){
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className='loader'/>
            </div>
        )
    }

    return (
        <>
            <div className={`relative w-full bg-richblack-800`}>

                {/* Hero Section */}
                <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
                    <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
                        <div className="relative block max-h-[30rem] lg:hidden">
                            <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"/>
                            <img
                               src={thumbnail}
                               alt="course thumbnail"
                               className="aspect-auto w-full"
                            />
                        </div>

                        <div className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}>
                            <div>
                                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px] tracking-wider lg:text-left text-center">
                                    {courseName} 
                                </p>
                            </div>

                            <p className={`text-richblack-200`}>
                                <ul style={{ listStyle: 'none', padding: 0 }} >
                                    {courseDescription.split('\n').map((line, index) => (
                                        <li key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <span style={{ marginRight: '0.5em' }}>{index + 1}.</span>
                                        <span>{line.trim().substring(line.indexOf('.') + 1).trim()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </p>

                            <div className="text-md flex flex-wrap items-center gap-2 lg:justify-start justify-center">
                                <span className="text-yellow-25">{avgReviewCount}</span>
                                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                                <span>{`(${ratingReviews.length} reviews)`}</span>
                                <span>{`${studentEnrolled.length} students enrolled`}</span>
                            </div>

                            <div>
                                <p className="">
                                    Created By {`${instructor.firstName} ${instructor.lastName}`}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-5 text-lg">
                                <p className="flex items-center gap-2">
                                    {" "}
                                    <BiInfoCircle /> Created at {formatDate(createdAt)}
                                </p>
                                <p className="flex items-center gap-2">
                                    {" "}
                                    <HiOutlineGlobeAlt /> English
                                </p>
                            </div>
                        </div>

                        <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
                            <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                                Rs. {price}
                            </p>

                            <button className="yellowButton tracking-wide" onClick={handleBuyCourse}>
                                Buy Now
                            </button>

                            <button className="blackButton tracking-wide">Add to Cart</button>
                        </div>
                    </div>

                    {/* Course Card */}
                    <div className="right-[4rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
                        <CourseDetailsCard
                            course={response?.data?.courseDetails}
                            setConfirmationModal={setConfirmationModal}
                            handleBuyCourse={handleBuyCourse}
                        />
                    </div>
                </div>
            </div>

            <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
                <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
                    
                    {/* What will you learn section */}
                    <div className="my-8 border border-richblack-600 p-8">
                        <p className="text-3xl font-semibold uppercase tracking-wider">What you'll Learn?</p>
                        
                        <div className='mt-5'>
                            <ul style={{ listStyle: 'none', padding: 0 }} className="leading-relaxed">
                                {whatYouLearn.split('\n').map((line, index) => (
                                    <li key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <span style={{ marginRight: '0.5em' }}>{index + 1}.</span>
                                        <span>{line.trim().substring(line.indexOf('.') + 1).trim()}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Course Content Section */}
                    <div className='max-w-[830px]'>
                        <div className='flex flex-col gap-3'>
                            <p className="text-[28px] font-semibold uppercase tracking-wider">Course Content</p>
                        

                            <div className="flex flex-wrap justify-between gap-2">
                                <div className='flex gap-2 tracking-wide'>
                                    <span>
                                        {courseContent.length} {`section(s)`}
                                    </span>
                                    <span>
                                        {totalNoOfLectures} {`lecture(s)`}
                                    </span>
                                    <span>{response.data?.totalDuration}</span>
                                </div>

                                <div>
                                    <button className="text-yellow-25" onClick={() => setIsActive([])}>
                                        Collapse all sections
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Course Details Accordion */}
                        <div className='py-4'>
                            {courseContent?.map((course, index) => (
                                <CourseAccordionBar
                                course={course}
                                key={index}
                                isActive={isActive}
                                handleActive={handleActive}
                                />
                            ))}
                        </div>

                        {/* Author Details */}
                        <div className='mb-12 py-4'>
                            <p className="text-[28px] font-semibold">Author</p>

                            <div className='flex items-center py-4 gap-4'>
                                <img
                                    src={
                                        instructor.image
                                        ? instructor.image
                                        : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                                    }
                                    alt="Author"
                                    className="h-14 w-14 rounded-full object-cover"
                                />
                                <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
                            </div>

                            <p className="text-richblack-50">
                                {instructor?.additionalDetails?.about}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {
                confirmationModal && <ConfirmationModal data={confirmationModal} /> 
            }
        </>
    )
}

export default CourseDetails