'use client';

import React, { useState, useEffect } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { z, ZodError } from 'zod';

const countries = [
    { name: "Россия", code: "RU" }, { name: "Беларусь", code: "BY" },
    { name: "Австралия", code: "AU" }, { name: "Австрия", code: "AT" }, { name: "Азербайджан", code: "AZ" },
    { name: "Албания", code: "AL" }, { name: "Алжир", code: "DZ" }, { name: "Ангола", code: "AO" },
    { name: "Андорра", code: "AD" }, { name: "Антигуа и Барбуда", code: "AG" }, { name: "Аргентина", code: "AR" },
    { name: "Армения", code: "AM" }, { name: "Афганистан", code: "AF" }, { name: "Багамы", code: "BS" },
    { name: "Бангладеш", code: "BD" }, { name: "Барбадос", code: "BB" }, { name: "Бахрейн", code: "BH" },
    { name: "Белиз", code: "BZ" }, { name: "Бельгия", code: "BE" },
    { name: "Бенин", code: "BJ" }, { name: "Болгария", code: "BG" }, { name: "Боливия", code: "BO" },
    { name: "Босния и Герцеговина", code: "BA" }, { name: "Ботсвана", code: "BW" }, { name: "Бразилия", code: "BR" },
    { name: "Бруней", code: "BN" }, { name: "Буркина-Фасо", code: "BF" }, { name: "Бурунди", code: "BI" },
    { name: "Бутан", code: "BT" }, { name: "Вануату", code: "VU" }, { name: "Великобритания", code: "GB" },
    { name: "Венгрия", code: "HU" }, { name: "Венесуэла", code: "VE" }, { name: "Восточный Тимор", code: "TL" },
    { name: "Вьетнам", code: "VN" }, { name: "Габон", code: "GA" }, { name: "Гаити", code: "HT" },
    { name: "Гайана", code: "GY" }, { name: "Гамбия", code: "GM" }, { name: "Гана", code: "GH" },
    { name: "Гватемала", code: "GT" }, { name: "Гвинея", code: "GN" }, { name: "Гвинея-Бисау", code: "GW" },
    { name: "Германия", code: "DE" }, { name: "Гондурас", code: "HN" }, { name: "Гренада", code: "GD" },
    { name: "Греция", code: "GR" }, { name: "Грузия", code: "GE" }, { name: "Дания", code: "DK" },
    { name: "Джибути", code: "DJ" }, { name: "Доминика", code: "DM" }, { name: "Доминиканская Республика", code: "DO" },
    { name: "Египет", code: "EG" }, { name: "Замбия", code: "ZM" }, { name: "Зимбабве", code: "ZW" },
    { name: "Израиль", code: "IL" }, { name: "Индия", code: "IN" }, { name: "Индонезия", code: "ID" },
    { name: "Иордания", code: "JO" }, { name: "Ирак", code: "IQ" }, { name: "Иран", code: "IR" },
    { name: "Ирландия", code: "IE" }, { name: "Исландия", code: "IS" }, { name: "Испания", code: "ES" },
    { name: "Италия", code: "IT" }, { name: "Йемен", code: "YE" }, { name: "Кабо-Верде", code: "CV" },
    { name: "Казахстан", code: "KZ" }, { name: "Камбоджа", code: "KH" }, { name: "Камерун", code: "CM" },
    { name: "Канада", code: "CA" }, { name: "Катар", code: "QA" }, { name: "Кения", code: "KE" },
    { name: "Кипр", code: "CY" }, { name: "Киргизия", code: "KG" }, { name: "Кирибати", code: "KI" },
    { name: "Китай", code: "CN" }, { name: "Колумбия", code: "CO" }, { name: "Коморы", code: "KM" },
    { name: "Конго", code: "CG" }, { name: "Коста-Рика", code: "CR" }, { name: "Кот-д'Ивуар", code: "CI" },
    { name: "Куба", code: "CU" }, { name: "Кувейт", code: "KW" }, { name: "Лаос", code: "LA" },
    { name: "Латвия", code: "LV" }, { name: "Лесото", code: "LS" }, { name: "Либерия", code: "LR" },
    { name: "Ливан", code: "LB" }, { name: "Ливия", code: "LY" }, { name: "Литва", code: "LT" },
    { name: "Лихтенштейн", code: "LI" }, { name: "Люксембург", code: "LU" }, { name: "Маврикий", code: "MU" },
    { name: "Мавритания", code: "MR" }, { name: "Мадагаскар", code: "MG" }, { name: "Малави", code: "MW" },
    { name: "Малайзия", code: "MY" }, { name: "Мали", code: "ML" }, { name: "Мальдивы", code: "MV" },
    { name: "Мальта", code: "MT" }, { name: "Марокко", code: "MA" }, { name: "Маршалловы Острова", code: "MH" },
    { name: "Мексика", code: "MX" }, { name: "Мозамбик", code: "MZ" }, { name: "Молдавия", code: "MD" },
    { name: "Монако", code: "MC" }, { name: "Монголия", code: "MN" }, { name: "Мьянма", code: "MM" },
    { name: "Намибия", code: "NA" }, { name: "Науру", code: "NR" }, { name: "Непал", code: "NP" },
    { name: "Нигер", code: "NE" }, { name: "Нигерия", code: "NG" }, { name: "Новая Зеландия", code: "NZ" },
    { name: "Норвегия", code: "NO" }, { name: "ОАЭ", code: "AE" }, { name: "Оман", code: "OM" },
    { name: "Пакистан", code: "PK" }, { name: "Палау", code: "PW" }, { name: "Панама", code: "PA" },
    { name: "Папуа - Новая Гвинея", code: "PG" }, { name: "Парагвай", code: "PY" }, { name: "Перу", code: "PE" },
    { name: "Польша", code: "PL" }, { name: "Португалия", code: "PT" }, { name: "Республика Корея", code: "KR" },
    { name: "Руанда", code: "RW" }, { name: "Румыния", code: "RO" },
    { name: "Сальвадор", code: "SV" }, { name: "Сан-Марино", code: "SM" }, { name: "Саудовская Аравия", code: "SA" },
    { name: "Сейшельские Острова", code: "SC" }, { name: "Сенегал", code: "SN" }, { name: "Сент-Люсия", code: "LC" },
    { name: "Сент-Китс и Невис", code: "KN" }, { name: "Сент-Винсент и Гренадины", code: "VC" },
    { name: "Сербия", code: "RS" }, { name: "Сингапур", code: "SG" }, { name: "Сирия", code: "SY" },
    { name: "Словакия", code: "SK" }, { name: "Словения", code: "SI" }, { name: "Соединенные Штаты Америки", code: "US" },
    { name: "Соломоновы Острова", code: "SB" }, { name: "Сомали", code: "SO" }, { name: "Судан", code: "SD" },
    { name: "Суринам", code: "SR" }, { name: "Сьерра-Леоне", code: "SL" }, { name: "Таджикистан", code: "TJ" },
    { name: "Таиланд", code: "TH" }, { name: "Танзания", code: "TZ" }, { name: "Того", code: "TG" },
    { name: "Тонга", code: "TO" }, { name: "Тунис", code: "TN" }, { name: "Туркменистан", code: "TM" },
    { name: "Турция", code: "TR" }, { name: "Уганда", code: "UG" }, { name: "Узбекистан", code: "UZ" },
    { name: "Украина", code: "UA" }, { name: "Уругвай", code: "UY" }, { name: "Фиджи", code: "FJ" },
    { name: "Филиппины", code: "PH" }, { name: "Финляндия", code: "FI" }, { name: "Франция", code: "FR" },
    { name: "Хорватия", code: "HR" }, { name: "Центральноафриканская Республика", code: "CF" }, { name: "Чад", code: "TD" },
    { name: "Чехия", code: "CZ" }, { name: "Чили", code: "CL" }, { name: "Швейцария", code: "CH" },
    { name: "Швеция", code: "SE" }, { name: "Шри-Ланка", code: "LK" }, { name: "Эквадор", code: "EC" },
    { name: "Экваториальная Гвинея", code: "GQ" }, { name: "Эритрея", code: "ER" }, { name: "Эсватини", code: "SZ" },
    { name: "Эстония", code: "EE" }, { name: "Южноафриканская Республика", code: "ZA" }, { name: "Южный Судан", code: "SS" },
    { name: "Ямайка", code: "JM" }, { name: "Япония", code: "JP" }
];

const Skeleton: React.FC = () => (
    <div className='animate-pulse bg-gray-300 h-30px rounded-xl w-1/4' />
);

const UserSettings: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [country, setCountry] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editField, setEditField] = useState<string | null>(null);
    const [newUsername, setNewUsername] = useState<string | null>(null);
    const [newEmail, setNewEmail] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState<string | null>(null);
    const [newCountry, setNewCountry] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string | null>(null);
    const [ariaMessage, setAriaMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
            fetch(`/api/getUserData?username=${storedUsername}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.email) {
                        setEmail(data.email);
                    }
                    if (data.country) {
                        setCountry(data.country);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Ошибка при загрузке данных пользователя: ', err);
                    setLoading(false);
                });
        }
    }, []);

    const startEditing = (field: string) => {
        setEditField(field);
        setIsEditing(true);
        setAriaMessage(null);
        if (field === 'username') {
            setNewUsername(username);
        } else if (field === 'email') {
            setNewEmail(email);
        } else if (field === 'password') {
            setNewPassword('');
        } else if (field === 'country') {
            setNewCountry(country);
        }
    }

    const cancelEditing = () => {
        setIsEditing(false);
        setEditField(null);
        setValidationErrors(null);
        setAriaMessage(null);
    }

    const validatePassword = (password: string) => {
        const schema = z.string().min(6, 'Пароль должен содержать минимум 6 символов')
        try {
            schema.parse(password);
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                setValidationErrors(error.errors[0].message);
            }
            return false;
        }
    }

    const saveUserDetails = async () => {
        if (!username) {
            console.error('Имя пользователя не установлено');
            return;
        }

        if (editField === 'password' && newPassword && !validatePassword(newPassword)) {
            return;
        }

        const updates = {
            username,
            newUsername: newUsername !== username ? newUsername : null,
            newEmail: newEmail !== email ? newEmail : null,
            newPassword: newPassword ? newPassword : null,
            newCountry: newCountry !== country ? newCountry : null,
        };

        if (
            (editField === 'username' && newUsername === username) ||
            (editField === 'email' && newEmail === email) ||
            (editField === 'password' && !newPassword) ||
            (editField === 'country' && newCountry === country)
        ) {
            setAriaMessage('Данные не были изменены');
            return;
        }

        try {
            const response = await fetch('/api/updateUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            const data = await response.json();

            if (data.message) {
                if (newUsername) {
                    localStorage.setItem('username', newUsername);
                    setUsername(newUsername);
                }

                if (newEmail) setEmail(newEmail);

                if (newCountry) setCountry(newCountry);

                setIsEditing(false);
                setEditField(null);
                setValidationErrors(null);
                setAriaMessage(null);
            } else {
                console.error('Ошибка: ', data.error);
            }
        } catch (error) {
            console.error('Ошибка: ', error);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col">
                <div className="flex flex-col pl-2 gap-2">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>
            </div>
        )
    }
    return (
        <div className="flex flex-col">
            <div className="flex flex-col pl-2 gap-2">
                <div className="flex flex-row gap-2 items-center">
                    {editField === 'username' ? (
                        <div className='h-6 flex flex-row items-center'>
                            <p className="text-base font-medium">Имя пользователя:</p>
                            <input
                                type="text"
                                value={newUsername || ''}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="input input-bordered border-b border-emerald-600 pb-0.5 pl-2 ml-2 mt-1 w-48 outline-none mr-3"
                                placeholder="Новое имя пользователя"
                                aria-label="Новое имя пользователя"
                            />
                            <button
                                className="btn btn-primary"
                                onClick={saveUserDetails}
                                title="Сохранить имя пользователя"
                            >
                                <CheckIcon className="w-5 h-5 mr-1" />
                            </button>
                            <button
                                className='btn btn-primary'
                                onClick={cancelEditing}
                                title='Отменить изменения'
                            >
                                <XMarkIcon className='w-5 h-5' />
                            </button>
                            <span aria-live='polite' className='text-red-500 text-sm ml-2'>{ariaMessage}</span>
                        </div>
                    ) : (
                        <div className='h-6 flex flex-row items-center'>
                            <p className="text-base flex flex-row font-medium">Имя пользователя: <span className='block w-48 pl-2 ml-2 font-normal'>{username}</span></p>
                            <button
                                className="btn btn-primary"
                                onClick={() => startEditing('username')}
                                title="Редактировать имя пользователя"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-row gap-2 items-center mt-2">
                    {editField === 'email' ? (
                        <div className='h-6 flex flex-row items-center'>
                            <p className="text-base font-medium">Электронная почта:</p>
                            <input
                                type="email"
                                value={newEmail || ''}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="input input-bordered border-b border-emerald-600 pb-0.5 pl-2 ml-2 mt-1 w-64 outline-none mr-3"
                                placeholder="Новая электронная почта"
                                aria-label="Новое электронная почта"
                            />
                            <button
                                className="btn btn-primary"
                                onClick={saveUserDetails}
                                title="Сохранить электронную почту"
                            >
                                <CheckIcon className="w-5 h-5 mr-1" />
                            </button>
                            <button
                                className='btn btn-primary'
                                onClick={cancelEditing}
                                title='Отменить изменения'
                            >
                                <XMarkIcon className='w-5 h-5' />
                            </button>
                            <span aria-live='polite' className='text-red-500 text-sm ml-2'>{ariaMessage}</span>
                        </div>
                    ) : (
                        <div className='h-6 flex flex-row items-center'>
                            <p className="text-base flex flex-row font-medium">Электронная почта: <span className='block w-64 pl-2 ml-2 font-normal'>{email}</span></p>
                            <button
                                className="btn btn-primary"
                                onClick={() => startEditing('email')}
                                title="Редактировать электронную почту"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-row gap-2 items-center mt-2">
                    {editField === 'password' ? (
                        <div className='h-6 flex flex-row items-center'>
                            <p className="text-base font-medium">Пароль:</p>
                            <input
                                type={visible ? 'text' : 'password'}
                                value={newPassword || ''}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input input-bordered border-b border-emerald-600 pb-0.5 pl-2 ml-2 mt-1 w-48 outline-none"
                                placeholder="Новый пароль"
                                aria-label="Новый пароль"
                            />
                            <button
                                className='btn btn-primary'
                                onClick={() => setVisible(!visible)}
                                title={visible ? 'Скрыть пароль' : 'Показать пароль'}
                            >
                                {visible ? <EyeSlashIcon className='w-5 h-5 -ml-5 mr-3' /> : <EyeIcon className='w-5 h-5 -ml-5 mr-3' />}
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={saveUserDetails}
                                title="Сохранить пароль"
                            >
                                <CheckIcon className="w-5 h-5 mr-1" />
                            </button>
                            <button
                                className='btn btn-primary'
                                onClick={cancelEditing}
                                title='Отменить изменения'
                            >
                                <XMarkIcon className='w-5 h-5' />
                            </button>
                            <span aria-live='polite' className='text-red-500 text-sm ml-2'>{validationErrors || ariaMessage}</span>
                        </div>
                    ) : (
                        <div className='h-6 flex flex-row items-center'>
                            <p className="text-base flex flex-row font-medium">Пароль: <span className='block w-48 pl-2 ml-2 font-normal'>• • • • • •</span></p>
                            <button
                                className="btn btn-primary"
                                onClick={() => startEditing('password')}
                                title="Редактировать пароль"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-row gap-2 items-center mt-2">
                    {editField === 'country' ? (
                        <div className='h-6 flex flex-row items-center'>
                            <p className="text-base font-medium">Страна:</p>
                            <select
                                value={newCountry || ''}
                                onChange={(e) => setNewCountry(e.target.value)}
                                className='select select-bordered bg-transparent border-b border-emerald-600 ml-4 mt-0.5 mr-2 w-48 outline-none'
                                aria-label='Выберите страну'
                            >
                                {countries.map((country) => (
                                    <option key={country.code} value={country.code}>{country.name}</option>
                                ))}
                            </select>
                            <button
                                className="btn btn-primary"
                                onClick={saveUserDetails}
                                title="Сохранить страну"
                            >
                                <CheckIcon className="w-5 h-5 mr-1" />
                            </button>
                            <button
                                className='btn btn-primary'
                                onClick={cancelEditing}
                                title='Отменить изменения'
                            >
                                <XMarkIcon className='w-5 h-5' />
                            </button>
                            <span aria-live='polite' className='text-red-500 text-sm ml-2'>{ariaMessage}</span>
                        </div>
                    ) : (
                        <div className='h-6 flex flex-row items-center'>
                            <p className="text-base flex flex-row font-medium">Страна: <span className='block w-48 pl-2 ml-2 font-normal'>{countries.find(c => c.code === country)?.name || 'Не установлена'}</span></p>
                            <button
                                className="btn btn-primary"
                                onClick={() => startEditing('country')}
                                title="Редактировать страну"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserSettings;