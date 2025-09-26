'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import StepApplicationForm, { FormStep, FormField } from './step-form';

// Registration Steps Configuration - ye same rahenge
export const registrationSteps: FormStep[] = [
    {
        title: "Personal Info",
        description: "Basic personal information",
        icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
        fields: [
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
            }
        ]
    },
    {
        title: "Location",
        description: "Your location details",
        icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>,
        fields: [
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
                options: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Other'],
            }
        ]
    },
    {
        title: "Security",
        description: "Create your secure account",
        icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>,
        fields: [
            {
                name: "password",
                label: "Password",
                type: "password",
                required: true,
                showToggle: true,
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
            }
        ]
    },
    {
        title: "Final Step",
        description: "Complete your registration",
        icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>,
        fields: [
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
        ]
    }
];

// Login Steps Configuration (Simple single step)
export const loginSteps: FormStep[] = [
    {
        title: "Sign In",
        description: "Enter your credentials to access your account",
        icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" /></svg>,
        fields: [
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
                validation: {
                    minLength: 0,
                    requireUppercase: false,
                    requireLowercase: false,
                    requireNumbers: false,
                    requireSpecialChars: false
                },
                required: true,
                showToggle: true,
            }
        ]
    }
];

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (formData: any) => {
        try {
            console.log('Form Data:', formData);
            alert(isLogin ? 'Login submitted!' : 'Registration submitted!')
        } catch (error) {
            console.error(error);
        }
    }

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
    }

    return (
        <div className='min-h-screen relative flex justify-center items-center p-2 sm:p-4 xl:p-0 bg-background'>
            {/* Background Image */}
            <Image
                src={'/assets/bg-1.jpg'}
                alt='Background'
                fill
                className='object-cover backdrop-blur-2xl inset-0'
                priority
            />

            {/* Main Container - Responsive */}
            <div className='relative w-full max-w-sm sm:max-w-[95%] md:max-w-4xl lg:max-w-6xl xl:max-w-7xl h-[95vh] sm:!h-[80vh] min-h-[600px] shadow-2xl  border-border rounded-3xl sm:min-h-[450px]'>
                {/* Main Card Container - Responsive */}
                <div className='relative w-full h-full bg-card/55 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl ring-1 ring-border/20 overflow-hidden'>
                    {/* Responsive Layout Container */}
                    <div className='flex flex-col md:flex-row h-full'>

                        {/* Left Side - Image Container - Hidden on mobile, visible on desktop */}
                        <div className='hidden md:flex md:flex-1 relative overflow-hidden bg-muted/30'>
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

                            {/* Decorations - Responsive */}
                            <div className='absolute top-4 lg:top-8 left-4 lg:left-8 w-16 h-16 lg:w-20 lg:h-20 bg-card/60 backdrop-blur-md rounded-xl lg:rounded-2xl ring-1 ring-border/30'></div>
                            <div className='absolute bottom-4 lg:bottom-8 right-4 lg:right-8 w-20 h-20 lg:w-28 lg:h-28 bg-card/40 backdrop-blur-md rounded-2xl lg:rounded-3xl ring-1 ring-border/20'></div>

                            {/* Center Image Container - Responsive */}
                            <div className='absolute inset-0 flex items-center justify-center shadow-2xl p-8 lg:p-12'>
                                <div className='relative w-full max-w-xs lg:max-w-md h-64 lg:h-80 bg-card/80 backdrop-blur-lg rounded-xl lg:rounded-2xl ring-1 ring-border/40 overflow-hidden shadow-2xl'>
                                    <Image
                                        src={'/assets/bg-1.jpg'}
                                        alt='Auth Image'
                                        fill
                                        className='object-cover'
                                    />
                                    {/* Overlay text */}
                                    <div className='absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent flex items-end justify-center p-4 lg:p-6'>
                                        <div className='text-center text-muted-foreground'>
                                            <h3 className='text-lg lg:text-xl font-semibold mb-2'>
                                                {isLogin ? 'Welcome Back!' : 'Join Our Community'}
                                            </h3>
                                            <p className='text-xs lg:text-sm text-muted-foreground'>
                                                {isLogin
                                                    ? 'Access your account securely'
                                                    : 'Create your account in simple steps'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side / Full Width on Mobile - Form Container */}
                        <div className='flex-1 md:flex-1 relative bg-card/10 backdrop-blur-md flex flex-col h-full'>

                            {/* Mobile Header Background - Only on mobile */}
                            <div className='md:hidden absolute inset-0 opacity-10'>
                                <Image
                                    src={'/assets/bg-1.jpg'}
                                    alt='Mobile Background'
                                    fill
                                    className='object-cover'
                                />
                            </div>

                            {/* Fixed Header - Responsive */}
                            <div className='relative z-10 flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-2'>
                                <div className='text-center'>
                                    {/* Logo/Icon - Responsive */}
                                    <div className='w-12 h-12 sm:w-14 sm:h-14 md:w-18 md:h-18 shadow-lg mx-auto mb-2 sm:mb-3 bg-muted/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center ring-1 ring-border/20'>
                                        <svg className='w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z' clipRule='evenodd' />
                                        </svg>
                                    </div>

                                    {/* Title - Responsive */}
                                    <h1 className='text-lg sm:text-xl lg:text-4xl font-bold text-foreground mb-1'>
                                        {isLogin ? 'Welcome Back' : 'Create Account'}
                                    </h1>

                                    {/* Subtitle - Responsive */}
                                    <p className='text-xs sm:text-sm text-muted-foreground px-2'>
                                        {isLogin
                                            ? 'Please sign in to your account'
                                            : 'Complete the steps below to register'
                                        }
                                    </p>

                                    {/* Mobile-only welcome message */}
                                    <div className='md:hidden mt-3 p-3 bg-muted/10 backdrop-blur-sm rounded-lg border border-border/20'>
                                        <p className='text-xs text-muted-foreground'>
                                            {isLogin
                                                ? '👋 Welcome back! Please enter your credentials below.'
                                                : '🚀 Join thousands of users with our step-by-step process.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Step Form Area - Responsive */}
                            <div className='relative z-10 flex-1 overflow-hidden'>
                                <div className='h-full overflow-y-auto px-2 sm:px-4 py-1 sm:py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted/20'>
                                    <StepApplicationForm
                                        metaDataName={isLogin ? 'login' : 'register'}
                                        steps={isLogin ? loginSteps : registrationSteps}
                                        onSubmit={handleSubmit}
                                        className='!max-w-none !my-0 !shadow-none !bg-transparent !p-0'
                                        allowStepNavigation={!isLogin}
                                    />
                                </div>
                            </div>

                            {/* Fixed Footer - Responsive */}
                            <div className='relative z-10 flex-shrink-0 px-4 sm:px-6 pb-4 sm:pb-6 pt-2'>
                                <div className='text-center space-y-2 sm:space-y-3'>
                                    {/* Divider */}
                                    <div className='w-full h-px bg-border/30'></div>

                                    {/* Toggle Auth Mode - Responsive */}
                                    <p className='text-xs sm:text-sm text-muted-foreground'>
                                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                                        <button
                                            onClick={toggleAuthMode}
                                            className='ml-1 text-primary hover:text-primary/80 font-semibold transition-colors duration-200 underline-offset-4 hover:underline text-xs sm:text-sm'
                                        >
                                            {isLogin ? 'Sign up' : 'Sign in'}
                                        </button>
                                    </p>

                                    {/* Footer Message - Responsive */}
                                    <p className='text-xs text-muted-foreground/90 px-2'>
                                        {isLogin
                                            ? 'Secure login with your credentials'
                                            : 'Join thousands of users with our step-by-step process'
                                        }
                                    </p>

                                    {/* Mobile-only additional info */}
                                    {/* <div className='md:hidden text-xs text-muted-foreground/50'>
                                        Powered by Next.js & Tailwind CSS
                                    </div> */}
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
