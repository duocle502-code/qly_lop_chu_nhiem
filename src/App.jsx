import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Star, TrendingUp, Award, Users, Gift, BarChart3, BookOpen, AlertTriangle, Upload, Download, Settings } from "lucide-react";
import { COLORS, DEFAULT_STUDENTS, DEFAULT_BEHAVIORS, DEFAULT_REWARDS, DEFAULT_LEVELS, DEFAULT_TIERS } from "./constants.js";
import { generateSampleData, getTier, getLevel, loadData, saveData, getDaysInMonth } from "./utils.js";
import { importExcel, exportExcel } from "./excelHelper.js";
import { TabBtn } from "./components/CommonUI.jsx";
import { VisitCounter } from "./components/VisitCounter.jsx";
import DashboardTab from "./components/DashboardTab.jsx";
import DailyTab from "./components/DailyTab.jsx";
import RankingTab from "./components/RankingTab.jsx";
import BehaviorTab from "./components/BehaviorTab.jsx";
import InterventionTab from "./components/InterventionTab.jsx";
import RewardTab from "./components/RewardTab.jsx";
import SettingsTab from "./components/SettingsTab.jsx";

export default function PBISApp() {
    const [tab, setTab] = useState(0);
    const [students, setStudents] = useState(DEFAULT_STUDENTS);
    const [starData, setStarData] = useState({});
    const [exchanges, setExchanges] = useState([]);
    const [interventions, setInterventions] = useState([]);
    const [behaviors, setBehaviors] = useState([...DEFAULT_BEHAVIORS]);
    const [rewards, setRewards] = useState([...DEFAULT_REWARDS]);
    const [levels, setLevels] = useState([...DEFAULT_LEVELS]);
    const [tiers, setTiers] = useState([...DEFAULT_TIERS]);
    const [classes, setClasses] = useState(["10A1"]);
    const [studentMeta, setStudentMeta] = useState({});
    const [activeClass, setActiveClass] = useState("all");
    const [loaded, setLoaded] = useState(false);
    const now = new Date();
    const [selectedDay, setSelectedDay] = useState(now.getDate());
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [searchTerm, setSearchTerm] = useState("");
    const [importMsg, setImportMsg] = useState(null);
    const fileInputRef = useRef(null);

    // Load data on mount
    useEffect(() => {
        const sd = loadData("pbis-stars", null);
        const ex = loadData("pbis-exchanges", []);
        const iv = loadData("pbis-interventions", []);
        const st = loadData("pbis-students", null);
        const bh = loadData("pbis-behaviors", null);
        const rw = loadData("pbis-rewards", null);
        const lv = loadData("pbis-levels", null);
        const tr = loadData("pbis-tiers", null);
        const cl = loadData("pbis-classes", null);
        const sm = loadData("pbis-studentmeta", null);
        const ac = loadData("pbis-activeclass", null);
        setStarData(sd || generateSampleData());
        setExchanges(ex);
        setInterventions(iv);
        if (st) setStudents(st);
        if (bh) setBehaviors(bh);
        if (rw) setRewards(rw);
        if (lv) setLevels(lv);
        if (tr) setTiers(tr);
        if (cl) setClasses(cl);
        if (sm) setStudentMeta(sm);
        if (ac) setActiveClass(ac);
        setLoaded(true);
    }, []);

    // Auto-save all state
    useEffect(() => {
        if (!loaded) return;
        saveData("pbis-stars", starData);
        saveData("pbis-exchanges", exchanges);
        saveData("pbis-interventions", interventions);
        saveData("pbis-students", students);
        saveData("pbis-behaviors", behaviors);
        saveData("pbis-rewards", rewards);
        saveData("pbis-levels", levels);
        saveData("pbis-tiers", tiers);
        saveData("pbis-classes", classes);
        saveData("pbis-studentmeta", studentMeta);
        saveData("pbis-activeclass", activeClass);
    }, [starData, exchanges, interventions, students, behaviors, rewards, levels, tiers, classes, studentMeta, activeClass, loaded]);

    // Computed stats using custom levels & tiers
    const summaryData = useMemo(() => {
        return students.map((name) => {
            const days = starData[name] || {};
            const total = Object.values(days).reduce((s, v) => s + (v || 0), 0);
            const activeDays = Object.values(days).filter(v => v !== undefined && v !== null).length || 1;
            const avg = total / Math.max(activeDays, 1);
            const daysAbove5 = Object.values(days).filter(v => v >= 5).length;
            const exchanged = exchanges.filter(e => e.student === name).reduce((s, e) => s + e.cost, 0);
            const tier = getTier(avg, tiers);
            const level = getLevel(total, levels);
            return { name, total, avg, daysAbove5, tier, level, remaining: total - exchanged, exchanged };
        }).sort((a, b) => b.total - a.total);
    }, [students, starData, exchanges, levels, tiers]);

    const tierCounts = useMemo(() => {
        const c = {};
        tiers.forEach(t => c[t.name] = 0);
        summaryData.forEach(s => { if (c[s.tier.name] !== undefined) c[s.tier.name]++; });
        return c;
    }, [summaryData, tiers]);

    // Find the "worst" tier for badge count
    const worstTier = useMemo(() => {
        const sorted = [...tiers].sort((a, b) => a.minAvg - b.minAvg);
        return sorted[0]?.name || "Tầng 3";
    }, [tiers]);
    const worstTierCount = tierCounts[worstTier] || 0;

    const updateStar = useCallback((name, day, value) => {
        setStarData(prev => ({
            ...prev,
            [name]: { ...(prev[name] || {}), [day]: Math.max(0, Math.min(10, value)) }
        }));
    }, []);

    // Excel Import
    const handleImport = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const result = await importExcel(file);
            if (result.students.length > 0) {
                setStudents(result.students);
                setStarData(prev => ({ ...prev, ...result.starData }));
                setImportMsg({ type: "success", text: `✅ Đã nhập ${result.students.length} học sinh từ "${file.name}"` });
            } else {
                setImportMsg({ type: "error", text: "⚠️ Không tìm thấy học sinh trong file" });
            }
        } catch (err) {
            setImportMsg({ type: "error", text: `❌ ${err}` });
        }
        e.target.value = "";
        setTimeout(() => setImportMsg(null), 5000);
    };

    const handleExport = () => {
        const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
        exportExcel(students, starData, exchanges, daysInMonth, `T${selectedMonth}_${selectedYear}`);
    };

    if (!loaded) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: COLORS.bg }}>
            <div style={{ textAlign: "center" }}>
                <div style={{ width: 48, height: 48, border: `4px solid ${COLORS.primary}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                <div style={{ color: COLORS.textMuted, fontSize: 14 }}>Đang tải hệ thống PBIS...</div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const tabList = [
        { icon: BarChart3, label: "Tổng quan" },
        { icon: Star, label: "Ngôi sao" },
        { icon: TrendingUp, label: "Xếp hạng" },
        { icon: BookOpen, label: "Hành vi" },
        { icon: AlertTriangle, label: "Can thiệp", badge: worstTierCount },
        { icon: Gift, label: "Phần thưởng" },
        { icon: Settings, label: "Cài đặt" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
            <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .tab-label { display: inline; }
        @media (max-width: 700px) {
          .tab-label { display: none !important; }
          .header-actions { gap: 4px !important; }
          .header-actions button { padding: 6px 8px !important; font-size: 11px !important; }
        }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, #1a2d4a 100%)`, padding: "16px 20px 12px", color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontSize: 28 }}>⭐</div>
                        <div>
                            <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>Hệ thống PBIS</h1>
                            <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 500 }}>{activeClass === "all" ? classes.join(", ") : activeClass} — Tháng {selectedMonth}/{selectedYear}</div>
                        </div>
                    </div>
                    <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input type="file" ref={fileInputRef} accept=".xlsx,.xls" onChange={handleImport} style={{ display: "none" }} />
                        <button onClick={() => fileInputRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                            <Upload size={14} /> Import
                        </button>
                        <button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                            <Download size={14} /> Export
                        </button>
                    </div>
                </div>
            </div>

            {importMsg && (
                <div style={{ padding: "8px 20px", background: importMsg.type === "success" ? "#dcfce7" : "#fef2f2", fontSize: 13, fontWeight: 600, color: importMsg.type === "success" ? "#166534" : "#991b1b", textAlign: "center" }}>
                    {importMsg.text}
                </div>
            )}

            {/* Navigation */}
            <div style={{ background: "#fff", borderBottom: `1px solid ${COLORS.border}`, padding: "8px 12px", display: "flex", gap: 4, overflowX: "auto" }}>
                {tabList.map((t, i) => <TabBtn key={i} {...t} active={tab === i} onClick={() => setTab(i)} />)}
            </div>

            {/* Content */}
            <div style={{ padding: "16px 16px 24px", maxWidth: 1100, margin: "0 auto" }}>
                {tab === 0 && <DashboardTab summaryData={summaryData} tierCounts={tierCounts} starData={starData} students={students} />}
                {tab === 1 && <DailyTab students={students} starData={starData} updateStar={updateStar} selectedDay={selectedDay} setSelectedDay={setSelectedDay} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedYear={selectedYear} setSelectedYear={setSelectedYear} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
                {tab === 2 && <RankingTab summaryData={summaryData} />}
                {tab === 3 && <BehaviorTab behaviors={behaviors} setBehaviors={setBehaviors} />}
                {tab === 4 && <InterventionTab summaryData={summaryData} interventions={interventions} setInterventions={setInterventions} tiers={tiers} />}
                {tab === 5 && <RewardTab summaryData={summaryData} exchanges={exchanges} setExchanges={setExchanges} rewards={rewards} />}
                {tab === 6 && <SettingsTab students={students} setStudents={setStudents} setStarData={setStarData} behaviors={behaviors} setBehaviors={setBehaviors} rewards={rewards} setRewards={setRewards} levels={levels} setLevels={setLevels} tiers={tiers} setTiers={setTiers} classes={classes} setClasses={setClasses} studentMeta={studentMeta} setStudentMeta={setStudentMeta} activeClass={activeClass} setActiveClass={setActiveClass} />}
            </div>

            {/* Footer */}
            <div style={{ borderTop: `1px solid ${COLORS.border}`, background: "#fff", paddingBottom: 8 }}>
                <VisitCounter />
                <div style={{ textAlign: "center", fontSize: 11, color: COLORS.textMuted, padding: "4px 16px 12px" }}>
                    © {new Date().getFullYear()} PBIS Tracker · Hệ thống theo dõi hành vi tích cực
                </div>
            </div>
        </div>
    );
}
