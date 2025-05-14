'use client';

import React, { useEffect } from 'react';

// 1) Подпись для window.YaAuthSuggest, чтобы TS не ругался
declare global {
    interface Window {
        YaAuthSuggest?: {
            init: (
                params: {
                    client_id: string;
                    response_type: 'token';
                    redirect_uri: string;
                },
                origin: string,
                options: Record<string, any>
            ) => Promise<{
                handler: () => Promise<{ access_token: string }>;
            }>;
        };
    }
}

const YandexLoginButton: React.FC = () => {
    useEffect(() => {
        if (!window.YaAuthSuggest) return;

        window.YaAuthSuggest
            .init(
                {
                    client_id: process.env.NEXT_PUBLIC_YANDEX_ID!,
                    response_type: 'token',
                    redirect_uri: `${window.location.origin}/api/auth/callback/yandex`
                },
                window.location.origin,
                {
                    view: 'button',
                    parentId: 'yandex-button-container',
                    buttonSize: 'm',
                    buttonView: 'main',
                    buttonTheme: 'light',
                    buttonBorderRadius: '18',
                    buttonIcon: 'ya',
                }
            )
            .then(({ handler }: { handler: () => Promise<{ access_token: string }> }) => handler())
            .then((data) => {
                // редиректим на страницу-приёмник
                window.location.href = `/yandex-callback#access_token=${data.access_token}`;
            })
            .catch(console.error);
    }, []);

    return <div id="yandex-button-container" />;
};

export default React.memo(YandexLoginButton);