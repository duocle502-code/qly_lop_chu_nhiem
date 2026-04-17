import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { COLORS } from '../constants.js';

export default function BehaviorTab({ behaviors }) {
    const [expanded, setExpanded] = useState(null);
    return (
        <div>
            <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #1a2d4a)`, borderRadius: 14, padding: "20px 24px", color: "#fff", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>📋 Danh mục Hành vi Mong đợi</h2>
                <p style={{ fontSize: 12, opacity: 0.8 }}>{behaviors.length} hành vi tích cực được ghi nhận và khen thưởng bằng ngôi sao</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {behaviors.map((b, i) => (
                    <div key={b.code || i} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: `1px solid ${COLORS.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <button onClick={() => setExpanded(expanded === i ? null : i)} style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
                            border: "none", background: "transparent", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                        }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.accent + "20", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: COLORS.accent, flexShrink: 0 }}>{(b.code || "").slice(-2) || i + 1}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{b.name}</div>
                                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{b.def}</div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                                <span style={{ fontWeight: 800, fontSize: 16, color: COLORS.accent }}>{b.stars}</span>
                                <span style={{ fontSize: 11, color: COLORS.textMuted }}>⭐/{b.unit}</span>
                            </div>
                            {expanded === i ? <ChevronUp size={16} color={COLORS.textMuted} /> : <ChevronDown size={16} color={COLORS.textMuted} />}
                        </button>
                        {expanded === i && b.example && (
                            <div style={{ padding: "0 18px 14px", borderTop: `1px solid ${COLORS.border}` }}>
                                <div style={{ padding: "12px 14px", background: "#f0fdf4", borderRadius: 8, marginTop: 10 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.green, marginBottom: 4 }}>VÍ DỤ QUAN SÁT:</div>
                                    <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5 }}>{b.example}</div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
