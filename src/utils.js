import { DEFAULT_STUDENTS, DEFAULT_LEVELS, DEFAULT_TIERS } from './constants.js';

export function generateSampleData() {
    const data = {};
    const seed = 42;
    let r = seed;
    const rand = (min, max) => { r = (r * 16807 + 0) % 2147483647; return min + (r % (max - min + 1)); };
    DEFAULT_STUDENTS.forEach((name, idx) => {
        const days = {};
        const [lo, hi] = idx < 5 ? [3, 8] : idx < 25 ? [2, 6] : idx < 35 ? [1, 4] : [0, 3];
        for (let d = 1; d <= 30; d++) days[d] = rand(lo, hi);
        data[name] = days;
    });
    return data;
}

// Dynamic level lookup using custom levels array
export const getLevel = (total, levels) => {
    const sorted = [...(levels || DEFAULT_LEVELS)].sort((a, b) => b.minStars - a.minStars);
    for (const lv of sorted) {
        if (total >= lv.minStars) return lv;
    }
    return sorted[sorted.length - 1] || { name: "Không xác định", emoji: "❓", color: "#64748b" };
};

// Dynamic tier lookup using custom tiers array
export const getTier = (avg, tiers) => {
    const sorted = [...(tiers || DEFAULT_TIERS)].sort((a, b) => b.minAvg - a.minAvg);
    for (const t of sorted) {
        if (avg >= t.minAvg) return t;
    }
    return sorted[sorted.length - 1] || { name: "Không xác định", color: "#64748b", bg: "#f1f5f9", action: "Không rõ" };
};

export const starColor = (v) => {
    if (v >= 5) return { bg: "#dcfce7", text: "#166534" };
    if (v >= 3) return { bg: "#fef9c3", text: "#92400e" };
    if (v >= 1) return { bg: "#fed7aa", text: "#c2410c" };
    return { bg: "#fecaca", text: "#991b1b" };
};

export const loadData = (key, fallback) => {
    try {
        const result = localStorage.getItem(key);
        return result ? JSON.parse(result) : fallback;
    } catch { return fallback; }
};

export const saveData = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error(e); }
};

export const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
