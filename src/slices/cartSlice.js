import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
    totalPrice: localStorage.getItem("totalPrice") ? JSON.parse(localStorage.getItem("totalPrice")) : 0,
    totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setTotalItems(state, value){
            state.totalItems = value.payload;
        },

        addToCart(state, value){
            const course = value.payload
            const index = state.cart.findIndex((item) => item._id === course._id)

            if(index >= 0){
                toast.error("Course already present in the cart")
                return
            }

            state.cart.push(course)
            state.totalItems++
            state.totalPrice += course.price
            localStorage.setItem("cart", JSON.stringify(state.cart))
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
            localStorage.setItem("totalPrice", JSON.stringify(state.totalPrice))
            toast.success("Course added to cart")
        },

        removeFromCart(state, value){
            const courseId = value.payload
            const index = state.cart.findIndex((item) => item._id === courseId)

            if(index >= 0){
                state.totalItems--
                state.totalPrice -= state.cart[index].price
                state.cart.splice(index, 1)
                localStorage.setItem("cart", JSON.stringify(state.cart))
                localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
                localStorage.setItem("totalPrice", JSON.stringify(state.totalPrice))
                toast.success("Course removed from cart")
            }
        },

        resetCart(state){
            state.cart = []
            state.totalPrice = 0
            state.totalItems = 0
            localStorage.removeItem("cart")
            localStorage.removeItem("totalPrice")
            localStorage.removeItem("totalItems")
        }
    }
})

export const {setTotalItems, resetCart, addToCart, removeFromCart} = cartSlice.actions;
export default cartSlice.reducer;