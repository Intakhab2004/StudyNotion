import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { MdClose } from 'react-icons/md';

const ChipInput = ({label, name, placeholder, register, errors, setValue, getValues}) => {

    const [chips, setChips] = useState([]);
    const {editCourse, course} = useSelector((state) => state.course);

    useEffect(() => {
        if(editCourse){
            setChips(course?.tag);
        }

        register(name, {required: true, validate: (value) => value.length > 0});
    }, [])

    useEffect(() => {
        setValue(name, chips)
    }, [chips])


    const handleKeyDown = (event) => {
        if(event.key === "Enter" || event.key === ","){
            event.preventDefault();

            const chipValue = event.target.value.trim();

            if(chipValue && !chips.includes(chipValue)){
                const newChips = [...chips, chipValue]

                setChips(newChips);
                event.target.value = ""
            }
        }
    }


    const handleChipDelete = (chipIndex) => {
        const newChips = chips.filter((_, index) => index !== chipIndex);

        setChips(newChips);
    }


    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5 tracking-wider" htmlFor={name}>
                {label} <sup className="text-pink-200">*</sup>
            </label>
            
            <div className="flex w-full flex-wrap gap-y-2">
                {
                    chips.map((chip, index) => (
                        <div className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5" key={index}>
                            {chip}
                            <button className="ml-2 focus:outline-none" type='button' onClick={() => handleChipDelete(index)}>
                                <MdClose className="text-sm" />
                            </button>
                        </div>
                    ))
                }

                <input
                    name={name}
                    id={name}
                    type="text"
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown}
                    className="form-style w-full placeholder:text-sm"
                />
            </div>

            {
                errors[name] && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        {label} is required
                    </span>
                  )
            }

        </div>
    )
}

export default ChipInput