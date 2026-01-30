import { Platform } from 'react-native';

const getBaseUrl = () => {
    if (__DEV__) {
        // Saat development, gunakan IP komputer Anda agar bisa diakses dari HP (Expo Go)
        // Silakan ganti IP ini jika IP komputer Anda berubah
        return 'http://192.168.1.3:3000/api';
    }

    if (Platform.OS === 'web') {
        // Di produksi (Vercel), gunakan relatif path
        return '/api';
    }

    // Fallback untuk mobile produksi (jika ada)
    return 'https://siip-rs-esaunggul.vercel.app/api';
};

export const BASE_URL = getBaseUrl();
