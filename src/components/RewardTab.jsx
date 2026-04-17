import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { COLORS } from '../constants.js';

export default function RewardTab({ summaryData, exchanges, setExchanges, rewards }) {
    const [showExchange, setShowExchange] = useState(false);
    const [exForm, setExForm] = useState({ student: "", reward: "" });

    const doExchange = () => {
        if (!exForm.student || !exForm.reward) return;
        const reward = rewards.find(r => r.code === exForm.reward);
        const student = summaryData.find(s => s.name === exForm.student);
        if (!reward || !student || student.remaining < reward.cost) return;
        setExchanges(prev => [...prev, { student: exForm.student, reward: reward.code, rewardName: reward.name, cost: reward.cost, date: new Date().toLocaleDateString("vi-VN"), id: Date.now() }]);
        setExForm({ student: "", reward: "" });
        setShowExchange(false);
    };

    const selectedReward = rewards.find(r => r.code === exForm.reward);
    const selectedStudent = summaryData.find(s => s.name === exForm.student);
    const canExchange = selectedStudent && selectedReward && selectedStudent.remaining >= selectedReward.cost;
    const selectStyle = { width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit" };

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>🎁 Menu Phần thưởng</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                    {rewards.map(r => (
                        <div key={r.code} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: `1px solid ${COLORS.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8, gap: 8 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{r.name}</div>
                                <div style={{ background: COLORS.accent + "20", padding: "3px 10px", borderRadius: 99, fontWeight: 800, fontSize: 13, color: COLORS.accent, whiteSpace: "nowrap", flexShrink: 0 }}>{r.cost} ⭐</div>
                            </div>
                            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, lineHeight: 1.4 }}>{r.desc}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.textMuted, flexWrap: "wrap", gap: 4 }}>
                                <span>📦 {r.quota}</span>
                                <span>⏰ {r.deadline}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>📝 Đổi điểm</h3>
                <button onClick={() => setShowExchange(!showExchange)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", background: COLORS.accent, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    <Gift size={14} /> Đổi phần thưởng
                </button>
            </div>

            {showExchange && (
                <div style={{ background: "#fffbeb", borderRadius: 12, padding: 18, marginBottom: 14, border: "1px solid #fde68a" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Học sinh</label>
                            <select value={exForm.student} onChange={e => setExForm(p => ({ ...p, student: e.target.value }))} style={selectStyle}>
                                <option value="">Chọn học sinh...</option>
                                {summaryData.map(s => <option key={s.name} value={s.name}>{s.name} (còn {s.remaining}⭐)</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Phần thưởng</label>
                            <select value={exForm.reward} onChange={e => setExForm(p => ({ ...p, reward: e.target.value }))} style={selectStyle}>
                                <option value="">Chọn phần thưởng...</option>
                                {rewards.map(r => <option key={r.code} value={r.code}>{r.name} ({r.cost}⭐)</option>)}
                            </select>
                        </div>
                    </div>
                    {selectedStudent && selectedReward && (
                        <div style={{ padding: "8px 12px", borderRadius: 8, background: canExchange ? "#dcfce7" : "#fecaca", fontSize: 12, fontWeight: 600, marginBottom: 10, color: canExchange ? COLORS.green : COLORS.red }}>
                            {canExchange
                                ? `✅ ${selectedStudent.name} có ${selectedStudent.remaining}⭐, đủ đổi "${selectedReward.name}" (${selectedReward.cost}⭐). Còn lại: ${selectedStudent.remaining - selectedReward.cost}⭐`
                                : `❌ ${selectedStudent.name} chỉ có ${selectedStudent.remaining}⭐, chưa đủ đổi "${selectedReward.name}" (cần ${selectedReward.cost}⭐)`}
                        </div>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={doExchange} disabled={!canExchange} style={{ padding: "8px 18px", background: COLORS.green, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: canExchange ? 1 : 0.5 }}>Xác nhận đổi</button>
                        <button onClick={() => setShowExchange(false)} style={{ padding: "8px 18px", background: "#f1f5f9", color: COLORS.textMuted, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Hủy</button>
                    </div>
                </div>
            )}

            {exchanges.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
                    <div style={{ padding: "12px 16px", background: "#f0fdf4", fontWeight: 700, fontSize: 13, color: COLORS.green }}>Lịch sử đổi điểm ({exchanges.length} lần)</div>
                    {exchanges.slice().reverse().map((ex) => (
                        <div key={ex.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 12, flexWrap: "wrap", gap: 4 }}>
                            <div>
                                <span style={{ fontWeight: 700 }}>{ex.student}</span>
                                <span style={{ color: COLORS.textMuted }}> đổi </span>
                                <span style={{ fontWeight: 600, color: COLORS.primary }}>{ex.rewardName}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontWeight: 700, color: COLORS.red }}>-{ex.cost}⭐</span>
                                <span style={{ fontSize: 11, color: COLORS.textMuted }}>{ex.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
