import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/CTAButton";
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import ExploreTabs from "../components/core/HomePage/ExploreTabs";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import CrossCards from "../components/core/HomePage/CrossCards";
import Instructor from "../assets/Images/Instructor.png";
import ReviewSlider from "../components/common/ReviewSlider";
import Footer from "../components/common/Footer";

function Home(){
    return(
        <div>
            {/* section 1 */}
            <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
                <Link to={"/signup"}>
                    <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
                        <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>
                </Link>

                <div className="mt-8 text-center font-semibold text-4xl">
                    Empower Your Future with
                    <HighlightText text = {"Coding Skills"}/>
                </div>

                <p className="-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.</p>

                <div className="mt-8 flex flex-row gap-7">
                    <CTAButton linkto={"/signup"} active={true}>
                        Learn More
                    </CTAButton>

                    <CTAButton linkto={"/login"} active={false}>
                        Book a Demo
                    </CTAButton>
                </div>

                <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
                    <video autoPlay muted loop className="shadow-[20px_20px_rgba(255,255,255)]">
                        <source src={Banner} type="video/mp4"/>
                    </video>
                </div>

                <div>
                    <CodeBlocks
                     position={"lg:flex-row"}
                     heading={
                            <div className="text-left font-semibold text-4xl">
                                Unlock your 
                                <HighlightText text={"coding potential "}/>
                                with our online courses.
                            </div>
                            }
                     subHeading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}      
                     btn1={["Try it yourself", "/signup", true]} 
                     btn2={["Learn More", "/login", false]} 
                     codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                     codeColor={"text-yellow-25"}
                     backgroundGradient={<div className="codeblock1 absolute"></div>}
                        />
                </div>

                <div>
                    <CodeBlocks
                     position={"lg:flex-row-reverse"}
                     heading={
                            <div className="text-left font-semibold text-4xl">
                                Start 
                                <HighlightText text={"coding in seconds"}/>
                            </div>
                            }
                     subHeading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}      
                     btn1={["Continue Lesson", "/signup", true]} 
                     btn2={["Learn More", "/login", false]} 
                     codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                     codeColor={"white"}
                     backgroundGradient={<div className="codeblock2 absolute"></div>}
                        />
                </div>

                <div className="text-center font-semibold text-4xl">
                    Unlock the
                    <HighlightText text={"Power of Code"}/>
                </div>

                <div className="font-semibold text-center text-lg text-richblack-200 mt-[-25px]">Learn to Build Anything You Can Imagine</div>

                <ExploreTabs/>

            </div>


            {/* Section 2 */}
            <div className="bg-pure-greys-5 text-richblack-700">
                <div className="bg_home h-[320px]">
                    <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
                        <div className="lg:h-[150px]"></div>
                        <div className="flex flex-row gap-7 text-white lg:mt-8">
                            <CTAButton linkto={"/signup"} active={true}>
                                <div className="flex items-center gap-2">
                                    Explore Full Catalog
                                    <FaArrowRight/>
                                </div>
                            </CTAButton>
                            <CTAButton linkto={"/login"} active={false}>
                                Learn More
                            </CTAButton>
                        </div>
                    </div>
                </div>
                <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
                    <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
                        <div className="text-left font-semibold text-4xl lg:w-[45%]">
                            Get the skills you need for a
                            <HighlightText text={" job that is in demand."}/>
                        </div>

                        <div className="flex flex-col items-start gap-10 lg:w-[40%]">
                            <div>
                                The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                            </div>
                            <CTAButton linkto={"/login"} active={true}>
                                Learn More
                            </CTAButton>
                        </div>
                    </div>

                    <TimelineSection/>

                    <div className="text-4xl font-semibold text-center my-10">
                        Your swiss knife for
                        <HighlightText text={"learning any language"} />
                        <div className="text-center text-richblack-700 font-small lg:w-[75%] mx-auto leading-6 text-base mt-3">
                            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
                        </div>
                    </div>
                    
                    <CrossCards/>
                </div>
            </div>

            {/* Section 3 */}
            <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    <div className="lg:w-[50%]">
                        <img src={Instructor} alt="Instructor" className="shadow-white shadow-[-20px_-20px_0_0]" />
                    </div>

                    <div className="lg:w-[50%] flex gap-10 flex-col">
                        <div className="lg:w-[50%] text-4xl font-semibold ">
                            Become an
                            <HighlightText text={"Instructor"} />
                        </div>
                        <div className="font-medium text-[16px] text-justify w-[90%] text-richblack-300">
                            Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                        </div>
                        <div className="w-fit">
                            <CTAButton linkto={"/signup"} active={true}>
                                <div className="flex items-center gap-3">
                                    Start Teaching Today
                                    <FaArrowRight/>
                                </div>
                            </CTAButton>
                        </div>
                    </div>
                </div>

                <h1 className="text-center text-4xl font-semibold mt-8">
                    Reviews from other learners
                </h1>

                <ReviewSlider/>
            </div>

            <Footer/>
        </div>
    )
}

export default Home;


