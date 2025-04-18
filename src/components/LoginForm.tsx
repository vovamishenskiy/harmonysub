'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { z, ZodError } from 'zod';

interface LoginFormProps {
    onLoginSuccess?: () => void;
}

const LoginSchema = z.object({
    email: z.string().email({ message: 'Введите адрес электронной почты' }),
    password: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' })
});

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const schema = LoginSchema;

        try {
            schema.parse(formData);

            const response = await axios.post('/api/login', formData);

            if (response.status === 200) {
                const { avatar_url, username } = response.data;
                localStorage.setItem('avatar_url', avatar_url);
                localStorage.setItem('username', username);
                setFormData({
                    email: '',
                    password: ''
                });
                if (onLoginSuccess) onLoginSuccess();
                router.push('/subscriptions');
            }
        } catch (err) {
            if (err instanceof ZodError) {
                const zodErrors = err.errors.reduce((acc: any, curr) => {
                    acc[curr.path[0]] = curr.message;
                    return acc;
                }, {});
                setErrors(zodErrors);
            } else if (axios.isAxiosError(err) && err.response?.status === 401) {
                setErrors({ general: 'Неверный email или пароль' });
            } else {
                setErrors({ general: 'Произошла ошибка. Попробуйте позже.' });
            }
        }
    }

    return (
        <div className='w-full m-auto sm:flex sm:flex-col sm:m-auto sm:h-screen'>
            <div className="sm:block lg:hidden sm:min-h-[15%]"></div>
            <form onSubmit={handleSubmit} className='flex flex-col items-center w-5/6 lg:w-2/6 h-1/3 m-auto'>
                <h2 className="lg:text-4xl font-bold mb-6 text-emerald-700 sm:text-2xl ">Вход</h2>
                <div className="flex flex-col gap max-w-full w-1/3 mx-auto sm:w-full sm:px-2">
                    <div className="mb-4">
                        <input
                            type="email"
                            name='email'
                            placeholder='Адрес электронной почты'
                            value={formData.email}
                            onChange={handleChange}
                            autoFocus
                            className={`block w-full p-2 border rounded-xl bg-transparent h-12 outline-none ${errors.email ? 'border-red-500' : ''}`}
                            aria-invalid={!!errors.email}
                            aria-describedby='email-error'
                        />
                        {errors.email && <p id='email-error' className='text-red-500'>{errors.email}</p>}
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            name='password'
                            placeholder='Пароль'
                            value={formData.password}
                            onChange={handleChange}
                            className={`block w-full p-2 border rounded-xl bg-transparent h-12 outline-none ${errors.password ? 'border-red-500' : ''}`}
                            aria-invalid={!!errors.password}
                            aria-describedby='password-error'
                        />
                        {errors.password && <p id='password-error' className='text-red-500'>{errors.password}</p>}
                    </div>
                </div>
                <button type='submit' className='w-1/6 sm:w-4/6 bg-emerald-700 hover:bg-emerald-600 disabled:bg-gray-300 transition ease-in-out text-white py-2 rounded-xl mt-4'>
                    Войти
                </button>
                {errors.general && <p className='text-red-500 pt-2'>{errors.general}</p>}
            </form>
        </div>
    );
};

export default LoginForm;