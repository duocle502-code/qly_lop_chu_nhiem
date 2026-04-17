import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { COLORS } from '../constants.js';

export default function RankingTab({ summaryData }) {
    const [sortKey, setSortKey] = useState("total");
    const sorted = [...summaryData].sort((a, b) => sortKey === "total" ? b.total - a.total : sortKey === "avg" ? b.avg - a.avg : b.daysAbove5 - a.daysAbove5);

    return (
        <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                {[["total", "Tổng sao"], ["avg", "TB/ngày"], ["daysAbove5", "Ngày ≥5 sao"]].map(([k, label]) => (
                    <button key={k} onClick={() => setSortKey(k)} style={{
                        padding: "6px 14px", borderRadius: 8, border: `1px solid ${sortKey === k ? COLORS.primary : COLORS.border}`,
                        background: sortKey === k ? COLORS.primary : "#fff", color: sortKey === k ? "#fff" : COLORS.text,
                        fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    }}>{label}</button>
                ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.border}` }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: COLORS.text }}>📊 Top 10 Học sinh</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={sorted.slice(0, 10)} layout="vertical" margin={{ left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="total" fill={COLORS.green} radius={[0, 6, 6, 0]} name="Tổng sao" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.border}` }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: COLORS.primary, color: "#fff" }}>
                                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>#</th>
                                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700 }}>Họ và Tên</th>
                                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>Tổng ⭐</th>
                                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>TB/Ngày</th>
                                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>Ngày ≥5⭐</th>
                                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>Tầng</th>
                                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>Level</th>
                                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((s, i) => (
                                <tr key={s.name} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: `1px solid ${COLORS.border}` }}>
                                    <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: COLORS.textMuted }}>{i + 1}</td>
                                    <td style={{ padding: "8px 12px", fontWeight: 600 }}>{s.name}</td>
                                    <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 800, color: COLORS.accent }}>{s.total}</td>
                                    <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600 }}>{s.avg.toFixed(1)}</td>
                                    <td style={{ padding: "8px 12px", textAlign: "center" }}>{s.daysAbove5}</td>
                                    <td style={{ padding: "8px 12px", textAlign: "center" }}>
                                        <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: s.tier.bg, color: s.tier.color }}>{s.tier.name}</span>
                                    </td>
                                    <td style={{ padding: "8px 12px", textAlign: "center", fontSize: 12 }}>{s.level.emoji} {s.level.name}</td>
                                    <td style={{ padding: "8px 12px", textAlign: "center", fontSize: 11, color: s.tier.color, fontWeight: 600 }}>{s.tier.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
