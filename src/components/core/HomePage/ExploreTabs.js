import React, { useState } from "react";
import CourseCard from "./CourseCard";
import { HomePageExplore } from "../../../Data/homepage-explore";

const tabs = ["Free", "New to Coding", "Most Popular", "Skills Paths", "Career Paths"];

function ExploreTabs(){

    const [currentTab, setCurrentTab] = useState(tabs[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    function tabSwitch(value){
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }


    return(
        <>
            <div className="lg:flex gap-5 -mt-5 mb-52 mx-auto w-max p-1 text-richblack-200 font-thin bg-richblack-800 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
                {
                    tabs.map((ele, index) => {
                        return (
                            <div className={`text-[16px] flex flex-row items-center gap-2 
                                            ${currentTab === ele ? "bg-richblack-900 text-richblack-5 font-medium"
                                                                    : "text-richblack-200"} px-7 py-[7px] rounded-full transition-all duration-200 cursor-pointer
                                                                    hover:bg-richblack-900 hover:text-richblack-5`} onClick={() => tabSwitch(ele)} key={index} >
                                {ele}
                            </div>
                        )
                    })
                }
            </div>
            
            <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
                {
                    courses.map((ele, index) => {
                        return (
                            <CourseCard 
                                key={index}
                                cardData={ele}
                                currentCard={currentCard}
                                setCurrentCard={setCurrentCard}>
                            </CourseCard>
                        )
                    })
                }
            </div>
        </> 
    )
}

export default ExploreTabs;