import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartCourses from './RenderCartCourses'
import RenderTotalAmount from './RenderTotalAmount'

const Cart = () => {

    const {totalItems} = useSelector((state) => state.cart)


    return (
        <div>
            <div className='bg-richblack-900 text-white'>
                <h2 className=' text-3xl font-medium text-richblack-5 mb-5 md:mb-10'>My Cart</h2>
                <p className='font-semibold text-richblack-400 border-b border-richblack-400 pb-2'>{totalItems} Courses in Cart</p>

                <div>
                    {
                        !totalItems ? 
                                    (
                                        <div>
                                            <p className=' text-3xl text-center text-richblack-100 mt-14' >Your cart is empty</p>
                                        </div>
                                    ) :
                                    (
                                        <div className='flex flex-col-reverse lg:flex-row items-start mt-8 gap-x-10 gap-y-6'>
                                            <RenderCartCourses />
                                            <RenderTotalAmount />
                                        </div>
                                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default Cart