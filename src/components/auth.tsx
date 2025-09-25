'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import ApplicationForm, { FormField } from './form';

export const registrationFormFields: FormField[] = [
    {
        name: "firstName",
        label: "First name",
        type: "text",
        required: true,
    },
    {
        name: "lastName",
        label: "Last name",
        type: "text",
        required: true,
    },
    {
        name: "country",
        label: "Country",
        type: "select",
        required: true,
        options: [
            "United States",
            "United Kingdom",
            "Canada",
            "Australia",
            "Germany",
            "France",
            "India",
            "Other",
        ],
    },
    {
        name: "state",
        label: "State",
        type: "select",
        required: true,
        options: ['delhi'],
    },
    {
        name: "email",
        label: "Email address",
        type: "email",
        required: true,
    },
    {
        name: "phone",
        label: "Phone number",
        type: "phone",
        required: true,
        placeholder: "+1 (555) 000-0000"
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        required: true,
        validation: {
            minLength: 10,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
        }
    },
    {
        name: "passwordConfirmation",
        label: "Password confirmation",
        type: "password",
        required: true,
        showToggle: true,
        validation: "matchPassword",
    },
    {
        name: "referralCode",
        label: "Referal code (optional)",
        type: "text",
        required: false,
    },
    {
        name: "marketingEmails",
        label: "Accept to receive marketing emails from Playse",
        type: "checkbox",
        required: false,
    },
    {
        name: "termsConditions",
        label: "I accept the terms and conditions of use",
        type: "checkbox",
        required: true,
    }
];

export const loginFormFields: FormField[] = [
    {
        name: "email",
        label: "Email address",
        type: "email",
        required: true,
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        required: true,
        showToggle: true,
    }
];

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async () => {
        try {
            alert(isLogin ? 'Login submitted!' : 'Registration submitted!')
        } catch (error) {
            console.error(error);
        }
    }

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
    }

    return (
        <div className='min-h-screen relative flex justify-center items-center p-4 bg-background'>

            <Image
                src={'/assets/bg-1.jpg'}
                alt='Background'
                fill
                className='object-cover backdrop-blur-2xl inset-0'
                priority
            />
            <div className='relative w-full max-w-7xl h-[90vh] min-h-[650px]'>
                {/* Main Card Container */}
                <div className='relative w-full h-full bg-card backdrop-blur-sm rounded-3xl shadow-xl ring-1 ring-border/20 overflow-hidden'>

                    <div className='flex h-full'>

                        {/* Left Side - Image Container */}
                        <div className='flex-1 relative overflow-hidden bg-muted/30'>
                            {/* Background with lighter overlay */}
                            <div className='absolute inset-0'>
                                <Image
                                    src={'/assets/bg-1.jpg'}
                                    alt='Background'
                                    fill
                                    className='object-cover'
                                    priority
                                />
                                {/* Much lighter overlay */}
                                <div className='absolute inset-0 bg-background/20'></div>
                            </div>

                            {/* Top left decoration */}
                            <div className='absolute top-8 left-8 w-20 h-20 bg-card/60 backdrop-blur-md rounded-2xl ring-1 ring-border/30'></div>

                            {/* Bottom right decoration */}
                            <div className='absolute bottom-8 right-8 w-28 h-28 bg-card/40 backdrop-blur-md rounded-3xl ring-1 ring-border/20'></div>

                            {/* Center Image Container */}
                            <div className='absolute inset-0 flex items-center justify-center p-12'>
                                <div className='relative w-full max-w-md h-80 bg-card/80 backdrop-blur-lg rounded-2xl ring-1 ring-border/40 overflow-hidden shadow-2xl'>
                                    <Image
                                        src={'/assets/bg-1.jpg'}
                                        alt='Auth Image'
                                        fill
                                        className='object-cover'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form Container */}
                        <div className='flex-1 relative bg-card flex flex-col'>

                            {/* Fixed Header */}
                            <div className='flex-shrink-0 px-10 pt-10 pb-6'>
                                <div className='text-center'>
                                    <div className='w-16 h-16 mx-auto mb-6 bg-muted/20 rounded-2xl flex items-center justify-center ring-1 ring-border/20'>
                                        <svg className='w-8 h-8 text-muted-foreground' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z' clipRule='evenodd' />
                                        </svg>
                                    </div>
                                    <h1 className='text-3xl font-bold text-foreground mb-3'>
                                        {isLogin ? 'Welcome Back' : 'Create Account'}
                                    </h1>
                                    <p className='text-muted-foreground'>
                                        {isLogin
                                            ? 'Please sign in to your account'
                                            : 'Please fill in your details to register'
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Scrollable Form Area */}
                            <div className='flex-1 overflow-hidden px-10'>
                                <div className='h-full overflow-y-auto pr-2 scrollbar-none scrollbar-track-transparent scrollbar-thumb-muted/10 hover:scrollbar-thumb-muted/50'>
                                    <ApplicationForm
                                        applicationFormFields={isLogin ? loginFormFields : registrationFormFields}
                                        onSubmit={handleSubmit}
                                        className='!shadow-none !border-none !bg-transparent !p-0'
                                    />
                                </div>
                            </div>

                            {/* Fixed Footer */}
                            <div className='flex-shrink-0 px-10 pb-10 pt-6'>
                                <div className='text-center space-y-4'>
                                    <div className='w-full h-px bg-border/30'></div>
                                    <p className='text-muted-foreground text-sm'>
                                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                                        <button
                                            onClick={toggleAuthMode}
                                            className='ml-1 text-primary hover:text-primary/80 font-semibold transition-colors duration-200 underline-offset-4 hover:underline'
                                        >
                                            {isLogin ? 'Sign up' : 'Sign in'}
                                        </button>
                                    </p>
                                    <p className='text-muted-foreground/60 text-xs'>
                                        {isLogin
                                            ? 'Secure login with your credentials'
                                            : 'Join thousands of users today'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth