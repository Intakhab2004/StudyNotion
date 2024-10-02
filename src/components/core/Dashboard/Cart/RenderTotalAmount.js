import React from 'react'
import IconBtn from "../../../common/IconBtn"
import { useSelector } from 'react-redux'

const RenderTotalAmount = () => {

    const {totalPrice, cart} = useSelector((state) => state.auth);



    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id);
        console.log("Bought these courses:", courses)
    }

    return (
        <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
            <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {totalPrice}</p>
            <IconBtn
                text="Buy Now"
                onclick={handleBuyCourse}
                customClasses="w-full justify-center"
            />
        </div>
    )
}

export default RenderTotalAmount