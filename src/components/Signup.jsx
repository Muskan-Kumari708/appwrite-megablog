import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import Button from './Button.jsx'
import Input from './Input.jsx'
import Logo from './Logo.jsx'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, setError] = useState("")
    const { register, handleSubmit, formState: { isSubmitting } } = useForm()

    const create = async (data) => {
        setError("")
        try {
            const account = await authService.createAccount(data)
            if (account) {
                const userData = await authService.getCurrentUser()
                if (!userData) {
                    throw new Error('Your account was created, but the session could not be verified. Please sign in.')
                }
                dispatch(login({ userData }))
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="flex items-center justify-center w-full">
            <div className="mx-auto w-full max-w-lg bg-white rounded-2xl p-5 sm:p-10 border border-stone-200 shadow-sm">
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" className="text-stone-800" />
                    </span>
                </div>
                <h2 className="text-center text-xl sm:text-2xl font-bold leading-tight text-stone-900">
                    Sign up to create account
                </h2>
              <p className="mt-2 text-center text-sm sm:text-base text-stone-600">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-amber-700 hover:text-amber-600 hover:underline" 
                    >
                        Sign In
                    </Link>
                </p>
                {error && (
                    <p className="text-red-600 mt-6 sm:mt-8 text-center text-sm sm:text-base break-words">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit(create)} className="mt-6 sm:mt-8">
                    <div className='space-y-5'>
                        <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("name", { required: true })}
                        />
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", { required: true })}
                        />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Creating account..." : "Create Account"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup
