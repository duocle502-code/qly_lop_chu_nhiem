import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit3, X, Check, RotateCcw } from 'lucide-react';
import { COLORS, DEFAULT_BEHAVIORS } from '../constants.js';

const inputStyle = {
    width: "100%", padding: "7px 10px", borderRadius: 8,
    border: `1px solid ${COLORS.border}`, fontSize: 13,
    fontFamily: "inherit", boxSizing: "border-box",
};

const btnBase = {
    display: "flex", alignItems: "center", gap: 5,
    padding: "7px 14px", border: "none", borderRadius: 8,
    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
};
const btnPrimary = { ...btnBase, background: COLORS.primary, color: "#fff" };
const btnSuccess = { ...btnBase, background: COLORS.green, color: "#fff" };
const btnDanger  = { ...btnBase, background: COLORS.red,   color: "#fff" };
const btnGhost   = { ...btnBase, background: "#f1f5f9",    color: COLORS.textMuted };

const EMPTY_FORM = { code: "", name: "", def: "", example: "", stars: 1, unit: "lần" };

export default function BehaviorTab({ behaviors, setBehaviors }) {
    const [expanded, setExpanded] = useState(null);
    const [showAdd, setShowAdd]   = useState(false);
    const [editIdx, setEditIdx]   = useState(-1);
    const [form, setForm]         = useState(EMPTY_FORM);

    const resetForm = () => setForm(EMPTY_FORM);

    const handleAdd = () => {
        if (!form.name.trim()) return;
        const code = form.code.trim() || `HV${String(behaviors.length + 1).padStart(2, "0")}`;
        setBehaviors(prev => [...prev, { ...form, code, stars: Number(form.stars) || 1 }]);
        resetForm();
        setShowAdd(false);
    };

    const handleSaveEdit = () => {
        if (!form.name.trim()) return;
        setBehaviors(prev => prev.map((b, i) => i === editIdx ? { ...form, stars: Number(form.stars) || 1 } : b));
        resetForm();
        setEditIdx(-1);
        setExpanded(null);
    };

    const handleDelete = (idx) => {
        if (!confirm(`Xóa hành vi "${behaviors[idx].name}"?`)) return;
        setBehaviors(prev => prev.filter((_, i) => i !== idx));
        if (expanded === idx) setExpanded(null);
    };

    const handleReset = () => {
        if (!confirm("Reset về 8 hành vi mẫu ban đầu?")) return;
        setBehaviors([...DEFAULT_BEHAVIORS]);
        setExpanded(null); setEditIdx(-1); setShowAdd(false); resetForm();
    };

    const startEdit = (idx) => {
        setForm({ ...behaviors[idx] });
        setEditIdx(idx);
        setShowAdd(false);
        setExpanded(null);
    };

    const cancelEdit = () => { resetForm(); setEditIdx(-1); };
    const cancelAdd  = () => { resetForm(); setShowAdd(false); };

    return (
        <div>
            {/* Header */}
            <div style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, #1a2d4a)`,
                borderRadius: 14, padding: "20px 24px", color: "#fff", marginBottom: 16,
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
            }}>
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>📋 Danh mục Hành vi Mong đợi</h2>
                    <p style={{ fontSize: 12, opacity: 0.8 }}>
                        {behaviors.length} hành vi tích cực được ghi nhận và khen thưởng bằng ngôi sao
                    </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        onClick={() => { resetForm(); setShowAdd(true); setEditIdx(-1); }}
                        style={{ ...btnPrimary, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)", fontSize: 13 }}
                    >
                        <Plus size={15} /> Thêm hành vi
                    </button>
                    <button
                        onClick={handleReset}
                        style={{ ...btnGhost, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", fontSize: 12 }}
                    >
                        <RotateCcw size={13} /> Reset mẫu
                    </button>
                </div>
            </div>

            {/* Add Form */}
            {showAdd && (
                <div style={{
                    background: "#fff", borderRadius: 12, padding: 18, marginBottom: 14,
                    border: `2px solid ${COLORS.primary}`, boxShadow: "0 4px 16px rgba(30,58,95,0.10)",
                }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.primary, marginBottom: 12 }}>
                        ➕ Thêm hành vi mới
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 60px 80px", gap: 8, marginBottom: 8 }}>
                        <input value={form.code}  onChange={e => setForm(p => ({ ...p, code:  e.target.value }))} placeholder="Mã (tự động)" style={inputStyle} />
                        <input value={form.name}  onChange={e => setForm(p => ({ ...p, name:  e.target.value }))} placeholder="Tên hành vi *" style={inputStyle} autoFocus />
                        <input type="number" min="1" max="10" value={form.stars} onChange={e => setForm(p => ({ ...p, stars: e.target.value }))} placeholder="⭐" style={inputStyle} />
                        <input value={form.unit}  onChange={e => setForm(p => ({ ...p, unit:  e.target.value }))} placeholder="Đơn vị" style={inputStyle} />
                    </div>
                    <input value={form.def}     onChange={e => setForm(p => ({ ...p, def:     e.target.value }))} placeholder="Mô tả định nghĩa hành vi" style={{ ...inputStyle, marginBottom: 8 }} />
                    <input value={form.example} onChange={e => setForm(p => ({ ...p, example: e.target.value }))} placeholder="Ví dụ quan sát được" style={{ ...inputStyle, marginBottom: 12 }} />
                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={handleAdd}  style={btnSuccess}><Check size={14} /> Lưu hành vi</button>
                        <button onClick={cancelAdd}  style={btnGhost}  ><X     size={14} /> Hủy</button>
                    </div>
                </div>
            )}

            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {behaviors.map((b, i) => (
                    <div key={b.code || i} style={{
                        background: "#fff", borderRadius: 12, overflow: "hidden",
                        border: editIdx === i ? `2px solid ${COLORS.green}` : `1px solid ${COLORS.border}`,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}>
                        {/* Edit mode */}
                        {editIdx === i ? (
                            <div style={{ padding: 16 }}>
                                <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.green, marginBottom: 10 }}>
                                    ✏️ Chỉnh sửa: {b.name}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 60px 80px", gap: 8, marginBottom: 8 }}>
                                    <input value={form.code}  onChange={e => setForm(p => ({ ...p, code:  e.target.value }))} placeholder="Mã" style={inputStyle} />
                                    <input value={form.name}  onChange={e => setForm(p => ({ ...p, name:  e.target.value }))} placeholder="Tên hành vi *" style={inputStyle} autoFocus />
                                    <input type="number" min="1" max="10" value={form.stars} onChange={e => setForm(p => ({ ...p, stars: e.target.value }))} placeholder="⭐" style={inputStyle} />
                                    <input value={form.unit}  onChange={e => setForm(p => ({ ...p, unit:  e.target.value }))} placeholder="Đơn vị" style={inputStyle} />
                                </div>
                                <input value={form.def}     onChange={e => setForm(p => ({ ...p, def:     e.target.value }))} placeholder="Mô tả" style={{ ...inputStyle, marginBottom: 8 }} />
                                <input value={form.example} onChange={e => setForm(p => ({ ...p, example: e.target.value }))} placeholder="Ví dụ quan sát" style={{ ...inputStyle, marginBottom: 12 }} />
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button onClick={handleSaveEdit} style={btnSuccess}><Check size={14} /> Lưu</button>
                                    <button onClick={cancelEdit}     style={btnGhost}  ><X     size={14} /> Hủy</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Row */}
                                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10,
                                        background: COLORS.accent + "20", display: "flex",
                                        alignItems: "center", justifyContent: "center",
                                        fontWeight: 800, fontSize: 13, color: COLORS.accent, flexShrink: 0,
                                    }}>
                                        {(b.code || "").slice(-2) || i + 1}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{b.name}</div>
                                        <div style={{ fontSize: 11, color: COLORS.textMuted }}>{b.def}</div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                                        <span style={{ fontWeight: 800, fontSize: 16, color: COLORS.accent }}>{b.stars}</span>
                                        <span style={{ fontSize: 11, color: COLORS.textMuted }}>⭐/{b.unit}</span>
                                    </div>
                                    {/* Action buttons */}
                                    <div style={{ display: "flex", gap: 4 }}>
                                        <button
                                            onClick={() => startEdit(i)}
                                            style={{ ...btnGhost, padding: "5px 9px" }}
                                            title="Chỉnh sửa"
                                        >
                                            <Edit3 size={13} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(i)}
                                            style={{ ...btnDanger, padding: "5px 9px" }}
                                            title="Xóa"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                    {/* Expand toggle */}
                                    {b.example && (
                                        <button
                                            onClick={() => setExpanded(expanded === i ? null : i)}
                                            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}
                                        >
                                            {expanded === i ? <ChevronUp size={16} color={COLORS.textMuted} /> : <ChevronDown size={16} color={COLORS.textMuted} />}
                                        </button>
                                    )}
                                </div>

                                {/* Expand */}
                                {expanded === i && b.example && (
                                    <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${COLORS.border}` }}>
                                        <div style={{ padding: "12px 14px", background: "#f0fdf4", borderRadius: 8, marginTop: 10 }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.green, marginBottom: 4 }}>VÍ DỤ QUAN SÁT:</div>
                                            <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5 }}>{b.example}</div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}

                {behaviors.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: COLORS.textMuted, fontSize: 14 }}>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
                        Chưa có hành vi nào. Nhấn <strong>Thêm hành vi</strong> để bắt đầu.
                    </div>
                )}
            </div>
        </div>
    );
}
