import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { COLORS } from '../constants.js';
import { starColor, getDaysInMonth } from '../utils.js';

export default function DailyTab({ students, starData, updateStar, selectedDay, setSelectedDay, searchTerm, setSearchTerm, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }) {
    const filtered = students.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

    return (
        <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "6px 12px", flex: "1 1 180px", minWidth: 160 }}>
                    <Search size={16} color={COLORS.textMuted} />
                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Tìm học sinh..." style={{ border: "none", outline: "none", width: "100%", fontSize: 13, fontFamily: "inherit", background: "transparent" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "6px 12px" }}>
                    <Calendar size={16} color={COLORS.textMuted} />
                    <select value={selectedMonth} onChange={e => { setSelectedMonth(Number(e.target.value)); setSelectedDay(1); }} style={{ border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", background: "transparent" }}>
                        {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>)}
                    </select>
                    <select value={selectedYear} onChange={e => { setSelectedYear(Number(e.target.value)); setSelectedDay(1); }} style={{ border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", background: "transparent" }}>
                        {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "6px 12px" }}>
                    <select value={selectedDay} onChange={e => setSelectedDay(Number(e.target.value))} style={{ border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", background: "transparent" }}>
                        {Array.from({ length: daysInMonth }, (_, i) => <option key={i + 1} value={i + 1}>Ngày {i + 1}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.border}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 80px 90px", padding: "12px 16px", background: COLORS.primary, color: "#fff", fontWeight: 700, fontSize: 12, gap: 8 }}>
                    <div>STT</div><div>Họ và Tên</div><div style={{ textAlign: "center" }}>Ngôi sao</div><div style={{ textAlign: "center" }}>Tổng tháng</div>
                </div>
                <div style={{ maxHeight: 520, overflowY: "auto" }}>
                    {filtered.map((name, i) => {
                        const days = starData[name] || {};
                        const val = days[selectedDay] ?? "";
                        const total = Object.values(days).reduce((s, v) => s + (v || 0), 0);
                        const sc = val !== "" ? starColor(val) : { bg: "transparent", text: COLORS.textMuted };
                        return (
                            <div key={name} style={{ display: "grid", gridTemplateColumns: "48px 1fr 80px 90px", padding: "10px 16px", borderBottom: `1px solid ${COLORS.border}`, alignItems: "center", gap: 8, background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>{students.indexOf(name) + 1}</div>
                                <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <input
                                        type="number" min="0" max="10" value={val}
                                        onChange={e => updateStar(name, selectedDay, e.target.value === "" ? 0 : Number(e.target.value))}
                                        style={{
                                            width: 52, height: 34, textAlign: "center", border: `2px solid ${val !== "" ? sc.text + "44" : COLORS.border}`,
                                            borderRadius: 8, fontSize: 15, fontWeight: 700, color: sc.text, background: sc.bg,
                                            fontFamily: "inherit", outline: "none",
                                        }}
                                    />
                                </div>
                                <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, color: COLORS.accent }}>{total}⭐</div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: COLORS.textMuted, textAlign: "center" }}>
                Nhập số ngôi sao từ 0-10 cho mỗi học sinh · Màu sắc tự thay đổi theo mức đạt
            </div>
        </div>
    );
}
