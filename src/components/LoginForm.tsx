'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { z, ZodError } from 'zod';
import { Image } from '@nextui-org/react';

interface LoginFormProps {
    onLoginSuccess?: () => void;
}

const LoginSchema = z.object({
    email: z.string().email({ message: 'Введите адрес электронной почты' }),
    password: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
});

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        try {
            LoginSchema.parse(formData);
            const response = await axios.post('/api/login', formData);
            if (response.status === 200) {
                const { avatar_url, username } = response.data;
                localStorage.setItem('avatar_url', avatar_url);
                localStorage.setItem('username', username);
                onLoginSuccess?.();
                router.push('/subscriptions');
            }
        } catch (err) {
            if (err instanceof ZodError) {
                const z = err.errors.reduce<Record<string, string>>((acc, cur) => {
                    acc[cur.path[0] as string] = cur.message;
                    return acc;
                }, {});
                setErrors(z);
            } else if (axios.isAxiosError(err) && err.response?.status === 401) {
                setErrors({ general: 'Неверный email или пароль' });
            } else {
                setErrors({ general: 'Произошла ошибка. Попробуйте позже.' });
            }
        }
    };

    const redirectGitHub = useCallback(() => {
        window.location.href = `/api/auth/github?callbackUrl=/subscriptions`;
    }, []);

    const redirectYandex = useCallback(() => {
        window.location.href = `/api/auth/yandex?callbackUrl=/subscriptions`;
    }, []);

    return (
        <div className="w-full m-auto sm:flex sm:flex-col sm:h-screen">
            <div className="lg:flex lg:flex-col lg:align-center lg:gap-8 lg:h-fit lg:mt-auto lg:mb-auto">
                {/* Email/Password */}
                <form onSubmit={handleSubmit} className="flex flex-col items-center w-5/6 lg:w-2/6 m-auto">
                    <h2 className="lg:text-4xl font-bold mb-6 text-emerald-700 sm:text-2xl">Вход</h2>
                    <div className="flex flex-col gap-4 w-full sm:px-2">
                        <div>
                            <input
                                type="email" name="email" placeholder="Адрес электронной почты"
                                value={formData.email} onChange={handleChange}
                                className={`block w-full p-2 border rounded-xl bg-transparent h-12 outline-none ${errors.email ? 'border-red-500' : ''
                                    }`}
                                aria-invalid={!!errors.email}
                                aria-describedby="email-error"
                            />
                            {errors.email && <p id="email-error" className="text-red-500">{errors.email}</p>}
                        </div>
                        <div>
                            <input
                                type="password" name="password" placeholder="Пароль"
                                value={formData.password} onChange={handleChange}
                                className={`block w-full p-2 border rounded-xl bg-transparent h-12 outline-none ${errors.password ? 'border-red-500' : ''
                                    }`}
                                aria-invalid={!!errors.password}
                                aria-describedby="password-error"
                            />
                            {errors.password && <p id="password-error" className="text-red-500">{errors.password}</p>}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-1/6 sm:w-4/6 bg-emerald-700 hover:bg-emerald-600 disabled:bg-gray-300 text-white py-2 rounded-xl mt-4 transition"
                    >
                        Войти
                    </button>
                    {errors.general && <p className="text-red-500 pt-2">{errors.general}</p>}
                </form>

                {/* OAuth-кнопки */}
                <div className="flex flex-row items-center gap-4 ml-auto mr-auto">
                    <button
                        onClick={redirectGitHub}
                        className="w-fit bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-xl transition flex flex-row gap-3"
                    >
                        <Image width={24} height={24} src="/icons/github-mark-white.svg" alt="github icon" />
                        Войти через GitHub
                    </button>
                    <button
                        onClick={redirectYandex}
                        className="w-fit bg-gray-950 hover:bg-gray-900 text-white py-2 px-4 rounded-xl transition flex flex-row gap-3"
                    >
                        <Image width={24} height={24} src="/icons/yandex.svg" alt="yandex icon" />
                        Войти через Яндекс
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(LoginForm);
