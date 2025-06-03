import React, { useState } from 'react'
import assets from '../assets/assets'
import { signup, login, resetPassword } from '../config/firebase'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const [currState, setCurrState] = useState('Sign Up')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const onSubmitHandle = (event) => {
        event.preventDefault();
        if (currState === 'Sign Up') {
            signup(username, email, password);
            navigate('/profile');
        }
        else {
            login(email, password);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden'>
          
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>

            <div className='w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10'>
             
                <div className='flex flex-col items-center lg:items-start text-center lg:text-left'>
                    <div className='relative group'>
                        <img 
                            src={assets.logo_big1} 
                            className='w-64 lg:w-80 drop-shadow-2xl transform transition-transform duration-300 group-hover:scale-105' 
                            alt="Logo"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                    <h1 className='text-white text-3xl lg:text-5xl font-bold mt-6 mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text'>
                        Welcome Back
                    </h1>
                    <p className='text-blue-200 text-lg lg:text-xl max-w-md'>
                        Connect with friends and family instantly. Your conversations, secure and private.
                    </p>
                </div>

                {/* Form Section */}
                <div className='w-full max-w-md'>
                    <form 
                        onSubmit={onSubmitHandle}
                        className='bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300'
                    >
                        <div className='text-center mb-8'>
                            <h2 className='text-3xl font-bold text-white mb-2'>{currState}</h2>
                            <div className='w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full'></div>
                        </div>

                        <div className='space-y-6'>
                            {currState === 'Sign Up' ? (
                                <div className='relative group'>
                                    <input
                                        onChange={(e) => setUsername(e.target.value)}
                                        value={username}
                                        type='text'
                                        placeholder='Username'
                                        className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                            ) : null}

                            <div className='relative group'>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    type='email'
                                    placeholder='Email'
                                    className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                            </div>

                            <div className='relative group'>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    type='password'
                                    placeholder='Password'
                                    className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                            </div>

                            <button
                                type='submit'
                                className='w-full p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group'
                            >
                                {currState === 'Sign Up' ? 'Create Account' : 'Sign In'}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>

                            <div className="flex items-start gap-3 text-white/80">
                                <input 
                                    type="checkbox" 
                                    className='mt-1 w-4 h-4 rounded border-white/20 bg-white/10 focus:ring-blue-400'
                                />
                                <p className='text-sm leading-relaxed'>
                                    I agree to the <span className='text-blue-400 hover:text-blue-300 cursor-pointer underline'>Terms of Service</span> and <span className='text-blue-400 hover:text-blue-300 cursor-pointer underline'>Privacy Policy</span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 text-center space-y-4">
                            {currState === 'Sign Up' ? (
                                <p className='text-white/80'>
                                    Already have an account?{' '}
                                    <span 
                                        className='text-blue-400 hover:text-blue-300 cursor-pointer font-semibold transition-colors duration-200 hover:underline' 
                                        onClick={() => setCurrState('Login')}
                                    >
                                        Sign In
                                    </span>
                                </p>
                            ) : (
                                <p className='text-white/80'>
                                    Don't have an account?{' '}
                                    <span 
                                        className='text-blue-400 hover:text-blue-300 cursor-pointer font-semibold transition-colors duration-200 hover:underline' 
                                        onClick={() => setCurrState('Sign Up')}
                                    >
                                        {currState === 'Sign Up' ? 'Login' : 'Sign Up'}
                                    </span>
                                </p>
                            )}

                            {currState === 'Login' ? (
                                <p className='text-white/80'>
                                    <span 
                                        className='text-purple-400 hover:text-purple-300 cursor-pointer font-semibold transition-colors duration-200 hover:underline' 
                                        onClick={() => resetPassword(email)}
                                    >
                                        Forgot Password?
                                    </span>
                                </p>
                            ) : null}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login