import React, { useEffect, useState } from 'react'
import Error from "../pages/Error"
import Footer from "../components/common/Footer"
import CourseCard from '../components/core/catalog/CourseCard'
import CourseSlider from '../components/core/catalog/CourseSlider'
import { useParams } from 'react-router-dom'
import {categories} from "../services/apis"
import { getCatalogPageData } from '../services/operation/pageAndComponentDatas'
import { apiConnector } from '../services/apiConnector'

const Catalog = () => {

    const [loading, setLoading] = useState(false);
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [active, setActive] = useState(1);
    const {catalogName} = useParams();


    // Function to fetch categoryId
    useEffect(() => {
        const getCategoryDetails = async() => {
            try{
                setLoading(true);
                const response = await apiConnector("GET", categories.CATEGORIES_API);
                
                const category_id = response?.data?.data?.filter(
                    (id) => id.name.split(" ").join("-").toLowerCase() === catalogName
                )[0]._id;
                
                setCategoryId(category_id);
                setLoading(false);
            }
            catch(error){
                console.log("Could not fetch Categories.", error)
            }
        }

        getCategoryDetails();

    }, [catalogName])

    useEffect(() => {
        if(categoryId){
            const getCategoryDetails = async() => {
                try{
                    setLoading(true);
                    
                    const res = await getCatalogPageData(categoryId)

                    setCatalogPageData(res)

                    setLoading(false);
                }
                catch(error){
                    console.log(error)
                }
            }

            getCategoryDetails();
        }

    }, [categoryId])


    if(loading || !catalogPageData){
        return(
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className='loader'></div>
            </div>
        )
    }

    if(!loading && !catalogPageData?.success){
        return <Error />
    }

    return (
        <>
            <div className=" box-content bg-richblack-800 px-4">
                <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                    <p className="text-sm text-richblack-300">
                        Home / Catalog / {" "}
                        <span className="text-yellow-25 capitalize">
                            {catalogName}
                        </span>
                    </p>

                    <p className="text-3xl text-richblack-5">
                        {catalogPageData?.data?.specifiedCategory.name}
                    </p>

                    <p className="max-w-[870px] text-richblack-200">
                        {catalogPageData?.data?.specifiedCategory.description}
                    </p>
                </div>
            </div>

            {/* Section 1 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">
                    Courses to get you started
                </div>
                <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                    <p
                      className={`px-4 py-2 cursor-pointer ${active === 1
                                  ? "border-b border-b-yellow-25 text-yellow-25"
                                  : "text-richblack-50"}`}
                      onClick = {() => setActive(1)}
                    >
                        Most Popular
                    </p>

                    <p
                      className={`px-4 py-2 ml-2 cursor-pointer ${active === 2
                                  ? "border-b border-b-yellow-25 text-yellow-25"
                                  : "text-richblack-50"}`}
                      onClick = {() => setActive(2)}
                    >
                        New
                    </p>    
                </div>

                <div>
                    <CourseSlider courses = {catalogPageData?.data?.specifiedCategory?.course} />
                </div>
            </div>

            {/* Section 2 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">
                    Top courses in {catalogPageData?.data?.otherCategoryCourse?.name}
                </div>
                
                <div className='border-b border-b-richblack-600 mt-2 max-w-maxContentTab h-1'></div>

                <div className="py-8">
                    <CourseSlider Courses={catalogPageData?.data?.otherCategoryCourse?.course}/>
                </div>
            </div>

            {/* Section 3 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">
                    Frequently Bought
                </div>
                
                <div className='border-b border-b-richblack-600 mt-2 max-w-maxContentTab h-1'></div>

                <div className='py-8'>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {
                            catalogPageData?.data?.topSellingCourses
                            ?.slice(0, 4)
                            .map((course, index) => (
                                <CourseCard course={course} key={index} Height={"h-[400px]"} />
                            ))
                        }
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Catalog