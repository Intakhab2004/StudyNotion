import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import CourseCard from './CourseCard'
import { FreeMode, Pagination } from 'swiper/modules'

const CourseSlider = ({courses}) => {
    return (
        <>
            {
                courses?.length ? 
                                (
                                    <Swiper 
                                        slidesPerView={1}
                                        spaceBetween={25}
                                        loop={true}
                                        modules={[FreeMode, Pagination]}
                                        breakpoints={{
                                        1024: {
                                            slidesPerView: 3,
                                        },
                                        }}
                                        className="max-h-[30rem]"
                                    >
                                        {
                                            courses.map((course, i) => (
                                                <SwiperSlide key={i}>
                                                    <CourseCard course={course} Height={"h-[250px]"} />
                                                </SwiperSlide>
                                            ))
                                        }
                                    </Swiper>
                                ) : 
                                    (
                                        <p className="text-xl text-richblack-5">No Course Found</p>
                                    )
            }
        </>
    )
}

export default CourseSlider