import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit3, RotateCcw, CheckSquare, X, Check } from 'lucide-react';
import { COLORS, DEFAULT_STUDENTS, DEFAULT_BEHAVIORS, DEFAULT_REWARDS, DEFAULT_LEVELS, DEFAULT_TIERS } from '../constants.js';
import ClassManagement from './ClassManagement.jsx';

const inputStyle = { width: "100%", padding: "7px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" };
const btnPrimary = { padding: "6px 14px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };
const btnDanger = { ...btnPrimary, background: COLORS.red };
const btnGhost = { ...btnPrimary, background: "#f1f5f9", color: COLORS.textMuted };
const btnSuccess = { ...btnPrimary, background: COLORS.green };

function SectionHeader({ title, emoji, count }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>{emoji}</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, flex: 1 }}>{title}</h3>
            <span style={{ fontSize: 12, color: COLORS.textMuted, background: "#f1f5f9", padding: "2px 10px", borderRadius: 99, fontWeight: 600 }}>{count} mục</span>
        </div>
    );
}

// ═══ STUDENT MANAGEMENT ═══
function StudentSection({ students, setStudents, setStarData }) {
    const [newName, setNewName] = useState("");
    const [editIdx, setEditIdx] = useState(-1);
    const [editName, setEditName] = useState("");
    const [selected, setSelected] = useState(new Set());

    const addStudent = () => {
        const name = newName.trim();
        if (!name || students.includes(name)) return;
        setStudents(prev => [...prev, name]);
        setNewName("");
    };

    const deleteStudent = (name) => {
        setStudents(prev => prev.filter(s => s !== name));
        setStarData(prev => { const n = { ...prev }; delete n[name]; return n; });
    };

    const saveEdit = (oldName) => {
        const name = editName.trim();
        if (!name || (name !== oldName && students.includes(name))) return;
        setStudents(prev => prev.map(s => s === oldName ? name : s));
        if (name !== oldName) {
            setStarData(prev => {
                const n = { ...prev };
                n[name] = n[oldName] || {};
                delete n[oldName];
                return n;
            });
        }
        setEditIdx(-1);
    };

    const toggleAll = () => {
        if (selected.size === students.length) setSelected(new Set());
        else setSelected(new Set(students));
    };

    const deleteSelected = () => {
        if (selected.size === 0) return;
        if (!confirm(`Xóa ${selected.size} học sinh đã chọn?`)) return;
        setStudents(prev => prev.filter(s => !selected.has(s)));
        setStarData(prev => {
            const n = { ...prev };
            selected.forEach(s => delete n[s]);
            return n;
        });
        setSelected(new Set());
    };

    const resetStudents = () => {
        if (!confirm("Reset về danh sách mẫu 40 học sinh? Dữ liệu sao hiện tại sẽ bị xóa!")) return;
        setStudents([...DEFAULT_STUDENTS]);
        setStarData({});
    };

    return (
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
            <SectionHeader title="Quản lý Học sinh" emoji="👨‍🎓" count={students.length} />

            {/* Add */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && addStudent()} placeholder="Nhập tên học sinh mới..." style={{ ...inputStyle, flex: 1 }} />
                <button onClick={addStudent} style={btnPrimary}><Plus size={14} /> Thêm</button>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                <button onClick={toggleAll} style={btnGhost}><CheckSquare size={13} /> {selected.size === students.length ? "Bỏ chọn" : "Chọn tất cả"}</button>
                {selected.size > 0 && <button onClick={deleteSelected} style={btnDanger}><Trash2 size={13} /> Xóa {selected.size} đã chọn</button>}
                <button onClick={resetStudents} style={{ ...btnGhost, marginLeft: "auto" }}><RotateCcw size={13} /> Reset mẫu</button>
            </div>

            {/* List */}
            <div style={{ maxHeight: 300, overflowY: "auto", border: `1px solid ${COLORS.border}`, borderRadius: 10 }}>
                {students.map((name, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                        <input type="checkbox" checked={selected.has(name)} onChange={() => { const n = new Set(selected); n.has(name) ? n.delete(name) : n.add(name); setSelected(n); }} />
                        <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600, width: 28 }}>{i + 1}</span>
                        {editIdx === i ? (
                            <>
                                <input value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEdit(name)} style={{ ...inputStyle, flex: 1 }} autoFocus />
                                <button onClick={() => saveEdit(name)} style={{ ...btnSuccess, padding: "4px 8px" }}><Check size={14} /></button>
                                <button onClick={() => setEditIdx(-1)} style={{ ...btnGhost, padding: "4px 8px" }}><X size={14} /></button>
                            </>
                        ) : (
                            <>
                                <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{name}</span>
                                <button onClick={() => { setEditIdx(i); setEditName(name); }} style={{ ...btnGhost, padding: "4px 8px" }}><Edit3 size={13} /></button>
                                <button onClick={() => deleteStudent(name)} style={{ ...btnDanger, padding: "4px 8px" }}><Trash2 size={13} /></button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ═══ BEHAVIOR MANAGEMENT ═══

// BehaviorFormFields phải định nghĩa NGOÀI BehaviorSection
// để tránh bị re-define mỗi khi BehaviorSection re-render → gây mất focus sau 1 ký tự
function BehaviorFormFields({ initial, onSave, onCancel }) {
    const rCode    = useRef(null);
    const rName    = useRef(null);
    const rStars   = useRef(null);
    const rUnit    = useRef(null);
    const rDef     = useRef(null);
    const rExample = useRef(null);

    const collect = () => ({
        code:    rCode.current?.value.trim()    || "",
        name:    rName.current?.value.trim()    || "",
        stars:   Number(rStars.current?.value)  || 1,
        unit:    rUnit.current?.value.trim()    || "lần",
        def:     rDef.current?.value.trim()     || "",
        example: rExample.current?.value.trim() || "",
    });

    const handleSave = () => {
        const d = collect();
        if (!d.name) { rName.current?.focus(); return; }
        onSave(d);
    };

    const onKey = (e) => {
        if (e.key === "Enter")  handleSave();
        if (e.key === "Escape") onCancel();
    };

    return (
        <div style={{ background: "#f8fafc", borderRadius: 10, padding: 14, marginBottom: 10, border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 60px 70px", gap: 8, marginBottom: 8 }}>
                <input ref={rCode}  defaultValue={initial.code}    placeholder="Mã"           style={inputStyle} onKeyDown={onKey} />
                <input ref={rName}  defaultValue={initial.name}    placeholder="Tên hành vi *" style={inputStyle} onKeyDown={onKey} autoFocus />
                <input ref={rStars} defaultValue={initial.stars}   placeholder="⭐" type="number" min="1" max="10" style={inputStyle} onKeyDown={onKey} />
                <input ref={rUnit}  defaultValue={initial.unit}    placeholder="Đơn vị"       style={inputStyle} onKeyDown={onKey} />
            </div>
            <input ref={rDef}     defaultValue={initial.def}     placeholder="Mô tả"           style={{ ...inputStyle, marginBottom: 8 }} onKeyDown={onKey} />
            <input ref={rExample} defaultValue={initial.example} placeholder="Ví dụ quan sát" style={{ ...inputStyle, marginBottom: 8 }} onKeyDown={onKey} />
            <div style={{ display: "flex", gap: 6 }}>
                <button onClick={handleSave} style={btnSuccess}><Check size={13} /> Lưu</button>
                <button onClick={onCancel}   style={btnGhost}  ><X     size={13} /> Hủy</button>
            </div>
        </div>
    );
}

const BEHAVIOR_INIT = { code: "", name: "", def: "", example: "", stars: 1, unit: "lần" };

function BehaviorSection({ behaviors, setBehaviors }) {
    const [showAdd, setShowAdd] = useState(false);
    const [editIdx, setEditIdx] = useState(-1);
    const [editInit, setEditInit] = useState(BEHAVIOR_INIT);

    const handleAdd = (data) => {
        const code = data.code || `HV${String(behaviors.length + 1).padStart(2, "0")}`;
        setBehaviors(prev => [...prev, { ...data, code }]);
        setShowAdd(false);
    };

    const handleSaveEdit = (data) => {
        setBehaviors(prev => prev.map((b, i) => i === editIdx ? { ...b, ...data } : b));
        setEditIdx(-1);
    };

    const deleteBehavior = (idx) => setBehaviors(prev => prev.filter((_, i) => i !== idx));
    const resetBehaviors = () => { if (confirm("Reset về 8 hành vi mẫu?")) setBehaviors([...DEFAULT_BEHAVIORS]); };

    return (
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
            <SectionHeader title="Quản lý Hành vi" emoji="📋" count={behaviors.length} />
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                <button onClick={() => { setShowAdd(true); setEditIdx(-1); }} style={btnPrimary}><Plus size={14} /> Thêm</button>
                <button onClick={resetBehaviors} style={{ ...btnGhost, marginLeft: "auto" }}><RotateCcw size={13} /> Reset mẫu</button>
            </div>
            {showAdd && (
                <BehaviorFormFields
                    key="add"
                    initial={BEHAVIOR_INIT}
                    onSave={handleAdd}
                    onCancel={() => setShowAdd(false)}
                />
            )}
            {behaviors.map((b, i) => (
                <div key={i}>
                    {editIdx === i ? (
                        <BehaviorFormFields
                            key={`edit-${i}`}
                            initial={editInit}
                            onSave={handleSaveEdit}
                            onCancel={() => setEditIdx(-1)}
                        />
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: COLORS.accent + "20", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: COLORS.accent, flexShrink: 0 }}>{b.code?.slice(-2) || i + 1}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 13 }}>{b.name} <span style={{ color: COLORS.accent, fontSize: 12 }}>({b.stars}⭐/{b.unit})</span></div>
                                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{b.def}</div>
                            </div>
                            <button onClick={() => { setEditIdx(i); setEditInit({ ...b }); setShowAdd(false); }} style={{ ...btnGhost, padding: "4px 8px" }}><Edit3 size={13} /></button>
                            <button onClick={() => deleteBehavior(i)} style={{ ...btnDanger, padding: "4px 8px" }}><Trash2 size={13} /></button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ═══ REWARD MANAGEMENT ═══

// RewardFormFields phải định nghĩa NGOÀI RewardSection
// để tránh bị re-define mỗi khi RewardSection re-render → gây mất focus sau 1 ký tự
function RewardFormFields({ initial, onSave, onCancel }) {
    const rCode     = useRef(null);
    const rName     = useRef(null);
    const rCost     = useRef(null);
    const rDesc     = useRef(null);
    const rQuota    = useRef(null);
    const rDeadline = useRef(null);

    const collect = () => ({
        code:     rCode.current?.value.trim()     || "",
        name:     rName.current?.value.trim()     || "",
        cost:     Number(rCost.current?.value)    || 10,
        desc:     rDesc.current?.value.trim()     || "",
        quota:    rQuota.current?.value.trim()    || "",
        deadline: rDeadline.current?.value.trim() || "",
    });

    const handleSave = () => {
        const d = collect();
        if (!d.name) { rName.current?.focus(); return; }
        onSave(d);
    };

    const onKey = (e) => {
        if (e.key === "Enter")  handleSave();
        if (e.key === "Escape") onCancel();
    };

    return (
        <div style={{ background: "#fffbeb", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #fde68a" }}>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 80px", gap: 8, marginBottom: 8 }}>
                <input ref={rCode} defaultValue={initial.code}  placeholder="Mã"               style={inputStyle} onKeyDown={onKey} />
                <input ref={rName} defaultValue={initial.name}  placeholder="Tên phần thưởng *" style={inputStyle} onKeyDown={onKey} autoFocus />
                <input ref={rCost} defaultValue={initial.cost}  placeholder="Sao ⭐" type="number" min="1" style={inputStyle} onKeyDown={onKey} />
            </div>
            <input ref={rDesc}     defaultValue={initial.desc}     placeholder="Mô tả"                      style={{ ...inputStyle, marginBottom: 8 }} onKeyDown={onKey} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                <input ref={rQuota}    defaultValue={initial.quota}    placeholder="Số lượng (VD: 5 suất/tháng)" style={inputStyle} onKeyDown={onKey} />
                <input ref={rDeadline} defaultValue={initial.deadline} placeholder="Thời hạn"                    style={inputStyle} onKeyDown={onKey} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
                <button onClick={handleSave} style={btnSuccess}><Check size={13} /> Lưu</button>
                <button onClick={onCancel}   style={btnGhost}  ><X     size={13} /> Hủy</button>
            </div>
        </div>
    );
}

const REWARD_INIT = { code: "", name: "", cost: 10, desc: "", quota: "", deadline: "" };

function RewardSection({ rewards, setRewards }) {
    const [showAdd,   setShowAdd]   = useState(false);
    const [editIdx,   setEditIdx]   = useState(-1);
    const [editInit,  setEditInit]  = useState(REWARD_INIT);

    const handleAdd = (data) => {
        const code = data.code || `PT${String(rewards.length + 1).padStart(2, "0")}`;
        setRewards(prev => [...prev, { ...data, code }]);
        setShowAdd(false);
    };

    const handleSaveEdit = (data) => {
        setRewards(prev => prev.map((r, i) => i === editIdx ? { ...r, ...data } : r));
        setEditIdx(-1);
    };

    const deleteReward = (idx) => setRewards(prev => prev.filter((_, i) => i !== idx));
    const resetRewards = () => { if (confirm("Reset về 6 phần thưởng mẫu?")) setRewards([...DEFAULT_REWARDS]); };

    return (
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
            <SectionHeader title="Quản lý Phần thưởng" emoji="🎁" count={rewards.length} />
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                <button onClick={() => { setShowAdd(true); setEditIdx(-1); }} style={btnPrimary}><Plus size={14} /> Thêm</button>
                <button onClick={resetRewards} style={{ ...btnGhost, marginLeft: "auto" }}><RotateCcw size={13} /> Reset mẫu</button>
            </div>
            {showAdd && (
                <RewardFormFields
                    key="add"
                    initial={REWARD_INIT}
                    onSave={handleAdd}
                    onCancel={() => setShowAdd(false)}
                />
            )}
            {rewards.map((r, i) => (
                <div key={i}>
                    {editIdx === i ? (
                        <RewardFormFields
                            key={`edit-${i}`}
                            initial={editInit}
                            onSave={handleSaveEdit}
                            onCancel={() => setEditIdx(-1)}
                        />
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                            <div style={{ background: COLORS.accent + "20", padding: "4px 10px", borderRadius: 99, fontWeight: 800, fontSize: 13, color: COLORS.accent, flexShrink: 0 }}>{r.cost}⭐</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</div>
                                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{r.desc}</div>
                            </div>
                            <button onClick={() => { setEditIdx(i); setEditInit({ ...r }); setShowAdd(false); }} style={{ ...btnGhost, padding: "4px 8px" }}><Edit3 size={13} /></button>
                            <button onClick={() => deleteReward(i)} style={{ ...btnDanger, padding: "4px 8px" }}><Trash2 size={13} /></button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ═══ LEVEL & TIER MANAGEMENT ═══
function LevelTierSection({ levels, setLevels, tiers, setTiers }) {
    const [lvForm, setLvForm] = useState({ minStars: 0, name: "", emoji: "", color: "#64748b" });
    const [trForm, setTrForm] = useState({ minAvg: 0, name: "", color: "#64748b", bg: "#f1f5f9", action: "" });
    const [showAddLv, setShowAddLv] = useState(false);
    const [showAddTr, setShowAddTr] = useState(false);
    const [editLvIdx, setEditLvIdx] = useState(-1);
    const [editTrIdx, setEditTrIdx] = useState(-1);

    // Level CRUD
    const addLevel = () => {
        if (!lvForm.name.trim()) return;
        setLevels(prev => [...prev, { ...lvForm, minStars: Number(lvForm.minStars) }].sort((a, b) => a.minStars - b.minStars));
        setLvForm({ minStars: 0, name: "", emoji: "", color: "#64748b" }); setShowAddLv(false);
    };
    const saveLvEdit = () => {
        if (!lvForm.name.trim()) return;
        setLevels(prev => prev.map((l, i) => i === editLvIdx ? { ...lvForm, minStars: Number(lvForm.minStars) } : l).sort((a, b) => a.minStars - b.minStars));
        setEditLvIdx(-1);
    };
    const deleteLv = (idx) => setLevels(prev => prev.filter((_, i) => i !== idx));
    const resetLevels = () => { if (confirm("Reset về 4 cấp bậc mẫu?")) setLevels([...DEFAULT_LEVELS]); };

    // Tier CRUD
    const addTier = () => {
        if (!trForm.name.trim()) return;
        setTiers(prev => [...prev, { ...trForm, minAvg: Number(trForm.minAvg) }].sort((a, b) => a.minAvg - b.minAvg));
        setTrForm({ minAvg: 0, name: "", color: "#64748b", bg: "#f1f5f9", action: "" }); setShowAddTr(false);
    };
    const saveTrEdit = () => {
        if (!trForm.name.trim()) return;
        setTiers(prev => prev.map((t, i) => i === editTrIdx ? { ...trForm, minAvg: Number(trForm.minAvg) } : t).sort((a, b) => a.minAvg - b.minAvg));
        setEditTrIdx(-1);
    };
    const deleteTr = (idx) => setTiers(prev => prev.filter((_, i) => i !== idx));
    const resetTiers = () => { if (confirm("Reset về 3 tầng mẫu?")) setTiers([...DEFAULT_TIERS]); };

    return (
        <>
            {/* Levels */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
                <SectionHeader title="Quản lý Cấp bậc (Level)" emoji="🏅" count={levels.length} />
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    <button onClick={() => { setShowAddLv(true); setEditLvIdx(-1); }} style={btnPrimary}><Plus size={14} /> Thêm</button>
                    <button onClick={resetLevels} style={{ ...btnGhost, marginLeft: "auto" }}><RotateCcw size={13} /> Reset mẫu</button>
                </div>

                {(showAddLv || editLvIdx >= 0) && (
                    <div style={{ background: "#f0f9ff", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #bae6fd" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 60px 80px", gap: 8, marginBottom: 8 }}>
                            <input type="number" min="0" value={lvForm.minStars} onChange={e => setLvForm(p => ({ ...p, minStars: e.target.value }))} placeholder="≥ sao" style={inputStyle} />
                            <input value={lvForm.name} onChange={e => setLvForm(p => ({ ...p, name: e.target.value }))} placeholder="Tên cấp bậc *" style={inputStyle} />
                            <input value={lvForm.emoji} onChange={e => setLvForm(p => ({ ...p, emoji: e.target.value }))} placeholder="Icon" style={inputStyle} />
                            <input type="color" value={lvForm.color} onChange={e => setLvForm(p => ({ ...p, color: e.target.value }))} style={{ ...inputStyle, padding: 2, height: 34 }} />
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={editLvIdx >= 0 ? saveLvEdit : addLevel} style={btnSuccess}><Check size={13} /> Lưu</button>
                            <button onClick={() => { setShowAddLv(false); setEditLvIdx(-1); }} style={btnGhost}><X size={13} /> Hủy</button>
                        </div>
                    </div>
                )}

                {[...levels].sort((a, b) => a.minStars - b.minStars).map((lv, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                        <span style={{ fontSize: 20 }}>{lv.emoji}</span>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: lv.color }}>{lv.name}</span>
                            <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>≥ {lv.minStars} sao</span>
                        </div>
                        <button onClick={() => { setEditLvIdx(i); setLvForm({ ...lv }); setShowAddLv(false); }} style={{ ...btnGhost, padding: "4px 8px" }}><Edit3 size={13} /></button>
                        <button onClick={() => deleteLv(i)} style={{ ...btnDanger, padding: "4px 8px" }}><Trash2 size={13} /></button>
                    </div>
                ))}
            </div>

            {/* Tiers */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
                <SectionHeader title="Quản lý Tầng (Tier)" emoji="📊" count={tiers.length} />
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    <button onClick={() => { setShowAddTr(true); setEditTrIdx(-1); }} style={btnPrimary}><Plus size={14} /> Thêm</button>
                    <button onClick={resetTiers} style={{ ...btnGhost, marginLeft: "auto" }}><RotateCcw size={13} /> Reset mẫu</button>
                </div>

                {(showAddTr || editTrIdx >= 0) && (
                    <div style={{ background: "#f0f9ff", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #bae6fd" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 80px 80px", gap: 8, marginBottom: 8 }}>
                            <input type="number" min="0" step="0.5" value={trForm.minAvg} onChange={e => setTrForm(p => ({ ...p, minAvg: e.target.value }))} placeholder="≥ TB" style={inputStyle} />
                            <input value={trForm.name} onChange={e => setTrForm(p => ({ ...p, name: e.target.value }))} placeholder="Tên tầng *" style={inputStyle} />
                            <input type="color" value={trForm.color} onChange={e => setTrForm(p => ({ ...p, color: e.target.value }))} style={{ ...inputStyle, padding: 2, height: 34 }} />
                            <input type="color" value={trForm.bg} onChange={e => setTrForm(p => ({ ...p, bg: e.target.value }))} style={{ ...inputStyle, padding: 2, height: 34 }} />
                        </div>
                        <input value={trForm.action} onChange={e => setTrForm(p => ({ ...p, action: e.target.value }))} placeholder="Hành động (VD: Khen thưởng)" style={{ ...inputStyle, marginBottom: 8 }} />
                        <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={editTrIdx >= 0 ? saveTrEdit : addTier} style={btnSuccess}><Check size={13} /> Lưu</button>
                            <button onClick={() => { setShowAddTr(false); setEditTrIdx(-1); }} style={btnGhost}><X size={13} /> Hủy</button>
                        </div>
                    </div>
                )}

                {[...tiers].sort((a, b) => a.minAvg - b.minAvg).map((t, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                        <div style={{ width: 12, height: 12, borderRadius: 99, background: t.color, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: t.color }}>{t.name}</span>
                            <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>TB ≥ {t.minAvg} → {t.action}</span>
                        </div>
                        <button onClick={() => { setEditTrIdx(i); setTrForm({ ...t }); setShowAddTr(false); }} style={{ ...btnGhost, padding: "4px 8px" }}><Edit3 size={13} /></button>
                        <button onClick={() => deleteTr(i)} style={{ ...btnDanger, padding: "4px 8px" }}><Trash2 size={13} /></button>
                    </div>
                ))}
            </div>
        </>
    );
}

// ═══ MAIN SETTINGS TAB ═══
export default function SettingsTab({ students, setStudents, setStarData, behaviors, setBehaviors, rewards, setRewards, levels, setLevels, tiers, setTiers, classes, setClasses, studentMeta, setStudentMeta, activeClass, setActiveClass }) {
    return (
        <div>
            <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #1a2d4a)`, borderRadius: 14, padding: "20px 24px", color: "#fff", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>⚙️ Cài đặt & Quản lý</h2>
                <p style={{ fontSize: 12, opacity: 0.8 }}>Quản lý lớp học, danh sách học sinh, hành vi, phần thưởng, cấp bậc và tầng</p>
            </div>
            <ClassManagement classes={classes} setClasses={setClasses} students={students} setStudents={setStudents} studentMeta={studentMeta} setStudentMeta={setStudentMeta} setStarData={setStarData} activeClass={activeClass} setActiveClass={setActiveClass} />
            <StudentSection students={students} setStudents={setStudents} setStarData={setStarData} />
            <BehaviorSection behaviors={behaviors} setBehaviors={setBehaviors} />
            <RewardSection rewards={rewards} setRewards={setRewards} />
            <LevelTierSection levels={levels} setLevels={setLevels} tiers={tiers} setTiers={setTiers} />
        </div>
    );
}
