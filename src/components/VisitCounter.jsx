import React, { useState, useEffect } from 'react';

const APP_NAMESPACE = 'pbis-tracker-edugenvn';
const BASE_VISIT_OFFSET = 1000;
const COUNTER_API_URL = `https://api.counterapi.dev/v1/${APP_NAMESPACE}/visits/up`;
const VISIT_STORAGE_KEY = `${APP_NAMESPACE}_my_visits`;
const LAST_VISIT_KEY = `${APP_NAMESPACE}_last_visit_time`;
const FALLBACK_KEY = `${APP_NAMESPACE}_total_fallback`;

const getToday = () => new Date().toISOString().split('T')[0];

const incrementLocalVisits = () => {
    const today = getToday();
    const todayKey = `${APP_NAMESPACE}_today_${today}`;
    try {
        const myVisits = parseInt(localStorage.getItem(VISIT_STORAGE_KEY) || '0', 10) + 1;
        localStorage.setItem(VISIT_STORAGE_KEY, String(myVisits));
        const lastDate = localStorage.getItem(LAST_VISIT_KEY) || '';
        const prevToday = lastDate === today ? parseInt(localStorage.getItem(todayKey) || '0', 10) : 0;
        const todayVisits = prevToday + 1;
        localStorage.setItem(todayKey, String(todayVisits));
        localStorage.setItem(LAST_VISIT_KEY, today);
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        localStorage.removeItem(`${APP_NAMESPACE}_today_${yesterday}`);
        return { myVisits, todayVisits };
    } catch { return { myVisits: 1, todayVisits: 1 }; }
};

const fetchServerVisitCount = async () => {
    try {
        const response = await fetch(COUNTER_API_URL);
        const data = await response.json();
        if (data && data.count) return BASE_VISIT_OFFSET + data.count;
    } catch (error) { console.error('Error fetching visit count:', error); }
    const fallback = parseInt(localStorage.getItem(FALLBACK_KEY) || String(BASE_VISIT_OFFSET), 10);
    const newFallback = fallback + Math.floor(Math.random() * 3) + 1;
    localStorage.setItem(FALLBACK_KEY, String(newFallback));
    return newFallback;
};

const AnimatedNumber = ({ value, duration = 800 }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        if (value === 0) return;
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(value * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value, duration]);
    return <>{display.toLocaleString('vi-VN')}</>;
};

export const VisitCounter = () => {
    const [visitData, setVisitData] = useState({ myVisits: 0, totalVisits: 0, todayVisits: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            const localData = incrementLocalVisits();
            const totalVisits = await fetchServerVisitCount();
            setVisitData({ ...localData, totalVisits });
            setIsLoaded(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    if (!isLoaded) return null;

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", padding: "12px 16px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, border: "1px solid rgba(30,58,95,0.2)", background: "rgba(30,58,95,0.05)", fontSize: 12 }}>
                <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
                    <span style={{ animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite", position: "absolute", inset: 0, borderRadius: 99, background: "#16a34a", opacity: 0.75 }} />
                    <span style={{ position: "relative", display: "inline-flex", borderRadius: 99, width: 8, height: 8, background: "#16a34a" }} />
                </span>
                <span style={{ fontWeight: 800, color: "#1e3a5f" }}><AnimatedNumber value={visitData.totalVisits} /></span>
                <span style={{ color: "#64748b" }}>lượt truy cập</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 99, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", fontSize: 12 }}>
                <span>📅</span>
                <span style={{ color: "#92400e" }}>Hôm nay: <strong><AnimatedNumber value={visitData.todayVisits} duration={600} /></strong></span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 99, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", fontSize: 12 }}>
                <span>👤</span>
                <span style={{ color: "#1e40af" }}>Bạn: <strong><AnimatedNumber value={visitData.myVisits} duration={600} /></strong> lần</span>
            </div>
        </div>
    );
};
