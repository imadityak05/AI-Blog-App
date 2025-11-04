import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const { axios } = useAppContext();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (data.success) {
                toast.success('Registration successful! Please login.');
                navigate('/admin/login');
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            toast.error(error.response?.data?.message || 'An error occurred  ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-50'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Create an <span className='text-primary'>Account</span>
                    </h1>
                    <p className='mt-2 text-sm text-gray-600'>
                        Join our community today
                    </p>
                </div>

                <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
                    <div className='space-y-4'>
                        <div>
                            <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
                                Username
                            </label>
                            <input
                                id='username'
                                name='username'
                                type='text'
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
                                placeholder='Enter your username'
                            />
                        </div>

                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                                Email address
                            </label>
                            <input
                                id='email'
                                name='email'
                                type='email'
                                autoComplete='email'
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
                                placeholder='Enter your email'
                            />
                        </div>

                        <div>
                            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                                Password
                            </label>
                            <input
                                id='password'
                                name='password'
                                type='password'
                                autoComplete='new-password'
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
                                placeholder='Enter your password'
                            />
                        </div>

                        <div>
                            <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
                                Confirm Password
                            </label>
                            <input
                                id='confirmPassword'
                                name='confirmPassword'
                                type='password'
                                autoComplete='new-password'
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
                                placeholder='Confirm your password'
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type='submit'
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <div className='text-sm text-center text-gray-600'>
                    <p>
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/admin/login')}
                            className='font-medium text-primary hover:text-primary/80'
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
