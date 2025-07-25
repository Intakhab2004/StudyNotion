import { useEffect, useState } from "react";
import LightLogo from "../../assets/Logo/Logo-Full-Light.png"
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../Data/navbar-links";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../../Util/constants";
import { FaCartArrowDown } from "react-icons/fa";
import ProfileDropDown from "../core/auth/ProfileDropDown";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { IoIosArrowDown } from "react-icons/io";

function Navbar(){

    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const {totalItems} = useSelector((state) => state.cart);


    const [subLinks, setSublinks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        ;(async () => {
            setLoading(true);
            try{
                const res = await apiConnector("GET", categories.CATEGORIES_API)
                setSublinks(res.data.data)
            }
            catch(error){
                console.log("Could not fetch Categories.", error)
            }
            setLoading(false);
        })()
    }, [])

    const location = useLocation();
    function matchRoute(route){
        return matchPath({path: route}, location.pathname);
    }

    return(
        <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${location.pathname === "/" ? "bg-richblack-900" : "bg-richblack-800"}`}>
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                <Link to={"/"}>
                    <img src={LightLogo} alt="Logo" width={160} height={32} loading="lazy"/>
                </Link>

                <nav className="hidden md:block">
                    <ul className="flex gap-x-6 text-richblack-25">
                        {
                            NavbarLinks.map((link, index) => {
                                return (
                                    <li key={index}>
                                        {
                                            link.title === "Catalog" ? (
                                                <>
                                                    <div className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName")} ? "text-yellow-25" : "text-richblack-25"`}>
                                                        <p>{link.title}</p>
                                                        <IoIosArrowDown />

                                                        <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                                            {
                                                                (loading || !subLinks) ? (<p>Loading...</p>) :
                                                                subLinks.length ? (
                                                                    <>
                                                                        {
                                                                            subLinks?.filter((sublink) => sublink?.course?.length > 0)
                                                                            ?.map((subLink, index) => (
                                                                                <Link to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50" key={index}>
                                                                                    <p>{subLink.name}</p>
                                                                                </Link>
                                                                            ))
                                                                            
                                                                        }
                                                                    </>
                                                                ) : (<p className="text-center">No Courses Found</p>)
                                                            }
                                                        </div>
                                                    </div> 
                                                </>
                                            ) : (
                                                <Link to={link.path}>
                                                    <p className={`${matchRoute(link.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                                        {link.title}
                                                    </p>
                                                </Link>
                                            )
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </nav>

                {/* signup/login/Dashboard section */}
                <div className="hidden items-center gap-x-4 md:flex">
                    {
                        user && user?.userType !== ACCOUNT_TYPE.INSTRUCTOR && (
                            <Link to="/dashboard/cart" className="relative">
                                <FaCartArrowDown className="text-2xl text-richblack-100" />
                                {
                                    totalItems>0 && (
                                        <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to={"/login"}>
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                    Log in
                                </button>
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to={"/signup"}>
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                    Sign up
                                </button>
                            </Link>
                        )
                    }
                    {
                        token !== null && <ProfileDropDown/>
                    }

                </div>    
            </div>
        </div>
    )
}

export default Navbar;