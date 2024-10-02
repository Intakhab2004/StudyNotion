import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import SideBar from '../components/core/Dashboard/SideBar';
import Footer from "../components/common/Footer"

const Dashboard = () => {

    const {loading: authLoading} = useSelector((state) => state.auth);
    const {loading: profileLoading} = useSelector((state) => state.profile);

    if(profileLoading || authLoading){
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
    }

    return (
        <div>
            <div className="relative flex min-h-[calc(100vh-3.5rem)] overflow-auto">
                <SideBar />
                <div className="flex-1 mb-20" >
                    <div className="mx-auto w-11/12 max-w-[1000px] py-10">
                        <Outlet />
                    </div>
                </div>
             </div>
            <Footer/>                          
        </div>
    )
}

export default Dashboard