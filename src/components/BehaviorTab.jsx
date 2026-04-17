import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit3, X, Check, RotateCcw } from 'lucide-react';
import { COLORS, DEFAULT_BEHAVIORS } from '../constants.js';

const inputStyle = {
    width: "100%", padding: "7px 10px", borderRadius: 8,
    border: `1px solid ${COLORS.border}`, fontSize: 13,
    fontFamily: "inherit", boxSizing: "border-box",
};
const btnBase    = { display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };
const btnSuccess = { ...btnBase, background: COLORS.green, color: "#fff" };
const btnDanger  = { ...btnBase, background: COLORS.red,   color: "#fff" };
const btnGhost   = { ...btnBase, background: "#f1f5f9",    color: COLORS.textMuted };

const EMPTY = { code: "", name: "", def: "", example: "", stars: 1, unit: "lần" };

/* ───────────────────────────────────────────────
   BehaviorForm – dùng UNCONTROLLED inputs + ref
   Không phụ thuộc React state khi gõ → không bị mất con trỏ
─────────────────────────────────────────────── */
function BehaviorForm({ initial = EMPTY, title, accentColor, accentBorder, onSave, onCancel }) {
    const codeRef    = useRef(null);
    const nameRef    = useRef(null);
    const starsRef   = useRef(null);
    const unitRef    = useRef(null);
    const defRef     = useRef(null);
    const exampleRef = useRef(null);

    // Đồng bộ giá trị initial vào DOM khi mount
    useEffect(() => {
        if (codeRef.current)    codeRef.current.value    = initial.code    ?? "";
        if (nameRef.current)    nameRef.current.value    = initial.name    ?? "";
        if (starsRef.current)   starsRef.current.value   = initial.stars   ?? 1;
        if (unitRef.current)    unitRef.current.value    = initial.unit    ?? "lần";
        if (defRef.current)     defRef.current.value     = initial.def     ?? "";
        if (exampleRef.current) exampleRef.current.value = initial.example ?? "";
        nameRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = () => {
        const name = nameRef.current?.value?.trim() ?? "";
        if (!name) { nameRef.current?.focus(); return; }
        onSave({
            code:    codeRef.current?.value?.trim()    ?? "",
            name,
            stars:   Number(starsRef.current?.value)   || 1,
            unit:    unitRef.current?.value?.trim()    || "lần",
            def:     defRef.current?.value?.trim()     ?? "",
            example: exampleRef.current?.value?.trim() ?? "",
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") onCancel();
    };

    return (
        <div style={{
            background: "#fff", borderRadius: 12, padding: 18, marginBottom: 14,
            border: `2px solid ${accentBorder || COLORS.primary}`,
            boxShadow: "0 4px 16px rgba(30,58,95,0.10)",
        }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: accentColor || COLORS.primary, marginBottom: 12 }}>
                {title}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 60px 80px", gap: 8, marginBottom: 8 }}>
                <input ref={codeRef}  style={inputStyle} placeholder="Mã (tự động)" onKeyDown={handleKeyDown} />
                <input ref={nameRef}  style={inputStyle} placeholder="Tên hành vi *" onKeyDown={handleKeyDown} />
                <input ref={starsRef} style={inputStyle} type="number" min="1" max="10" placeholder="⭐" onKeyDown={handleKeyDown} />
                <input ref={unitRef}  style={inputStyle} placeholder="Đơn vị" onKeyDown={handleKeyDown} />
            </div>
            <input ref={defRef}     style={{ ...inputStyle, marginBottom: 8 }}  placeholder="Mô tả định nghĩa hành vi" onKeyDown={handleKeyDown} />
            <input ref={exampleRef} style={{ ...inputStyle, marginBottom: 12 }} placeholder="Ví dụ quan sát được"      onKeyDown={handleKeyDown} />

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleSave} style={btnSuccess}><Check size={14} /> Lưu hành vi</button>
                <button onClick={onCancel}   style={btnGhost}  ><X     size={14} /> Hủy</button>
            </div>
        </div>
    );
}

/* ───────────────────────────────────────────────
   BehaviorTab – component chính
─────────────────────────────────────────────── */
export default function BehaviorTab({ behaviors, setBehaviors }) {
    const [expanded, setExpanded] = useState(null);
    const [showAdd,  setShowAdd]  = useState(false);
    const [editIdx,  setEditIdx]  = useState(-1);

    const handleAdd = (data) => {
        const code = data.code || `HV${String(behaviors.length + 1).padStart(2, "0")}`;
        setBehaviors(prev => [...prev, { ...data, code }]);
        setShowAdd(false);
    };

    const handleSaveEdit = (data) => {
        setBehaviors(prev => prev.map((b, i) => i === editIdx ? { ...b, ...data } : b));
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
        setExpanded(null); setEditIdx(-1); setShowAdd(false);
    };

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
                        onClick={() => { setShowAdd(true); setEditIdx(-1); }}
                        style={{ ...btnBase, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", fontSize: 13 }}
                    >
                        <Plus size={15} /> Thêm hành vi
                    </button>
                    <button
                        onClick={handleReset}
                        style={{ ...btnBase, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", fontSize: 12 }}
                    >
                        <RotateCcw size={13} /> Reset mẫu
                    </button>
                </div>
            </div>

            {/* Add Form */}
            {showAdd && (
                <BehaviorForm
                    key="add-form"
                    initial={EMPTY}
                    title="➕ Thêm hành vi mới"
                    accentBorder={COLORS.primary}
                    accentColor={COLORS.primary}
                    onSave={handleAdd}
                    onCancel={() => setShowAdd(false)}
                />
            )}

            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {behaviors.map((b, i) => (
                    <div key={b.code || i} style={{
                        background: "#fff", borderRadius: 12, overflow: "hidden",
                        border: editIdx === i ? `2px solid ${COLORS.green}` : `1px solid ${COLORS.border}`,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}>
                        {editIdx === i ? (
                            <div style={{ padding: "12px 16px" }}>
                                <BehaviorForm
                                    key={`edit-${b.code || i}`}
                                    initial={{ ...b }}
                                    title={`✏️ Chỉnh sửa: ${b.name}`}
                                    accentBorder={COLORS.green}
                                    accentColor={COLORS.green}
                                    onSave={handleSaveEdit}
                                    onCancel={() => setEditIdx(-1)}
                                />
                            </div>
                        ) : (
                            <>
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
                                    <div style={{ display: "flex", gap: 4 }}>
                                        <button
                                            onClick={() => { setEditIdx(i); setShowAdd(false); setExpanded(null); }}
                                            style={{ ...btnGhost, padding: "5px 9px" }} title="Chỉnh sửa"
                                        >
                                            <Edit3 size={13} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(i)}
                                            style={{ ...btnDanger, padding: "5px 9px" }} title="Xóa"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                    {b.example && (
                                        <button
                                            onClick={() => setExpanded(expanded === i ? null : i)}
                                            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}
                                        >
                                            {expanded === i
                                                ? <ChevronUp   size={16} color={COLORS.textMuted} />
                                                : <ChevronDown size={16} color={COLORS.textMuted} />}
                                        </button>
                                    )}
                                </div>

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
