import React, { useEffect, useState } from 'react'
import IconBtn from '../../common/IconBtn'
import { VscAdd } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../common/Spinner'
import CoursesTable from './InstructorCourses/CoursesTable'
import { useSelector } from 'react-redux'
import { fetchInstructorCourse } from '../../../services/operation/courseDetailsAPI'

const MyCourse = () => {

    const navigate = useNavigate();
    const {token} = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourse = async() => {
            setLoading(true);
            const result = await fetchInstructorCourse(token);

            if(result){
                setCourses(result);
                console.log("FETCHING THE INSTRUCTOR COURSE", result);
            }
            setLoading(false);
        }
        fetchCourse();
    }, [token])


    return (
        <div>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-14 gap-y-5'>
                <h1 className='text-3xl font-medium text-richblack-5 lg:text-left text-center'>
                    My Course
                </h1>

                <div className='hidden md:block'>
                    <IconBtn
                        type = "btn"
                        text = "Add Course"
                        customClasses="hidden md:block"
                        onClickHandler = {() => navigate("/dashboard/add-course")}
                    >
                        <VscAdd/>
                    </IconBtn>
                </div>
            </div>

            <div>
                {
                    loading ? 
                    (
                        <div>
                            <Spinner />
                        </div>
                    ) : !courses || courses.length === 0 ?
                        (
                            <div>
                                <div className='h-[1px] mb-10  mx-auto bg-richblack-500' ></div>
                                <p className='text-center text-2xl font-medium text-richblack-100 select-none' >No Courses Found</p>
                            </div>
                        ) : 
                            (
                                <CoursesTable courses={courses} setCourses={setCourses} />
                            )              
                }
            </div>
        </div>
    )
}

export default MyCourse