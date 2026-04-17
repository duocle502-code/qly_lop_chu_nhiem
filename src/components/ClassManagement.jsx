import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit3, Upload, X, Check, Users, School, FileText, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { COLORS } from '../constants.js';
import { parseStudentFile } from '../fileParser.js';

const inputStyle = { width: "100%", padding: "7px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" };
const btnPrimary = { padding: "6px 14px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };
const btnDanger = { ...btnPrimary, background: COLORS.red };
const btnGhost = { ...btnPrimary, background: "#f1f5f9", color: COLORS.textMuted };
const btnSuccess = { ...btnPrimary, background: COLORS.green };

export default function ClassManagement({ classes, setClasses, students, setStudents, studentMeta, setStudentMeta, setStarData, activeClass, setActiveClass }) {
    const [newClassName, setNewClassName] = useState("");
    const [editClassIdx, setEditClassIdx] = useState(-1);
    const [editClassName, setEditClassName] = useState("");
    const [uploadResult, setUploadResult] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [expandedClass, setExpandedClass] = useState(null);
    const fileRef = useRef(null);

    // Add new class
    const addClass = () => {
        const name = newClassName.trim();
        if (!name || classes.includes(name)) return;
        setClasses(prev => [...prev, name]);
        setNewClassName("");
    };

    // Delete class
    const deleteClass = (className) => {
        if (!confirm(`Xóa lớp "${className}" và tất cả học sinh thuộc lớp này?`)) return;
        setClasses(prev => prev.filter(c => c !== className));
        // Remove students belonging to this class
        const toRemove = Object.entries(studentMeta).filter(([_, m]) => m.className === className).map(([name]) => name);
        setStudents(prev => prev.filter(s => !toRemove.includes(s)));
        setStudentMeta(prev => {
            const n = { ...prev };
            toRemove.forEach(name => delete n[name]);
            return n;
        });
        setStarData(prev => {
            const n = { ...prev };
            toRemove.forEach(name => delete n[name]);
            return n;
        });
        if (activeClass === className) setActiveClass("all");
    };

    // Edit class name
    const saveEditClass = (oldName) => {
        const name = editClassName.trim();
        if (!name || (name !== oldName && classes.includes(name))) return;
        setClasses(prev => prev.map(c => c === oldName ? name : c));
        // Update studentMeta
        setStudentMeta(prev => {
            const n = { ...prev };
            Object.keys(n).forEach(s => { if (n[s].className === oldName) n[s] = { ...n[s], className: name }; });
            return n;
        });
        if (activeClass === oldName) setActiveClass(name);
        setEditClassIdx(-1);
    };

    // Upload file to import students
    const handleFileUpload = async (e, targetClass) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        setUploadResult(null);

        try {
            const parsed = await parseStudentFile(file);
            let added = 0;
            const newStudents = [];
            const newMeta = {};

            parsed.forEach(s => {
                const cls = s.className || targetClass || "Chưa phân lớp";
                if (!students.includes(s.name) && !newStudents.includes(s.name)) {
                    newStudents.push(s.name);
                    newMeta[s.name] = { birthYear: s.birthYear, className: cls };
                    added++;
                }
                // Add class if not exists
                if (cls && !classes.includes(cls)) {
                    setClasses(prev => prev.includes(cls) ? prev : [...prev, cls]);
                }
            });

            setStudents(prev => [...prev, ...newStudents]);
            setStudentMeta(prev => ({ ...prev, ...newMeta }));

            setUploadResult({
                type: "success",
                text: `✅ Đã nhập ${added} học sinh từ "${file.name}"${added < parsed.length ? ` (bỏ qua ${parsed.length - added} trùng tên)` : ''}`,
                details: parsed,
            });
        } catch (err) {
            setUploadResult({ type: "error", text: `❌ ${err.message || err}` });
        }

        setIsUploading(false);
        e.target.value = "";
        setTimeout(() => setUploadResult(null), 8000);
    };

    // Students in a class
    const getStudentsInClass = (className) => {
        return students.filter(s => (studentMeta[s]?.className || "Chưa phân lớp") === className);
    };

    return (
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <School size={22} color={COLORS.primary} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, flex: 1 }}>Quản lý Lớp học</h3>
                <span style={{ fontSize: 12, color: COLORS.textMuted, background: "#f1f5f9", padding: "2px 10px", borderRadius: 99, fontWeight: 600 }}>{classes.length} lớp</span>
            </div>

            {/* Guide toggle */}
            <button onClick={() => setShowGuide(!showGuide)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, fontSize: 12, color: "#0369a1", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%", marginBottom: 14 }}>
                <FileText size={14} />
                📘 Hướng dẫn upload danh sách học sinh
                {showGuide ? <ChevronUp size={14} style={{ marginLeft: "auto" }} /> : <ChevronDown size={14} style={{ marginLeft: "auto" }} />}
            </button>

            {showGuide && (
                <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: 16, marginBottom: 14, fontSize: 12, lineHeight: 1.8, color: "#0c4a6e" }}>
                    <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8, color: COLORS.primary }}>📋 Hướng dẫn chuẩn bị file danh sách học sinh</div>

                    <div style={{ fontWeight: 700, marginBottom: 4 }}>📌 Format file được hỗ trợ:</div>
                    <div style={{ paddingLeft: 12, marginBottom: 8 }}>
                        • <strong>Excel (.xlsx)</strong> — ⭐ Khuyên dùng, chính xác nhất<br />
                        • <strong>Word (.docx)</strong> — Cần có bảng (table), không dùng text thường<br />
                        • <strong>PDF (.pdf)</strong> — Hỗ trợ cơ bản, nên dùng Excel nếu có thể
                    </div>

                    <div style={{ fontWeight: 700, marginBottom: 4 }}>📌 Cấu trúc file yêu cầu 4 cột:</div>
                    <div style={{ overflowX: "auto", marginBottom: 8 }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                            <thead>
                                <tr style={{ background: COLORS.primary, color: "#fff" }}>
                                    <th style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700 }}>STT</th>
                                    <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 700 }}>HỌ VÀ TÊN</th>
                                    <th style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700 }}>NĂM SINH</th>
                                    <th style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700 }}>LỚP</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ background: "#e0f2fe" }}>
                                    <td style={{ padding: "6px 10px", textAlign: "center" }}>1</td>
                                    <td style={{ padding: "6px 10px" }}>Nguyễn Văn An</td>
                                    <td style={{ padding: "6px 10px", textAlign: "center" }}>2009</td>
                                    <td style={{ padding: "6px 10px", textAlign: "center" }}>10A1</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "6px 10px", textAlign: "center" }}>2</td>
                                    <td style={{ padding: "6px 10px" }}>Trần Thị Bình</td>
                                    <td style={{ padding: "6px 10px", textAlign: "center" }}>2009</td>
                                    <td style={{ padding: "6px 10px", textAlign: "center" }}>10A1</td>
                                </tr>
                                <tr style={{ background: "#e0f2fe" }}>
                                    <td style={{ padding: "6px 10px", textAlign: "center" }}>3</td>
                                    <td style={{ padding: "6px 10px" }}>Lê Hoàng Cường</td>
                                    <td style={{ padding: "6px 10px", textAlign: "center" }}>2008</td>
                                    <td style={{ padding: "6px 10px", textAlign: "center" }}>10A2</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style={{ fontWeight: 700, marginBottom: 4 }}>📌 Lưu ý quan trọng:</div>
                    <div style={{ paddingLeft: 12 }}>
                        • Dòng đầu tiên phải là <strong>tiêu đề cột</strong> (STT, Họ tên, Năm sinh, Lớp)<br />
                        • Tên cột có thể viết tắt: "TT", "Tên", "NS", "Lớp"<br />
                        • Cột <strong>HỌ VÀ TÊN</strong> là <u>bắt buộc</u>, các cột khác không bắt buộc<br />
                        • Nếu không có cột LỚP, học sinh sẽ được thêm vào lớp đang chọn<br />
                        • Học sinh trùng tên sẽ bị bỏ qua (không nhập đè)
                    </div>
                </div>
            )}

            {/* Add class */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <input value={newClassName} onChange={e => setNewClassName(e.target.value)} onKeyDown={e => e.key === "Enter" && addClass()} placeholder="Nhập tên lớp mới (VD: 10A1, 10A2...)" style={{ ...inputStyle, flex: 1 }} />
                <button onClick={addClass} style={btnPrimary}><Plus size={14} /> Thêm lớp</button>
            </div>

            {/* Upload result */}
            {uploadResult && (
                <div style={{ padding: "10px 14px", borderRadius: 10, marginBottom: 12, background: uploadResult.type === "success" ? "#dcfce7" : "#fef2f2", border: `1px solid ${uploadResult.type === "success" ? "#86efac" : "#fecaca"}`, fontSize: 13, fontWeight: 600, color: uploadResult.type === "success" ? "#166534" : "#991b1b" }}>
                    {uploadResult.text}
                </div>
            )}

            {/* Class list */}
            {classes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px 20px", color: COLORS.textMuted }}>
                    <School size={40} color="#cbd5e1" style={{ marginBottom: 10 }} />
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Chưa có lớp học nào</div>
                    <div style={{ fontSize: 12 }}>Thêm lớp mới hoặc upload file danh sách để bắt đầu</div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {classes.map((cls, i) => {
                        const classStudents = getStudentsInClass(cls);
                        const isExpanded = expandedClass === cls;

                        return (
                            <div key={cls} style={{ background: "#f8fafc", borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
                                {/* Class header */}
                                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px" }}>
                                    {editClassIdx === i ? (
                                        <>
                                            <input value={editClassName} onChange={e => setEditClassName(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEditClass(cls)} style={{ ...inputStyle, flex: 1 }} autoFocus />
                                            <button onClick={() => saveEditClass(cls)} style={{ ...btnSuccess, padding: "4px 8px" }}><Check size={14} /></button>
                                            <button onClick={() => setEditClassIdx(-1)} style={{ ...btnGhost, padding: "4px 8px" }}><X size={14} /></button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setExpandedClass(isExpanded ? null : cls)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                                {isExpanded ? <ChevronUp size={16} color={COLORS.textMuted} /> : <ChevronDown size={16} color={COLORS.textMuted} />}
                                            </button>
                                            <School size={16} color={COLORS.primary} />
                                            <div style={{ flex: 1 }}>
                                                <span style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{cls}</span>
                                                <span style={{ fontSize: 12, color: COLORS.textMuted, marginLeft: 8 }}>({classStudents.length} học sinh)</span>
                                            </div>

                                            {/* Upload button for this class */}
                                            <input type="file" accept=".xlsx,.xls,.docx,.doc,.pdf" onChange={e => handleFileUpload(e, cls)} style={{ display: "none" }} id={`file-${i}`} />
                                            <label htmlFor={`file-${i}`} style={{ ...btnPrimary, padding: "5px 10px", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                                                <Upload size={13} /> Upload
                                            </label>
                                            <button onClick={() => { setEditClassIdx(i); setEditClassName(cls); }} style={{ ...btnGhost, padding: "4px 8px" }}><Edit3 size={13} /></button>
                                            <button onClick={() => deleteClass(cls)} style={{ ...btnDanger, padding: "4px 8px" }}><Trash2 size={13} /></button>
                                        </>
                                    )}
                                </div>

                                {/* Expanded: show students */}
                                {isExpanded && (
                                    <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "10px 14px" }}>
                                        {classStudents.length === 0 ? (
                                            <div style={{ fontSize: 12, color: COLORS.textMuted, fontStyle: "italic", padding: 8 }}>
                                                Chưa có học sinh. Nhấn <strong>Upload</strong> để thêm từ file.
                                            </div>
                                        ) : (
                                            <div style={{ maxHeight: 250, overflowY: "auto" }}>
                                                <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 70px", padding: "6px 8px", fontWeight: 700, fontSize: 11, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>
                                                    <div>STT</div><div>Họ và Tên</div><div style={{ textAlign: "center" }}>Năm sinh</div>
                                                </div>
                                                {classStudents.map((name, j) => {
                                                    const meta = studentMeta[name] || {};
                                                    return (
                                                        <div key={name} style={{ display: "grid", gridTemplateColumns: "36px 1fr 70px", padding: "6px 8px", fontSize: 12, borderBottom: `1px solid ${COLORS.border}`, background: j % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                                            <div style={{ color: COLORS.textMuted }}>{j + 1}</div>
                                                            <div style={{ fontWeight: 600 }}>{name}</div>
                                                            <div style={{ textAlign: "center", color: COLORS.textMuted }}>{meta.birthYear || '—'}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Global upload */}
            <div style={{ marginTop: 14, padding: "14px 16px", background: "#fffbeb", borderRadius: 10, border: "1px solid #fde68a" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <AlertCircle size={16} color="#d97706" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#92400e" }}>Upload nhanh — Thêm học sinh từ file</span>
                </div>
                <div style={{ fontSize: 11, color: "#78716c", marginBottom: 8 }}>
                    Upload file có cột <strong>LỚP</strong> → tự động phân lớp. Không có cột LỚP → thêm vào "Chưa phân lớp".
                </div>
                <input type="file" ref={fileRef} accept=".xlsx,.xls,.docx,.doc,.pdf" onChange={e => handleFileUpload(e, null)} style={{ display: "none" }} />
                <button onClick={() => fileRef.current?.click()} disabled={isUploading} style={{ ...btnPrimary, background: "#d97706", display: "flex", alignItems: "center", gap: 6, opacity: isUploading ? 0.6 : 1 }}>
                    <Upload size={14} /> {isUploading ? "Đang xử lý..." : "Chọn file (.xlsx, .docx, .pdf)"}
                </button>
            </div>
        </div>
    );
}
