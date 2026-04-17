import React, { useState } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { COLORS } from '../constants.js';

export default function InterventionTab({ summaryData, interventions, setInterventions, tiers }) {
    // Sort tiers by minAvg ascending — lowest tiers need most intervention
    const sortedTiers = [...(tiers || [])].sort((a, b) => a.minAvg - b.minAvg);
    const bestTier = sortedTiers[sortedTiers.length - 1];
    // All students NOT in the best tier need intervention
    const needsIntervention = summaryData.filter(s => bestTier && s.tier.name !== bestTier.name);
    const worstTier = sortedTiers[0];
    const worstStudents = summaryData.filter(s => worstTier && s.tier.name === worstTier.name);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ student: "", issue: "", plan: "", person: "", tier: "2" });

    const addIntervention = () => {
        if (!form.student) return;
        setInterventions(prev => [...prev, { ...form, id: Date.now(), date: new Date().toLocaleDateString("vi-VN"), status: "Đang theo dõi" }]);
        setForm({ student: "", issue: "", plan: "", person: "", tier: "2" });
        setShowAdd(false);
    };

    const inputStyle = { width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" };

    return (
        <div>
            {worstStudents.length > 0 && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <AlertTriangle size={20} color={COLORS.red} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.red }}>⚠️ {worstStudents.length} học sinh cần can thiệp {worstTier.name}</div>
                        <div style={{ fontSize: 11, color: "#991b1b" }}>{worstStudents.map(s => s.name).join(", ")}</div>
                    </div>
                </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Danh sách Can thiệp</h3>
                <button onClick={() => setShowAdd(!showAdd)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    <Plus size={14} /> Thêm
                </button>
            </div>

            {showAdd && (
                <div style={{ background: "#fff", borderRadius: 12, padding: 18, marginBottom: 14, border: `1px solid ${COLORS.border}` }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Học sinh</label>
                            <select value={form.student} onChange={e => setForm(p => ({ ...p, student: e.target.value }))} style={inputStyle}>
                                <option value="">Chọn...</option>
                                {needsIntervention.map(s => <option key={s.name} value={s.name}>{s.name} ({s.tier.name})</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Tầng</label>
                            <select value={form.tier} onChange={e => setForm(p => ({ ...p, tier: e.target.value }))} style={inputStyle}>
                                {sortedTiers.filter((_, i) => i < sortedTiers.length - 1).map(t => <option key={t.name} value={t.name}>{t.name} — {t.action}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Vấn đề chính</label>
                        <input value={form.issue} onChange={e => setForm(p => ({ ...p, issue: e.target.value }))} placeholder="VD: Hay đến muộn, quên đồ" style={inputStyle} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Can thiệp áp dụng</label>
                            <input value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))} placeholder="VD: Check-in buổi sáng" style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Người phụ trách</label>
                            <input value={form.person} onChange={e => setForm(p => ({ ...p, person: e.target.value }))} placeholder="VD: GVCN" style={inputStyle} />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={addIntervention} style={{ padding: "8px 18px", background: COLORS.green, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Lưu</button>
                        <button onClick={() => setShowAdd(false)} style={{ padding: "8px 18px", background: "#f1f5f9", color: COLORS.textMuted, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Hủy</button>
                    </div>
                </div>
            )}

            {/* Dynamic tier sections */}
            {sortedTiers.filter((_, i) => i < sortedTiers.length - 1).map(tier => {
                const tierStudents = summaryData.filter(s => s.tier.name === tier.name);
                return (
                    <div key={tier.name} style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                            <div style={{ width: 10, height: 10, borderRadius: 99, background: tier.color }} />
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{tier.name} — {tier.action} ({tierStudents.length} em)</h4>
                        </div>
                        {tierStudents.map(s => {
                            const iv = interventions.find(x => x.student === s.name);
                            return (
                                <div key={s.name} style={{ background: "#fff", borderRadius: 10, padding: "12px 16px", marginBottom: 8, border: `1px solid ${tier.color}33`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 13, color: tier.color }}>{s.name}</div>
                                        <div style={{ fontSize: 11, color: COLORS.textMuted }}>TB {s.avg.toFixed(1)}/ngày · {s.total} sao</div>
                                        {iv && <div style={{ fontSize: 11, color: tier.color, marginTop: 2 }}>📋 {iv.plan} — {iv.person}</div>}
                                    </div>
                                    <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: iv ? "#dcfce7" : tier.bg, color: iv ? COLORS.green : tier.color }}>{iv ? iv.status : "Chưa có kế hoạch"}</span>
                                </div>
                            );
                        })}
                        {tierStudents.length === 0 && <div style={{ fontSize: 13, color: COLORS.textMuted, fontStyle: "italic" }}>Không có học sinh {tier.name}</div>}
                    </div>
                );
            })}
        </div>
    );
}
