import React from 'react';
import { COLORS } from '../constants.js';

export const TabBtn = ({ icon: Icon, label, active, onClick, badge }) => (
    <button onClick={onClick} style={{
        display: "flex", alignItems: "center", gap: 6, padding: "10px 14px",
        background: active ? COLORS.primary : "transparent",
        color: active ? "#fff" : COLORS.textMuted,
        border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13,
        fontWeight: active ? 700 : 500, transition: "all 0.2s", position: "relative",
        whiteSpace: "nowrap", fontFamily: "inherit",
    }}>
        <Icon size={17} />
        <span className="tab-label">{label}</span>
        {badge > 0 && <span style={{ position: "absolute", top: 2, right: 2, background: COLORS.red, color: "#fff", borderRadius: 99, fontSize: 10, padding: "1px 5px", fontWeight: 700 }}>{badge}</span>}
    </button>
);

export const StatCard = ({ icon: Icon, label, value, color, sub }) => (
    <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.border}`, flex: "1 1 140px", minWidth: 140 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} color={color} />
            </div>
            <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>{label}</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.text, letterSpacing: -1 }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{sub}</div>}
    </div>
);
