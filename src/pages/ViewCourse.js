import React, { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';
import VideoDetailSidebar from '../components/core/ViewCourse/VideoDetailSidebar';
import { useDispatch, useSelector } from 'react-redux';
import {
    setCompletedLectures,
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures

} from "../slices/viewCourseSlice"
import { getFullCourseDetails } from '../services/operation/courseDetailsAPI';

const ViewCourse = () => {

    const [reviewModal, setReviewModal] = useState(false);
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth);
    const {courseId} = useParams();

    
    useEffect(() => {
        ;(async () => {
            const courseData = await getFullCourseDetails(courseId, token)
            
            dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
            dispatch(setEntireCourseData(courseData.courseDetails))
            dispatch(setCompletedLectures(courseData.completedVideos))
            let lectures = 0
            courseData?.courseDetails?.courseContent?.forEach((sec) => {
                lectures += sec.subSection.length
            })
            dispatch(setTotalNoOfLectures(lectures))
        })()
    
    }, [])

    return (
        <>
            <div className="relative flex min-h-[calc(100vh-3.5rem)]">
                <VideoDetailSidebar setReviewModal = {setReviewModal} />

                <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                    <div className='mx-6'>
                        <Outlet/>
                    </div>
                </div>
            </div>

            {
                reviewModal && <CourseReviewModal setReviewModal = {setReviewModal} />
            }
        </>
    )
}

export default ViewCourse