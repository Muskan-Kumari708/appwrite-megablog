import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref) {
    const id = useId()
    return (
        <div className='w-full'>
            {label && (
                <label
                    className='inline-block mb-1 pl-1 text-sm sm:text-base text-stone-700'
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`px-3 py-2 rounded-lg bg-white text-stone-900 placeholder-stone-400 outline-none border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 duration-200 w-full text-base ${className}`}
                ref={ref}
                {...props}
                id={id}
            />
        </div>
    )
})

export default Input