import React from "react";
import ReviewSlider from "../components/common/ReviewSlider";
import Footer from "../components/common/Footer";
import ContactForm from "../components/core/ContactUsPage/ContactForm";
import ContactDetails from "../components/core/ContactUsPage/ContactDetails";

function Contact(){
    return(
        <div>
            <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">

                {/* Contact Details */}
                <div className="lg:w-[40%]">
                    <ContactDetails />
                </div>

                {/* Contact Form */}
                <div>
                    <ContactForm />
                </div>
            </div>

            <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                <h1 className="text-center text-4xl font-semibold mt-8">
                    Reviews form other learners
                    <ReviewSlider />
                </h1>
            </div>

            <Footer />
        </div>
    )
}

export default Contact;