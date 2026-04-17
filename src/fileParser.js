import * as XLSX from 'xlsx';
import mammoth from 'mammoth';

/**
 * Parse student list from uploaded file (Excel, Word, PDF)
 * Expected columns: STT | HỌ TÊN | NĂM SINH | LỚP
 * Returns: Array of { stt, name, birthYear, className }
 */

// ═══ EXCEL (.xlsx, .xls) ═══
async function parseExcel(file) {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
    return parseRows(rows);
}

// ═══ WORD (.docx) ═══
async function parseWord(file) {
    const buffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
    const html = result.value;

    // Parse HTML tables
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const tables = doc.querySelectorAll('table');

    if (tables.length > 0) {
        // Extract from first table
        const rows = [];
        tables[0].querySelectorAll('tr').forEach(tr => {
            const cells = [];
            tr.querySelectorAll('td, th').forEach(td => cells.push(td.textContent.trim()));
            if (cells.length > 0) rows.push(cells);
        });
        return parseRows(rows);
    }

    // Fallback: parse plain text lines (tab or multi-space separated)
    const text = doc.body.textContent || '';
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const rows = lines.map(line => line.split(/\t+|\s{2,}/).map(c => c.trim()));
    return parseRows(rows);
}

// ═══ PDF (.pdf) ═══
async function parsePDF(file) {
    // Load pdf.js from CDN dynamically to avoid bundling (~500KB)
    if (!window.pdfjsLib) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
        script.type = 'module';

        // Use import() for ES module
        try {
            const pdfjsModule = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
            window.pdfjsLib = pdfjsModule;
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
        } catch {
            throw new Error('Không thể tải thư viện PDF. Vui lòng dùng file Excel (.xlsx) thay thế.');
        }
    }

    const buffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
    const allLines = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        // Group text items by Y position (same row)
        const lineMap = {};
        content.items.forEach(item => {
            const y = Math.round(item.transform[5]); // Y coordinate
            if (!lineMap[y]) lineMap[y] = [];
            lineMap[y].push({ x: item.transform[4], text: item.str.trim() });
        });

        // Sort by Y (descending = top to bottom) then X (left to right)
        Object.keys(lineMap)
            .sort((a, b) => Number(b) - Number(a))
            .forEach(y => {
                const cells = lineMap[y].sort((a, b) => a.x - b.x).map(c => c.text).filter(Boolean);
                if (cells.length > 0) allLines.push(cells);
            });
    }

    return parseRows(allLines);
}

// ═══ ROW PARSER (shared) ═══
function parseRows(rows) {
    if (!rows || rows.length < 2) throw new Error('File trống hoặc không đúng format');

    // Find header row
    let headerIdx = -1;
    for (let i = 0; i < Math.min(rows.length, 8); i++) {
        const row = (rows[i] || []).map(c => String(c || '').toLowerCase());
        const hasName = row.some(c => c.includes('tên') || c.includes('họ'));
        if (hasName) { headerIdx = i; break; }
    }

    // If no header found, assume first row is header
    if (headerIdx === -1) headerIdx = 0;

    const header = (rows[headerIdx] || []).map(c => String(c || '').toLowerCase().trim());

    // Map columns
    const colMap = { stt: -1, name: -1, birthYear: -1, className: -1 };

    header.forEach((h, i) => {
        if (h.includes('stt') || h === '#' || h === 'tt') colMap.stt = i;
        else if (h.includes('tên') || h.includes('họ')) colMap.name = i;
        else if (h.includes('năm') || h.includes('sinh') || h.includes('ns')) colMap.birthYear = i;
        else if (h.includes('lớp') || h.includes('class')) colMap.className = i;
    });

    // Name column is required
    if (colMap.name === -1) {
        // Try to guess: if header has exactly 4 columns, map STT, TEN, NS, LOP
        if (header.length >= 2) {
            colMap.stt = 0;
            colMap.name = 1;
            if (header.length >= 3) colMap.birthYear = 2;
            if (header.length >= 4) colMap.className = 3;
        } else {
            throw new Error('Không tìm thấy cột "Họ và Tên" trong file. Vui lòng kiểm tra lại format.');
        }
    }

    // Parse data rows
    const students = [];
    for (let i = headerIdx + 1; i < rows.length; i++) {
        const row = rows[i] || [];
        const name = colMap.name >= 0 ? String(row[colMap.name] || '').trim() : '';
        if (!name || name.length < 2) continue;

        students.push({
            stt: colMap.stt >= 0 ? (Number(row[colMap.stt]) || students.length + 1) : students.length + 1,
            name,
            birthYear: colMap.birthYear >= 0 ? String(row[colMap.birthYear] || '').trim() : '',
            className: colMap.className >= 0 ? String(row[colMap.className] || '').trim() : '',
        });
    }

    if (students.length === 0) throw new Error('Không tìm thấy học sinh trong file');
    return students;
}

// ═══ MAIN ENTRY ═══
export async function parseStudentFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();

    switch (ext) {
        case 'xlsx':
        case 'xls':
            return await parseExcel(file);
        case 'docx':
        case 'doc':
            return await parseWord(file);
        case 'pdf':
            return await parsePDF(file);
        default:
            throw new Error(`Không hỗ trợ file .${ext}. Vui lòng dùng .xlsx, .docx hoặc .pdf`);
    }
}
