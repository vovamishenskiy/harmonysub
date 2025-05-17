// src/lib/services.ts
export interface ServiceList {
  name: string;
  logoUrl: string;
}

export const services: ServiceList[] = [
  { name: 'Сбер «Прайм»', logoUrl: '/icons/sber.svg' },
  { name: 'Яндекс Плюс', logoUrl: '/icons/plus.png' },
  { name: 'МТС Premium', logoUrl: '/icons/mts_premium.svg' },
  { name: 'KION', logoUrl: '/icons/kion.svg' },
  { name: 'Т-Банк Pro', logoUrl: '/icons/tbank.svg' },
  { name: 'Газпром Бонус', logoUrl: '/icons/gazprom.svg' },
  { name: 'Мегафон Плюс', logoUrl: '/icons/megafon.svg' },
  { name: 'OZON Premium', logoUrl: '/icons/ozon.png' },
  { name: 'X5 Пакет', logoUrl: '/icons/paket.svg' },
  { name: 'Амедиатека', logoUrl: 'https://upload.wikimedia.org/wikipedia/ru/5/57/Amediateka-logo.png' },
  { name: 'Okko', logoUrl: 'https://upload.wikimedia.org/wikipedia/ru/8/80/Okko-logo.png' },
  { name: 'Иви', logoUrl: 'https://upload.wikimedia.org/wikipedia/ru/c/c5/IVI_logo.png' },
  { name: 'Megogo', logoUrl: 'https://cdn.megogo.net/web/images/icons/logoSvg.svg' },
  { name: 'Spotify', logoUrl: 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png' },
  { name: 'Apple Music', logoUrl: 'https://www.apple.com/newsroom/images/product/music/standard/apple-music-icon_125x125_09192018.png' },
  { name: 'YouTube Premium', logoUrl: 'https://www.youtube.com/s/desktop/6e5eb9fc/img/favicon_144x144.png' },
  { name: 'Netflix', logoUrl: 'https://assets.brand.microsites.netflix.io/assets/00e915b2-6606-11ea-9eb9-0e3e6f17a914_cm_800w.png' },
  { name: 'Crunchyroll', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Crunchyroll_logo.svg' },
  { name: 'Twitch', logoUrl: 'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png' },
];  