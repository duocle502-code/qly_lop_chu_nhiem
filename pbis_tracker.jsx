import { useState, useEffect, useCallback, useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, ResponsiveContainer, CartesianGrid } from "recharts";
import { Star, TrendingUp, Award, Users, Gift, BarChart3, BookOpen, AlertTriangle, ChevronDown, ChevronUp, Plus, Check, X, Search, Calendar, ArrowUpDown } from "lucide-react";

const COLORS = {
  primary: "#1e3a5f",
  primaryLight: "#2e5090",
  accent: "#f59e0b",
  green: "#16a34a",
  greenLight: "#bbf7d0",
  yellow: "#eab308",
  yellowLight: "#fef9c3",
  orange: "#ea580c",
  orangeLight: "#fed7aa",
  red: "#dc2626",
  redLight: "#fecaca",
  bg: "#f8fafc",
  card: "#ffffff",
  border: "#e2e8f0",
  text: "#1e293b",
  textMuted: "#64748b",
};

const BEHAVIORS = [
  { code: "HV01", name: "Tham gia Phát biểu", def: "Giơ tay và trả lời câu hỏi của giáo viên", example: 'Em giơ tay cao, nói rõ ràng: "Thưa thầy, em nghĩ đáp án là B vì..."', stars: 1, unit: "lần" },
  { code: "HV02", name: "Giúp đỡ Bạn bè", def: "Chủ động hỗ trợ bạn học bài, giải thích kiến thức", example: "Em A giải thích bài toán cho em B trong giờ tự học", stars: 2, unit: "lần" },
  { code: "HV03", name: "Hoàn thành Đúng hạn", def: "Nộp bài tập, đồ án đúng hoặc trước deadline", example: "Nộp bài tập Toán trước 7h sáng thứ 2", stars: 1, unit: "bài" },
  { code: "HV04", name: "Giữ gìn Vệ sinh", def: "Nhặt rác, lau bảng, sắp xếp bàn ghế", example: "Em C nhặt giấy vụn dưới sàn sau giờ ra chơi", stars: 2, unit: "lần" },
  { code: "HV05", name: "Đến lớp Đúng giờ", def: "Có mặt trước 7h00, đồng phục gọn gàng", example: "Em D đến lớp lúc 6h55, áo sơ mi là phẳng", stars: 1, unit: "ngày" },
  { code: "HV06", name: "Tôn trọng Ý kiến", def: "Lắng nghe bạn nói hết, không ngắt lời", example: '"Em đồng ý với ý kiến của bạn E, và em muốn bổ sung thêm..."', stars: 2, unit: "lần" },
  { code: "HV07", name: "Sáng tạo Giải pháp", def: "Đưa ra ý tưởng mới trong hoạt động nhóm", example: "Em F đề xuất dùng Canva để làm poster thay vì vẽ tay", stars: 3, unit: "lần" },
  { code: "HV08", name: "Tự học Chủ động", def: "Tự tìm tài liệu, hỏi thêm GV ngoài giờ", example: "Em G hỏi thầy về bài toán Olympic sau giờ tan trường", stars: 3, unit: "lần" },
];

const REWARDS = [
  { code: "PT01", name: "Chọn chỗ ngồi 1 tuần", cost: 10, desc: "Được chọn vị trí ngồi yêu thích trong 1 tuần", quota: "Không giới hạn", deadline: "Đổi trước thứ 6" },
  { code: "PT02", name: "Miễn 1 bài tập về nhà", cost: 20, desc: "Miễn làm 1 bài tập bất kỳ (trừ kiểm tra)", quota: "5 suất/tháng", deadline: "Thông báo trước 1 ngày" },
  { code: "PT03", name: "Ăn trưa cùng GVCN", cost: 50, desc: "Ăn trưa và trò chuyện với thầy/cô", quota: "2 suất/tháng", deadline: "Đặt trước 3 ngày" },
  { code: "PT04", name: 'Thẻ "Ra khỏi lớp 5 phút"', cost: 30, desc: "Ra khỏi lớp 5 phút khi căng thẳng", quota: "10 suất/tháng", deadline: "Sử dụng ngay" },
  { code: "PT05", name: "Voucher nhà sách 50k", cost: 100, desc: "Phiếu mua sách tại Fahasa", quota: "3 suất/tháng", deadline: "Hết tháng hết hạn" },
  { code: "PT06", name: "Dẫn hoạt động lớp", cost: 80, desc: "Làm MC buổi sinh hoạt lớp", quota: "1 suất/tháng", deadline: "Đăng ký trước 1 tuần" },
];

const DEFAULT_STUDENTS = [
  "Lê Văn C", "Nguyễn Văn A", "Trần Minh D", "Phạm Thị E", "Hoàng Văn F",
  "Đỗ Thị G", "Vũ Văn H", "Bùi Thị I", "Ngô Văn K", "Đặng Thị L",
  "Lý Văn M", "Phan Thị N", "Đinh Văn O", "Hồ Thị P", "Trần Thị B",
  "Mai Văn Q", "Dương Thị R", "Tô Văn S", "Châu Thị T", "Lâm Văn U",
  "Cao Thị V", "Trịnh Văn W", "Từ Thị X", "Huỳnh Văn Y", "Võ Thị Z",
  "Nguyễn Minh AA", "Trần Văn AB", "Lê Thị AC", "Phạm Văn AD", "Hoàng Thị AE",
  "Đỗ Văn AF", "Vũ Thị AG", "Bùi Văn AH", "Ngô Thị AI", "Phạm Văn D",
  "Đặng Văn AK", "Lý Thị AL", "Phan Văn AM", "Đinh Thị AN", "Hồ Văn AO"
];

function generateSampleData() {
  const data = {};
  const seed = 42;
  let r = seed;
  const rand = (min, max) => { r = (r * 16807 + 0) % 2147483647; return min + (r % (max - min + 1)); };
  DEFAULT_STUDENTS.forEach((name, idx) => {
    const days = {};
    const [lo, hi] = idx < 5 ? [3, 8] : idx < 25 ? [2, 6] : idx < 35 ? [1, 4] : [0, 3];
    for (let d = 1; d <= 30; d++) days[d] = rand(lo, hi);
    data[name] = days;
  });
  return data;
}

const getLevel = (total) => {
  if (total >= 151) return { name: "Huyền thoại", emoji: "👑", color: "#7c3aed" };
  if (total >= 101) return { name: "Anh hùng", emoji: "⚔️", color: "#2563eb" };
  if (total >= 51) return { name: "Chiến binh", emoji: "🛡️", color: "#16a34a" };
  return { name: "Người mới", emoji: "🌱", color: "#64748b" };
};

const getTier = (avg) => {
  if (avg >= 4) return { name: "Tầng 1", color: "#16a34a", bg: "#dcfce7", action: "Khen thưởng" };
  if (avg >= 2) return { name: "Tầng 2", color: "#ea580c", bg: "#fff7ed", action: "Can thiệp nhóm" };
  return { name: "Tầng 3", color: "#dc2626", bg: "#fef2f2", action: "Can thiệp cá nhân" };
};

const starColor = (v) => {
  if (v >= 5) return { bg: "#dcfce7", text: "#166534" };
  if (v >= 3) return { bg: "#fef9c3", text: "#92400e" };
  if (v >= 1) return { bg: "#fed7aa", text: "#c2410c" };
  return { bg: "#fecaca", text: "#991b1b" };
};

// Storage helpers
const loadData = async (key, fallback) => {
  try {
    const result = await window.storage.get(key);
    return result ? JSON.parse(result.value) : fallback;
  } catch { return fallback; }
};
const saveData = async (key, value) => {
  try { await window.storage.set(key, JSON.stringify(value)); } catch (e) { console.error(e); }
};

// ─── Tab Button ───
const TabBtn = ({ icon: Icon, label, active, onClick, badge }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 6, padding: "10px 14px",
    background: active ? COLORS.primary : "transparent",
    color: active ? "#fff" : COLORS.textMuted,
    border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13,
    fontWeight: active ? 700 : 500, transition: "all 0.2s", position: "relative",
    whiteSpace: "nowrap",
  }}>
    <Icon size={17} />
    <span className="tab-label">{label}</span>
    {badge > 0 && <span style={{ position: "absolute", top: 2, right: 2, background: COLORS.red, color: "#fff", borderRadius: 99, fontSize: 10, padding: "1px 5px", fontWeight: 700 }}>{badge}</span>}
  </button>
);

// ─── Stat Card ───
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.border}`, flex: 1, minWidth: 160 }}>
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

// ─── Main App ───
export default function PBISApp() {
  const [tab, setTab] = useState(0);
  const [students, setStudents] = useState(DEFAULT_STUDENTS);
  const [starData, setStarData] = useState({});
  const [exchanges, setExchanges] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [searchTerm, setSearchTerm] = useState("");

  // Load data on mount
  useEffect(() => {
    (async () => {
      const sd = await loadData("pbis-stars", null);
      const ex = await loadData("pbis-exchanges", []);
      const iv = await loadData("pbis-interventions", []);
      const st = await loadData("pbis-students", null);
      setStarData(sd || generateSampleData());
      setExchanges(ex);
      setInterventions(iv);
      if (st) setStudents(st);
      setLoaded(true);
    })();
  }, []);

  // Auto-save
  useEffect(() => {
    if (!loaded) return;
    saveData("pbis-stars", starData);
    saveData("pbis-exchanges", exchanges);
    saveData("pbis-interventions", interventions);
    saveData("pbis-students", students);
  }, [starData, exchanges, interventions, students, loaded]);

  // Computed stats
  const summaryData = useMemo(() => {
    return students.map((name) => {
      const days = starData[name] || {};
      const total = Object.values(days).reduce((s, v) => s + (v || 0), 0);
      const activeDays = Object.values(days).filter(v => v !== undefined && v !== null).length || 1;
      const avg = total / Math.max(activeDays, 1);
      const daysAbove5 = Object.values(days).filter(v => v >= 5).length;
      const exchanged = exchanges.filter(e => e.student === name).reduce((s, e) => s + e.cost, 0);
      const tier = getTier(avg);
      const level = getLevel(total);
      return { name, total, avg, daysAbove5, tier, level, remaining: total - exchanged, exchanged };
    }).sort((a, b) => b.total - a.total);
  }, [students, starData, exchanges]);

  const tierCounts = useMemo(() => {
    const c = { "Tầng 1": 0, "Tầng 2": 0, "Tầng 3": 0 };
    summaryData.forEach(s => c[s.tier.name]++);
    return c;
  }, [summaryData]);

  const tier3Count = tierCounts["Tầng 3"];

  const updateStar = useCallback((name, day, value) => {
    setStarData(prev => ({
      ...prev,
      [name]: { ...(prev[name] || {}), [day]: Math.max(0, Math.min(10, value)) }
    }));
  }, []);

  if (!loaded) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: COLORS.bg }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, border: `4px solid ${COLORS.primary}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <div style={{ color: COLORS.textMuted, fontSize: 14 }}>Đang tải hệ thống PBIS...</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const tabs = [
    { icon: BarChart3, label: "Tổng quan" },
    { icon: Star, label: "Ngôi sao" },
    { icon: TrendingUp, label: "Xếp hạng" },
    { icon: BookOpen, label: "Hành vi" },
    { icon: AlertTriangle, label: "Can thiệp", badge: tier3Count },
    { icon: Gift, label: "Phần thưởng" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .tab-label { display: inline; }
        @media (max-width: 700px) { .tab-label { display: none !important; } }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
      `}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, #1a2d4a 100%)`, padding: "20px 24px 14px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ fontSize: 28 }}>⭐</div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>Hệ thống PBIS</h1>
            <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 500 }}>Lớp 10A1 — Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${COLORS.border}`, padding: "8px 12px", display: "flex", gap: 4, overflowX: "auto" }}>
        {tabs.map((t, i) => <TabBtn key={i} {...t} active={tab === i} onClick={() => setTab(i)} />)}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 16px 100px", maxWidth: 1100, margin: "0 auto" }}>
        {tab === 0 && <DashboardTab summaryData={summaryData} tierCounts={tierCounts} starData={starData} students={students} />}
        {tab === 1 && <DailyTab students={students} starData={starData} updateStar={updateStar} selectedDay={selectedDay} setSelectedDay={setSelectedDay} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
        {tab === 2 && <RankingTab summaryData={summaryData} />}
        {tab === 3 && <BehaviorTab />}
        {tab === 4 && <InterventionTab summaryData={summaryData} interventions={interventions} setInterventions={setInterventions} />}
        {tab === 5 && <RewardTab summaryData={summaryData} exchanges={exchanges} setExchanges={setExchanges} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// TAB 0: DASHBOARD
// ═══════════════════════════════════════
function DashboardTab({ summaryData, tierCounts, starData, students }) {
  const totalStars = summaryData.reduce((s, d) => s + d.total, 0);
  const avgPerStudent = summaryData.length > 0 ? (totalStars / summaryData.length).toFixed(1) : 0;
  const above100 = summaryData.filter(s => s.total >= 100).length;

  const pieData = [
    { name: "Tầng 1", value: tierCounts["Tầng 1"], color: "#16a34a" },
    { name: "Tầng 2", value: tierCounts["Tầng 2"], color: "#f59e0b" },
    { name: "Tầng 3", value: tierCounts["Tầng 3"], color: "#dc2626" },
  ];

  const weeklyData = [1, 2, 3, 4].map(w => {
    const start = (w - 1) * 7 + 1;
    const end = Math.min(w * 7, 30);
    let total = 0;
    students.forEach(name => {
      const days = starData[name] || {};
      for (let d = start; d <= end; d++) total += (days[d] || 0);
    });
    return { week: `Tuần ${w}`, total };
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={Star} label="Tổng ngôi sao" value={totalStars.toLocaleString()} color={COLORS.accent} sub="toàn lớp tháng này" />
        <StatCard icon={Users} label="TB/học sinh" value={avgPerStudent} color={COLORS.primaryLight} sub={`${summaryData.length} học sinh`} />
        <StatCard icon={Award} label="Đạt ≥100 sao" value={above100} color={COLORS.green} sub="học sinh xuất sắc" />
        <StatCard icon={AlertTriangle} label="Cần can thiệp" value={tierCounts["Tầng 3"]} color={COLORS.red} sub="Tầng 3" />
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        {/* Pie Chart */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, flex: 1, minWidth: 280, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: COLORS.text }}>Phân bổ Tầng</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 11, fontWeight: 600 }}>
                {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trend */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, flex: 1.2, minWidth: 300, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: COLORS.text }}>Xu hướng theo tuần</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke={COLORS.primary} strokeWidth={3} dot={{ fill: COLORS.primary, r: 5 }} name="Tổng sao" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: COLORS.text }}>🏆 Top 5 Học sinh Xuất sắc</h3>
        {summaryData.slice(0, 5).map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? `1px solid ${COLORS.border}` : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 99, background: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#d97706" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: i < 3 ? "#fff" : COLORS.textMuted }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{s.name}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>{s.level.emoji} {s.level.name} · TB {s.avg.toFixed(1)}/ngày</div>
            </div>
            <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.accent }}>{s.total}⭐</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// TAB 1: DAILY STAR TRACKING
// ═══════════════════════════════════════
function DailyTab({ students, starData, updateStar, selectedDay, setSelectedDay, searchTerm, setSearchTerm }) {
  const filtered = students.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "6px 12px", flex: 1, minWidth: 180 }}>
          <Search size={16} color={COLORS.textMuted} />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Tìm học sinh..." style={{ border: "none", outline: "none", width: "100%", fontSize: 13, fontFamily: "inherit" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "6px 12px" }}>
          <Calendar size={16} color={COLORS.textMuted} />
          <select value={selectedDay} onChange={e => setSelectedDay(Number(e.target.value))} style={{ border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", background: "transparent" }}>
            {Array.from({ length: 30 }, (_, i) => <option key={i + 1} value={i + 1}>Ngày {i + 1}</option>)}
          </select>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 80px 90px", padding: "12px 16px", background: COLORS.primary, color: "#fff", fontWeight: 700, fontSize: 12, gap: 8 }}>
          <div>STT</div><div>Họ và Tên</div><div style={{ textAlign: "center" }}>Ngôi sao</div><div style={{ textAlign: "center" }}>Tổng tháng</div>
        </div>
        <div style={{ maxHeight: 520, overflowY: "auto" }}>
          {filtered.map((name, i) => {
            const days = starData[name] || {};
            const val = days[selectedDay] ?? "";
            const total = Object.values(days).reduce((s, v) => s + (v || 0), 0);
            const sc = val !== "" ? starColor(val) : { bg: "transparent", text: COLORS.textMuted };
            return (
              <div key={name} style={{ display: "grid", gridTemplateColumns: "48px 1fr 80px 90px", padding: "10px 16px", borderBottom: `1px solid ${COLORS.border}`, alignItems: "center", gap: 8, background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>{students.indexOf(name) + 1}</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.text }}>{name}</div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <input
                    type="number" min="0" max="10" value={val}
                    onChange={e => updateStar(name, selectedDay, e.target.value === "" ? 0 : Number(e.target.value))}
                    style={{
                      width: 52, height: 34, textAlign: "center", border: `2px solid ${val !== "" ? sc.text + "44" : COLORS.border}`,
                      borderRadius: 8, fontSize: 15, fontWeight: 700, color: sc.text, background: sc.bg,
                      fontFamily: "inherit", outline: "none",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, color: COLORS.accent }}>{total}⭐</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: COLORS.textMuted, textAlign: "center" }}>
        Nhập số ngôi sao từ 0-10 cho mỗi học sinh · Màu sắc tự thay đổi theo mức đạt
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// TAB 2: RANKING
// ═══════════════════════════════════════
function RankingTab({ summaryData }) {
  const [sortKey, setSortKey] = useState("total");
  const sorted = [...summaryData].sort((a, b) => sortKey === "total" ? b.total - a.total : sortKey === "avg" ? b.avg - a.avg : b.daysAbove5 - a.daysAbove5);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {[["total", "Tổng sao"], ["avg", "TB/ngày"], ["daysAbove5", "Ngày ≥5 sao"]].map(([k, label]) => (
          <button key={k} onClick={() => setSortKey(k)} style={{
            padding: "6px 14px", borderRadius: 8, border: `1px solid ${sortKey === k ? COLORS.primary : COLORS.border}`,
            background: sortKey === k ? COLORS.primary : "#fff", color: sortKey === k ? "#fff" : COLORS.text,
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>{label}</button>
        ))}
      </div>

      {/* Top 10 Bar Chart */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: COLORS.text }}>📊 Top 10 Học sinh</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={sorted.slice(0, 10)} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="total" fill={COLORS.green} radius={[0, 6, 6, 0]} name="Tổng sao" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Full table */}
      <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.border}` }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: COLORS.primary, color: "#fff" }}>
                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>#</th>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700 }}>Họ và Tên</th>
                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>Tổng ⭐</th>
                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>TB/Ngày</th>
                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>Ngày ≥5⭐</th>
                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>Tầng</th>
                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>Level</th>
                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700 }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => (
                <tr key={s.name} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: COLORS.textMuted }}>{i + 1}</td>
                  <td style={{ padding: "8px 12px", fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 800, color: COLORS.accent }}>{s.total}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600 }}>{s.avg.toFixed(1)}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center" }}>{s.daysAbove5}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: s.tier.bg, color: s.tier.color }}>{s.tier.name}</span>
                  </td>
                  <td style={{ padding: "8px 12px", textAlign: "center" }}>
                    <span style={{ fontSize: 12 }}>{s.level.emoji} {s.level.name}</span>
                  </td>
                  <td style={{ padding: "8px 12px", textAlign: "center", fontSize: 11, color: s.tier.color, fontWeight: 600 }}>{s.tier.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// TAB 3: BEHAVIOR CATALOG
// ═══════════════════════════════════════
function BehaviorTab() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #1a2d4a)`, borderRadius: 14, padding: "20px 24px", color: "#fff", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>📋 Danh mục Hành vi Mong đợi</h2>
        <p style={{ fontSize: 12, opacity: 0.8 }}>8 hành vi tích cực được ghi nhận và khen thưởng bằng ngôi sao</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {BEHAVIORS.map((b, i) => (
          <div key={b.code} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: `1px solid ${COLORS.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <button onClick={() => setExpanded(expanded === i ? null : i)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
              border: "none", background: "transparent", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.accent + "20", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: COLORS.accent, flexShrink: 0 }}>{b.code.slice(2)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{b.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{b.def}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <span style={{ fontWeight: 800, fontSize: 16, color: COLORS.accent }}>{b.stars}</span>
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>⭐/{b.unit}</span>
              </div>
              {expanded === i ? <ChevronUp size={16} color={COLORS.textMuted} /> : <ChevronDown size={16} color={COLORS.textMuted} />}
            </button>
            {expanded === i && (
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

// ═══════════════════════════════════════
// TAB 4: INTERVENTION
// ═══════════════════════════════════════
function InterventionTab({ summaryData, interventions, setInterventions }) {
  const tier2 = summaryData.filter(s => s.tier.name === "Tầng 2");
  const tier3 = summaryData.filter(s => s.tier.name === "Tầng 3");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ student: "", issue: "", plan: "", person: "", tier: "2" });

  const addIntervention = () => {
    if (!form.student) return;
    setInterventions(prev => [...prev, { ...form, id: Date.now(), date: new Date().toLocaleDateString("vi-VN"), status: "Đang theo dõi" }]);
    setForm({ student: "", issue: "", plan: "", person: "", tier: "2" });
    setShowAdd(false);
  };

  return (
    <div>
      {/* Alert banner */}
      {tier3.length > 0 && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <AlertTriangle size={20} color={COLORS.red} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.red }}>⚠️ {tier3.length} học sinh cần can thiệp Tầng 3</div>
            <div style={{ fontSize: 11, color: "#991b1b" }}>{tier3.map(s => s.name).join(", ")}</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
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
              <select value={form.student} onChange={e => setForm(p => ({ ...p, student: e.target.value }))} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit" }}>
                <option value="">Chọn...</option>
                {[...tier2, ...tier3].map(s => <option key={s.name} value={s.name}>{s.name} ({s.tier.name})</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Tầng</label>
              <select value={form.tier} onChange={e => setForm(p => ({ ...p, tier: e.target.value }))} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit" }}>
                <option value="2">Tầng 2 - Nhóm nhỏ</option>
                <option value="3">Tầng 3 - Cá nhân</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Vấn đề chính</label>
            <input value={form.issue} onChange={e => setForm(p => ({ ...p, issue: e.target.value }))} placeholder="VD: Hay đến muộn, quên đồ" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Can thiệp áp dụng</label>
              <input value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))} placeholder="VD: Check-in buổi sáng" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Người phụ trách</label>
              <input value={form.person} onChange={e => setForm(p => ({ ...p, person: e.target.value }))} placeholder="VD: GVCN" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addIntervention} style={{ padding: "8px 18px", background: COLORS.green, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Lưu</button>
            <button onClick={() => setShowAdd(false)} style={{ padding: "8px 18px", background: "#f1f5f9", color: COLORS.textMuted, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Hủy</button>
          </div>
        </div>
      )}

      {/* Tier 2 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: 99, background: "#f59e0b" }} />
          <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Tầng 2 — Can thiệp Nhóm nhỏ ({tier2.length} em)</h4>
        </div>
        {tier2.map(s => {
          const iv = interventions.find(x => x.student === s.name);
          return (
            <div key={s.name} style={{ background: "#fff", borderRadius: 10, padding: "12px 16px", marginBottom: 8, border: `1px solid #fed7aa`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>TB {s.avg.toFixed(1)}/ngày · {s.total} sao</div>
                {iv && <div style={{ fontSize: 11, color: COLORS.orange, marginTop: 2 }}>📋 {iv.plan} — {iv.person}</div>}
              </div>
              <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: iv ? "#dcfce7" : "#fef9c3", color: iv ? COLORS.green : "#92400e" }}>{iv ? iv.status : "Chưa có kế hoạch"}</span>
            </div>
          );
        })}
        {tier2.length === 0 && <div style={{ fontSize: 13, color: COLORS.textMuted, fontStyle: "italic" }}>Không có học sinh Tầng 2</div>}
      </div>

      {/* Tier 3 */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: 99, background: COLORS.red }} />
          <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Tầng 3 — Can thiệp Cá nhân ({tier3.length} em)</h4>
        </div>
        {tier3.map(s => {
          const iv = interventions.find(x => x.student === s.name);
          return (
            <div key={s.name} style={{ background: "#fff", borderRadius: 10, padding: "12px 16px", marginBottom: 8, border: `1px solid #fecaca`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.red }}>{s.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>TB {s.avg.toFixed(1)}/ngày · {s.total} sao</div>
                {iv && <div style={{ fontSize: 11, color: COLORS.red, marginTop: 2 }}>📋 {iv.plan} — {iv.person}</div>}
              </div>
              <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: iv ? "#dcfce7" : "#fecaca", color: iv ? COLORS.green : COLORS.red }}>{iv ? iv.status : "⚠️ Cần kế hoạch NGAY"}</span>
            </div>
          );
        })}
        {tier3.length === 0 && <div style={{ fontSize: 13, color: COLORS.textMuted, fontStyle: "italic" }}>Không có học sinh Tầng 3 — Tuyệt vời!</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// TAB 5: REWARDS
// ═══════════════════════════════════════
function RewardTab({ summaryData, exchanges, setExchanges }) {
  const [showExchange, setShowExchange] = useState(false);
  const [exForm, setExForm] = useState({ student: "", reward: "" });

  const doExchange = () => {
    if (!exForm.student || !exForm.reward) return;
    const reward = REWARDS.find(r => r.code === exForm.reward);
    const student = summaryData.find(s => s.name === exForm.student);
    if (!reward || !student || student.remaining < reward.cost) return;
    setExchanges(prev => [...prev, { student: exForm.student, reward: reward.code, rewardName: reward.name, cost: reward.cost, date: new Date().toLocaleDateString("vi-VN"), id: Date.now() }]);
    setExForm({ student: "", reward: "" });
    setShowExchange(false);
  };

  const selectedReward = REWARDS.find(r => r.code === exForm.reward);
  const selectedStudent = summaryData.find(s => s.name === exForm.student);

  return (
    <div>
      {/* Rewards Menu */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>🎁 Menu Phần thưởng</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {REWARDS.map(r => (
            <div key={r.code} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: `1px solid ${COLORS.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{r.name}</div>
                <div style={{ background: COLORS.accent + "20", padding: "3px 10px", borderRadius: 99, fontWeight: 800, fontSize: 13, color: COLORS.accent, whiteSpace: "nowrap" }}>{r.cost} ⭐</div>
              </div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, lineHeight: 1.4 }}>{r.desc}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.textMuted }}>
                <span>📦 {r.quota}</span>
                <span>⏰ {r.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exchange Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>📝 Đổi điểm</h3>
        <button onClick={() => setShowExchange(!showExchange)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", background: COLORS.accent, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          <Gift size={14} /> Đổi phần thưởng
        </button>
      </div>

      {showExchange && (
        <div style={{ background: "#fffbeb", borderRadius: 12, padding: 18, marginBottom: 14, border: `1px solid #fde68a` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Học sinh</label>
              <select value={exForm.student} onChange={e => setExForm(p => ({ ...p, student: e.target.value }))} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit" }}>
                <option value="">Chọn học sinh...</option>
                {summaryData.map(s => <option key={s.name} value={s.name}>{s.name} (còn {s.remaining}⭐)</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>Phần thưởng</label>
              <select value={exForm.reward} onChange={e => setExForm(p => ({ ...p, reward: e.target.value }))} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit" }}>
                <option value="">Chọn phần thưởng...</option>
                {REWARDS.map(r => <option key={r.code} value={r.code}>{r.name} ({r.cost}⭐)</option>)}
              </select>
            </div>
          </div>
          {selectedStudent && selectedReward && (
            <div style={{ padding: "8px 12px", borderRadius: 8, background: selectedStudent.remaining >= selectedReward.cost ? "#dcfce7" : "#fecaca", fontSize: 12, fontWeight: 600, marginBottom: 10, color: selectedStudent.remaining >= selectedReward.cost ? COLORS.green : COLORS.red }}>
              {selectedStudent.remaining >= selectedReward.cost
                ? `✅ ${selectedStudent.name} có ${selectedStudent.remaining}⭐, đủ đổi "${selectedReward.name}" (${selectedReward.cost}⭐). Còn lại: ${selectedStudent.remaining - selectedReward.cost}⭐`
                : `❌ ${selectedStudent.name} chỉ có ${selectedStudent.remaining}⭐, chưa đủ đổi "${selectedReward.name}" (cần ${selectedReward.cost}⭐)`}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={doExchange} disabled={!selectedStudent || !selectedReward || (selectedStudent && selectedReward && selectedStudent.remaining < selectedReward.cost)} style={{ padding: "8px 18px", background: COLORS.green, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: (!selectedStudent || !selectedReward || (selectedStudent && selectedReward && selectedStudent.remaining < selectedReward.cost)) ? 0.5 : 1 }}>Xác nhận đổi</button>
            <button onClick={() => setShowExchange(false)} style={{ padding: "8px 18px", background: "#f1f5f9", color: COLORS.textMuted, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Hủy</button>
          </div>
        </div>
      )}

      {/* History */}
      {exchanges.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
          <div style={{ padding: "12px 16px", background: "#f0fdf4", fontWeight: 700, fontSize: 13, color: COLORS.green }}>Lịch sử đổi điểm ({exchanges.length} lần)</div>
          {exchanges.slice().reverse().map((ex, i) => (
            <div key={ex.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 12 }}>
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
