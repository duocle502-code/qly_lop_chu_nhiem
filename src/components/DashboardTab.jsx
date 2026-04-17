import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Star, Users, Award, AlertTriangle } from 'lucide-react';
import { COLORS } from '../constants.js';
import { StatCard } from './CommonUI.jsx';

export default function DashboardTab({ summaryData, tierCounts, starData, students }) {
    const totalStars = summaryData.reduce((s, d) => s + d.total, 0);
    const avgPerStudent = summaryData.length > 0 ? (totalStars / summaryData.length).toFixed(1) : 0;
    const above100 = summaryData.filter(s => s.total >= 100).length;

    const pieData = [
        { name: "Tầng 1", value: tierCounts["Tầng 1"], color: "#16a34a" },
        { name: "Tầng 2", value: tierCounts["Tầng 2"], color: "#f59e0b" },
        { name: "Tầng 3", value: tierCounts["Tầng 3"], color: "#dc2626" },
    ];

    const weeklyData = [1, 2, 3, 4].map(w => {
        const start = (w - 1) * 7 + 1;
        const end = Math.min(w * 7, 30);
        let total = 0;
        students.forEach(name => {
            const days = starData[name] || {};
            for (let d = start; d <= end; d++) total += (days[d] || 0);
        });
        return { week: `Tuần ${w}`, total };
    });

    return (
        <div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
                <StatCard icon={Star} label="Tổng ngôi sao" value={totalStars.toLocaleString()} color={COLORS.accent} sub="toàn lớp tháng này" />
                <StatCard icon={Users} label="TB/học sinh" value={avgPerStudent} color={COLORS.primaryLight} sub={`${summaryData.length} học sinh`} />
                <StatCard icon={Award} label="Đạt ≥100 sao" value={above100} color={COLORS.green} sub="học sinh xuất sắc" />
                <StatCard icon={AlertTriangle} label="Cần can thiệp" value={tierCounts["Tầng 3"]} color={COLORS.red} sub="Tầng 3" />
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: 20, flex: "1 1 280px", minWidth: 260, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.border}` }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: COLORS.text }}>Phân bổ Tầng</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 11, fontWeight: 600 }}>
                                {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: 20, flex: "1.2 1 300px", minWidth: 280, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.border}` }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: COLORS.text }}>Xu hướng theo tuần</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="total" stroke={COLORS.primary} strokeWidth={3} dot={{ fill: COLORS.primary, r: 5 }} name="Tổng sao" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.border}` }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: COLORS.text }}>🏆 Top 5 Học sinh Xuất sắc</h3>
                {summaryData.slice(0, 5).map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? `1px solid ${COLORS.border}` : "none" }}>
                        <div style={{ width: 32, height: 32, borderRadius: 99, background: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#d97706" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: i < 3 ? "#fff" : COLORS.textMuted, flexShrink: 0 }}>{i + 1}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: COLORS.textMuted }}>{s.level.emoji} {s.level.name} · TB {s.avg.toFixed(1)}/ngày</div>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.accent, flexShrink: 0 }}>{s.total}⭐</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
