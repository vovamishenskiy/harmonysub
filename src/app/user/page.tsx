'use client';

import React, { useMemo, useState } from "react";
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    ChartData,
    ChartDataset,
} from 'chart.js';
import { format, getYear, getMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useSubscriptions } from "../subscriptions/hooks/useSubscriptions";
import Sidebar from "@/components/Sidebar";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const MONTH_NAMES = Array.from({ length: 12 })
    .map((_, i) => format(new Date(2020, i, 1), 'LLLL', { locale: ru }));

type ChartType = 'monthly' | 'yearly' | 'status';

const User: React.FC = () => {
    // раз в минуту
    const { subscriptions, loading, error } = useSubscriptions(60000);
    const [selectedChart, setSelectedChart] = useState<ChartType>('monthly');

    // 1) Расходы по месяцам за текущий год
    const now = Date.now();

    // Фильтруем подписки: только не отменённые и не истёкшие
    const activeSubs = useMemo(
        () =>
            subscriptions.filter((s) => {
                if (s.status) return false; // status=true → отменена
                const exp = new Date(s.expiry_date).getTime();
                return exp >= now; // истёкшие (exp < now) — отбрасываем
            }),
        [now, subscriptions]
    );

    // 1) Расходы по месяцам за текущий год
    const monthlyData = useMemo(() => {
        const year = new Date().getFullYear();
        const sums = Array(12).fill(0);
        activeSubs.forEach((s) => {
            const d = new Date(s.start_date);
            if (getYear(d) === year) {
                sums[getMonth(d)] += s.price;
            }
        });
        return {
            labels: MONTH_NAMES,
            datasets: [
                {
                    label: `Расходы ${year}, ₽`,
                    data: sums,
                    backgroundColor: 'rgba(6,95,70,0.6)',
                },
            ],
        };
    }, [activeSubs]);

    // 2) Расходы по годам
    const yearlyData = useMemo<ChartData<'bar', number[], string>>(() => {
        const map = new Map<number, number>();
        activeSubs.forEach(s => {
            const y = getYear(new Date(s.start_date));
            map.set(y, (map.get(y) || 0) + s.price);
        });
        const years = Array.from(map.keys()).sort();

        const dataset: ChartDataset<'bar', number[]> = {
            label: 'Годовые расходы, ₽',
            data: years.map(y => map.get(y)!),
            backgroundColor: 'rgba(6,95,70,0.4)',
            borderColor: 'rgb(6,95,70)',
            borderRadius: 4,
            maxBarThickness: 32,
        };

        return {
            labels: years.map(String),
            datasets: [dataset],
        };
    }, [activeSubs]);

    // 3) Статус подписок
    const statusData = useMemo(() => {
        let active = 0, stopped = 0, expired = 0;
        const now = Date.now();
        subscriptions.forEach(s => {
            const exp = new Date(s.expiry_date).getTime();
            if (s.status) stopped++;
            else if (exp < now) expired++;
            else active++;
        });
        return {
            labels: ['Активные', 'Отменённые', 'Истекшие'],
            datasets: [{
                data: [active, stopped, expired],
                backgroundColor: [
                    'rgb(6,95,70)',
                    'rgba(120,120,120,0.6)',
                    'rgba(220,50,50,0.6)',
                ]
            }]
        };
    }, [subscriptions]);

    return (
        <div className="flex flex-row">
            <Sidebar />
            <main className="flex flex-col mt-3 ml-4 w-full">
                <h1 className="text-3xl mb-5 pt-4 text-emerald-800">Статистика</h1>

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setSelectedChart('monthly')}
                        className={`px-4 py-2 rounded ${selectedChart === 'monthly'
                            ? 'bg-emerald-700 text-white'
                            : 'bg-gray-200 text-gray-800'}`}
                    >
                        Месяцы
                    </button>
                    <button
                        onClick={() => setSelectedChart('yearly')}
                        className={`px-4 py-2 rounded ${selectedChart === 'yearly'
                            ? 'bg-emerald-700 text-white'
                            : 'bg-gray-200 text-gray-800'}`}
                    >
                        Годы
                    </button>
                    <button
                        onClick={() => setSelectedChart('status')}
                        className={`px-4 py-2 rounded ${selectedChart === 'status'
                            ? 'bg-emerald-700 text-white'
                            : 'bg-gray-200 text-gray-800'}`}
                    >
                        Статус
                    </button>
                </div>

                {error && <div className="text-red-500 mb-4">{error}</div>}
                {loading && <p>Загрузка данных…</p>}

                {!loading && (
                    <div className="max-w-4xl mx-auto">
                        {selectedChart === 'monthly' && (
                            <div className="bg-white rounded-xl p-4 shadow mb-6">
                                <Bar
                                    data={monthlyData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            tooltip: {
                                                backgroundColor: 'rgba(0,0,0,0.8)',
                                                titleColor: '#fff',
                                                bodyColor: '#fff',
                                                cornerRadius: 4,
                                                padding: 8
                                            }
                                        },
                                        scales: {
                                            x: {
                                                grid: {
                                                    display: false
                                                },
                                                ticks: {
                                                    color: '#4B5563',
                                                    font: { size: 12 }
                                                }
                                            },
                                            y: {
                                                grid: {
                                                    color: 'rgba(107,114,128,0.2)'
                                                },
                                                ticks: {
                                                    color: '#4B5563',
                                                    stepSize: 500
                                                }
                                            }
                                        },
                                        elements: {
                                            bar: {
                                                borderRadius: 4,
                                            }
                                        }
                                    }}
                                    className="h-64"
                                />
                            </div>
                        )}

                        {selectedChart === 'yearly' && (
                            <div className="bg-white rounded-xl p-4 shadow mb-6">
                                <Bar
                                    data={yearlyData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            tooltip: {
                                                backgroundColor: 'rgba(0,0,0,0.8)',
                                                titleColor: '#fff',
                                                bodyColor: '#fff',
                                                cornerRadius: 4,
                                                padding: 8
                                            }
                                        },
                                        scales: {
                                            x: {
                                                grid: {
                                                    display: false
                                                },
                                                ticks: {
                                                    color: '#4B5563',
                                                    font: { size: 12 }
                                                }
                                            },
                                            y: {
                                                grid: {
                                                    color: 'rgba(107,114,128,0.2)'
                                                },
                                                ticks: {
                                                    color: '#4B5563',
                                                    stepSize: Math.ceil(Math.max(...yearlyData.datasets[0].data as number[]) / 5)
                                                }
                                            }
                                        },
                                        elements: {
                                            bar: {
                                                borderRadius: 4,
                                            }
                                        }
                                    }}
                                />
                            </div>
                        )}

                        {selectedChart === 'status' && (
                            <div className="bg-white rounded-xl p-4 shadow max-w-md mx-auto">
                                <Pie
                                    data={statusData}
                                    options={{
                                        responsive: true,
                                        plugins: { legend: { position: 'bottom' } }
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default React.memo(User);