// src/config/env.ts

// Đọc env từ process.env (Expo sẽ inject EXPO_PUBLIC_API_URL lúc build)
const apiUrlFromEnv = process.env.EXPO_PUBLIC_API_URL;

// Fallback: nếu chưa set env thì dùng localhost (hữu ích khi quên config)
export const API_URL =
    apiUrlFromEnv && apiUrlFromEnv.length > 0
        ? apiUrlFromEnv
        : "http://localhost:8000";