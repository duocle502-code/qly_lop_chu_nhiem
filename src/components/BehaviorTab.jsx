import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit3, X, Check, RotateCcw } from 'lucide-react';
import { COLORS, DEFAULT_BEHAVIORS } from '../constants.js';

const IS = { // inputStyle
    width: "100%", padding: "7px 10px", borderRadius: 8,
    border: `1px solid ${COLORS.border}`, fontSize: 13,
    fontFamily: "inherit", boxSizing: "border-box",
};
const B0 = { display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };
const Bgreen = { ...B0, background: COLORS.green, color: "#fff" };
const Bred   = { ...B0, background: COLORS.red,   color: "#fff" };
const Bghost = { ...B0, background: "#f1f5f9",    color: COLORS.textMuted };

const INIT = { code: "", name: "", def: "", example: "", stars: 1, unit: "lần" };

/*
  BehaviorForm: uncontrolled, dùng defaultValue + ref
  KHÔNG dùng useEffect để gán giá trị → tránh StrictMode double-mount bug
*/
function BehaviorForm({ initial = INIT, title, borderColor, titleColor, onSave, onCancel }) {
    // Refs - chỉ dùng để ĐỌC khi save, không ghi
    const r = {
        code:    useRef(null),
        name:    useRef(null),
        stars:   useRef(null),
        unit:    useRef(null),
        def:     useRef(null),
        example: useRef(null),
    };

    const collect = () => ({
        code:    r.code.current?.value.trim()    ?? "",
        name:    r.name.current?.value.trim()    ?? "",
        stars:   Number(r.stars.current?.value)  || 1,
        unit:    r.unit.current?.value.trim()    || "lần",
        def:     r.def.current?.value.trim()     ?? "",
        example: r.example.current?.value.trim() ?? "",
    });

    const handleSave = () => {
        const data = collect();
        if (!data.name) { r.name.current?.focus(); return; }
        onSave(data);
    };

    const onKey = (e) => {
        if (e.key === "Enter")  handleSave();
        if (e.key === "Escape") onCancel();
    };

    return (
        <div style={{
            background: "#fff", borderRadius: 12, padding: 18, marginBottom: 14,
            border: `2px solid ${borderColor || COLORS.primary}`,
            boxShadow: "0 4px 16px rgba(30,58,95,0.10)",
        }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: titleColor || COLORS.primary, marginBottom: 12 }}>
                {title}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 60px 80px", gap: 8, marginBottom: 8 }}>
                <input ref={r.code}  style={IS} placeholder="Mã (tự động)"    defaultValue={initial.code}    onKeyDown={onKey} />
                <input ref={r.name}  style={IS} placeholder="Tên hành vi *"   defaultValue={initial.name}    onKeyDown={onKey} autoFocus />
                <input ref={r.stars} style={IS} type="number" min="1" max="10" defaultValue={initial.stars}   onKeyDown={onKey} placeholder="⭐" />
                <input ref={r.unit}  style={IS} placeholder="Đơn vị"          defaultValue={initial.unit}    onKeyDown={onKey} />
            </div>
            <input ref={r.def}     style={{ ...IS, marginBottom: 8 }}  placeholder="Mô tả định nghĩa hành vi" defaultValue={initial.def}     onKeyDown={onKey} />
            <input ref={r.example} style={{ ...IS, marginBottom: 12 }} placeholder="Ví dụ quan sát được"      defaultValue={initial.example} onKeyDown={onKey} />

            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleSave} style={Bgreen}><Check size={14} /> Lưu hành vi</button>
                <button onClick={onCancel}   style={Bghost}><X     size={14} /> Hủy</button>
            </div>
        </div>
    );
}

/* ─── Main Component ─── */
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
                        onClick={() => { setShowAdd(s => !s); setEditIdx(-1); }}
                        style={{ ...B0, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", fontSize: 13 }}
                    >
                        <Plus size={15} /> Thêm hành vi
                    </button>
                    <button
                        onClick={handleReset}
                        style={{ ...B0, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", fontSize: 12 }}
                    >
                        <RotateCcw size={13} /> Reset mẫu
                    </button>
                </div>
            </div>

            {/* Add Form – key cố định, chỉ unmount khi showAdd = false */}
            {showAdd && (
                <BehaviorForm
                    key="form-add"
                    initial={INIT}
                    title="➕ Thêm hành vi mới"
                    borderColor={COLORS.primary}
                    titleColor={COLORS.primary}
                    onSave={handleAdd}
                    onCancel={() => setShowAdd(false)}
                />
            )}

            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {behaviors.map((b, i) => (
                    <div
                        key={`bv-${i}`}
                        style={{
                            background: "#fff", borderRadius: 12, overflow: "hidden",
                            border: editIdx === i ? `2px solid ${COLORS.green}` : `1px solid ${COLORS.border}`,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                    >
                        {editIdx === i ? (
                            /* Edit form inline – đặt CHÚ Ý key phải ổn định */
                            <div style={{ padding: "12px 16px" }}>
                                <BehaviorForm
                                    key={`form-edit-${i}`}
                                    initial={{ ...b }}
                                    title={`✏️ Chỉnh sửa: ${b.name}`}
                                    borderColor={COLORS.green}
                                    titleColor={COLORS.green}
                                    onSave={handleSaveEdit}
                                    onCancel={() => setEditIdx(-1)}
                                />
                            </div>
                        ) : (
                            <>
                                {/* Row */}
                                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10,
                                        background: COLORS.accent + "20",
                                        display: "flex", alignItems: "center", justifyContent: "center",
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
                                            style={{ ...Bghost, padding: "5px 9px" }} title="Chỉnh sửa"
                                        >
                                            <Edit3 size={13} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(i)}
                                            style={{ ...Bred, padding: "5px 9px" }} title="Xóa"
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
