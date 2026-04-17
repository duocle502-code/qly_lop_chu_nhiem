import * as XLSX from 'xlsx';
import { getTier, getLevel } from './utils.js';

/**
 * Import Excel file → parse students + star data
 * Expected format: Column A = STT, Column B = Tên HS, Columns C+ = Ngày 1, 2, 3...
 */
export function importExcel(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const wb = XLSX.read(e.target.result, { type: 'array' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(ws, { header: 1 });

                if (json.length < 2) { reject('File rỗng hoặc không đúng format'); return; }

                // Find header row (the row containing "Tên" or similar)
                let headerIdx = 0;
                for (let i = 0; i < Math.min(json.length, 5); i++) {
                    const row = json[i] || [];
                    const hasName = row.some(c => typeof c === 'string' && (c.includes('Tên') || c.includes('Họ') || c.includes('tên')));
                    if (hasName) { headerIdx = i; break; }
                }

                const header = json[headerIdx] || [];
                // Find the name column
                let nameCol = -1;
                for (let c = 0; c < header.length; c++) {
                    const h = String(header[c] || '').toLowerCase();
                    if (h.includes('tên') || h.includes('họ')) { nameCol = c; break; }
                }
                if (nameCol === -1) nameCol = 1; // fallback to column B

                // Find day columns (numbers 1-31)
                const dayColumns = {};
                for (let c = 0; c < header.length; c++) {
                    const val = header[c];
                    if (typeof val === 'number' && val >= 1 && val <= 31) {
                        dayColumns[val] = c;
                    } else if (typeof val === 'string') {
                        const num = parseInt(val);
                        if (num >= 1 && num <= 31) dayColumns[num] = c;
                    }
                }

                const students = [];
                const starData = {};

                for (let r = headerIdx + 1; r < json.length; r++) {
                    const row = json[r] || [];
                    const name = row[nameCol];
                    if (!name || typeof name !== 'string' || name.trim() === '') continue;

                    const trimmed = name.trim();
                    students.push(trimmed);
                    const days = {};
                    for (const [day, col] of Object.entries(dayColumns)) {
                        const val = row[col];
                        if (val !== undefined && val !== null && val !== '') {
                            days[day] = Math.max(0, Math.min(10, Number(val) || 0));
                        }
                    }
                    starData[trimmed] = days;
                }

                resolve({ students, starData });
            } catch (err) {
                reject('Lỗi đọc file: ' + err.message);
            }
        };
        reader.onerror = () => reject('Không thể đọc file');
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Export data to Excel file
 */
export function exportExcel(students, starData, exchanges, daysInMonth, monthLabel) {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Summary
    const summaryRows = [['#', 'Họ và Tên', 'Tổng ⭐', 'TB/Ngày', 'Tầng', 'Level', 'Hành động']];
    const sorted = students.map(name => {
        const days = starData[name] || {};
        const total = Object.values(days).reduce((s, v) => s + (v || 0), 0);
        const activeDays = Object.values(days).filter(v => v !== undefined && v !== null).length || 1;
        const avg = total / Math.max(activeDays, 1);
        const tier = getTier(avg);
        const level = getLevel(total);
        const exchanged = (exchanges || []).filter(e => e.student === name).reduce((s, e) => s + e.cost, 0);
        return { name, total, avg, tier, level, remaining: total - exchanged };
    }).sort((a, b) => b.total - a.total);

    sorted.forEach((s, i) => {
        summaryRows.push([i + 1, s.name, s.total, Number(s.avg.toFixed(1)), s.tier.name, `${s.level.emoji} ${s.level.name}`, s.tier.action]);
    });
    const ws1 = XLSX.utils.aoa_to_sheet(summaryRows);
    ws1['!cols'] = [{ wch: 4 }, { wch: 20 }, { wch: 8 }, { wch: 8 }, { wch: 10 }, { wch: 14 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Tổng hợp');

    // Sheet 2: Daily data
    const dayHeaders = ['#', 'Họ và Tên'];
    for (let d = 1; d <= daysInMonth; d++) dayHeaders.push(d);
    dayHeaders.push('Tổng');
    const dailyRows = [dayHeaders];

    students.forEach((name, i) => {
        const days = starData[name] || {};
        const row = [i + 1, name];
        let total = 0;
        for (let d = 1; d <= daysInMonth; d++) {
            const val = days[d] ?? '';
            row.push(val);
            total += (val || 0);
        }
        row.push(total);
        dailyRows.push(row);
    });
    const ws2 = XLSX.utils.aoa_to_sheet(dailyRows);
    ws2['!cols'] = [{ wch: 4 }, { wch: 20 }, ...Array(daysInMonth + 1).fill({ wch: 5 })];
    XLSX.utils.book_append_sheet(wb, ws2, 'Chi tiết theo ngày');

    const fileName = `PBIS_${monthLabel || 'data'}.xlsx`;
    XLSX.writeFile(wb, fileName);
}
