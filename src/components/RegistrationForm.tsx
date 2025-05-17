'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { z } from 'zod';
import { ZodError } from 'zod';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Link } from '@nextui-org/react';

const HCAPTCHA_TOKEN: any = process.env.NEXT_PUBLIC_HCAPTCHA_TOKEN;

interface RegistrationFormProps {
    onRegisterSuccess?: () => void;
}

const RegistrationSchema = z.object({
    name: z.string().min(1, { message: "Введите имя" }),
    surname: z.string().min(1, { message: "Введите фамилию" }),
    username: z.string().min(1, { message: "Введите имя пользователя на английском языке" }),
    email: z.string().email({ message: 'Введите адрес электронной почты' }),
    password: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
    confirmPassword: z.string().min(6, { message: 'Подтвердите пароль' }),
    country: z.string().min(1, { message: 'Выберите страну' }),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
});

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegisterSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isRegistered, setIsRegistered] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCaptcha = (captchaToken: string) => {
        setCaptchaToken(captchaToken);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const schema = z.object({
            name: z.string().min(1, { message: "Введите имя" }),
            surname: z.string().min(1, { message: "Введите фамилию" }),
            username: z.string().min(1, { message: "Введите имя пользователя на английском языке" }),
            email: z.string().email({ message: 'Введите адрес электронной почты' }),
            password: z.string().min(6, { message: 'Введите пароль длиной минимум 6 символов' }),
            confirmPassword: z.string().min(6, { message: 'Подтвердите пароль' }),
            country: z.string().min(1, { message: 'Выберите страну' }),
        }).refine(data => data.password === data.confirmPassword, {
            message: 'Пароли не совпадают',
            path: ['confirmPassword'],
        });

        try {
            schema.parse(formData);

            if (!captchaToken) {
                setErrors({ general: 'Пройдите проверку капчи' });
                return;
            }

            const response = await axios.post('/api/registration', formData);

            if (response.status === 200) {
                try {
                    await axios.post('/api/sendRegistrationEmail', {
                        email: formData.email,
                        name: formData.name,
                        username: formData.username,
                    })
                } catch (err) {
                    console.error('Не удалось отправить приветственное письмо:', err)
                }
                
                setFormData({
                    name: '',
                    surname: '',
                    username: '',
                    password: '',
                    confirmPassword: '',
                    email: '',
                    country: ''
                });
                setIsRegistered(true);
                if (onRegisterSuccess) onRegisterSuccess();
            }
        } catch (err) {
            if (err instanceof ZodError) {
                const zodErrors = err.errors.reduce((acc: any, curr) => {
                    acc[curr.path[0]] = curr.message;
                    return acc;
                }, {});
                setErrors(zodErrors);
            } else if (axios.isAxiosError(err) && err.response?.status === 409) {
                setErrors({ general: 'При регистрации возникла ошибка. Попробуйте позже.' });
            } else {
                setErrors({ general: 'Пользователь с таким именем пользователя или электронной почтой уже существует' });
            }
        }
    };

    return (
        <div className='w-full m-auto sm:h-full sm:flex sm:flex-col'>
            {isRegistered ? (
                <div className='sm:mt-[50%] lg:mt-32'>
                    <h2 className='text-4xl font-bold mb-6 text-emerald-700 sm:text-2xl'>Вы успешно зарегистрировались!</h2>
                    <button onClick={() => router.push('/login')} className='px-12 bg-emerald-700 hover:bg-emerald-600 transition ease-in-out text-white py-2 rounded-xl mt-4'>Вход</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className='w-5/6 h-1/2 lg:h-2/3 lg:w-2/6 lg:m-auto sm:mt-3'>
                    <h2 className="text-4xl font-bold mb-2 text-emerald-700 sm:text-2xl">Регистрация</h2>
                    <p className='ml-auto mr-auto mb-6 text-base'>
                        или <Link href='/login' className='text-emerald-900 hover:text-emerald-700 transition ease-in-out'>вход по сервисам</Link>
                    </p>
                    <div className="flex flex-col gap max-w-full w-1/2 mx-auto sm:w-full">
                        <div className="flex flex-col gap w-auto">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name='name'
                                    placeholder='Имя'
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoFocus
                                    className={`block w-full p-2 border rounded-xl bg-transparent h-12 outline-none ${errors.name ? 'border-red-500' : ''}`}
                                    aria-invalid={!!errors.name}
                                    aria-describedby='name-error'
                                />
                                {errors.name && <p id='name-error' className='text-red-500'>{errors.name}</p>}
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    name='surname'
                                    placeholder='Фамилия'
                                    value={formData.surname}
                                    onChange={handleChange}
                                    className={`block w-full p-2 border rounded-xl bg-transparent h-12 outline-none ${errors.surname ? 'border-red-500' : ''}`}
                                    aria-invalid={!!errors.surname}
                                    aria-describedby='surname-error'
                                />
                                {errors.name && <p id='surname-error' className='text-red-500'>{errors.surname}</p>}
                            </div>

                            <div className="mb-4">
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className={`block w-full p-2 border rounded-xl bg-transparent h-12 outline-none ${errors.country ? 'border-red-500' : ''}`}
                                    aria-invalid={!!errors.country}
                                    aria-describedby="country-error"
                                >
                                    <option value="">Выберите страну</option>
                                    <option value="RU">Россия</option>
                                    <option value="BY">Беларусь</option>
                                    <option value="AL">Албания</option>
                                    <option value="DZ">Алжир</option>
                                    <option value="AS">Американское Самоа</option>
                                    <option value="AD">Андорра</option>
                                    <option value="AO">Ангола</option>
                                    <option value="AI">Ангилья</option>
                                    <option value="AQ">Антарктида</option>
                                    <option value="AG">Антигуа и Барбуда</option>
                                    <option value="AR">Аргентина</option>
                                    <option value="AM">Армения</option>
                                    <option value="AW">Аруба</option>
                                    <option value="AU">Австралия</option>
                                    <option value="AT">Австрия</option>
                                    <option value="AZ">Азербайджан</option>
                                    <option value="BS">Багамы</option>
                                    <option value="BH">Бахрейн</option>
                                    <option value="BD">Бангладеш</option>
                                    <option value="BB">Барбадос</option>
                                    <option value="BE">Бельгия</option>
                                    <option value="BZ">Белиз</option>
                                    <option value="BJ">Бенин</option>
                                    <option value="BM">Бермуды</option>
                                    <option value="BT">Бутан</option>
                                    <option value="BO">Боливия</option>
                                    <option value="BQ">Бонэйр, Синт-Эстатиус и Саба</option>
                                    <option value="BA">Босния и Герцеговина</option>
                                    <option value="BW">Ботсвана</option>
                                    <option value="BR">Бразилия</option>
                                    <option value="IO">Британская территория в Индийском океане</option>
                                    <option value="BN">Бруней-Даруссалам</option>
                                    <option value="BG">Болгария</option>
                                    <option value="BF">Буркина-Фасо</option>
                                    <option value="BI">Бурунди</option>
                                    <option value="CV">Кабо-Верде</option>
                                    <option value="KH">Камбоджа</option>
                                    <option value="CM">Камерун</option>
                                    <option value="CA">Канада</option>
                                    <option value="KY">Каймановы острова</option>
                                    <option value="CF">Центральноафриканская Республика</option>
                                    <option value="TD">Чад</option>
                                    <option value="CL">Чили</option>
                                    <option value="CN">Китай</option>
                                    <option value="CX">Остров Рождества</option>
                                    <option value="CC">Кокосовые (Килинг) острова</option>
                                    <option value="CO">Колумбия</option>
                                    <option value="KM">Коморы</option>
                                    <option value="CD">Конго (ДРК)</option>
                                    <option value="CG">Конго</option>
                                    <option value="CK">Острова Кука</option>
                                    <option value="CR">Коста-Рика</option>
                                    <option value="HR">Хорватия</option>
                                    <option value="CU">Куба</option>
                                    <option value="CW">Кюрасао</option>
                                    <option value="CY">Кипр</option>
                                    <option value="CZ">Чехия</option>
                                    <option value="DK">Дания</option>
                                    <option value="DJ">Джибути</option>
                                    <option value="DM">Доминика</option>
                                    <option value="DO">Доминиканская Республика</option>
                                    <option value="EC">Эквадор</option>
                                    <option value="EG">Египет</option>
                                    <option value="SV">Сальвадор</option>
                                    <option value="GQ">Экваториальная Гвинея</option>
                                    <option value="ER">Эритрея</option>
                                    <option value="EE">Эстония</option>
                                    <option value="SZ">Эсватини</option>
                                    <option value="ET">Эфиопия</option>
                                    <option value="FJ">Фиджи</option>
                                    <option value="FI">Финляндия</option>
                                    <option value="FR">Франция</option>
                                    <option value="PF">Французская Полинезия</option>
                                    <option value="GA">Габон</option>
                                    <option value="GM">Гамбия</option>
                                    <option value="GE">Грузия</option>
                                    <option value="DE">Германия</option>
                                    <option value="GH">Гана</option>
                                    <option value="GI">Гибралтар</option>
                                    <option value="GR">Греция</option>
                                    <option value="GL">Гренландия</option>
                                    <option value="GD">Гренада</option>
                                    <option value="GU">Гуам</option>
                                    <option value="GT">Гватемала</option>
                                    <option value="GG">Гернси</option>
                                    <option value="GN">Гвинея</option>
                                    <option value="GW">Гвинея-Бисау</option>
                                    <option value="GY">Гайана</option>
                                    <option value="HT">Гаити</option>
                                    <option value="HN">Гондурас</option>
                                    <option value="HK">Гонконг</option>
                                    <option value="HU">Венгрия</option>
                                    <option value="IS">Исландия</option>
                                    <option value="IN">Индия</option>
                                    <option value="ID">Индонезия</option>
                                    <option value="IR">Иран</option>
                                    <option value="IQ">Ирак</option>
                                    <option value="IE">Ирландия</option>
                                    <option value="IM">Остров Мэн</option>
                                    <option value="IL">Израиль</option>
                                    <option value="IT">Италия</option>
                                    <option value="CI">Кот-д&apos;Ивуар</option>
                                    <option value="JM">Ямайка</option>
                                    <option value="JP">Япония</option>
                                    <option value="JE">Джерси</option>
                                    <option value="JO">Иордания</option>
                                    <option value="KZ">Казахстан</option>
                                    <option value="KE">Кения</option>
                                    <option value="KI">Кирибати</option>
                                    <option value="KP">Северная Корея</option>
                                    <option value="KR">Южная Корея</option>
                                    <option value="KW">Кувейт</option>
                                    <option value="KG">Киргизия</option>
                                    <option value="LA">Лаос</option>
                                    <option value="LV">Латвия</option>
                                    <option value="LB">Ливан</option>
                                    <option value="LS">Лесото</option>
                                    <option value="LR">Либерия</option>
                                    <option value="LY">Ливия</option>
                                    <option value="LI">Лихтенштейн</option>
                                    <option value="LT">Литва</option>
                                    <option value="LU">Люксембург</option>
                                    <option value="MO">Макао</option>
                                    <option value="MG">Мадагаскар</option>
                                    <option value="MW">Малави</option>
                                    <option value="MY">Малайзия</option>
                                    <option value="MV">Мальдивы</option>
                                    <option value="ML">Мали</option>
                                    <option value="MT">Мальта</option>
                                    <option value="MH">Маршалловы острова</option>
                                    <option value="MR">Мавритания</option>
                                    <option value="MU">Маврикий</option>
                                    <option value="MX">Мексика</option>
                                    <option value="FM">Федеративные Штаты Микронезии</option>
                                    <option value="MD">Молдова</option>
                                    <option value="MC">Монако</option>
                                    <option value="MN">Монголия</option>
                                    <option value="ME">Черногория</option>
                                    <option value="MS">Монтсеррат</option>
                                    <option value="MA">Марокко</option>
                                    <option value="MZ">Мозамбик</option>
                                    <option value="MM">Мьянма (Бирма)</option>
                                    <option value="NA">Намибия</option>
                                    <option value="NR">Науру</option>
                                    <option value="NP">Непал</option>
                                    <option value="NL">Нидерланды</option>
                                    <option value="NC">Новая Каледония</option>
                                    <option value="NZ">Новая Зеландия</option>
                                    <option value="NI">Никарагуа</option>
                                    <option value="NE">Нигер</option>
                                    <option value="NG">Нигерия</option>
                                    <option value="NU">Ниуэ</option>
                                    <option value="NF">Остров Норфолк</option>
                                    <option value="MK">Северная Македония</option>
                                    <option value="MP">Северные Марианские острова</option>
                                    <option value="NO">Норвегия</option>
                                    <option value="OM">Оман</option>
                                    <option value="PK">Пакистан</option>
                                    <option value="PW">Палау</option>
                                    <option value="PS">Палестина</option>
                                    <option value="PA">Панама</option>
                                    <option value="PG">Папуа — Новая Гвинея</option>
                                    <option value="PY">Парагвай</option>
                                    <option value="PE">Перу</option>
                                    <option value="PH">Филиппины</option>
                                    <option value="PN">Питкэрн</option>
                                    <option value="PL">Польша</option>
                                    <option value="PT">Португалия</option>
                                    <option value="PR">Пуэрто-Рико</option>
                                    <option value="QA">Катар</option>
                                    <option value="RE">Реюньон</option>
                                    <option value="RO">Румыния</option>
                                    <option value="RW">Руанда</option>
                                    <option value="SH">Остров Святой Елены</option>
                                    <option value="KN">Сент-Китс и Невис</option>
                                    <option value="LC">Сент-Люсия</option>
                                    <option value="PM">Сен-Пьер и Микелон</option>
                                    <option value="VC">Сент-Винсент и Гренадины</option>
                                    <option value="WS">Самоа</option>
                                    <option value="SM">Сан-Марино</option>
                                    <option value="ST">Сан-Томе и Принсипи</option>
                                    <option value="SA">Саудовская Аравия</option>
                                    <option value="SN">Сенегал</option>
                                    <option value="RS">Сербия</option>
                                    <option value="SC">Сейшельские острова</option>
                                    <option value="SL">Сьерра-Леоне</option>
                                    <option value="SG">Сингапур</option>
                                    <option value="SX">Синт-Мартен</option>
                                    <option value="SK">Словакия</option>
                                    <option value="SI">Словения</option>
                                    <option value="SB">Соломоновы Острова</option>
                                    <option value="SO">Сомали</option>
                                    <option value="ZA">Южная Африка</option>
                                    <option value="GS">Южная Георгия и Южные Сандвичевы острова</option>
                                    <option value="SS">Южный Судан</option>
                                    <option value="ES">Испания</option>
                                    <option value="LK">Шри-Ланка</option>
                                    <option value="SD">Судан</option>
                                    <option value="SR">Суринам</option>
                                    <option value="SE">Швеция</option>
                                    <option value="CH">Швейцария</option>
                                    <option value="SY">Сирийская Арабская Республика</option>
                                    <option value="TW">Тайвань</option>
                                    <option value="TJ">Таджикистан</option>
                                    <option value="TZ">Танзания</option>
                                    <option value="TH">Таиланд</option>
                                    <option value="TL">Тимор-Лешти</option>
                                    <option value="TG">Того</option>
                                    <option value="TK">Токелау</option>
                                    <option value="TO">Тонга</option>
                                    <option value="TT">Тринидад и Тобаго</option>
                                    <option value="TN">Тунис</option>
                                    <option value="TR">Турция</option>
                                    <option value="TM">Туркмения</option>
                                    <option value="TC">Теркс и Кайкос</option>
                                    <option value="TV">Тувалу</option>
                                    <option value="UG">Уганда</option>
                                    <option value="AE">Объединенные Арабские Эмираты</option>
                                    <option value="GB">Великобритания</option>
                                    <option value="US">Соединенные Штаты Америки</option>
                                    <option value="UM">Внешние малые острова США</option>
                                    <option value="UY">Уругвай</option>
                                    <option value="UZ">Узбекистан</option>
                                    <option value="VU">Вануату</option>
                                    <option value="VE">Венесуэла</option>
                                    <option value="VN">Вьетнам</option>
                                    <option value="VG">Виргинские острова, Британия</option>
                                    <option value="VI">Виргинские острова, США</option>
                                    <option value="WF">Уоллис и Футуна</option>
                                    <option value="EH">Западная Сахара</option>
                                    <option value="YE">Йемен</option>
                                    <option value="ZM">Замбия</option>
                                    <option value="ZW">Зимбабве</option>
                                </select>
                                {errors.country && <p id="country-error" className="text-red-500">{errors.country}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col gap w-auto">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name='username'
                                    placeholder='Имя пользователя'
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`block w-full p-2 border rounded-xl bg-transparent h-12 outline-none ${errors.username ? 'border-red-500' : ''}`}
                                    aria-invalid={!!errors.username}
                                    aria-describedby='username-error'
                                />
                                {errors.name && <p id='username-error' className='text-red-500'>{errors.username}</p>}
                            </div>

                            <div className="mb-4">
                                <input
                                    type="email"
                                    name='email'
                                    placeholder='Адрес электронной почты'
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`block w-full p-2 border rounded-xl bg-transparent h-12 outline-none ${errors.email ? 'border-red-500' : ''}`}
                                    aria-invalid={!!errors.email}
                                    aria-describedby='email-error'
                                />
                                {errors.name && <p id='email-error' className='text-red-500'>{errors.email}</p>}
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
                                {errors.name && <p id='password-error' className='text-red-500'>{errors.password}</p>}
                            </div>

                            <div className="mb-4">
                                <input
                                    type="password"
                                    name='confirmPassword'
                                    placeholder='Подтвердите пароль'
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`block w-full p-2 border rounded-xl bg-transparent h-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                    aria-invalid={!!errors.confirmPassword}
                                    aria-describedby='confirmPassword-error'
                                />
                                {errors.name && <p id='confirmPassword-error' className='text-red-500'>{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <div className="w-80 lg:flex flex-col items-center mx-auto sm:hidden">
                            <HCaptcha sitekey={HCAPTCHA_TOKEN} onVerify={handleCaptcha} />

                            <button type='submit' disabled={!captchaToken} className='w-full mx-auto bg-emerald-700 hover:bg-emerald-600 disabled:bg-gray-300 transition ease-in-out text-white py-2 rounded-xl mt-4'>
                                Зарегистрироваться
                            </button>
                        </div>
                        <div className="sm:w-full hidden flex-col items-center mx-auto sm:flex lg:hidden">
                            <HCaptcha sitekey={HCAPTCHA_TOKEN} onVerify={handleCaptcha} size='compact' />

                            <button type='submit' disabled={!captchaToken} className='w-full mx-auto bg-emerald-700 hover:bg-emerald-600 disabled:bg-gray-300 transition ease-in-out text-white py-2 rounded-xl mt-4'>
                                Зарегистрироваться
                            </button>
                        </div>
                    </div>

                    {errors.general && <p className='text-red-500 pt-2'>{errors.general}</p>}
                </form>
            )}
        </div>
    );
};

export default RegistrationForm;