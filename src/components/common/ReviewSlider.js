import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { FreeMode, Pagination, Autoplay } from 'swiper/modules'
import { FaStar } from "react-icons/fa";
import ReactStars from "react-stars";
import {apiConnector} from "../../services/apiConnector"
import { ratings } from "../../services/apis";


function ReviewSlider(){

    const [reviews, setReviews] = useState([]);
    const truncateWords = 15;

    useEffect(() => {

        const fetchReviews = async () => {
            try{
                console.log("HELLO2")
                const { data } = await apiConnector("GET", ratings.REVIEWS_DETAILS_API);

                if(data?.success) {
                    setReviews(data?.data);
                }
            } 
            catch (error) {
                console.error("Error fetching reviews: ", error);
            }
        };
    
        fetchReviews();
    }, []);

    return(
        <div className="text-white">
            <div className="my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent">
                <Swiper
                    slidesPerView={reviews.length < 4 ? reviews.length % 4 : 4}
                    spaceBetween={14}
                    loop={true}
                    freeMode={true}
                    autoplay={{
                      delay: 1000,
                      disableOnInteraction: false,
                    }}
                    modules={[FreeMode, Pagination, Autoplay]}
                    className="w-full"
                >
                    {
                        reviews.map((review, index) => (
                            <SwiperSlide key={index}>
                                <div className="bg-richblack-800 p-4 text-richblack-25 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={review?.user?.image ? review?.user?.image : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`}
                                            alt={`${review?.user?.firstName} ${review?.user?.lastName}`}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />

                                        <div className="flex flex-col">
                                            <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                                            <h2 className="text-[12px] font-medium text-richblack-500">
                                                {review?.course?.courseName}
                                            </h2>
                                        </div>
                                    </div>

                                    <p className="font-medium text-richblack-25">
                                        {review?.reviews.split(" ").length > truncateWords
                                        ? `${review?.reviews.split(" ").slice(0, truncateWords).join(" ")} ...`
                                        : `${review?.reviews}`}
                                    </p>

                                    <div className="flex items-center mt-3 gap-2">
                                        <h3 className="font-semibold text-yellow-400">{review.rating.toFixed(1)}</h3>

                                        <ReactStars
                                            count={5}
                                            value={review.rating}
                                            size={20}
                                            edit={false}
                                            activeColor="#ffd700"
                                            emptyIcon={<FaStar />}
                                            fullIcon={<FaStar />}
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </div>
    )
}

export default ReviewSlider;