import React from "react";
import KnowYourProgress from "../../../assets/Images/Know_your_progress.png"
import compareWithOthers from "../../../assets/Images/Compare_with_others.png"
import planYourLessons from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from "./CTAButton";

function CrossCards(){
    return(
        <div>
            <div className="flex flex-col lg:flex-row items-center justify-center -mt-16 lg:mt-0">
                <div className="object-contain  lg:-mr-32 ">
                    <img src={KnowYourProgress} alt="" />
                </div>
                <div className="object-contain lg:-mb-10 lg:-mt-0 -mt-12">
                    <img src={compareWithOthers} alt="" />
                </div>
                <div className="object-contain  lg:-ml-36 lg:-mt-5 -mt-16">
                    <img src={planYourLessons} alt="" />
                </div>
            </div>

            <div className="w-fit mx-auto lg:mb-20 mb-8 mt-6">
                <CTAButton linkto={"/signup"} active={true}>
                    Learn More
                </CTAButton>
            </div>
        </div>
    )
}

export default CrossCards;