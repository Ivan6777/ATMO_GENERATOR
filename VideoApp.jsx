import React, { useState, useReducer, useRef, useEffect, useCallback } from 'react';
/* ============================================================================
 * ІКОНКИ — inline SVG (замість lucide-react CDN, що не резолвиться у цьому
 * рантаймі: babel-standalone + React UMD не надає named-export'ів lucide-react).
 * Імена компонентів збігаються з lucide, тож решта коду без змін.
 * ========================================================================== */
const Icon = ({ size = 24, className, strokeWidth = 2, children, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        {children}
    </svg>
);
const Play = (p) => <Icon {...p}><polygon points="6 3 20 12 6 21 6 3" /></Icon>;
const Square = (p) => <Icon {...p}><rect width="18" height="18" x="3" y="3" rx="2" /></Icon>;
const RefreshCw = (p) => <Icon {...p}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></Icon>;
const Download = (p) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></Icon>;
const FileText = (p) => <Icon {...p}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></Icon>;
const Trash2 = (p) => <Icon {...p}><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></Icon>;
const Loader2 = (p) => <Icon {...p}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></Icon>;
const Mic = (p) => <Icon {...p}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></Icon>;
const Layers = (p) => <Icon {...p}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></Icon>;
const PlayCircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></Icon>;
const CheckCircle = (p) => <Icon {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Icon>;
const UploadCloud = (p) => <Icon {...p}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" /></Icon>;
const Type = (p) => <Icon {...p}><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" x2="15" y1="20" y2="20" /><line x1="12" x2="12" y1="4" y2="20" /></Icon>;
const AlertCircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></Icon>;
const Headphones = (p) => <Icon {...p}><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a9 9 0 0 1 18 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" /></Icon>;
const ChevronDown = (p) => <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>;
const ChevronUp = (p) => <Icon {...p}><path d="m18 15-6-6-6 6" /></Icon>;
const Edit3 = (p) => <Icon {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" /></Icon>;
const Sparkles = (p) => <Icon {...p}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" /><path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" /></Icon>;
const Wand2 = (p) => <Icon {...p}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></Icon>;
const Clock = (p) => <Icon {...p}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>;
const Users = (p) => <Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>;
const Combine = (p) => <Icon {...p}><rect width="8" height="8" x="2" y="2" rx="2" /><path d="M14 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" /><path d="M20 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" /><path d="M10 18H5c-1.7 0-3-1.3-3-3v-1" /><polyline points="7 21 10 18 7 15" /><rect width="8" height="8" x="14" y="14" rx="2" /></Icon>;
const ListStart = (p) => <Icon {...p}><path d="M16 12H3" /><path d="M16 6H3" /><path d="M11 18H3" /><path d="M21 18V8a2 2 0 0 0-2-2h-5" /><path d="m16 8-2-2 2-2" /></Icon>;
const AlignLeft = (p) => <Icon {...p}><line x1="21" x2="3" y1="6" y2="6" /><line x1="15" x2="3" y1="12" y2="12" /><line x1="17" x2="3" y1="18" y2="18" /></Icon>;
const Video = (p) => <Icon {...p}><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></Icon>;
const Presentation = (p) => <Icon {...p}><path d="M2 3h20" /><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" /><path d="m7 21 5-5 5 5" /><line x1="12" x2="12" y1="16" y2="21" /></Icon>;
const ImagePlus = (p) => <Icon {...p}><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /><line x1="16" x2="22" y1="5" y2="5" /><line x1="19" x2="19" y1="2" y2="8" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></Icon>;
const MonitorPlay = (p) => <Icon {...p}><path d="M10 7.75a.75.75 0 0 1 1.142-.638l3.664 2.249a.75.75 0 0 1 0 1.278l-3.664 2.25a.75.75 0 0 1-1.142-.64z" /><path d="M12 17v4" /><path d="M8 21h8" /><rect width="20" height="14" x="2" y="3" rx="2" /></Icon>;
const Film = (p) => <Icon {...p}><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18" /><path d="M3 7.5h4" /><path d="M3 12h18" /><path d="M3 16.5h4" /><path d="M17 3v18" /><path d="M17 7.5h4" /><path d="M17 16.5h4" /></Icon>;
const Music = (p) => <Icon {...p}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></Icon>;
const Lock = (p) => <Icon {...p}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon>;
const ZoomIn = (p) => <Icon {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></Icon>;
const ZoomOut = (p) => <Icon {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></Icon>;
const Unlock = (p) => <Icon {...p}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></Icon>;
const Eye = (p) => <Icon {...p}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></Icon>;
const Zap = (p) => <Icon {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Icon>;
const Copy = (p) => <Icon {...p}><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></Icon>;
const Send = (p) => <Icon {...p}><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></Icon>;
const Plus = (p) => <Icon {...p}><path d="M5 12h14" /><path d="M12 5v14" /></Icon>;
const Paperclip = (p) => <Icon {...p}><path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 0 0-5.657-5.657l-8.379 8.551a6 6 0 0 0 8.485 8.485l8.379-8.551" /></Icon>;

// --- Передача файлів/запиту з чат-лендінгу у цільовий модуль (одноразове споживання) ---
// Чат збирає файли+текст, ставить target=режим і перемикає вкладку; цільовий модуль
// на монтуванні забирає inbox через takeStudioInbox(mode) і вантажить файли у свій стан.
let studioInbox = { files: [], text: '', target: null, ts: 0 };
const setStudioInbox = (data) => { studioInbox = { files: [], text: '', target: null, ...data, ts: Date.now() }; };
const takeStudioInbox = (target) => {
    if (studioInbox && studioInbox.target === target) {
        const inbox = studioInbox;
        studioInbox = { files: [], text: '', target: null, ts: 0 };
        return inbox;
    }
    return null;
};

// ── Інтерактивні накладки (H5P-стиль) — повний набір типів ──
// interactive=true (режим «гра») робить віджет клікабельним; інакше — режим авторингу.
// Каталог типів (для меню додавання та підписів)
const H5P_TYPES = [
    ['mcq', 'Тест (вибір)', '☑'],
    ['truefalse', 'Правда / Хибність', '⊻'],
    ['fill', 'Заповни пропуск', '▭'],
    ['summary', 'Обери правильне', '✓'],
    ['hotspot', 'Гаряча точка', '◉'],
    ['info', 'Інфо-блок', 'ℹ'],
    ['accordion', 'Акордеон', '≡'],
    ['flashcard', 'Картка (фліп)', '⇄'],
    ['link', 'Кнопка-посилання', '▶'],
];
const InteractiveWidget = ({ obj, scale, interactive }) => {
    const [open, setOpen] = React.useState(false);
    const [picked, setPicked] = React.useState(null);
    const [flipped, setFlipped] = React.useState(false);
    const [acc, setAcc] = React.useState(0);
    const [inputs, setInputs] = React.useState({});
    const [checked, setChecked] = React.useState(false);
    const accent = obj.color || '#7c3aed';
    const fs = Math.max(13 * scale, 9);
    const pe = interactive ? 'auto' : 'none';
    const stop = (e) => { if (interactive) e.stopPropagation(); };
    const card = { borderColor: accent, pointerEvents: pe, fontSize: fs };

    switch (obj.iType) {
        case 'hotspot':
            return (
                <div className="w-full h-full relative" style={{ pointerEvents: pe }}>
                    <button onClick={(e) => { if (interactive) { e.stopPropagation(); setOpen(o => !o); } }}
                        className="w-full h-full rounded-full flex items-center justify-center text-white font-extrabold shadow-lg"
                        style={{ background: accent, fontSize: Math.max(obj.w * scale * 0.42, 11), animation: interactive ? 'pulse 1.6s infinite' : undefined }}>
                        {obj.label || 'i'}
                    </button>
                    {open && interactive && (
                        <div className="absolute left-1/2 -translate-x-1/2 z-[60] bg-white rounded-xl shadow-2xl border border-slate-200 p-3 text-slate-700"
                            style={{ top: '105%', width: Math.max(220, obj.w * scale * 3.5), fontSize: fs }}>{obj.content || '—'}</div>
                    )}
                </div>
            );
        case 'mcq':
        case 'summary':
            return (
                <div className="w-full h-full bg-white rounded-xl shadow-lg border-2 p-3 flex flex-col gap-1.5 overflow-auto" style={card}>
                    <div className="font-bold text-slate-800">{obj.question || (obj.iType === 'summary' ? 'Оберіть правильне твердження:' : 'Питання?')}</div>
                    {(obj.options || []).map((opt, i) => {
                        const correct = i === obj.correct;
                        let cls = 'bg-slate-50 border-slate-200 text-slate-700';
                        if (picked != null && i === picked) cls = correct ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-red-50 border-red-300 text-red-600';
                        else if (picked != null && correct) cls = 'bg-emerald-50 border-emerald-400 text-emerald-700';
                        return <button key={i} onClick={(e) => { stop(e); if (interactive) setPicked(i); }} className={`text-left px-2.5 py-1.5 rounded-lg border font-semibold ${cls}`}>{opt}</button>;
                    })}
                    {picked != null && <div className={`text-xs font-bold ${picked === obj.correct ? 'text-emerald-600' : 'text-red-500'}`}>{picked === obj.correct ? '✓ Правильно!' : '✗ Спробуйте ще'}</div>}
                </div>
            );
        case 'truefalse': {
            const fb = picked != null;
            return (
                <div className="w-full h-full bg-white rounded-xl shadow-lg border-2 p-3 flex flex-col gap-2 overflow-auto" style={card}>
                    <div className="font-bold text-slate-800">{obj.question || 'Твердження правдиве?'}</div>
                    <div className="flex gap-2">
                        {[['Правда', true], ['Хибність', false]].map(([lbl, val]) => {
                            let cls = 'bg-slate-50 border-slate-200 text-slate-700';
                            if (fb && picked === val) cls = (val === !!obj.correct) ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-red-50 border-red-300 text-red-600';
                            return <button key={lbl} onClick={(e) => { stop(e); if (interactive) setPicked(val); }} className={`flex-1 px-3 py-2 rounded-lg border font-bold ${cls}`}>{lbl}</button>;
                        })}
                    </div>
                    {fb && <div className={`text-xs font-bold ${picked === !!obj.correct ? 'text-emerald-600' : 'text-red-500'}`}>{picked === !!obj.correct ? '✓ Правильно!' : '✗ Неправильно'}</div>}
                </div>
            );
        }
        case 'fill': {
            const parts = String(obj.text || '').split(/(\*[^*]+\*)/);
            return (
                <div className="w-full h-full bg-white rounded-xl shadow-lg border-2 p-3 flex flex-col gap-2 overflow-auto" style={card}>
                    <div className="leading-loose text-slate-800">
                        {parts.map((p, i) => {
                            const m = p.match(/^\*([^*]+)\*$/);
                            if (!m) return <span key={i}>{p}</span>;
                            const ans = m[1];
                            const ok = checked && (inputs[i] || '').trim().toLowerCase() === ans.trim().toLowerCase();
                            const bad = checked && !ok;
                            return <input key={i} value={inputs[i] || ''} onChange={(e) => { if (interactive) setInputs(s => ({ ...s, [i]: e.target.value })); }} onClick={stop}
                                className={`inline-block mx-1 px-1 border-b-2 outline-none text-center bg-slate-50 ${ok ? 'border-emerald-400 text-emerald-700' : bad ? 'border-red-400 text-red-600' : 'border-slate-300'}`} style={{ width: `${Math.max(ans.length + 1, 4)}ch` }} />;
                        })}
                    </div>
                    {interactive && <button onClick={(e) => { stop(e); setChecked(true); }} className="self-start px-3 py-1 rounded-lg text-white font-bold text-xs" style={{ background: accent }}>Перевірити</button>}
                </div>
            );
        }
        case 'info':
            return <div className="w-full h-full bg-white rounded-xl shadow-md border-l-4 p-3 overflow-auto text-slate-700 whitespace-pre-wrap" style={card}>{obj.content || 'Інформаційний текст'}</div>;
        case 'accordion':
            return (
                <div className="w-full h-full bg-white rounded-xl shadow-lg border overflow-auto" style={card}>
                    {(obj.items || []).map((it, i) => (
                        <div key={i} className="border-b border-slate-100 last:border-0">
                            <button onClick={(e) => { stop(e); if (interactive) setAcc(a => a === i ? -1 : i); }} className="w-full text-left px-3 py-2 font-bold flex justify-between items-center" style={{ color: accent }}>
                                <span>{it.title}</span><span>{acc === i ? '−' : '+'}</span>
                            </button>
                            {acc === i && <div className="px-3 pb-2 text-slate-600 whitespace-pre-wrap">{it.body}</div>}
                        </div>
                    ))}
                </div>
            );
        case 'flashcard':
            return (
                <button onClick={(e) => { stop(e); if (interactive) setFlipped(f => !f); }}
                    className="w-full h-full rounded-xl shadow-lg border-2 flex items-center justify-center text-center p-3 font-semibold"
                    style={{ borderColor: accent, background: flipped ? accent : '#fff', color: flipped ? '#fff' : '#1e293b', pointerEvents: pe, fontSize: fs }}>
                    {flipped ? (obj.back || 'Відповідь') : (obj.front || 'Питання')}
                </button>
            );
        case 'link':
        default:
            return (
                <button onClick={(e) => { stop(e); if (interactive && obj.url) window.open(obj.url, '_blank', 'noopener'); }}
                    className="w-full h-full rounded-xl text-white font-bold shadow-lg flex items-center justify-center gap-2"
                    style={{ background: accent, fontSize: fs, pointerEvents: pe }}>
                    ▶ {obj.label || 'Перейти'}
                </button>
            );
    }
};

/* ============================================================================
 * ЖУРНАЛ ЗМІН (інлайн-версія logger.js — окремий модуль не резолвиться у цьому
 * build-конвеєрі, що подає main.jsx через stdin). Логіка ідентична logger.js.
 * ========================================================================== */
const __logEntries = [];
const __logListeners = new Set();
const __logNotify = () => {
    const snapshot = __logEntries.slice();
    __logListeners.forEach(fn => { try { fn(snapshot); } catch (e) { /* ignore */ } });
};
const logChange = (category, message, details = null) => {
    const now = new Date();
    const entry = {
        time: now.toISOString(),
        timeLabel: now.toLocaleTimeString('uk-UA'),
        category: category || 'Загальне',
        message: message || '',
        details: details ?? null
    };
    __logEntries.push(entry);
    if (__logEntries.length > 2000) __logEntries.splice(0, __logEntries.length - 2000);
    __logNotify();
    if (typeof console !== 'undefined' && console.log) {
        console.log(`[${entry.timeLabel}] [${entry.category}] ${entry.message}`, details ?? '');
    }
    return entry;
};
const subscribeChangeLog = (fn) => {
    __logListeners.add(fn);
    try { fn(__logEntries.slice()); } catch (e) { /* ignore */ }
    return () => __logListeners.delete(fn);
};
const clearChangeLog = () => { __logEntries.length = 0; __logNotify(); };
const downloadChangeLog = (format = 'txt') => {
    if (__logEntries.length === 0) return false;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fmtDet = (d) => d == null ? '' : (typeof d === 'string' ? d : (() => { try { return JSON.stringify(d); } catch (e) { return String(d); } })());
    let blob, filename;
    if (format === 'json') {
        blob = new Blob([JSON.stringify(__logEntries, null, 2)], { type: 'application/json' });
        filename = `studio-pro-журнал-${stamp}.json`;
    } else {
        const header = `Журнал змін Studio Pro\nСтворено: ${new Date().toLocaleString('uk-UA')}\nЗаписів: ${__logEntries.length}\n${'='.repeat(60)}\n`;
        const body = __logEntries.map(e => {
            const det = fmtDet(e.details);
            return `[${e.time}] [${e.category}] ${e.message}${det ? '\n    ↳ ' + det : ''}`;
        }).join('\n');
        blob = new Blob([header + body + '\n'], { type: 'text/plain;charset=utf-8' });
        filename = `studio-pro-журнал-${stamp}.txt`;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
};

/* ============================================================================
 * 1. КОНСТАНТИ
 * ========================================================================== */

let currentCtx = null;

// Внутрішня система координат слайду (повне HD 16:9)
const CANVAS_W = 1280;
const CANVAS_H = 720;

// Повний набір переходів між слайдами у стилі PowerPoint
const TRANSITIONS = {
    none: { label: 'Немає', duration: 0 },
    cut: { label: 'Різка зміна (Cut)', duration: 0.1 },
    fade: { label: 'Вицвітання (Fade)', duration: 0.9 },
    fadeThroughBlack: { label: 'Вицвітання через чорне', duration: 1.2 },
    pushLeft: { label: 'Зсув вліво (Push)', duration: 0.7 },
    pushRight: { label: 'Зсув вправо (Push)', duration: 0.7 },
    pushUp: { label: 'Зсув угору (Push)', duration: 0.7 },
    pushDown: { label: 'Зсув униз (Push)', duration: 0.7 },
    wipeLeft: { label: 'Витирання вліво (Wipe)', duration: 0.7 },
    wipeRight: { label: 'Витирання вправо (Wipe)', duration: 0.7 },
    wipeUp: { label: 'Витирання вгору (Wipe)', duration: 0.7 },
    wipeDown: { label: 'Витирання вниз (Wipe)', duration: 0.7 },
    splitVertical: { label: 'Розтин вертикальний (Split)', duration: 0.8 },
    splitHorizontal: { label: 'Розтин горизонтальний (Split)', duration: 0.8 },
    revealRight: { label: 'Поява праворуч (Reveal)', duration: 1.2 },
    revealLeft: { label: 'Поява ліворуч (Reveal)', duration: 1.2 },
    coverLeft: { label: 'Накриття вліво (Cover)', duration: 0.7 },
    coverRight: { label: 'Накриття вправо (Cover)', duration: 0.7 },
    coverUp: { label: 'Накриття вгору (Cover)', duration: 0.7 },
    coverDown: { label: 'Накриття вниз (Cover)', duration: 0.7 },
    uncoverLeft: { label: 'Відкриття вліво (Uncover)', duration: 0.7 },
    uncoverRight: { label: 'Відкриття вправо (Uncover)', duration: 0.7 },
    uncoverUp: { label: 'Відкриття вгору (Uncover)', duration: 0.7 },
    uncoverDown: { label: 'Відкриття вниз (Uncover)', duration: 0.7 },
    flash: { label: 'Спалах (Flash)', duration: 0.8 },
    zoom: { label: 'Масштабування (Zoom)', duration: 0.7 },
};

// Ефекти появи об'єктів слайду у стилі PowerPoint (entrance-анімації)
const ANIMATIONS = {
    none: { label: 'Немає (видимий одразу)' },
    appear: { label: 'Виникнення (Appear)' },
    fadeIn: { label: 'Вицвітання (Fade)' },
    flyInLeft: { label: 'Виліт зліва (Fly In)' },
    flyInRight: { label: 'Виліт справа (Fly In)' },
    flyInTop: { label: 'Виліт згори (Fly In)' },
    flyInBottom: { label: 'Виліт знизу (Fly In)' },
    floatIn: { label: 'Спливання вгору (Float In)' },
    floatDown: { label: 'Спливання вниз (Float Down)' },
    wipeFromLeft: { label: 'Витирання зліва (Wipe)' },
    wipeFromRight: { label: 'Витирання справа (Wipe)' },
    wipeFromTop: { label: 'Витирання згори (Wipe)' },
    wipeFromBottom: { label: 'Витирання знизу (Wipe)' },
    splitIn: { label: 'Розтин (Split)' },
    zoomIn: { label: 'Масштабування (Zoom)' },
    growTurn: { label: 'Збільшення з поворотом (Grow & Turn)' },
    swivel: { label: 'Вертушка (Swivel)' },
    stretch: { label: 'Розтягування (Stretch)' },
    spinIn: { label: 'Оберт (Spin In)' },
    bounce: { label: 'Відскік (Bounce)' },
    pop: { label: 'Pop (пружний)' },
};

// Згруповані опції анімацій появи для компактних <select>
// (інлайн-пікер прямо на об'єкті канвасу + бічна панель властивостей)
const ANIMATION_OPTION_GROUPS = [
    { label: 'Базові', items: [['none', 'Немає'], ['appear', 'Виникнення'], ['fadeIn', 'Вицвітання']] },
    { label: 'Виліт', items: [['flyInLeft', '← Зліва'], ['flyInRight', '→ Справа'], ['flyInTop', '↑ Згори'], ['flyInBottom', '↓ Знизу']] },
    { label: 'Спливання', items: [['floatIn', '↑ Вгору'], ['floatDown', '↓ Вниз']] },
    { label: 'Витирання', items: [['wipeFromLeft', 'Зліва'], ['wipeFromRight', 'Справа'], ['wipeFromTop', 'Згори'], ['wipeFromBottom', 'Знизу']] },
    { label: 'Маски', items: [['splitIn', 'Розтин'], ['zoomIn', 'Масштаб']] },
    { label: 'Ефектні', items: [['bounce', 'Відскік'], ['pop', 'Pop'], ['spinIn', 'Оберт'], ['growTurn', 'Збільш. з поворотом']] },
];

const IMAGE_MIME_BY_EXT = {
    png: 'image/png', apng: 'image/apng',
    jpg: 'image/jpeg', jpeg: 'image/jpeg', jpe: 'image/jpeg', jfif: 'image/jpeg', pjpeg: 'image/jpeg', pjp: 'image/jpeg',
    gif: 'image/gif',
    bmp: 'image/bmp', dib: 'image/bmp',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon', cur: 'image/x-icon',
    tif: 'image/tiff', tiff: 'image/tiff',
    avif: 'image/avif',
    heic: 'image/heic', heif: 'image/heif'
};
// Визначення формату за магічними байтами — для файлів без/з хибним розширенням
const sniffImageMime = (b) => {
    if (!b || b.length < 12) return null;
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return 'image/png';
    if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return 'image/jpeg';
    if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return 'image/gif';
    if (b[0] === 0x42 && b[1] === 0x4D) return 'image/bmp';
    if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46
        && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
    if (b[0] === 0x00 && b[1] === 0x00 && b[2] === 0x01 && b[3] === 0x00) return 'image/x-icon';
    if ((b[0] === 0x49 && b[1] === 0x49 && b[2] === 0x2A) || (b[0] === 0x4D && b[1] === 0x4D && b[3] === 0x2A)) return 'image/tiff';
    if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) { // ISO BMFF "ftyp" -> AVIF/HEIC
        const brand = String.fromCharCode(b[8], b[9], b[10], b[11]);
        if (brand.startsWith('avif') || brand.startsWith('avis')) return 'image/avif';
        if (brand.startsWith('heic') || brand.startsWith('heix') || brand.startsWith('mif1')) return 'image/heic';
    }
    let head = '';
    for (let i = 0; i < Math.min(b.length, 256); i++) head += String.fromCharCode(b[i]);
    if (head.includes('<svg') || (head.trimStart().startsWith('<?xml') && head.includes('svg'))) return 'image/svg+xml';
    return null;
};

// Відео, вбудовані у слайди PPTX (p:pic з a:videoFile) -> MIME для blob-відтворення
const VIDEO_MIME_BY_EXT = {
    mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm',
    ogv: 'video/ogg', ogg: 'video/ogg', mpeg: 'video/mpeg', mpg: 'video/mpeg',
    avi: 'video/x-msvideo', wmv: 'video/x-ms-wmv', mkv: 'video/x-matroska'
};

// Маркери вшитого проєкту у експортованому відео (зворотна конвертація MP4 → редактор)
const VIDEO_PROJECT_START = '---STUDIOPRO_VIDEO_DATA_START---';
const VIDEO_PROJECT_END = '---STUDIOPRO_VIDEO_DATA_END---';
// Пошук послідовності байтів у Uint8Array
const indexOfBytes = (hay, needle, from = 0) => {
    outer: for (let i = from; i <= hay.length - needle.length; i++) {
        for (let j = 0; j < needle.length; j++) if (hay[i + j] !== needle[j]) continue outer;
        return i;
    }
    return -1;
};

// Кольори теми Office за замовчуванням — перезаписуються темою конкретної презентації
const DEFAULT_THEME_COLORS = {
    dk1: '#000000', lt1: '#FFFFFF', dk2: '#44546A', lt2: '#E7E6E6',
    accent1: '#4472C4', accent2: '#ED7D31', accent3: '#A5A5A5',
    accent4: '#FFC000', accent5: '#5B9BD5', accent6: '#70AD47',
    hlink: '#0563C1', folHlink: '#954F72'
};
// Псевдоніми схемних кольорів (bg1/tx1 -> реальні слоти теми)
const SCHEME_ALIASES = { bg1: 'lt1', tx1: 'dk1', bg2: 'lt2', tx2: 'dk2' };
// Активна палітра теми поточної презентації (заповнюється парсером)
let themeColors = { ...DEFAULT_THEME_COLORS };
// Шрифти теми поточної презентації (majorFont — заголовки, minorFont — основний текст)
let themeFonts = { major: null, minor: null };
// Сімейства шрифтів, ВБУДОВАНИХ у поточну презентацію та завантажених у document.fonts
// (щоб canvas/DOM-рендер збігався з PowerPoint навіть якщо шрифт не встановлено в системі)
let embeddedFontFamilies = [];

// Прісет-штрихи PowerPoint -> dash-масиви canvas/SVG
const DASH_PATTERNS = {
    dash: [12, 6], dashDot: [12, 6, 3, 6], dot: [3, 6], lgDash: [18, 8],
    lgDashDot: [18, 8, 3, 8], lgDashDotDot: [18, 8, 3, 8, 3, 8], sysDash: [9, 4],
    sysDot: [2, 4], sysDashDot: [9, 4, 2, 4], sysDashDotDot: [9, 4, 2, 4, 2, 4]
};

// ── OMML (Office Math) -> MathML + лінійний текст (формули на слайдах) ──
// Повне покриття ECMA-376 Part 1 §22.1: дроби (всі типи), індекси, корені, дужки,
// n-арні оператори, функції, границі, акценти, риски, groupChr, матриці, системи
// рівнянь (eqArr), pre-індекси (sPre), box/borderBox/phant та стилі рунів (nor/sty/scr).
const xmlEscMath = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const mmlVal = (el, def) => {
    if (!el) return def;
    const v = el.getAttribute('m:val') != null ? el.getAttribute('m:val') : el.getAttribute('val');
    return v == null ? def : v; // порожній рядок ("") — валідне значення (напр. "без дужки")
};
// OnOff-властивість OMML: присутність елемента без val означає "увімкнено"
const mmlOn = (el, defWhenMissing = false) => {
    if (!el) return defWhenMissing;
    const v = mmlVal(el, 'on');
    return !(v === '0' || v === 'off' || v === 'false');
};
const mmlChild = (el, ln) => (el ? Array.from(el.children).find(c => c.localName === ln) : null);
const mmlChildren = (el, ln) => (el ? Array.from(el.children).filter(c => c.localName === ln) : []);

// ── Нормалізація Mathematical Alphanumeric Symbols (U+1D400–U+1D7FF) ──
// PowerPoint зберігає літери формул саме цими кодами (𝐴 = U+1D434), але шрифти
// слайдів (Calibri тощо) не мають таких гліфів — без нормалізації замість літер
// рендериться "ромб зі знаком питання". Згортаємо до базових літер, запам'ятовуючи
// курсив/жирність стильового блоку (курсив і так типовий для <mi> у MathML).
const MATH_GREEK_BASE = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡϴΣΤΥΦΧΨΩ∇αβγδεζηθικλμνξοπρςστυφχψω∂ϵϑϰϕϱϖ';
const foldMathChar = (cp) => {
    if (cp >= 0x1D400 && cp <= 0x1D6A3) { // латиниця: 13 стилів × 52 літери (A-Z, a-z)
        const off = cp - 0x1D400, i = off % 52, s = Math.floor(off / 52);
        return {
            ch: String.fromCharCode(i < 26 ? 65 + i : 97 + (i - 26)),
            italic: [1, 2, 10, 11].includes(s), bold: [0, 2, 4, 7, 9, 11].includes(s)
        };
    }
    if (cp >= 0x1D6A8 && cp <= 0x1D7CB) { // грецькі: 5 стилів × 58 символів
        const off = cp - 0x1D6A8, i = off % 58, s = Math.floor(off / 58);
        return { ch: Array.from(MATH_GREEK_BASE)[i] || '', italic: [1, 2, 4].includes(s), bold: [0, 2, 3, 4].includes(s) };
    }
    if (cp >= 0x1D7CE && cp <= 0x1D7FF) // цифри: 5 стилів × 10
        return { ch: String.fromCharCode(48 + (cp - 0x1D7CE) % 10), italic: false, bold: cp - 0x1D7CE < 10 };
    if (cp === 0x210E) return { ch: 'h', italic: true, bold: false }; // ℎ (Planck)
    return null;
};
// Згортає рядок; повертає текст + чи траплялися курсивні/жирні math-літери
const foldMathText = (s) => {
    let text = '', italic = false, bold = false, folded = false;
    for (const ch of Array.from(String(s || ''))) {
        const f = foldMathChar(ch.codePointAt(0));
        if (f) { text += f.ch; italic = italic || f.italic; bold = bold || f.bold; folded = true; }
        else text += ch;
    }
    return { text, italic, bold, folded };
};
const normalizeMathText = (s) => foldMathText(s).text;

const ommlTokens = (txt) => {
    let o = '';
    // Числа групуємо в один <mn> (12.5 — один токен), літери -> <mi>, решта -> <mo>.
    // Прапорець u обов'язковий: без нього [\s\S] розриває сурогатні пари астральних
    // символів (𝐴 тощо) і замість літери виходить пошкоджений символ.
    const parts = normalizeMathText(txt).match(/\d+(?:[.,]\d+)*|\s+|[\s\S]/gu) || [];
    for (const p of parts) {
        if (/^\s+$/.test(p)) o += '<mspace width="0.25em"/>';
        else if (/^\d/.test(p)) o += `<mn>${xmlEscMath(p)}</mn>`;
        else if (/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґΑ-Ωα-ωϴϵϑϰϕϱϖ∞ℏ∂∇]$/u.test(p)) o += `<mi>${xmlEscMath(p)}</mi>`;
        else if (p === '-') o += '<mo>−</mo>';
        else o += `<mo>${xmlEscMath(p)}</mo>`;
    }
    return o;
};
// Стиль запису руна: m:nor -> звичайний текст, m:sty/m:scr -> mathvariant
const MML_STY_VARIANT = { p: 'normal', b: 'bold', i: 'italic', bi: 'bold-italic' };
const MML_SCR_VARIANT = {
    script: 'script', fraktur: 'fraktur', 'double-struck': 'double-struck',
    'sans-serif': 'sans-serif', monospace: 'monospace'
};
const ommlRun = (r) => {
    const rPr = mmlChild(r, 'rPr');
    const txt = mmlChildren(r, 't').map(t => t.textContent).join('');
    // m:brk у rPr — примусовий розрив рядка формули
    let out = rPr && mmlChild(rPr, 'brk') ? '<mspace linebreak="newline"/>' : '';
    if (rPr && mmlOn(mmlChild(rPr, 'nor'))) return out + `<mtext>${xmlEscMath(normalizeMathText(txt))}</mtext>`;
    const sty = mmlVal(mmlChild(rPr, 'sty'), null);
    const scr = mmlVal(mmlChild(rPr, 'scr'), null);
    const variant = (scr && MML_SCR_VARIANT[scr]) || (sty && MML_STY_VARIANT[sty]) || null;
    const body = ommlTokens(txt);
    return out + (variant ? `<mstyle mathvariant="${variant}">${body}</mstyle>` : body);
};
const ommlToMathmlInner = (el) => {
    let out = '';
    const I = ommlToMathmlInner;
    const R = (node) => `<mrow>${node ? I(node) : ''}</mrow>`;
    for (const c of Array.from(el.children)) {
        const ln = c.localName;
        if (ln.endsWith('Pr')) continue;
        switch (ln) {
            case 'r': out += ommlRun(c); break;
            case 't': out += ommlTokens(c.textContent); break;
            case 'f': { // дріб: bar (звичайний), lin (лінійний a/b), skw (скісний), noBar (без риски)
                const fType = mmlVal(mmlChild(mmlChild(c, 'fPr'), 'type'), 'bar');
                const n = R(mmlChild(c, 'num')), d = R(mmlChild(c, 'den'));
                if (fType === 'lin') out += `<mrow>${n}<mo>/</mo>${d}</mrow>`;
                else if (fType === 'skw') out += `<mfrac bevelled="true">${n}${d}</mfrac>`;
                else if (fType === 'noBar') out += `<mfrac linethickness="0">${n}${d}</mfrac>`;
                else out += `<mfrac>${n}${d}</mfrac>`;
                break;
            }
            case 'sSup': out += `<msup>${R(mmlChild(c, 'e'))}${R(mmlChild(c, 'sup'))}</msup>`; break;
            case 'sSub': out += `<msub>${R(mmlChild(c, 'e'))}${R(mmlChild(c, 'sub'))}</msub>`; break;
            case 'sSubSup': out += `<msubsup>${R(mmlChild(c, 'e'))}${R(mmlChild(c, 'sub'))}${R(mmlChild(c, 'sup'))}</msubsup>`; break;
            case 'sPre': // pre-індекси (напр. ₙCₖ) -> mmultiscripts
                out += `<mmultiscripts>${R(mmlChild(c, 'e'))}<mprescripts/>${R(mmlChild(c, 'sub'))}${R(mmlChild(c, 'sup'))}</mmultiscripts>`; break;
            case 'rad': {
                const deg = mmlChild(c, 'deg');
                const degHide = mmlOn(mmlChild(mmlChild(c, 'radPr'), 'degHide'));
                out += (!degHide && deg && deg.children.length)
                    ? `<mroot>${R(mmlChild(c, 'e'))}${R(deg)}</mroot>`
                    : `<msqrt>${R(mmlChild(c, 'e'))}</msqrt>`;
                break;
            }
            case 'd': { // дужки; begChr/endChr="" означає "без дужки", sepChr — роздільник аргументів
                const dPr = mmlChild(c, 'dPr');
                const b = mmlVal(mmlChild(dPr, 'begChr'), '(');
                const en = mmlVal(mmlChild(dPr, 'endChr'), ')');
                const sep = mmlVal(mmlChild(dPr, 'sepChr'), '|');
                const es = mmlChildren(c, 'e').map(R).join(`<mo>${xmlEscMath(sep)}</mo>`);
                out += `<mrow>${b ? `<mo stretchy="true">${xmlEscMath(b)}</mo>` : ''}${es}${en ? `<mo stretchy="true">${xmlEscMath(en)}</mo>` : ''}</mrow>`;
                break;
            }
            case 'nary': { // ∑ ∏ ∫ ⋃ ... з межами під/над (undOvr) або як індекси (subSup)
                const np = mmlChild(c, 'naryPr');
                const chr = mmlVal(mmlChild(np, 'chr'), '∫');
                const limLoc = mmlVal(mmlChild(np, 'limLoc'), 'undOvr');
                const sb = mmlChild(c, 'sub'), sp = mmlChild(c, 'sup');
                const hasSub = !mmlOn(mmlChild(np, 'subHide')) && sb && sb.children.length;
                const hasSup = !mmlOn(mmlChild(np, 'supHide')) && sp && sp.children.length;
                const op = `<mo stretchy="true">${xmlEscMath(chr)}</mo>`;
                const [tagBoth, tagSub, tagSup] = limLoc === 'subSup'
                    ? ['msubsup', 'msub', 'msup'] : ['munderover', 'munder', 'mover'];
                let big = op;
                if (hasSub && hasSup) big = `<${tagBoth}>${op}${R(sb)}${R(sp)}</${tagBoth}>`;
                else if (hasSub) big = `<${tagSub}>${op}${R(sb)}</${tagSub}>`;
                else if (hasSup) big = `<${tagSup}>${op}${R(sp)}</${tagSup}>`;
                out += `<mrow>${big}${R(mmlChild(c, 'e'))}</mrow>`;
                break;
            }
            case 'func': out += `<mrow>${R(mmlChild(c, 'fName'))}<mo>&#x2061;</mo>${R(mmlChild(c, 'e'))}</mrow>`; break;
            case 'limLow': out += `<munder>${R(mmlChild(c, 'e'))}${R(mmlChild(c, 'lim'))}</munder>`; break;
            case 'limUpp': out += `<mover>${R(mmlChild(c, 'e'))}${R(mmlChild(c, 'lim'))}</mover>`; break;
            case 'acc': { // акцент; типовий символ — комбінований циркумфлекс U+0302
                const chr = mmlVal(mmlChild(mmlChild(c, 'accPr'), 'chr'), '̂');
                out += `<mover accent="true">${R(mmlChild(c, 'e'))}<mo>${xmlEscMath(chr)}</mo></mover>`;
                break;
            }
            case 'bar': { // риска над (pos=top) або під (типово bot) виразом
                const pos = mmlVal(mmlChild(mmlChild(c, 'barPr'), 'pos'), 'bot');
                out += pos === 'top'
                    ? `<mover>${R(mmlChild(c, 'e'))}<mo>&#x00AF;</mo></mover>`
                    : `<munder>${R(mmlChild(c, 'e'))}<mo>&#x005F;</mo></munder>`;
                break;
            }
            case 'groupChr': { // групувальний символ (фігурна дужка під/над виразом)
                const gPr = mmlChild(c, 'groupChrPr');
                const chr = mmlVal(mmlChild(gPr, 'chr'), '⏟');
                const pos = mmlVal(mmlChild(gPr, 'pos'), 'bot');
                out += pos === 'top'
                    ? `<mover>${R(mmlChild(c, 'e'))}<mo stretchy="true">${xmlEscMath(chr)}</mo></mover>`
                    : `<munder>${R(mmlChild(c, 'e'))}<mo stretchy="true">${xmlEscMath(chr)}</mo></munder>`;
                break;
            }
            case 'm': { // матриця: m:mr — рядки, m:e — комірки
                const rows = mmlChildren(c, 'mr')
                    .map(mr => `<mtr>${mmlChildren(mr, 'e').map(e => `<mtd>${R(e)}</mtd>`).join('')}</mtr>`).join('');
                out += `<mtable>${rows}</mtable>`;
                break;
            }
            case 'eqArr': { // система/масив рівнянь — кожен m:e з нового рядка
                const rows = mmlChildren(c, 'e')
                    .map(e => `<mtr><mtd columnalign="left">${R(e)}</mtd></mtr>`).join('');
                out += `<mtable>${rows}</mtable>`;
                break;
            }
            case 'box': out += R(mmlChild(c, 'e')); break;
            case 'borderBox': out += `<menclose notation="box">${R(mmlChild(c, 'e'))}</menclose>`; break;
            case 'phant': out += `<mphantom>${R(mmlChild(c, 'e'))}</mphantom>`; break;
            case 'e': case 'num': case 'den': case 'sub': case 'sup': case 'deg': case 'fName': case 'lim':
            case 'oMath': case 'oMathPara':
                out += I(c); break;
            default: if (c.children.length) out += I(c);
        }
    }
    return out;
};
const ommlToMathml = (el, display = 'block') =>
    `<math xmlns="http://www.w3.org/1998/Math/MathML" display="${display}">${ommlToMathmlInner(el)}</math>`;
// Усі формули всередині вузла (їх може бути кілька в одному текстовому блоці)
const findOMaths = (root) => (root ? Array.from(root.getElementsByTagName('*')).filter(e => e.localName === 'oMath') : []);

// Лінійний (UnicodeMath-подібний) запис формули — для canvas-рендера відео та TTS
const SUP_MAP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', '−': '⁻', '=': '⁼', '(': '⁽', ')': '⁾', 'n': 'ⁿ', 'i': 'ⁱ' };
const SUB_MAP = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋', '−': '₋', '=': '₌', '(': '₍', ')': '₎' };
const toScript = (s, map) => {
    const cs = Array.from(String(s || '').trim());
    return cs.length && cs.every(ch => map[ch]) ? cs.map(ch => map[ch]).join('') : null;
};
const linWrap = (s) => { const t = String(s || '').trim(); return Array.from(t).length > 1 ? `(${t})` : t; };
const ommlToLinear = (el) => {
    const L = ommlToLinear;
    const child = (c, ln) => { const e = mmlChild(c, ln); return e ? L(e) : ''; };
    const sup = (s) => toScript(s, SUP_MAP) || `^${linWrap(s)}`;
    const sub = (s) => toScript(s, SUB_MAP) || `_${linWrap(s)}`;
    let out = '';
    for (const c of Array.from(el.children)) {
        const ln = c.localName;
        if (ln.endsWith('Pr')) continue;
        switch (ln) {
            case 'r': out += normalizeMathText(mmlChildren(c, 't').map(t => t.textContent).join('')); break;
            case 't': out += normalizeMathText(c.textContent); break;
            case 'f': out += `${linWrap(child(c, 'num'))}/${linWrap(child(c, 'den'))}`; break;
            case 'sSup': out += child(c, 'e') + sup(child(c, 'sup')); break;
            case 'sSub': out += child(c, 'e') + sub(child(c, 'sub')); break;
            case 'sSubSup': out += child(c, 'e') + sub(child(c, 'sub')) + sup(child(c, 'sup')); break;
            case 'sPre': out += sub(child(c, 'sub')) + sup(child(c, 'sup')) + child(c, 'e'); break;
            case 'rad': {
                const dg = mmlChild(c, 'deg');
                const showDeg = dg && dg.children.length && !mmlOn(mmlChild(mmlChild(c, 'radPr'), 'degHide'));
                out += `${showDeg ? L(dg) : ''}√(${child(c, 'e')})`;
                break;
            }
            case 'd': {
                const dPr = mmlChild(c, 'dPr');
                out += mmlVal(mmlChild(dPr, 'begChr'), '(')
                    + mmlChildren(c, 'e').map(L).join(mmlVal(mmlChild(dPr, 'sepChr'), '|'))
                    + mmlVal(mmlChild(dPr, 'endChr'), ')');
                break;
            }
            case 'nary': {
                const np = mmlChild(c, 'naryPr');
                const sb = mmlChild(c, 'sub'), sp = mmlChild(c, 'sup');
                let s = mmlVal(mmlChild(np, 'chr'), '∫');
                if (!mmlOn(mmlChild(np, 'subHide')) && sb && sb.children.length) s += sub(L(sb));
                if (!mmlOn(mmlChild(np, 'supHide')) && sp && sp.children.length) s += sup(L(sp));
                out += `${s} ${child(c, 'e')}`;
                break;
            }
            case 'func': out += `${child(c, 'fName')} ${child(c, 'e')}`; break;
            case 'limLow': case 'limUpp': out += child(c, 'e') + sub(child(c, 'lim')); break;
            case 'acc': out += child(c, 'e') + mmlVal(mmlChild(mmlChild(c, 'accPr'), 'chr'), '̂'); break;
            case 'bar': out += child(c, 'e') + '̅'; break;
            case 'groupChr': out += child(c, 'e'); break;
            case 'm': out += '[' + mmlChildren(c, 'mr').map(mr => mmlChildren(mr, 'e').map(L).join('  ')).join('; ') + ']'; break;
            case 'eqArr': out += mmlChildren(c, 'e').map(L).join('; '); break;
            default: out += L(c);
        }
    }
    return out;
};

// Розміри наконечника стрілки PowerPoint (множники товщини лінії) — len/w: sm/med/lg
const ARROW_LEN = { sm: 2.5, med: 3.5, lg: 5 };
const ARROW_WID = { sm: 2.5, med: 4, lg: 6 };
// Нормалізація кінця стрілки (зворотна сумісність зі старим boolean=true)
const normArrowEnd = (e) => (e ? (typeof e === 'object' ? e : { type: 'triangle', w: 'med', len: 'med' }) : null);

const SHAPE_KIND_BY_PRST = {
    // Лінії
    line: 'line', straightConnector1: 'line', bentConnector2: 'line', bentConnector3: 'line', curvedConnector3: 'line',
    // Базові прямокутники
    rect: 'rect', snip1Rect: 'rect', snip2SameRect: 'rect', snip2DiagRect: 'rect', snipRoundRect: 'rect',
    round1Rect: 'roundRect', round2SameRect: 'roundRect', round2DiagRect: 'roundRect', roundRect: 'roundRect',
    // Основні фігури
    ellipse: 'ellipse', triangle: 'triangle', rtTriangle: 'rtTriangle', diamond: 'diamond',
    parallelogram: 'parallelogram', trapezoid: 'trapezoid', pentagon: 'pentagon', hexagon: 'hexagon',
    heptagon: 'heptagon', octagon: 'octagon', decagon: 'decagon', dodecagon: 'dodecagon',
    pie: 'ellipse', chord: 'ellipse', teardrop: 'ellipse', frame: 'rect', halfFrame: 'rect',
    corner: 'triangle', diagStripe: 'parallelogram', plus: 'cross', mathPlus: 'cross', mathMinus: 'minus',
    mathMultiply: 'cross', mathDivide: 'ellipse', mathEqual: 'rect', mathNotEqual: 'rect',
    // Зірки та прапори
    star4: 'star4', star5: 'star5', star6: 'star6', star7: 'star7', star8: 'star8', star10: 'star10',
    star12: 'star12', star16: 'star16', star24: 'star24', star32: 'star32',
    ribbon: 'rect', ribbon2: 'rect', ellipseRibbon: 'ellipse', ellipseRibbon2: 'ellipse',
    // Стрілки
    rightArrow: 'rightArrow', leftArrow: 'leftArrow', upArrow: 'upArrow', downArrow: 'downArrow',
    leftRightArrow: 'leftRightArrow', upDownArrow: 'upDownArrow', quadArrow: 'quadArrow',
    leftRightUpArrow: 'quadArrow', leftUpArrow: 'quadArrow', leftRightDownArrow: 'quadArrow',
    bentArrow: 'rightArrow', uturnArrow: 'rightArrow', circularArrow: 'ellipse',
    chevron: 'chevron', homePlate: 'chevron', rightArrowCallout: 'rightArrow', leftArrowCallout: 'leftArrow',
    // Блок-схеми (flowchart)
    flowChartProcess: 'rect', flowChartAlternateProcess: 'roundRect', flowChartDecision: 'diamond',
    flowChartInputOutput: 'parallelogram', flowChartPredefinedProcess: 'rect', flowChartInternalStorage: 'rect',
    flowChartDocument: 'rect', flowChartMultidocument: 'rect', flowChartTerminator: 'roundRect',
    flowChartPreparation: 'hexagon', flowChartManualInput: 'trapezoid', flowChartManualOperation: 'trapezoid',
    flowChartConnector: 'ellipse', flowChartPunchedCard: 'rect', flowChartPunchedTape: 'rect',
    flowChartSummingJunction: 'cross', flowChartOr: 'ellipse', flowChartCollate: 'triangle', flowChartSort: 'diamond',
    flowChartExtract: 'triangle', flowChartMerge: 'triangle', flowChartOfflineStorage: 'triangle',
    flowChartMagneticTape: 'ellipse', flowChartMagneticDisk: 'ellipse', flowChartMagneticDrum: 'ellipse',
    flowChartDisplay: 'rect', flowChartDelay: 'roundRect',
    // Виноски (callouts)
    wedgeRectCallout: 'callout', wedgeRoundRectCallout: 'callout', wedgeEllipseCallout: 'ellipse',
    cloudCallout: 'callout', borderCallout1: 'callout', borderCallout2: 'callout', borderCallout3: 'callout',
    accentCallout1: 'callout', accentCallout2: 'callout', accentCallout3: 'callout', callout1: 'callout', callout2: 'callout', callout3: 'callout',
    // Дії (action buttons)
    actionButtonBackPrevious: 'leftArrow', actionButtonForwardNext: 'rightArrow', actionButtonBeginning: 'leftArrow',
    actionButtonEnd: 'rightArrow', actionButtonHome: 'pentagon', actionButtonInformation: 'ellipse',
    actionButtonReturn: 'leftArrow', actionButtonMovie: 'rect', actionButtonDocument: 'rect', actionButtonSound: 'ellipse',
    actionButtonHelp: 'ellipse', actionButtonBlank: 'rect'
};

const SHAPE_POLYGONS = {
    triangle: [[0.5, 0], [1, 1], [0, 1]],
    rtTriangle: [[0, 0], [0, 1], [1, 1]],
    diamond: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
    parallelogram: [[0.2, 0], [1, 0], [0.8, 1], [0, 1]],
    trapezoid: [[0.2, 0], [0.8, 0], [1, 1], [0, 1]],
    pentagon: [[0.5, 0], [1, 0.38], [0.81, 1], [0.19, 1], [0, 0.38]],
    hexagon: [[0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]],
    heptagon: [[0.5, 0], [0.9, 0.2], [1, 0.6], [0.75, 1], [0.25, 1], [0, 0.6], [0.1, 0.2]],
    octagon: [[0.3, 0], [0.7, 0], [1, 0.3], [1, 0.7], [0.7, 1], [0.3, 1], [0, 0.7], [0, 0.3]],
    decagon: [[0.5, 0], [0.8, 0.1], [1, 0.35], [1, 0.65], [0.8, 0.9], [0.5, 1], [0.2, 0.9], [0, 0.65], [0, 0.35], [0.2, 0.1]],
    dodecagon: [[0.25, 0.06], [0.5, 0], [0.75, 0.06], [0.93, 0.25], [1, 0.5], [0.93, 0.75], [0.75, 0.93], [0.5, 1], [0.25, 0.93], [0.06, 0.75], [0, 0.5], [0.06, 0.25]],
    star4: [[0.5, 0], [0.6, 0.4], [1, 0.5], [0.6, 0.6], [0.5, 1], [0.4, 0.6], [0, 0.5], [0.4, 0.4]],
    star5: [[0.5, 0], [0.62, 0.35], [1, 0.38], [0.7, 0.6], [0.81, 1], [0.5, 0.75], [0.19, 1], [0.3, 0.6], [0, 0.38], [0.38, 0.35]],
    star6: [[0.5, 0], [0.65, 0.25], [1, 0.25], [0.75, 0.5], [1, 0.75], [0.65, 0.75], [0.5, 1], [0.35, 0.75], [0, 0.75], [0.25, 0.5], [0, 0.25], [0.35, 0.25]],
    star7: [[0.5, 0], [0.6, 0.25], [0.9, 0.2], [0.75, 0.45], [1, 0.6], [0.7, 0.7], [0.7, 1], [0.5, 0.75], [0.3, 1], [0.3, 0.7], [0, 0.6], [0.25, 0.45], [0.1, 0.2], [0.4, 0.25]],
    star8: [[0.5, 0], [0.65, 0.15], [1, 0], [0.85, 0.35], [1, 0.5], [0.85, 0.65], [1, 1], [0.65, 0.85], [0.5, 1], [0.35, 0.85], [0, 1], [0.15, 0.65], [0, 0.5], [0.15, 0.35], [0, 0], [0.35, 0.15]],
    star10: [[0.5, 0], [0.6, 0.2], [0.8, 0.05], [0.75, 0.3], [1, 0.35], [0.85, 0.5], [1, 0.65], [0.75, 0.7], [0.8, 0.95], [0.6, 0.8], [0.5, 1], [0.4, 0.8], [0.2, 0.95], [0.25, 0.7], [0, 0.65], [0.15, 0.5], [0, 0.35], [0.25, 0.3], [0.2, 0.05], [0.4, 0.2]],
    star12: [[0.5, 0], [0.6, 0.2], [0.75, 0.05], [0.75, 0.25], [0.95, 0.25], [0.8, 0.4], [1, 0.5], [0.8, 0.6], [0.95, 0.75], [0.75, 0.75], [0.75, 0.95], [0.6, 0.8], [0.5, 1], [0.4, 0.8], [0.25, 0.95], [0.25, 0.75], [0.05, 0.75], [0.2, 0.6], [0, 0.5], [0.2, 0.4], [0.05, 0.25], [0.25, 0.25], [0.25, 0.05], [0.4, 0.2]],
    star16: [[0.5, 0], [0.55, 0.2], [0.7, 0.1], [0.65, 0.3], [0.9, 0.3], [0.75, 0.45], [1, 0.5], [0.75, 0.55], [0.9, 0.7], [0.65, 0.7], [0.7, 0.9], [0.55, 0.8], [0.5, 1], [0.45, 0.8], [0.3, 0.9], [0.35, 0.7], [0.1, 0.7], [0.25, 0.55], [0, 0.5], [0.25, 0.45], [0.1, 0.3], [0.35, 0.3], [0.3, 0.1], [0.45, 0.2]],
    star24: [[0.5, 0], [0.55, 0.15], [0.65, 0.05], [0.65, 0.2], [0.8, 0.15], [0.75, 0.3], [0.9, 0.3], [0.8, 0.4], [0.95, 0.45], [0.85, 0.5], [0.95, 0.55], [0.8, 0.6], [0.9, 0.7], [0.75, 0.7], [0.8, 0.85], [0.65, 0.8], [0.65, 0.95], [0.55, 0.85], [0.5, 1], [0.45, 0.85], [0.35, 0.95], [0.35, 0.8], [0.2, 0.85], [0.25, 0.7], [0.1, 0.7], [0.2, 0.6], [0.05, 0.55], [0.15, 0.5], [0.05, 0.45], [0.2, 0.4], [0.1, 0.3], [0.25, 0.3], [0.2, 0.15], [0.35, 0.2], [0.35, 0.05], [0.45, 0.15]],
    star32: [[0.5, 0], [0.53, 0.1], [0.6, 0.05], [0.6, 0.15], [0.7, 0.1], [0.68, 0.2], [0.8, 0.15], [0.75, 0.25], [0.85, 0.25], [0.8, 0.35], [0.95, 0.35], [0.85, 0.45], [1, 0.5], [0.85, 0.55], [0.95, 0.65], [0.8, 0.65], [0.85, 0.75], [0.75, 0.75], [0.8, 0.85], [0.68, 0.8], [0.7, 0.9], [0.6, 0.85], [0.6, 0.95], [0.53, 0.9], [0.5, 1], [0.47, 0.9], [0.4, 0.95], [0.4, 0.85], [0.3, 0.9], [0.32, 0.8], [0.2, 0.85], [0.25, 0.75], [0.15, 0.75], [0.2, 0.65], [0.05, 0.65], [0.15, 0.55], [0, 0.5], [0.15, 0.45], [0.05, 0.35], [0.2, 0.35], [0.15, 0.25], [0.25, 0.25], [0.2, 0.15], [0.32, 0.2], [0.3, 0.1], [0.4, 0.15], [0.4, 0.05], [0.47, 0.1]],
    rightArrow: [[0, 0.25], [0.6, 0.25], [0.6, 0], [1, 0.5], [0.6, 1], [0.6, 0.75], [0, 0.75]],
    leftArrow: [[1, 0.25], [0.4, 0.25], [0.4, 0], [0, 0.5], [0.4, 1], [0.4, 0.75], [1, 0.75]],
    upArrow: [[0.25, 1], [0.25, 0.4], [0, 0.4], [0.5, 0], [1, 0.4], [0.75, 0.4], [0.75, 1]],
    downArrow: [[0.25, 0], [0.25, 0.6], [0, 0.6], [0.5, 1], [1, 0.6], [0.75, 0.6], [0.75, 0]],
    leftRightArrow: [[0.2, 0], [0, 0.5], [0.2, 1], [0.2, 0.75], [0.8, 0.75], [0.8, 1], [1, 0.5], [0.8, 0], [0.8, 0.25], [0.2, 0.25]],
    upDownArrow: [[0.25, 0.2], [0.75, 0.2], [0.75, 0.8], [1, 0.8], [0.5, 1], [0, 0.8], [0.25, 0.8], [0.25, 0.2], [0, 0.2], [0.5, 0], [1, 0.2], [0.75, 0.2]],
    quadArrow: [[0.4, 0.4], [0.4, 0.1], [0.2, 0.1], [0.5, 0], [0.8, 0.1], [0.6, 0.1], [0.6, 0.4], [0.9, 0.4], [0.9, 0.2], [1, 0.5], [0.9, 0.8], [0.9, 0.6], [0.6, 0.6], [0.6, 0.9], [0.8, 0.9], [0.5, 1], [0.2, 0.9], [0.4, 0.9], [0.4, 0.6], [0.1, 0.6], [0.1, 0.8], [0, 0.5], [0.1, 0.2], [0.1, 0.4]],
    chevron: [[0, 0], [0.7, 0], [1, 0.5], [0.7, 1], [0, 1], [0.3, 0.5]],
    cross: [[0.3, 0], [0.7, 0], [0.7, 0.3], [1, 0.3], [1, 0.7], [0.7, 0.7], [0.7, 1], [0.3, 1], [0.3, 0.7], [0, 0.7], [0, 0.3], [0.3, 0.3]],
    minus: [[0, 0.35], [1, 0.35], [1, 0.65], [0, 0.65]],
    check: [[0.25, 0.5], [0.45, 0.7], [0.9, 0.15], [1, 0.25], [0.45, 0.9], [0.15, 0.6]],
    callout: [[0, 0], [1, 0], [1, 0.8], [0.3, 0.8], [0, 1], [0.15, 0.8], [0, 0.8]]
};

/* ============================================================================
 * 2. ДОПОМІЖНІ ФУНКЦІЇ (XML, кольори, математика анімацій, аудіо)
 * ========================================================================== */

// Повертає перший прямий дочірній елемент з одним із заданих тегів (з урахуванням префіксу namespace)
const getDirectChild = (el, ...tagNames) => {
    if (!el) return null;
    return Array.from(el.children).find(c => tagNames.includes(c.tagName)) || null;
};

const hexToRgb = (hex) => {
    const m = hex.replace('#', '');
    return [parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16)];
};
const rgbToHex = (r, g, b) =>
    '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

// Модифікатори кольору OOXML (shade/tint/lumMod/lumOff/alpha) — наближене відтворення відтінків теми.
// alpha (прозорість) повертається як rgba(...) — критично для напівпрозорих плашок під білим текстом,
// інакше вони рендеряться суцільно чорними/непрозорими (як було в PowerPoint 1:1).
const applyColorMods = (hex, clrEl) => {
    let [r, g, b] = hexToRgb(hex);
    let alpha = 1;
    for (const ch of Array.from(clrEl.children)) {
        const val = parseInt(ch.getAttribute('val'), 10);
        if (isNaN(val)) continue;
        const f = val / 100000;
        switch (ch.localName) {
            case 'shade': r *= f; g *= f; b *= f; break;
            case 'tint': r = r * f + 255 * (1 - f); g = g * f + 255 * (1 - f); b = b * f + 255 * (1 - f); break;
            case 'lumMod': r *= f; g *= f; b *= f; break;
            case 'lumOff': r += 255 * f; g += 255 * f; b += 255 * f; break;
            case 'alpha': alpha = f; break;
        }
    }
    if (alpha < 1) {
        const ci = (v) => Math.max(0, Math.min(255, Math.round(v)));
        return `rgba(${ci(r)}, ${ci(g)}, ${ci(b)}, ${Math.round(alpha * 1000) / 1000})`;
    }
    return rgbToHex(r, g, b);
};

// Витягує колір (srgbClr / schemeClr / sysClr) з контейнера типу solidFill, з модифікаторами
const getSrgbColor = (container) => {
    if (!container) return null;
    const clrEl = getDirectChild(container, 'a:srgbClr', 'srgbClr', 'a:schemeClr', 'schemeClr', 'a:sysClr', 'sysClr');
    if (!clrEl) return null;
    let hex = null;
    if (clrEl.localName === 'srgbClr') hex = '#' + clrEl.getAttribute('val');
    else if (clrEl.localName === 'sysClr') hex = '#' + (clrEl.getAttribute('lastClr') || '000000');
    else {
        const key = clrEl.getAttribute('val');
        hex = themeColors[SCHEME_ALIASES[key] || key] || null;
    }
    if (!hex) return null;
    return applyColorMods(hex, clrEl);
};

// Градієнт із gradFill: точки (pos 0..1, колір) + кут (OOXML: 0° = зліва направо)
const parseGradFill = (gradFill) => {
    const gsLst = getDirectChild(gradFill, 'a:gsLst', 'gsLst');
    if (!gsLst) return null;
    const stops = Array.from(gsLst.children)
        .filter(c => c.localName === 'gs')
        .map(gs => ({ pos: (parseInt(gs.getAttribute('pos'), 10) || 0) / 100000, color: getSrgbColor(gs) }))
        .filter(s => s.color)
        .sort((a, b) => a.pos - b.pos);
    if (stops.length === 0) return null;
    const lin = getDirectChild(gradFill, 'a:lin', 'lin');
    const angle = lin ? Math.round((parseInt(lin.getAttribute('ang'), 10) || 0) / 60000) : 90;
    return { stops, angle };
};

// Повне визначення заливки: { color, gradient }; noFill -> обидва null
const getFillDef = (propsEl) => {
    const none = { color: null, gradient: null };
    if (!propsEl) return none;
    if (getDirectChild(propsEl, 'a:noFill', 'noFill')) return none;
    const solidFill = getDirectChild(propsEl, 'a:solidFill', 'solidFill');
    if (solidFill) return { color: getSrgbColor(solidFill), gradient: null };
    const gradFill = getDirectChild(propsEl, 'a:gradFill', 'gradFill');
    if (gradFill) {
        const gradient = parseGradFill(gradFill);
        if (!gradient) return none;
        return { color: gradient.stops[0].color, gradient: gradient.stops.length > 1 ? gradient : null };
    }
    return none;
};

// Колір заливки (для градієнта — перша точка); noFill -> null
const getFillColor = (propsEl) => getFillDef(propsEl).color;

// Властивості контуру фігури/лінії: колір, товщина (pt), штрих, стрілки на кінцях
const getLineProps = (spPr, spStyle) => {
    const ln = spPr ? getDirectChild(spPr, 'a:ln', 'ln') : null;
    const noFill = ln ? getDirectChild(ln, 'a:noFill', 'noFill') : null;
    if (noFill) return { color: null };

    let color = ln ? getFillColor(ln) : null;
    let widthPt = 1;
    let dash = null;
    let arrowHead = null;
    let arrowTail = null;

    if (ln) {
        const wAttr = ln.getAttribute('w');
        widthPt = wAttr ? parseInt(wAttr, 10) / 12700 : 1;
        const prstDash = getDirectChild(ln, 'a:prstDash', 'prstDash');
        dash = prstDash ? (DASH_PATTERNS[prstDash.getAttribute('val')] || null) : null;

        const parseEnd = (el) => {
            if (!el) return null;
            const type = el.getAttribute('type');
            if (!type || type === 'none') return null;
            return { type, w: el.getAttribute('w') || 'med', len: el.getAttribute('len') || 'med' };
        };
        arrowHead = parseEnd(getDirectChild(ln, 'a:headEnd', 'headEnd'));
        arrowTail = parseEnd(getDirectChild(ln, 'a:tailEnd', 'tailEnd'));
    }

    if (!color && spStyle) {
        const lnRef = getDirectChild(spStyle, 'a:lnRef', 'lnRef');
        if (lnRef) {
            const idx = parseInt(lnRef.getAttribute('idx'), 10) || 0;
            if (idx > 0) {
                color = getSrgbColor(lnRef);
                if (!color) color = '#1e293b';
            } else if (!ln) {
                return null;
            }
        }
    }

    if (!ln && !color) return null;
    if (!color) color = '#1e293b';

    return { color, widthPt, dash, arrowHead, arrowTail };
};

// Easing-функції для анімацій
const EASING = {
    linear: t => t,
    easeOutCubic: t => 1 - Math.pow(1 - t, 3),
    easeOutBack: t => {
        const c1 = 1.70158, c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    easeOutBounce: t => {
        const n1 = 7.5625, d1 = 2.75;
        if (t < 1 / d1) return n1 * t * t;
        if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
        if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    },
};

// Стан об'єкта в момент часу t (сек від початку слайду):
// видимість, прозорість, зсув, масштаб (X/Y), оберт, clip-маска появи
const getObjectRenderState = (obj, time) => {
    const base = { visible: true, alpha: 1, dx: 0, dy: 0, scale: 1, scaleX: null, scaleY: null, rot: 0, clip: null };
    const anim = obj.animation || { type: 'none', delay: 0, duration: 0.5 };
    if (!anim.type || anim.type === 'none') return base;
    const start = anim.delay || 0;
    const dur = Math.max(anim.duration || 0.5, 0.05);
    if (time < start) return { ...base, visible: false, alpha: 0 };

    const p = Math.min((time - start) / dur, 1);
    const e = EASING.easeOutCubic(p);

    switch (anim.type) {
        case 'appear': return base;
        case 'fadeIn': return { ...base, alpha: e };
        case 'flyInLeft': return { ...base, dx: -(1 - e) * (obj.x + obj.w + 60) };
        case 'flyInRight': return { ...base, dx: (1 - e) * (CANVAS_W - obj.x + 60) };
        case 'flyInTop': return { ...base, dy: -(1 - e) * (obj.y + obj.h + 60) };
        case 'flyInBottom': return { ...base, dy: (1 - e) * (CANVAS_H - obj.y + 60) };
        case 'floatIn': return { ...base, alpha: e, dy: (1 - e) * 50 };
        case 'floatDown': return { ...base, alpha: e, dy: -(1 - e) * 50 };
        case 'wipeFromLeft': return { ...base, clip: { type: 'wipe', dir: 'left', p: e } };
        case 'wipeFromRight': return { ...base, clip: { type: 'wipe', dir: 'right', p: e } };
        case 'wipeFromTop': return { ...base, clip: { type: 'wipe', dir: 'top', p: e } };
        case 'wipeFromBottom': return { ...base, clip: { type: 'wipe', dir: 'bottom', p: e } };
        case 'splitIn': return { ...base, clip: { type: 'split', p: e } };
        case 'blindsIn': return { ...base, clip: { type: 'blinds', p } };
        case 'barsIn': return { ...base, clip: { type: 'bars', p } };
        case 'shapeCircleIn': return { ...base, clip: { type: 'circle', p: e } };
        case 'wheelIn': return { ...base, clip: { type: 'wedge', p } };
        case 'zoomIn': return { ...base, alpha: p, scale: 0.4 + 0.6 * e };
        case 'growTurn': return { ...base, alpha: p, scale: Math.max(e, 0.01), rot: -(1 - e) * 90 };
        case 'swivel': return { ...base, alpha: p, scaleX: Math.max(e * Math.abs(Math.cos((1 - p) * Math.PI * 3)), 0.01), scaleY: 1 };
        case 'stretch': return { ...base, scaleX: Math.max(e, 0.01), scaleY: 1 };
        case 'spinIn': return { ...base, alpha: p, scale: Math.max(e, 0.01), rot: (1 - e) * 360 };
        case 'bounce': return { ...base, alpha: Math.min(p * 3, 1), dy: -(1 - EASING.easeOutBounce(p)) * 220 };
        case 'pop': {
            const b = EASING.easeOutBack(p);
            return { ...base, alpha: Math.min(p * 2, 1), scale: Math.max(b, 0.01) };
        }
        default: return base;
    }
};

// Кількість байтів у base64-рядку (без декодування)
const base64ByteLength = (b64) => {
    if (!b64) return 0;
    let padding = 0;
    if (b64.endsWith('==')) padding = 2;
    else if (b64.endsWith('=')) padding = 1;
    return (b64.length * 3) / 4 - padding;
};

// Тривалість PCM16-аудіо у секундах
const pcmDurationSec = (base64, sampleRate) => base64ByteLength(base64) / 2 / (sampleRate || 24000);

// base64 PCM16 -> AudioBuffer
const base64ToAudioBuffer = (audioCtx, base64PCM, sampleRate) => {
    const binaryString = atob(base64PCM);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) float32Array[i] = int16Array[i] / 32768.0;

    const buffer = audioCtx.createBuffer(1, float32Array.length, sampleRate || 24000);
    buffer.getChannelData(0).set(float32Array);
    return buffer;
};

// Рендер-руни рядка: фрагменти тексту з власними стилями (+ маркер списку першим фрагментом).
// Для рядків без runs (старі/ручні об'єкти) синтезується один рун зі стилів рядка.
const getRenderRuns = (line) => {
    const baseStyle = {
        color: line.color || '#1e293b', fontSize: line.fontSize || 24,
        bold: !!line.bold, italic: !!line.italic, underline: false, strike: false,
        font: line.font || null
    };
    let runs;
    if (line.runs && line.runs.length) runs = line.runs;
    else if (line.text) runs = [{ ...baseStyle, text: line.bullet ? line.text.slice(line.bullet.length) : line.text }];
    else runs = [];
    if (line.bullet) runs = [{ ...(runs[0] || baseStyle), underline: false, strike: false, math: false, mathml: null, text: line.bullet }, ...runs];
    return runs;
};

const PPT_FALLBACK_FONTS = '"Calibri", "Arial", "Segoe UI", "Helvetica Neue", "Segoe UI Emoji", "Segoe UI Symbol", "Cambria Math", "STIX Two Math", "Noto Sans Math", "Apple Color Emoji", "Noto Color Emoji", sans-serif';

const buildRunFont = (r) =>
    `${r.italic ? 'italic ' : ''}${r.bold ? 'bold ' : ''}${r.fontSize || 24}px ${r.font ? `"${r.font}", ` : ''}${PPT_FALLBACK_FONTS}`;

// CSS-градієнт із визначення заливки (кут OOXML 0° = вправо; CSS 0° = вгору, тому +90)
const cssGradient = (g) =>
    `linear-gradient(${(g.angle || 0) + 90}deg, ${g.stops.map(s => `${s.color} ${Math.round(s.pos * 100)}%`).join(', ')})`;

const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

// Розкладає рядок (з рунами) на візуальні рядки, що вміщуються у maxWidth (для canvas)
const layoutRichText = (octx, line, maxWidth) => {
    const runs = getRenderRuns(line);
    const out = [];
    let cur = { segs: [], width: 0, maxFs: 0 };
    const flush = () => { out.push(cur); cur = { segs: [], width: 0, maxFs: 0 }; };
    for (const r of runs) {
        const fs = r.fontSize || 24;
        const ls = r.letterSpacing || 0;
        octx.font = buildRunFont(r);
        // Математичний run — один нерозривний токен (формулу не ламаємо посеред запису)
        const tokens = r.math
            ? [String(r.text || '')]
            : String(r.text || '').split(/(\s+)/).filter(t => t.length);
        for (const tok of tokens) {
            const tw = octx.measureText(tok).width + ls * tok.length;
            if (tok.trim() && cur.width + tw > maxWidth && cur.width > 0) flush();
            const last = cur.segs[cur.segs.length - 1];
            if (last && last.run === r) { last.text += tok; last.width += tw; }
            else cur.segs.push({ run: r, text: tok, width: tw });
            cur.width += tw;
            cur.maxFs = Math.max(cur.maxFs, fs);
        }
    }
    if (cur.segs.length || out.length === 0) out.push(cur);
    for (const vl of out) if (!vl.maxFs) vl.maxFs = line.fontSize || 24;
    return out;
};

// Малює текстовий блок (рядки з рунами, переноси, вирівнювання, відступи) у прямокутнику w×h
// pad: { l, r, t, b } або числа padX/padY для зворотної сумісності; autofit — зменшити шрифт
const drawTextBlock = (octx, lines, w, h, vAlign, padXorPad = 6, padY = 6, autofit = false) => {
    let pL, pR, pT, pB;
    if (typeof padXorPad === 'object' && padXorPad !== null) {
        pL = padXorPad.l; pR = padXorPad.r; pT = padXorPad.t; pB = padXorPad.b;
    } else {
        pL = pR = padXorPad; pT = pB = padY;
    }

    const buildBlocks = (scale) => {
        const blocks = [];
        let totalH = 0;
        let prevLine = null;
        for (const line of (lines || [])) {
            const indentPx = (line.indent || 0) * 28;
            const ls = line.lineSpacing || 1;
            // spcBef: якщо це відносна величина (<1 = ratio), інакше absolute px
            const befPx = line.spcBef ? (line.spcBef < 1 ? line.spcBef * (line.fontSize || 24) * scale : line.spcBef) : 0;
            const aftPx = line.spcAft ? (line.spcAft < 1 ? line.spcAft * (line.fontSize || 24) * scale : line.spcAft) : 0;
            if (prevLine && befPx > 0) totalH += befPx;

            const scaledLine = scale < 1 ? {
                ...line,
                fontSize: Math.round((line.fontSize || 24) * scale),
                runs: (line.runs || []).map(r => ({ ...r, fontSize: Math.round((r.fontSize || 24) * scale), letterSpacing: (r.letterSpacing || 0) * scale }))
            } : line;
            const vls = layoutRichText(octx, scaledLine, Math.max(w - pL - pR - indentPx, 20));
            for (const vl of vls) {
                const lh = vl.maxFs * 1.25 * ls;
                blocks.push({ vl, line: scaledLine, indentPx, lh, befPx: blocks.length === 0 ? 0 : (prevLine !== line && befPx > 0 ? befPx : 0) });
                totalH += lh;
            }
            if (aftPx > 0) totalH += aftPx;
            prevLine = line;
        }
        return { blocks, totalH };
    };

    let scale = 1;
    let { blocks, totalH } = buildBlocks(1);
    if (autofit && totalH > h - pT - pB && lines && lines.length) {
        let lo = 0.3, hi = 1;
        for (let i = 0; i < 8; i++) {
            const mid = (lo + hi) / 2;
            const r = buildBlocks(mid);
            if (r.totalH <= h - pT - pB) lo = mid;
            else hi = mid;
        }
        scale = lo;
        ({ blocks, totalH } = buildBlocks(scale));
    }

    let cursorY = pT;
    if (vAlign === 'ctr') cursorY = Math.max((h - totalH) / 2, pT);
    else if (vAlign === 'b') cursorY = Math.max(h - totalH - pB, pT);

    octx.textBaseline = 'alphabetic';
    octx.textAlign = 'left';
    for (const b of blocks) {
        cursorY += b.befPx || 0;
        let tx = pL + b.indentPx;
        if (b.line.align === 'ctr') tx = Math.max((w - b.vl.width) / 2, pL);
        else if (b.line.align === 'r') tx = Math.max(w - pR - b.vl.width, pL);
        const baseY = cursorY + b.vl.maxFs;
        for (const seg of b.vl.segs) {
            const r = seg.run;
            const ls = r.letterSpacing || 0;
            octx.font = buildRunFont(r);
            octx.fillStyle = r.color || '#1e293b';
            if (ls) {
                const chars = Array.from(seg.text);
                let cx = tx;
                for (const ch of chars) {
                    octx.fillText(ch, cx, baseY);
                    cx += octx.measureText(ch).width + ls;
                }
            } else {
                octx.fillText(seg.text, tx, baseY);
            }
            if (r.underline || r.strike) {
                octx.strokeStyle = r.color || '#1e293b';
                octx.lineWidth = Math.max((r.fontSize || 24) / 16, 1);
                const ly = r.underline ? baseY + 2 : baseY - (r.fontSize || 24) * 0.3;
                octx.beginPath();
                octx.moveTo(tx, ly);
                octx.lineTo(tx + seg.width, ly);
                octx.stroke();
            }
            tx += seg.width;
        }
        cursorY += b.lh;
    }
};

// Запит до Gemini TTS з повторними спробами (експоненційна затримка при 429)
// Голоси Gemini TTS. Суфікс керує акцентом у промпті: "-UK" -> British English,
// "-UA" -> українська вимова. Усі групи розділені за СТАТТЮ (Чоловічі/Жіночі) —
// це фіксує стать обраного голосу. Група "Оригінал" — без акценту (мультимовна).
const VOICE_GROUPS = [
    {
        label: 'Українські · Чоловічі', voices: [
            ['Charon-UA', 'Charon (глибокий)'], ['Fenrir-UA', 'Fenrir (енергійний)'],
            ['Orus-UA', 'Orus (спокійний)'], ['Puck-UA', 'Puck (жвавий)'],
            ['Iapetus-UA', 'Iapetus (м’який)'], ['Algieba-UA', 'Algieba (рівний)'],
            ['Sadaltager-UA', 'Sadaltager (поважний)']
        ]
    },
    {
        label: 'Українські · Жіночі', voices: [
            ['Kore-UA', 'Kore (твердий)'], ['Aoede-UA', 'Aoede (яскравий)'],
            ['Leda-UA', 'Leda (м’який)'], ['Callirrhoe-UA', 'Callirrhoe (спокійний)'],
            ['Autonoe-UA', 'Autonoe (світлий)'], ['Despina-UA', 'Despina (теплий)'],
            ['Erinome-UA', 'Erinome (чіткий)'], ['Laomedeia-UA', 'Laomedeia (грайливий)']
        ]
    },
    {
        label: 'Британські · Чоловічі', voices: [
            ['Charon-UK', 'Charon (глибокий)'], ['Fenrir-UK', 'Fenrir (енергійний)'],
            ['Zephyr-UK', 'Zephyr (нейтральний)'], ['Orus-UK', 'Orus (спокійний)'],
            ['Puck-UK', 'Puck (жвавий)'], ['Iapetus-UK', 'Iapetus (м’який)'],
            ['Algieba-UK', 'Algieba (рівний)'], ['Sadaltager-UK', 'Sadaltager (поважний)']
        ]
    },
    {
        label: 'Британські · Жіночі', voices: [
            ['Kore-UK', 'Kore (твердий)'], ['Aoede-UK', 'Aoede (яскравий)'],
            ['Leda-UK', 'Leda (м’який)'], ['Callirrhoe-UK', 'Callirrhoe (спокійний)'],
            ['Autonoe-UK', 'Autonoe (світлий)'], ['Despina-UK', 'Despina (теплий)'],
            ['Erinome-UK', 'Erinome (чіткий)'], ['Laomedeia-UK', 'Laomedeia (грайливий)']
        ]
    },
    {
        label: 'Німецькі · Жіночі', voices: [
            ['Kore-DE', 'Kore (твердий)'], ['Aoede-DE', 'Aoede (яскравий)'],
            ['Leda-DE', 'Leda (м’який)']
        ]
    },
    {
        label: 'Німецькі · Чоловічі', voices: [
            ['Charon-DE', 'Charon (глибокий)'], ['Fenrir-DE', 'Fenrir (енергійний)'],
            ['Zephyr-DE', 'Zephyr (нейтральний)']
        ]
    },
    {
        label: 'Оригінал · Чоловічі', voices: [
            ['Charon', 'Charon'], ['Fenrir', 'Fenrir'], ['Orus', 'Orus'],
            ['Puck', 'Puck'], ['Zephyr', 'Zephyr']
        ]
    },
    {
        label: 'Оригінал · Жіночі', voices: [
            ['Kore', 'Kore'], ['Aoede', 'Aoede'], ['Leda', 'Leda']
        ]
    },
];
const renderVoiceOptions = () => VOICE_GROUPS.map(g => (
    <optgroup key={g.label} label={g.label}>
        {g.voices.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </optgroup>
));

// Режими темпу та стилю озвучки -> природномовні директиви для Gemini TTS
const TTS_RATES = { slow: 'at a slow, measured pace', normal: '', fast: 'at a brisk, lively pace' };
const TTS_STYLES = {
    neutral: '', cheerful: 'in a warm, cheerful tone', serious: 'in a serious, formal tone',
    calm: 'in a calm, soothing tone', dramatic: 'in an expressive, dramatic tone',
    storytelling: 'in an engaging storytelling tone'
};
const buildStyleDirection = (rate, style) => [TTS_RATES[rate] || '', TTS_STYLES[style] || ''].filter(Boolean).join(', ');

// Автовизначення мови фрагмента за скриптом (кирилиця → укр., латиниця →
// брит. англ.), щоб кожен шматок тексту озвучувався правильним варіантом
// обраного голосу — незалежно від того, яку саме мовну версію (-UA/-UK)
// вибрано в налаштуваннях. При змішаному/неоднозначному тексті (цифри,
// емодзі, обидва скрипти разом) лишаємо голос як обрано вручну.
const CYRILLIC_RE = /[а-яёіїєґ]/i;
const LATIN_RE = /[a-z]/i;
// Авто-акцент за мовою тексту: українська -> "-UA", англійська -> "-UK" (British
// English). Мова визначається за ДОМІНАНТНИМ алфавітом, тому кілька латинських
// термінів в українському реченні не перемикають голос. Свідомо обраний німецький
// голос (-DE) зберігається для не-кириличного тексту.
const pickVoiceForText = (voiceSelection, text) => {
    const baseName = voiceSelection.replace(/-(UK|UA|DE)$/, '');
    const cyr = (String(text || '').match(/[а-яёіїєґ]/gi) || []).length;
    const lat = (String(text || '').match(/[a-z]/gi) || []).length;
    if (!cyr && !lat) return voiceSelection;
    if (voiceSelection.endsWith('-DE') && !cyr) return voiceSelection;
    return cyr >= lat ? `${baseName}-UA` : `${baseName}-UK`;
};

// Розбиває текст диктора на однорідні за мовою фрагменти (по реченнях):
// українські речення озвучуються українським голосом, англійські — британською
// англійською, навіть коли вони чергуються в межах одного слайда
const splitTextByLanguage = (text) => {
    const sentences = String(text || '').match(/[^.!?…\n]+[.!?…]*[\s]*/g);
    if (!sentences || sentences.length < 2) return [{ text: String(text || '') }];
    const langOf = (s) => {
        const cyr = (s.match(/[а-яёіїєґ]/gi) || []).length;
        const lat = (s.match(/[a-z]/gi) || []).length;
        if (!cyr && !lat) return null; // лише цифри/розділові — приєднуємо до сусіднього
        return cyr >= lat ? 'uk' : 'en';
    };
    const out = [];
    for (const s of sentences) {
        const lang = langOf(s);
        const last = out[out.length - 1];
        if (!last) { out.push({ text: s, lang }); continue; }
        if (lang === null || last.lang === lang) last.text += s;
        else if (last.lang === null) { last.text += s; last.lang = lang; }
        else out.push({ text: s, lang });
    }
    return out.filter(p => p.text.trim());
};

const fetchTTSWithRetry = async (textToSpeak, voiceSelection, styleDirection = '', retries = 5) => {
    const isBritish = voiceSelection.endsWith('-UK');
    const isUkrainian = voiceSelection.endsWith('-UA');
    const isGerman = voiceSelection.endsWith('-DE');
    const actualVoiceName = voiceSelection.replace(/-(UK|UA|DE)$/, '');
    // Gemini 2.5 TTS керується природною мовою у промпті — додаємо акцент, темп, стиль
    const dirs = [];
    if (isBritish) dirs.push('with a British English accent');
    if (isUkrainian) dirs.push('in natural, fluent Ukrainian with a native Ukrainian accent');
    if (isGerman) dirs.push('in natural, fluent German with a native German accent');
    if (styleDirection) dirs.push(styleDirection);
    const finalPromptText = dirs.length
        ? `Read the following text ${dirs.join(', ')}:\n${textToSpeak}`
        : textToSpeak;

    const apiKey = "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: finalPromptText }] }],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: actualVoiceName }
                }
            }
        },
        model: "gemini-2.5-flash-preview-tts"
    };

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 429 && i < retries - 1) {
                    await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
                    continue;
                }
                throw new Error(`Помилка API: ${response.status}`);
            }
            const data = await response.json();
            const part = data.candidates?.[0]?.content?.parts?.[0];
            if (!part?.inlineData) throw new Error('Не отримано аудіо даних');

            let sampleRate = 24000;
            const mimeType = part.inlineData.mimeType;
            const rateMatch = mimeType.match(/rate=(\d+)/);
            if (rateMatch && rateMatch[1]) sampleRate = parseInt(rateMatch[1], 10);

            return { base64: part.inlineData.data, sampleRate };
        } catch (e) {
            if (i === retries - 1) throw e;
            await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        }
    }
};

// Динамічне підключення JSZip
const loadJSZip = () => new Promise((res, rej) => {
    if (window.JSZip) return res(window.JSZip);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload = () => res(window.JSZip);
    script.onerror = rej;
    document.head.appendChild(script);
});

// Дескриптори FontFace для кожного зрізу вбудованого шрифту PowerPoint
const EMBED_FONT_SLOTS = {
    regular: { weight: 'normal', style: 'normal' },
    bold: { weight: 'bold', style: 'normal' },
    italic: { weight: 'normal', style: 'italic' },
    boldItalic: { weight: 'bold', style: 'italic' }
};

// Витягує шрифти, вбудовані в .pptx (<p:embeddedFontLst> -> ppt/fonts/*.fntdata),
// і реєструє їх у document.fonts під реальним ім'ям. Повертає список завантажених сімей.
const loadEmbeddedFonts = async (zip, presDoc, presRelsDoc) => {
    const loaded = [];
    if (typeof FontFace === 'undefined' || !document.fonts) return loaded;
    try {
        const fontLst = presDoc.querySelector('embeddedFontLst, p\\:embeddedFontLst');
        if (!fontLst) return loaded;
        const fontGroups = Array.from(fontLst.children).filter(c => c.localName === 'embeddedFont');

        for (const ef of fontGroups) {
            const fontEl = getDirectChild(ef, 'p:font', 'font');
            const typeface = fontEl ? fontEl.getAttribute('typeface') : null;
            if (!typeface) continue;

            for (const slot of Object.keys(EMBED_FONT_SLOTS)) {
                const slotEl = Array.from(ef.children).find(c => c.localName === slot);
                if (!slotEl) continue;
                const rId = slotEl.getAttribute('r:id') || slotEl.getAttribute('id');
                if (!rId) continue;
                const rel = presRelsDoc.querySelector(`Relationship[Id="${rId}"]`);
                if (!rel) continue;

                let target = (rel.getAttribute('Target') || '').replace(/^\//, '');
                if (!target) continue;
                if (!target.startsWith('ppt/')) target = `ppt/${target}`;
                const fontFile = zip.file(target);
                if (!fontFile) continue;

                try {
                    const buf = await fontFile.async('arraybuffer');
                    const face = new FontFace(typeface, buf, EMBED_FONT_SLOTS[slot]);
                    await face.load();
                    document.fonts.add(face);
                    loaded.push(`${typeface} · ${slot}`);
                } catch (faceErr) {
                    // Окремий зріз шрифту може бути нечитабельним — пропускаємо без зриву імпорту
                    console.warn('PPTX: не вдалося завантажити вбудований шрифт', typeface, slot, faceErr);
                }
            }
        }
    } catch (e) {
        console.warn('PPTX: помилка розбору вбудованих шрифтів:', e);
    }
    return loaded;
};

/* ============================================================================
 * 3. ПАРСЕР PPTX (об'єктний: кожна фігура/текст/зображення -> окремий об'єкт)
 * ========================================================================== */

// Витягує текстові рядки з txBody:
// { lines: [{ text, runs, bullet, color, fontSize, bold, italic, align, indent, lineSpacing, spcBef, spcAft }], vAlign, padding, autofit }
// runs — фрагменти з власними стилями (колір, кегль, b/i/u/strike, шрифт, letterSpacing) для рендера 1:1.
// defaults — успадковані стилі плейсхолдера з майстра (fontSize, color, font)
const extractTextLines = (txBody, ptToPx, defaults = {}) => {
    const lines = [];
    const bodyPr = getDirectChild(txBody, 'a:bodyPr', 'bodyPr');
    const vAlign = bodyPr ? (bodyPr.getAttribute('anchor') || 't') : 't';
    // bodyPr padding (EMU -> canvas px via ptToPx; 1 EMU = 1/12700 pt)
    const emuToPx = (v) => ptToPx(v / 12700);
    const padL = bodyPr && bodyPr.hasAttribute('lIns') ? emuToPx(parseInt(bodyPr.getAttribute('lIns'), 10)) : emuToPx(91440);
    const padR = bodyPr && bodyPr.hasAttribute('rIns') ? emuToPx(parseInt(bodyPr.getAttribute('rIns'), 10)) : emuToPx(91440);
    const padT = bodyPr && bodyPr.hasAttribute('tIns') ? emuToPx(parseInt(bodyPr.getAttribute('tIns'), 10)) : emuToPx(45720);
    const padB = bodyPr && bodyPr.hasAttribute('bIns') ? emuToPx(parseInt(bodyPr.getAttribute('bIns'), 10)) : emuToPx(45720);
    const padding = { l: padL, r: padR, t: padT, b: padB };
    // autofit: normAutofit = shrink text to fit, spAutoFit = shape grows (treat as normal)
    const hasNormAutofit = bodyPr ? !!getDirectChild(bodyPr, 'a:normAutofit', 'normAutofit') : false;
    const autoNumCounters = {};

    // "+mj-lt"/"+mn-lt" -> реальні шрифти теми
    const resolveFont = (typeface) => {
        if (!typeface) return null;
        if (typeface.startsWith('+mj')) return themeFonts.major;
        if (typeface.startsWith('+mn')) return themeFonts.minor;
        return typeface;
    };

    const paragraphs = Array.from(txBody.children).filter(c => c.tagName === 'a:p' || c.tagName === 'p');
    for (const p of paragraphs) {
        const pPr = getDirectChild(p, 'a:pPr', 'pPr');
        const algnAttr = pPr ? pPr.getAttribute('algn') : null;
        const align = algnAttr || 'l';
        const lvl = pPr ? (parseInt(pPr.getAttribute('lvl'), 10) || 0) : 0;
        const pDefRPr = pPr ? getDirectChild(pPr, 'a:defRPr', 'defRPr') : null;

        // Міжрядковий інтервал абзацу (spcPct: 100000 = 100%)
        let lineSpacing = 1;
        const lnSpc = pPr ? getDirectChild(pPr, 'a:lnSpc', 'lnSpc') : null;
        const spcPct = lnSpc ? getDirectChild(lnSpc, 'a:spcPct', 'spcPct') : null;
        if (spcPct) {
            const v = parseInt(spcPct.getAttribute('val'), 10);
            if (!isNaN(v) && v > 0) lineSpacing = v / 100000;
        }

        // Відступ перед/після абзацу (spcBef/spcAft: spcPts у сотих пт, spcPct у 100000-них)
        const parseSpcVal = (parentEl) => {
            if (!parentEl) return 0;
            const pts = getDirectChild(parentEl, 'a:spcPts', 'spcPts');
            if (pts) { const v = parseInt(pts.getAttribute('val'), 10); return !isNaN(v) ? ptToPx(v / 100) : 0; }
            const pct = getDirectChild(parentEl, 'a:spcPct', 'spcPct');
            if (pct) { const v = parseInt(pct.getAttribute('val'), 10); return !isNaN(v) ? v / 100000 : 0; }
            return 0;
        };
        const spcBef = parseSpcVal(pPr ? getDirectChild(pPr, 'a:spcBef', 'spcBef') : null);
        const spcAft = parseSpcVal(pPr ? getDirectChild(pPr, 'a:spcAft', 'spcAft') : null);

        // Маркер списку: явний символ (buChar), автонумерація (buAutoNum) або вимкнено (buNone)
        let bulletKind = null;
        if (pPr) {
            const buChar = getDirectChild(pPr, 'a:buChar', 'buChar');
            const buAutoNum = getDirectChild(pPr, 'a:buAutoNum', 'buAutoNum');
            const buNone = getDirectChild(pPr, 'a:buNone', 'buNone');
            if (buChar && !buNone) {
                let char = buChar.getAttribute('char') || '•';
                const buFont = getDirectChild(pPr, 'a:buFont', 'buFont');
                const tf = buFont ? (buFont.getAttribute('typeface') || '') : '';
                const wingMap = { 'v': '❖', 'w': '❖', 'n': '■', '§': '▪', 'p': '▪', 'm': '○', 'l': '●', 'ü': '✓', 'ý': '✕', 'Ø': '➢', 'q': '❑', 'x': '⌧' };
                const symMap = { '·': '•', '-': '–', 'à': '→', 'ß': '←', 'á': '↔' };
                if (tf.includes('Wingdings')) {
                    char = wingMap[char] || char;
                } else if (tf.includes('Symbol')) {
                    char = symMap[char] || char;
                } else {
                    if (wingMap[char]) char = wingMap[char];
                    else if (symMap[char]) char = symMap[char];
                }
                bulletKind = { char: char + ' ' };
            }
            else if (buAutoNum && !buNone) bulletKind = { auto: true };
        }

        // Стиль одного run-а з фолбеком: rPr -> defRPr абзацу -> майстер -> базовий
        const readRunStyle = (rPr) => {
            const attr = (el, name) => (el ? el.getAttribute(name) : null);
            let color = rPr ? getFillColor(rPr) : null;
            if (!color && pDefRPr) color = getFillColor(pDefRPr);
            const szAttr = attr(rPr, 'sz') || attr(pDefRPr, 'sz');
            const bAttr = attr(rPr, 'b') != null ? attr(rPr, 'b') : attr(pDefRPr, 'b');
            const iAttr = attr(rPr, 'i') != null ? attr(rPr, 'i') : attr(pDefRPr, 'i');
            const uAttr = attr(rPr, 'u');
            const strikeAttr = attr(rPr, 'strike');
            const spcAttr = attr(rPr, 'spc') || attr(pDefRPr, 'spc');
            const latin = (rPr && getDirectChild(rPr, 'a:latin', 'latin'))
                || (pDefRPr && getDirectChild(pDefRPr, 'a:latin', 'latin'));
            return {
                color: color || defaults.color || '#1e293b',
                fontSize: szAttr ? Math.round(ptToPx(parseInt(szAttr, 10) / 100)) : (defaults.fontSize || Math.round(ptToPx(18))),
                bold: bAttr === '1',
                italic: iAttr === '1',
                underline: !!(uAttr && uAttr !== 'none'),
                strike: !!(strikeAttr && strikeAttr !== 'noStrike'),
                letterSpacing: spcAttr ? ptToPx(parseInt(spcAttr, 10) / 100) : 0,
                font: resolveFont(latin ? latin.getAttribute('typeface') : null)
                    || resolveFont(defaults.font) || themeFonts.minor || null
            };
        };

        // a:br розриває абзац на додаткові візуальні рядки (маркер — лише на першому)
        const chunks = [[]];
        let mathParaAlign = null; // вирівнювання блочної формули (m:oMathPara/m:jc)
        for (const child of Array.from(p.children)) {
            // ── Формула в тексті: a14:m / m:oMath(Para), інколи в mc:AlternateContent ──
            // Конвертуємо у "математичний" run: MathML для редактора + лінійний запис для canvas
            if (['m', 'oMath', 'oMathPara', 'AlternateContent'].includes(child.localName)) {
                let scope = child;
                if (child.localName === 'AlternateContent') {
                    // Формула живе у Choice (Requires="a14"); Fallback — лише її картинка
                    scope = Array.from(child.children).find(ch => ch.localName === 'Choice' && findOMaths(ch).length) || child;
                }
                const oMaths = child.localName === 'oMath' ? [child] : findOMaths(scope);
                for (const om of oMaths) {
                    try {
                        const linear = ommlToLinear(om).replace(/\s+/g, ' ').trim();
                        if (!linear) continue;
                        // Кегль/колір/шрифт беремо з першого a:rPr формули, інакше — стилі абзацу
                        const aRPr = Array.from(om.getElementsByTagName('*')).find(e =>
                            e.localName === 'rPr' && e.parentNode && e.parentNode.localName === 'r'
                            && (e.hasAttribute('sz') || e.hasAttribute('b') || e.hasAttribute('i')
                                || Array.from(e.children).some(x => ['solidFill', 'gradFill', 'latin'].includes(x.localName))));
                        chunks[chunks.length - 1].push({
                            ...readRunStyle(aRPr || null), italic: true,
                            text: linear, math: true, mathml: ommlToMathml(om, 'inline')
                        });
                        // Блочна формула (m:oMathPara) типово центрується
                        if (om.parentNode && om.parentNode.localName === 'oMathPara') {
                            const jc = mmlVal(mmlChild(mmlChild(om.parentNode, 'oMathParaPr'), 'jc'), 'center');
                            mathParaAlign = { left: 'l', right: 'r', center: 'ctr', centerGroup: 'ctr' }[jc] || 'ctr';
                        }
                    } catch (e) { /* пошкоджену формулу пропускаємо, текст не втрачаємо */ }
                }
                continue;
            }
            if (['a:r', 'r', 'a:fld', 'fld'].includes(child.tagName)) {
                const t = getDirectChild(child, 'a:t', 't');
                let runText = t ? t.textContent : '';
                const runPr = getDirectChild(child, 'a:rPr', 'rPr');

                if (runText && runPr) {
                    const latin = getDirectChild(runPr, 'a:latin', 'latin') || getDirectChild(runPr, 'a:sym', 'sym');
                    if (latin) {
                        const tf = latin.getAttribute('typeface') || '';
                        if (tf.includes('Wingdings')) {
                            const map = { 'v': '❖', 'w': '❖', 'n': '■', '§': '▪', 'p': '▪', 'm': '○', 'l': '●', 'ü': '✓', 'ý': '✕', 'Ø': '➢', 'q': '❑', 'x': '⌧' };
                            runText = Array.from(runText).map(c => map[c] || c).join('');
                        } else if (tf.includes('Symbol')) {
                            const map = { 'à': '→', 'ß': '←', 'á': '↔', '·': '•', '': '-' };
                            runText = Array.from(runText).map(c => map[c] || c).join('');
                        }
                    }
                }

                if (!runText) continue;
                // Math-літери (𝐴𝐵𝐶, U+1D400+) у звичайному тексті: згортаємо до базових
                // (шрифти слайдів не мають цих гліфів), стиль блоку -> курсив/жирність руна
                const foldedRun = foldMathText(runText);
                const runStyle = readRunStyle(runPr);
                if (foldedRun.folded) {
                    runStyle.italic = runStyle.italic || foldedRun.italic;
                    runStyle.bold = runStyle.bold || foldedRun.bold;
                }
                chunks[chunks.length - 1].push({ ...runStyle, text: foldedRun.text });
            } else if (child.tagName === 'a:br' || child.tagName === 'br') {
                chunks.push([]);
            }
        }

        const paraHasText = chunks.some(runs => runs.some(r => r.text.trim()));
        let bullet = '';
        if (paraHasText && bulletKind) {
            if (bulletKind.char) bullet = bulletKind.char;
            else {
                autoNumCounters[lvl] = (autoNumCounters[lvl] || 0) + 1;
                bullet = `${autoNumCounters[lvl]}. `;
            }
        }

        const defFs = defaults.fontSize || Math.round(ptToPx(18));
        chunks.forEach((runs, ci) => {
            const textContent = runs.map(r => r.text).join('');
            if (!textContent.trim()) {
                lines.push({
                    text: '', runs: [], bullet: '',
                    color: defaults.color || '#1e293b', fontSize: defFs,
                    bold: false, italic: false, align, indent: lvl, lineSpacing,
                    spcBef: ci === 0 ? spcBef : 0, spcAft: ci === chunks.length - 1 ? spcAft : 0
                });
                return;
            }
            const first = runs[0];
            const lineBullet = ci === 0 ? bullet : '';
            // Рядок, що складається лише з блочної формули, центруємо (якщо algn не заданий явно)
            const lineAlign = (!algnAttr && mathParaAlign && runs.every(r => r.math)) ? mathParaAlign : align;
            lines.push({
                text: lineBullet + textContent.trim(),
                runs,
                bullet: lineBullet,
                color: first.color,
                fontSize: Math.max(...runs.map(r => r.fontSize)),
                bold: first.bold,
                italic: first.italic,
                align: lineAlign,
                indent: lvl,
                lineSpacing,
                spcBef: ci === 0 ? spcBef : 0,
                spcAft: ci === chunks.length - 1 ? spcAft : 0
            });
        });
    }
    while (lines.length && !lines[lines.length - 1].text) lines.pop();
    return { lines, vAlign, padding, autofit: hasNormAutofit };
};

// Головна функція парсингу: повертає нормалізований масив слайдів зі списком об'єктів.
// Стійкість: помилка окремого слайду чи фігури не зриває імпорт усієї презентації.
const extractPptxData = async (file) => {
    const JSZip = await loadJSZip();
    const zip = await JSZip.loadAsync(file);
    const parser = new DOMParser();

    // Скидаємо палітру та шрифти теми попередньої презентації
    themeColors = { ...DEFAULT_THEME_COLORS };
    themeFonts = { major: null, minor: null };

    const parseXml = async (path) => {
        if (!path) return null;
        const f = zip.file(path);
        if (!f) return null;
        try {
            return parser.parseFromString(await f.async('string'), 'application/xml');
        } catch (e) {
            return null;
        }
    };
    const relsPathFor = (path) => {
        const dir = path.substring(0, path.lastIndexOf('/'));
        const name = path.substring(path.lastIndexOf('/') + 1);
        return `${dir}/_rels/${name}.rels`;
    };
    const resolveTarget = (basePath, target) => {
        if (!target) return null;
        if (target.startsWith('/')) return target.substring(1);
        return new URL(target, `https://x/${basePath}`).pathname.replace(/^\//, '');
    };

    // Витягує зображення за embedId відносно довільного XML-файла пакета -> dataURL.
    // Формат визначається розширенням, а якщо воно невідоме/хибне — магічними
    // байтами вмісту (тому підтримуються й файли типу image1.dat з PNG усередині).
    const resolveImageIn = async (relsDoc, basePath, embedId) => {
        if (!embedId || !relsDoc) return null;
        const imgRel = relsDoc.querySelector(`Relationship[Id="${embedId}"]`);
        if (!imgRel) return null;
        const imgTarget = resolveTarget(basePath, imgRel.getAttribute('Target'));
        const imgFile = zip.file(imgTarget);
        if (!imgFile) return null;
        const ext = imgTarget.split('.').pop().toLowerCase();
        let mime = IMAGE_MIME_BY_EXT[ext];
        if (!mime) {
            try { mime = sniffImageMime(await imgFile.async('uint8array')); } catch (e) { /* ignore */ }
        }
        if (!mime) return null; // векторні EMF/WMF браузер не декодує — буде плейсхолдер
        return `data:${mime};base64,${await imgFile.async('base64')}`;
    };

    // Витягує відеофайл за rId (a:videoFile) -> blob URL (або зовнішній http-URL)
    const resolveMediaIn = async (relsDoc, basePath, rId) => {
        if (!rId || !relsDoc) return null;
        const rel = relsDoc.querySelector(`Relationship[Id="${rId}"]`);
        if (!rel) return null;
        if ((rel.getAttribute('TargetMode') || '') === 'External') {
            const t = rel.getAttribute('Target') || '';
            return /^https?:/i.test(t) ? t : null; // зовнішнє посилання на відео
        }
        const target = resolveTarget(basePath, rel.getAttribute('Target'));
        const f = zip.file(target);
        if (!f) return null;
        const ext = (target.split('.').pop() || '').toLowerCase();
        const mime = VIDEO_MIME_BY_EXT[ext] || 'video/mp4';
        try {
            const blob = await f.async('blob');
            return URL.createObjectURL(new Blob([blob], { type: mime }));
        } catch (e) { return null; }
    };

    // Порядок слайдів та розмір (EMU) для перерахунку координат у систему 1280x720
    const presDoc = await parseXml('ppt/presentation.xml');
    if (!presDoc) throw new Error("У файлі не знайдено ppt/presentation.xml");
    const sldIds = presDoc.querySelectorAll('sldIdLst sldId');

    const sldSzEl = presDoc.querySelector('sldSz, p\\:sldSz');
    const slideWidthEmu = sldSzEl ? parseInt(sldSzEl.getAttribute('cx'), 10) : 12192000;
    const slideHeightEmu = sldSzEl ? parseInt(sldSzEl.getAttribute('cy'), 10) : 6858000;
    const scaleX = CANVAS_W / slideWidthEmu;
    const scaleY = CANVAS_H / slideHeightEmu;
    // Пікселів канвасу на дюйм слайду (914400 EMU = 1 дюйм) -> для конвертації пунктів шрифту
    const pxPerInch = CANVAS_W / (slideWidthEmu / 914400);
    const ptToPx = (pt) => pt * pxPerInch / 72;
    const emuToPx = (v) => ptToPx(v / 12700);

    const presRelsDoc = await parseXml('ppt/_rels/presentation.xml.rels');
    if (!presRelsDoc) throw new Error("У файлі не знайдено relationships презентації");

    // Вбудовані у презентацію шрифти -> document.fonts (рендер 1:1 з PowerPoint)
    embeddedFontFamilies = await loadEmbeddedFonts(zip, presDoc, presRelsDoc);
    if (embeddedFontFamilies.length) {
        logChange('Шрифти', `Завантажено вбудованих зрізів шрифтів PPTX: ${embeddedFontFamilies.length}`, embeddedFontFamilies);
    }

    // Геометрія фігури з xfrm: координати канвасу, поворот (1/60000 градуса), дзеркалення
    const readXfrm = (xfrm) => {
        if (!xfrm) return null;
        const off = getDirectChild(xfrm, 'a:off', 'off');
        const ext = getDirectChild(xfrm, 'a:ext', 'ext');
        if (!off || !ext) return null;
        const rotAttr = xfrm.getAttribute('rot');
        return {
            rect: {
                x: Math.round(parseInt(off.getAttribute('x'), 10) * scaleX),
                y: Math.round(parseInt(off.getAttribute('y'), 10) * scaleY),
                w: Math.max(Math.round(parseInt(ext.getAttribute('cx'), 10) * scaleX), 4),
                h: Math.max(Math.round(parseInt(ext.getAttribute('cy'), 10) * scaleY), 4)
            },
            rot: rotAttr ? Math.round(parseInt(rotAttr, 10) / 60000) : 0,
            flipH: xfrm.getAttribute('flipH') === '1',
            flipV: xfrm.getAttribute('flipV') === '1'
        };
    };

    // Інформація про плейсхолдер (type/idx) з nvSpPr/nvPicPr/nvGraphicFramePr
    const getPhInfo = (node) => {
        const nv = getDirectChild(node, 'p:nvSpPr', 'nvSpPr', 'p:nvPicPr', 'nvPicPr', 'p:nvGraphicFramePr', 'nvGraphicFramePr');
        const nvPr = nv ? getDirectChild(nv, 'p:nvPr', 'nvPr') : null;
        const phEl = nvPr ? getDirectChild(nvPr, 'p:ph', 'ph') : null;
        if (!phEl) return null;
        return { type: phEl.getAttribute('type') || 'body', idx: phEl.getAttribute('idx') };
    };

    // Фон документа (слайд / макет / майстер): колір, градієнт або картинка (embedId)
    const parseBg = (doc) => {
        const cSld = getDirectChild(doc.documentElement, 'p:cSld', 'cSld');
        const bg = cSld ? getDirectChild(cSld, 'p:bg', 'bg') : null;
        if (!bg) return null;
        const bgPr = getDirectChild(bg, 'p:bgPr', 'bgPr');
        if (bgPr) {
            const blipFill = getDirectChild(bgPr, 'a:blipFill', 'blipFill');
            if (blipFill) {
                const blip = getDirectChild(blipFill, 'a:blip', 'blip');
                const embedId = blip ? (blip.getAttribute('r:embed') || blip.getAttribute('embed')) : null;
                if (embedId) return { embedId };
            }
            const def = getFillDef(bgPr);
            return { color: def.color, gradient: def.gradient };
        }
        const bgRef = getDirectChild(bg, 'p:bgRef', 'bgRef');
        if (bgRef) return { color: getSrgbColor(bgRef) };
        return null;
    };

    // Фон з резолвом картинки: { color, gradient, image (dataURL) }
    const resolveBg = async (doc, relsDoc, basePath) => {
        const raw = parseBg(doc);
        if (!raw) return null;
        return {
            color: raw.color || null,
            gradient: raw.gradient || null,
            image: raw.embedId ? await resolveImageIn(relsDoc, basePath, raw.embedId) : null
        };
    };

    // Координати плейсхолдерів макета/майстра — для фігур слайду без власного xfrm
    const collectPlaceholders = (doc) => {
        const byIdx = new Map(), byType = new Map();
        const cSld = getDirectChild(doc.documentElement, 'p:cSld', 'cSld');
        const tree = cSld ? getDirectChild(cSld, 'p:spTree', 'spTree') : null;
        if (!tree) return { byIdx, byType };
        for (const sp of Array.from(tree.children)) {
            if (!['p:sp', 'sp'].includes(sp.tagName)) continue;
            const ph = getPhInfo(sp);
            if (!ph) continue;
            const spPr = getDirectChild(sp, 'p:spPr', 'spPr');
            const geom = readXfrm(spPr ? getDirectChild(spPr, 'a:xfrm', 'xfrm') : null);
            if (!geom) continue;
            if (ph.idx != null && !byIdx.has(ph.idx)) byIdx.set(ph.idx, geom);
            if (!byType.has(ph.type)) byType.set(ph.type, geom);
        }
        return { byIdx, byType };
    };

    // Дефолтні стилі тексту майстра (titleStyle/bodyStyle, рівень 1)
    const parseTxStyles = (masterDoc) => {
        const fallback = {
            title: { fontSize: Math.round(ptToPx(40)), color: null },
            body: { fontSize: Math.round(ptToPx(22)), color: null }
        };
        const tx = getDirectChild(masterDoc.documentElement, 'p:txStyles', 'txStyles');
        if (!tx) return fallback;
        const read = (styleEl) => {
            const lvl1 = styleEl ? getDirectChild(styleEl, 'a:lvl1pPr', 'lvl1pPr') : null;
            const defRPr = lvl1 ? getDirectChild(lvl1, 'a:defRPr', 'defRPr') : null;
            if (!defRPr) return null;
            const sz = defRPr.getAttribute('sz');
            const latin = getDirectChild(defRPr, 'a:latin', 'latin');
            return {
                fontSize: sz ? Math.round(ptToPx(parseInt(sz, 10) / 100)) : null,
                color: getFillColor(defRPr),
                font: latin ? latin.getAttribute('typeface') : null
            };
        };
        const t = read(getDirectChild(tx, 'p:titleStyle', 'titleStyle'));
        const b = read(getDirectChild(tx, 'p:bodyStyle', 'bodyStyle'));
        return {
            title: { fontSize: (t && t.fontSize) || fallback.title.fontSize, color: (t && t.color) || null, font: (t && t.font) || '+mj-lt' },
            body: { fontSize: (b && b.fontSize) || fallback.body.fontSize, color: (b && b.color) || null, font: (b && b.font) || '+mn-lt' }
        };
    };

    // Не-плейсхолдер фігури макета/майстра (декор: смуги, лого, картинки) — для показу під слайдом
    const parseStaticObjects = async (doc, relsDoc, basePath) => {
        const cSld = getDirectChild(doc.documentElement, 'p:cSld', 'cSld');
        const tree = cSld ? getDirectChild(cSld, 'p:spTree', 'spTree') : null;
        if (!tree) return [];
        const nodes = Array.from(tree.children).filter(c => DRAWABLE_TAGS.includes(c.tagName));
        const env = {
            resolveImage: (embedId) => resolveImageIn(relsDoc, basePath, embedId),
            resolveMedia: (rId) => resolveMediaIn(relsDoc, basePath, rId),
            layout: null, masterStyles: null, objects: [],
            fallback: { idx: 0 }, skipPlaceholders: true
        };
        await parseSpTree(nodes, env, null);
        return env.objects;
    };

    // Кеші майстрів і макетів + завантаження теми (палітри кольорів презентації)
    let themeLoaded = false;
    const masterCache = new Map();
    const ensureMaster = async (masterPath) => {
        if (masterCache.has(masterPath)) return masterCache.get(masterPath);
        const doc = await parseXml(masterPath);
        if (!doc) { masterCache.set(masterPath, null); return null; }
        const relsDoc = await parseXml(relsPathFor(masterPath));
        if (!themeLoaded) {
            const themeRel = relsDoc ? relsDoc.querySelector('Relationship[Type$="theme"]') : null;
            if (themeRel) {
                const themeDoc = await parseXml(resolveTarget(masterPath, themeRel.getAttribute('Target')));
                const scheme = themeDoc ? themeDoc.querySelector('clrScheme, a\\:clrScheme') : null;
                if (scheme) {
                    for (const el of Array.from(scheme.children)) {
                        const srgb = getDirectChild(el, 'a:srgbClr', 'srgbClr');
                        const sys = getDirectChild(el, 'a:sysClr', 'sysClr');
                        const hex = srgb ? '#' + srgb.getAttribute('val') : (sys ? '#' + (sys.getAttribute('lastClr') || '000000') : null);
                        if (hex) themeColors[el.localName] = hex;
                    }
                }
                // Шрифти теми: majorFont (заголовки) / minorFont (текст)
                const fontScheme = themeDoc ? themeDoc.querySelector('fontScheme, a\\:fontScheme') : null;
                if (fontScheme) {
                    const readFont = (el) => {
                        const latin = el ? getDirectChild(el, 'a:latin', 'latin') : null;
                        return latin ? (latin.getAttribute('typeface') || null) : null;
                    };
                    themeFonts.major = readFont(getDirectChild(fontScheme, 'a:majorFont', 'majorFont'));
                    themeFonts.minor = readFont(getDirectChild(fontScheme, 'a:minorFont', 'minorFont'));
                }
            }
            themeLoaded = true;
        }
        const master = {
            ...collectPlaceholders(doc),
            bg: await resolveBg(doc, relsDoc, masterPath),
            txStyles: parseTxStyles(doc),
            staticObjects: await parseStaticObjects(doc, relsDoc, masterPath)
        };
        masterCache.set(masterPath, master);
        return master;
    };

    const layoutCache = new Map();
    const ensureLayout = async (layoutPath) => {
        if (layoutCache.has(layoutPath)) return layoutCache.get(layoutPath);
        const doc = await parseXml(layoutPath);
        if (!doc) { layoutCache.set(layoutPath, null); return null; }
        // Спершу майстер і тема, потім кольори макета (щоб schemeClr розв'язувались правильно)
        let master = null;
        const relsDoc = await parseXml(relsPathFor(layoutPath));
        const mRel = relsDoc ? relsDoc.querySelector('Relationship[Type$="slideMaster"]') : null;
        if (mRel) master = await ensureMaster(resolveTarget(layoutPath, mRel.getAttribute('Target')));
        const layout = {
            ...collectPlaceholders(doc),
            bg: await resolveBg(doc, relsDoc, layoutPath),
            master,
            showMasterSp: doc.documentElement.getAttribute('showMasterSp') !== '0',
            staticObjects: await parseStaticObjects(doc, relsDoc, layoutPath)
        };
        layoutCache.set(layoutPath, layout);
        return layout;
    };

    // Пошук геометрії плейсхолдера: макет (idx -> type) -> майстер
    const findPhGeometry = (ph, layout) => {
        if (!ph) return null;
        const typeKeys = [ph.type];
        if (ph.type === 'ctrTitle') typeKeys.push('title');
        if (ph.type === 'subTitle') typeKeys.push('body');
        const lookup = (src) => {
            if (!src) return null;
            if (ph.idx != null && src.byIdx && src.byIdx.has(ph.idx)) return src.byIdx.get(ph.idx);
            for (const k of typeKeys) if (src.byType && src.byType.has(k)) return src.byType.get(k);
            return null;
        };
        return lookup(layout) || lookup(layout ? layout.master : null) || null;
    };

    const DRAWABLE_TAGS = ['p:sp', 'sp', 'p:cxnSp', 'cxnSp', 'p:pic', 'pic', 'p:graphicFrame', 'graphicFrame', 'p:grpSp', 'grpSp', 'mc:AlternateContent', 'AlternateContent'];

    // Перерахунок геометрії дочірньої фігури крізь трансформацію групи (зсув/масштаб/дзеркало/оберт)
    const applyGroupToGeom = (geom, g) => {
        if (!geom || !g) return geom;
        const r = geom.rect;
        const w = r.w * g.kx, h = r.h * g.ky;
        let cx = g.ox + (r.x + r.w / 2 - g.chOx) * g.kx;
        let cy = g.oy + (r.y + r.h / 2 - g.chOy) * g.ky;
        let rot = geom.rot || 0;
        let flipH = !!geom.flipH, flipV = !!geom.flipV;
        if (g.flipH) { cx = 2 * g.gcx - cx; flipH = !flipH; rot = -rot; }
        if (g.flipV) { cy = 2 * g.gcy - cy; flipV = !flipV; rot = -rot; }
        if (g.rot) {
            const a = g.rot * Math.PI / 180;
            const dx = cx - g.gcx, dy = cy - g.gcy;
            cx = g.gcx + dx * Math.cos(a) - dy * Math.sin(a);
            cy = g.gcy + dx * Math.sin(a) + dy * Math.cos(a);
            rot += g.rot;
        }
        return {
            rect: {
                x: Math.round(cx - w / 2), y: Math.round(cy - h / 2),
                w: Math.max(Math.round(w), 1), h: Math.max(Math.round(h), 1)
            },
            rot, flipH, flipV
        };
    };

    // Розбирає список фігур (рекурсивно заходячи у групи) і додає об'єкти в env.objects.
    // env: { resolveImage, layout, masterStyles, objects, fallback, skipPlaceholders }
    const parseSpTree = async (nodes, env, groupT) => {
        for (const node of nodes) {
            try {
                const tag = node.tagName;

                // --- mc:AlternateContent: беремо Fallback (інакше перший Choice) і парсимо його ---
                // Так не пропускаємо елементи, загорнуті в AlternateContent (SmartArt, нові фігури тощо).
                // Виняток — формули (Requires="a14"): справжній OMML живе у Choice,
                // а Fallback містить лише растрову картинку рівняння.
                if (tag === 'mc:AlternateContent' || node.localName === 'AlternateContent') {
                    const acChildren = Array.from(node.children);
                    const pick = acChildren.find(c => c.localName === 'Choice' && findOMaths(c).length)
                        || acChildren.find(c => c.localName === 'Fallback')
                        || acChildren.find(c => c.localName === 'Choice');
                    if (pick) {
                        const inner = Array.from(pick.children).filter(c => DRAWABLE_TAGS.includes(c.tagName));
                        if (inner.length) await parseSpTree(inner, env, groupT);
                    }
                    continue;
                }

                // --- Група фігур: рекурсія з трансформацією дочірніх координат (chOff/chExt) ---
                if (tag === 'p:grpSp' || tag === 'grpSp') {
                    const grpSpPr = getDirectChild(node, 'p:grpSpPr', 'grpSpPr');
                    const xfrm = grpSpPr ? getDirectChild(grpSpPr, 'a:xfrm', 'xfrm') : null;
                    const ownGeom = readXfrm(xfrm);
                    if (!ownGeom) continue;
                    const finalGeom = applyGroupToGeom(ownGeom, groupT) || ownGeom;
                    const chOff = getDirectChild(xfrm, 'a:chOff', 'chOff');
                    const chExt = getDirectChild(xfrm, 'a:chExt', 'chExt');
                    const chOx = chOff ? parseInt(chOff.getAttribute('x'), 10) * scaleX : finalGeom.rect.x;
                    const chOy = chOff ? parseInt(chOff.getAttribute('y'), 10) * scaleY : finalGeom.rect.y;
                    const chW = chExt ? Math.max(parseInt(chExt.getAttribute('cx'), 10) * scaleX, 1) : finalGeom.rect.w;
                    const chH = chExt ? Math.max(parseInt(chExt.getAttribute('cy'), 10) * scaleY, 1) : finalGeom.rect.h;
                    const newT = {
                        ox: finalGeom.rect.x, oy: finalGeom.rect.y,
                        kx: finalGeom.rect.w / chW, ky: finalGeom.rect.h / chH,
                        chOx, chOy,
                        rot: finalGeom.rot || 0,
                        flipH: !!finalGeom.flipH, flipV: !!finalGeom.flipV,
                        gcx: finalGeom.rect.x + finalGeom.rect.w / 2,
                        gcy: finalGeom.rect.y + finalGeom.rect.h / 2
                    };
                    await parseSpTree(Array.from(node.children).filter(c => DRAWABLE_TAGS.includes(c.tagName)), env, newT);
                    continue;
                }

                const isPic = tag === 'p:pic' || tag === 'pic';
                const isConnector = tag === 'p:cxnSp' || tag === 'cxnSp';
                const isFrame = tag === 'p:graphicFrame' || tag === 'graphicFrame';

                const ph = getPhInfo(node);
                if (env.skipPlaceholders && ph) continue;
                const spPr = getDirectChild(node, 'p:spPr', 'spPr');
                const ownXfrm = isFrame
                    ? getDirectChild(node, 'p:xfrm', 'xfrm')
                    : (spPr ? getDirectChild(spPr, 'a:xfrm', 'xfrm') : null);
                let geom = readXfrm(ownXfrm) || findPhGeometry(ph, env.layout);
                if (geom && groupT) geom = applyGroupToGeom(geom, groupT);
                const rect = geom ? geom.rect : null;

                const baseObject = {
                    id: crypto.randomUUID(),
                    rot: (geom && geom.rot) || 0,
                    flipH: !!(geom && geom.flipH),
                    flipV: !!(geom && geom.flipV),
                    animation: { type: 'none', delay: 0, duration: 0.8 }
                };

                // --- Зображення (з обрізкою srcRect, як у PowerPoint) ---
                if (isPic) {
                    const blipFill = getDirectChild(node, 'p:blipFill', 'blipFill');
                    const blip = blipFill ? getDirectChild(blipFill, 'a:blip', 'blip') : null;
                    const embedId = blip ? (blip.getAttribute('r:embed') || blip.getAttribute('embed')) : null;
                    // SVG-версія зображення (a:extLst/asvg:svgBlip) — векторна, без втрат якості;
                    // r:embed у такому разі вказує на растровий PNG-фолбек
                    const svgBlip = blip ? Array.from(blip.getElementsByTagName('*')).find(e => e.localName === 'svgBlip') : null;
                    const svgEmbedId = svgBlip ? (svgBlip.getAttribute('r:embed') || svgBlip.getAttribute('embed')) : null;
                    const srcRect = blipFill ? getDirectChild(blipFill, 'a:srcRect', 'srcRect') : null;
                    let crop = null;
                    if (srcRect) {
                        const f = (n) => (parseInt(srcRect.getAttribute(n), 10) || 0) / 100000;
                        crop = { l: f('l'), t: f('t'), r: f('r'), b: f('b') };
                        if (!crop.l && !crop.t && !crop.r && !crop.b) crop = null;
                    }
                    // Заокруглені/круглі картинки PowerPoint (prstGeom roundRect / ellipse)
                    const picPrstGeom = spPr ? getDirectChild(spPr, 'a:prstGeom', 'prstGeom') : null;
                    const picPrst = picPrstGeom ? picPrstGeom.getAttribute('prst') : null;
                    let cornerRadius = 0;
                    if (rect) {
                        if (picPrst === 'roundRect') cornerRadius = Math.round(Math.min(rect.w, rect.h) * 0.16);
                        else if (picPrst === 'ellipse') cornerRadius = Math.round(Math.min(rect.w, rect.h) / 2);
                    }
                    // Відео на слайді: p:pic з <a:videoFile> у nvPr (poster = картинка blipFill)
                    const nvPicPr = getDirectChild(node, 'p:nvPicPr', 'nvPicPr');
                    const picNvPr = nvPicPr ? getDirectChild(nvPicPr, 'p:nvPr', 'nvPr') : null;
                    const videoFile = picNvPr ? getDirectChild(picNvPr, 'a:videoFile', 'videoFile') : null;
                    if (videoFile && rect && env.resolveMedia) {
                        const vRid = videoFile.getAttribute('r:link') || videoFile.getAttribute('link')
                            || videoFile.getAttribute('r:embed') || videoFile.getAttribute('embed');
                        const videoSrc = await env.resolveMedia(vRid);
                        if (videoSrc) {
                            const poster = await env.resolveImage(embedId);
                            env.objects.push({ ...baseObject, type: 'video', src: videoSrc, poster, cornerRadius, ...rect });
                            continue;
                        }
                    }
                    const audioFile = picNvPr ? getDirectChild(picNvPr, 'a:audioFile', 'audioFile') : null;
                    if (audioFile && rect && env.resolveMedia) {
                        const aRid = audioFile.getAttribute('r:link') || audioFile.getAttribute('link')
                            || audioFile.getAttribute('r:embed') || audioFile.getAttribute('embed');
                        const audioSrc = await env.resolveMedia(aRid);
                        if (audioSrc) {
                            env.objects.push({ ...baseObject, type: 'audio', src: audioSrc, ...rect });
                            continue;
                        }
                    }
                    const src = (svgEmbedId ? await env.resolveImage(svgEmbedId) : null)
                        || await env.resolveImage(embedId);
                    if (src && rect) env.objects.push({ ...baseObject, type: 'image', src, crop, cornerRadius, ...rect });
                    else if (rect && embedId) {
                        // Формат, який браузер не декодує (EMF/WMF тощо) — інформативний
                        // плейсхолдер замість мовчазного зникнення зображення
                        env.objects.push({
                            ...baseObject, type: 'text', ...rect,
                            fillColor: '#F1F5F9', lineColor: '#CBD5E1', lineWidth: 1, lineDash: null,
                            vAlign: 'ctr',
                            lines: [{ text: '[Зображення: формат не підтримується браузером]', color: '#64748B', fontSize: Math.round(ptToPx(11)), bold: false, italic: true, align: 'ctr', indent: 0 }]
                        });
                    }
                    continue;
                }

                // --- graphicFrame: таблиця 1:1; для діаграм — інформативний плейсхолдер ---
                if (isFrame) {
                    const graphic = getDirectChild(node, 'a:graphic', 'graphic');
                    const graphicData = graphic ? getDirectChild(graphic, 'a:graphicData', 'graphicData') : null;
                    const tbl = graphicData ? getDirectChild(graphicData, 'a:tbl', 'tbl') : null;
                    if (tbl && rect) {
                        const grid = getDirectChild(tbl, 'a:tblGrid', 'tblGrid');
                        const colWs = grid
                            ? Array.from(grid.children).filter(c => c.localName === 'gridCol')
                                .map(c => Math.max((parseInt(c.getAttribute('w'), 10) || 0) * scaleX, 8))
                            : [];
                        const rows = [];
                        for (const tr of Array.from(tbl.children).filter(c => c.localName === 'tr')) {
                            const rh = Math.max((parseInt(tr.getAttribute('h'), 10) || 0) * scaleY, 16);
                            const cells = [];
                            let ci = 0;
                            for (const tc of Array.from(tr.children).filter(c => c.localName === 'tc')) {
                                const span = parseInt(tc.getAttribute('gridSpan'), 10) || 1;
                                const merged = tc.getAttribute('hMerge') === '1' || tc.getAttribute('vMerge') === '1';
                                const tcPr = getDirectChild(tc, 'a:tcPr', 'tcPr');
                                const tcTxBody = getDirectChild(tc, 'a:txBody', 'txBody');
                                const parsedCell = tcTxBody ? extractTextLines(tcTxBody, ptToPx, { fontSize: Math.round(ptToPx(12)) }) : { lines: [] };
                                // Cell padding (EMU -> canvas px; default: 91440 LR / 45720 TB)
                                const tcEmu = (el, attr, def) => el && el.hasAttribute(attr) ? emuToPx(parseInt(el.getAttribute(attr), 10)) : emuToPx(def);
                                const cellPad = {
                                    l: tcEmu(tcPr, 'marL', 91440), r: tcEmu(tcPr, 'marR', 91440),
                                    t: tcEmu(tcPr, 'marT', 45720), b: tcEmu(tcPr, 'marB', 45720)
                                };
                                // Per-side borders from tcPr (lnL/lnR/lnT/lnB)
                                const readBorder = (parentEl, tag) => {
                                    if (!parentEl) return null;
                                    const ln = getDirectChild(parentEl, `a:${tag}`, tag);
                                    if (!ln) return null;
                                    if (getDirectChild(ln, 'a:noFill', 'noFill')) return null;
                                    const c = getFillColor(ln);
                                    const wAttr = ln.getAttribute('w');
                                    return c ? { color: c, width: wAttr ? Math.max(parseInt(wAttr, 10) / 12700, 0.5) : 1 } : null;
                                };
                                const borders = {
                                    l: readBorder(tcPr, 'lnL'), r: readBorder(tcPr, 'lnR'),
                                    t: readBorder(tcPr, 'lnT'), b: readBorder(tcPr, 'lnB')
                                };
                                let cw = 0;
                                for (let k = 0; k < span; k++) cw += colWs[ci + k] || 40;
                                cells.push({
                                    w: cw, merged,
                                    fill: tcPr ? getFillColor(tcPr) : null,
                                    vAlign: tcPr ? (tcPr.getAttribute('anchor') || 't') : 't',
                                    lines: parsedCell.lines,
                                    padding: cellPad,
                                    borders
                                });
                                ci += span;
                            }
                            rows.push({ h: rh, cells });
                        }
                        // Нормалізація сітки до фактичного прямокутника фрейму
                        const totalW = colWs.reduce((a, b) => a + b, 0) || rect.w;
                        const totalH = rows.reduce((a, r) => a + r.h, 0) || rect.h;
                        const fx = rect.w / totalW, fy = rect.h / totalH;
                        for (const row of rows) {
                            row.h *= fy;
                            for (const cell of row.cells) cell.w *= fx;
                        }
                        if (rows.length > 0) {
                            env.objects.push({ ...baseObject, type: 'table', ...rect, rows });
                            continue;
                        }
                    }
                    if (rect) {
                        env.objects.push({
                            ...baseObject, type: 'text', ...rect,
                            fillColor: '#E2E8F0', lineColor: '#94A3B8', lineWidth: 1.5, lineDash: null,
                            vAlign: 'ctr',
                            lines: [{ text: '[Діаграма]', color: '#475569', fontSize: Math.round(ptToPx(14)), bold: false, italic: false, align: 'ctr', indent: 0 }]
                        });
                    }
                    continue;
                }

                // --- Фігури, лінії, стрілки та текстові блоки ---
                const prstGeom = spPr ? getDirectChild(spPr, 'a:prstGeom', 'prstGeom') : null;
                const geomType = prstGeom ? prstGeom.getAttribute('prst') : null;
                const fillDef = getFillDef(spPr);
                const spStyle = getDirectChild(node, 'p:style', 'style');
                const lineProps = getLineProps(spPr, spStyle);
                const lineWidthPx = (lineProps && lineProps.widthPt)
                    ? Math.max(Math.round(ptToPx(lineProps.widthPt) * 10) / 10, 1)
                    : 2;

                // Дефолтні стилі тексту плейсхолдерів — з майстра (titleStyle/bodyStyle)
                let textDefaults = {};
                if (ph && env.masterStyles) {
                    const st = (ph.type === 'title' || ph.type === 'ctrTitle') ? env.masterStyles.title : env.masterStyles.body;
                    if (st) textDefaults = { fontSize: st.fontSize, color: st.color, font: st.font };
                }

                const txBody = getDirectChild(node, 'p:txBody', 'txBody');
                // Формули (OMML) обробляє extractTextLines: вони стають math-рунами всередині
                // рядків тексту (інлайн у реченнях та блочні абзаци), тому текст поруч із
                // формулами і кілька формул в одному блоці не втрачаються.
                const parsed = txBody ? extractTextLines(txBody, ptToPx, textDefaults) : { lines: [], vAlign: 't' };
                const hasText = parsed.lines.some(l => l.text);

                if (hasText) {
                    const r = rect || { x: 96, y: 80 + env.fallback.idx * 150, w: CANVAS_W - 192, h: 130 };
                    if (!rect) env.fallback.idx++;
                    env.objects.push({
                        ...baseObject, type: 'text', ...r,
                        shapeKind: SHAPE_KIND_BY_PRST[geomType] || 'rect',
                        fillColor: fillDef.color,
                        fillGradient: fillDef.gradient,
                        lineColor: lineProps ? lineProps.color : null,
                        lineWidth: lineWidthPx,
                        lineDash: (lineProps && lineProps.dash) || null,
                        vAlign: parsed.vAlign,
                        lines: parsed.lines,
                        textPadding: parsed.padding,
                        autofit: parsed.autofit
                    });
                } else if (rect && (fillDef.color || (lineProps && lineProps.color) || isConnector)) {
                    const shapeKind = isConnector ? 'line' : (SHAPE_KIND_BY_PRST[geomType] || 'rect');
                    env.objects.push({
                        ...baseObject, type: 'shape', shapeKind, ...rect,
                        fillColor: fillDef.color,
                        fillGradient: fillDef.gradient,
                        lineColor: (lineProps && lineProps.color) || ((isConnector || shapeKind === 'line') ? '#64748b' : null),
                        lineWidth: lineWidthPx,
                        lineDash: (lineProps && lineProps.dash) || null,
                        arrowHead: (lineProps && lineProps.arrowHead) || null,
                        arrowTail: (lineProps && lineProps.arrowTail) || null
                    });
                }
            } catch (nodeErr) {
                console.warn('PPTX: пропущено фігуру:', nodeErr);
            }
        }
    };

    // Перехід слайду з PPTX (p:transition) -> ключ TRANSITIONS
    const parseSlideTransition = (slideDoc) => {
        const tr = Array.from(slideDoc.documentElement.children).find(c => c.localName === 'transition');
        if (!tr) return null;
        const el = Array.from(tr.children).find(c => !['extLst', 'sndAc'].includes(c.localName));
        if (!el) return 'fade';
        const dir = (el.getAttribute('dir') || '').toLowerCase();
        const d4 = (map, dflt) => map[dir.charAt(0)] || dflt;
        switch (el.localName) {
            case 'fade': return el.getAttribute('thruBlk') === '1' ? 'fadeThroughBlack' : 'fade';
            case 'cut': return 'cut';
            case 'push': return d4({ l: 'pushLeft', r: 'pushRight', u: 'pushUp', d: 'pushDown' }, 'pushLeft');
            case 'wipe': return d4({ l: 'wipeLeft', r: 'wipeRight', u: 'wipeUp', d: 'wipeDown' }, 'wipeRight');
            case 'split': return el.getAttribute('orient') === 'horz' ? 'splitHorizontal' : 'splitVertical';
            case 'cover': return d4({ l: 'coverLeft', r: 'coverRight', u: 'coverUp', d: 'coverDown' }, 'coverLeft');
            case 'pull': return d4({ l: 'uncoverLeft', r: 'uncoverRight', u: 'uncoverUp', d: 'uncoverDown' }, 'uncoverLeft');
            // Прибрані переходи (жалюзі/шахівниця/розчинення/смуги/фігури/годинник/колесо/новина)
            // мапимо на найближчий збережений ефект, щоб імпорт не давав невідомий ключ.
            case 'blinds': case 'comb': return 'wipeRight';
            case 'checker': return 'fade';
            case 'dissolve': case 'random': return 'fade';
            case 'randomBar': return 'fade';
            case 'circle': return 'fade';
            case 'diamond': return 'fade';
            case 'plus': return 'fade';
            case 'wedge': return 'fade';
            case 'wheel': return 'fade';
            case 'zoom': case 'warp': return 'zoom';
            case 'newsflash': return 'flash';
            case 'strips': return 'coverLeft';
            default: return 'fade';
        }
    };

    const extractedSlides = [];

    for (let i = 0; i < sldIds.length; i++) {
        try {
            const rId = sldIds[i].getAttribute('r:id');
            const rel = presRelsDoc.querySelector(`Relationship[Id="${rId}"]`);
            if (!rel) continue;

            let slideTarget = rel.getAttribute('Target').replace(/^\//, '');
            if (!slideTarget.startsWith('ppt/')) slideTarget = `ppt/${slideTarget}`;

            const slideDoc = await parseXml(slideTarget);
            if (!slideDoc) continue;
            const slideRelsDoc = await parseXml(relsPathFor(slideTarget));

            // Макет слайду — успадкування координат плейсхолдерів, фону, стилів тексту
            let layout = null;
            const layoutRel = slideRelsDoc ? slideRelsDoc.querySelector('Relationship[Type$="slideLayout"]') : null;
            if (layoutRel) layout = await ensureLayout(resolveTarget(slideTarget, layoutRel.getAttribute('Target')));
            const masterStyles = (layout && layout.master) ? layout.master.txStyles : null;

            // Розв'язує відносний шлях зображення слайду та повертає dataURL
            const resolveImage = (embedId) => resolveImageIn(slideRelsDoc, slideTarget, embedId);
            const resolveMedia = (rId) => resolveMediaIn(slideRelsDoc, slideTarget, rId);

            // Фон: слайд -> макет -> майстер (колір / градієнт / картинка)
            const ownBg = await resolveBg(slideDoc, slideRelsDoc, slideTarget);
            const bg = ownBg
                || (layout && layout.bg)
                || (layout && layout.master && layout.master.bg)
                || null;

            const objects = [];

            // Декоративні фігури майстра та макета — під об'єктами слайду (як у PowerPoint)
            const cloneStatic = (objs) => (objs || []).map(o => ({
                ...o,
                id: crypto.randomUUID(),
                lines: o.lines ? o.lines.map(l => ({ ...l, runs: l.runs ? l.runs.map(r2 => ({ ...r2 })) : l.runs })) : o.lines,
                rows: o.rows ? o.rows.map(row => ({ ...row, cells: row.cells.map(c => ({ ...c })) })) : o.rows,
                animation: { type: 'none', delay: 0, duration: 0.8 }
            }));
            if (layout && slideDoc.documentElement.getAttribute('showMasterSp') !== '0') {
                if (layout.showMasterSp !== false && layout.master) objects.push(...cloneStatic(layout.master.staticObjects));
                objects.push(...cloneStatic(layout.staticObjects));
            }

            const cSld = getDirectChild(slideDoc.documentElement, 'p:cSld', 'cSld');
            const spTree = cSld ? getDirectChild(cSld, 'p:spTree', 'spTree') : null;
            const nodes = spTree
                ? Array.from(spTree.children).filter(c => DRAWABLE_TAGS.includes(c.tagName))
                : [];

            await parseSpTree(nodes, {
                resolveImage, resolveMedia, layout, masterStyles, objects,
                fallback: { idx: 0 }, skipPlaceholders: false
            }, null);

            // Нотатки доповідача: лише текст body-плейсхолдера (без номера слайду та колонтитулів)
            let notesText = '';
            if (slideRelsDoc) {
                const notesRel = slideRelsDoc.querySelector('Relationship[Type$="notesSlide"]');
                if (notesRel) {
                    const notesDoc = await parseXml(resolveTarget(slideTarget, notesRel.getAttribute('Target')));
                    if (notesDoc) {
                        const nCSld = getDirectChild(notesDoc.documentElement, 'p:cSld', 'cSld');
                        const nTree = nCSld ? getDirectChild(nCSld, 'p:spTree', 'spTree') : null;
                        const nShapes = nTree ? Array.from(nTree.children).filter(c => ['p:sp', 'sp'].includes(c.tagName)) : [];
                        for (const sp of nShapes) {
                            const nph = getPhInfo(sp);
                            if (nph && nph.type === 'body') {
                                const texts = Array.from(sp.querySelectorAll('a\\:t, t')).map(t => t.textContent);
                                notesText = texts.join(' ').replace(/\s+/g, ' ').trim();
                                break;
                            }
                        }
                        if (!notesText) {
                            // Запасний варіант: увесь текст файлу нотаток
                            const texts = Array.from(notesDoc.querySelectorAll('a\\:t, t')).map(t => t.textContent);
                            notesText = texts.join(' ').replace(/\s+/g, ' ').trim();
                        }
                    }
                }
            }

            extractedSlides.push({
                id: crypto.randomUUID(),
                slideNumber: i + 1,
                speakerNotes: notesText,
                text: notesText,            // поточний текст диктора (редагований)
                background: (bg && bg.color) || '#FFFFFF',
                bgGradient: (bg && bg.gradient) || null,
                bgImage: (bg && bg.image) || null,
                objects,
                audioBase64: null,
                sampleRate: 24000,
                audioDuration: 0,
                isGenerating: false,
                transition: parseSlideTransition(slideDoc) || (i === 0 ? 'none' : 'fade'),
                error: null
            });
        } catch (slideErr) {
            // Слайд не розібрався — додаємо порожній з помилкою, але не зриваємо весь імпорт
            extractedSlides.push({
                id: crypto.randomUUID(),
                slideNumber: i + 1,
                speakerNotes: '', text: '', background: '#FFFFFF', bgGradient: null, bgImage: null, objects: [],
                audioBase64: null, sampleRate: 24000, audioDuration: 0, isGenerating: false,
                transition: i === 0 ? 'none' : 'fade',
                error: 'Не вдалося розібрати слайд: ' + slideErr.message
            });
        }
    }

    if (extractedSlides.length === 0) throw new Error("У презентації не знайдено слайдів");

    // Розігрів кеша відео одразу після імпорту (у фоні): блоби вже в пам'яті,
    // <video>-елементи створюємо і декодуємо заздалегідь — перший показ слайда
    // з відео стартує миттєво, без паузи на завантаження/сік
    const videoSrcsToWarm = new Set();
    for (const s of extractedSlides) {
        for (const o of s.objects || []) {
            if ((o.type === 'video' || o.type === 'audio') && o.src) videoSrcsToWarm.add(o.src);
        }
    }
    if (videoSrcsToWarm.size && typeof document !== 'undefined') {
        Promise.all(Array.from(videoSrcsToWarm).map(src => loadVideo(src))).then(() => {
            logChange('Імпорт', `Відео підготовлено до відтворення: ${videoSrcsToWarm.size}`);
        }).catch(() => { /* ignore */ });
    }

    logChange('Імпорт', `Розібрано презентацію: ${extractedSlides.length} слайд(ів)`, {
        slides: extractedSlides.length,
        embeddedFonts: embeddedFontFamilies.length,
        themeFonts: { major: themeFonts.major, minor: themeFonts.minor }
    });
    return extractedSlides;
};

/* ============================================================================
 * 4. РЕНДЕР-ДВИЖОК (Canvas: кадри слайдів, анімації об'єктів, переходи)
 * ========================================================================== */

// Кеш завантажених зображень: dataURL -> HTMLImageElement
const imageCache = new Map();

const loadImage = (src) => new Promise((resolve) => {
    if (imageCache.has(src)) return resolve(imageCache.get(src));
    const img = new Image();
    img.onload = () => { imageCache.set(src, img); resolve(img); };
    img.onerror = () => resolve(null);
    img.src = src;
});

// Кеш відеоелементів слайдів: src -> HTMLVideoElement (для малювання кадрів на canvas)
const videoCache = new Map();
// Кеш останнього успішно намальованого кадру кожного відео (src -> offscreen canvas).
// Під час сіку (наприклад, перезапуск циклу для fitMode='loop') readyState відео
// на мить падає, і без цього кешу кадр підмінявся б постером/чорним прямокутником —
// саме це й виглядало як "відео конвертується некоректно", хоча звук (captureStream,
// живий аудіопотік) продовжував грати без перерви.
const videoLastFrameCache = new Map();
const getVideoEl = (src) => {
    if (videoCache.has(src)) return videoCache.get(src);
    const v = document.createElement('video');
    v.src = src; v.muted = true; v.playsInline = true; v.preload = 'auto'; v.loop = false;
    if (!src.startsWith('data:') && !src.startsWith('blob:')) {
        v.setAttribute('crossorigin', 'anonymous');
    }
    videoCache.set(src, v);
    return v;
};
const loadVideo = (src) => new Promise((resolve) => {
    const v = getVideoEl(src);
    if (v.readyState >= 2) return resolve(v);
    const done = () => resolve(v);
    v.addEventListener('loadeddata', done, { once: true });
    v.addEventListener('error', () => resolve(null), { once: true });
    try { v.load(); } catch (e) { /* ignore */ }
    setTimeout(done, 2000); // фолбек, щоб імпорт не зависав
});
// Захоплені аудіоджерела відео (для мікшування у трек експорту) + таймери відкладеного старту
const videoAudioSources = new WeakMap();
const videoStartTimers = new WeakMap();
// Грати відео слайду зі звуком. mix={audioCtx,dest} — підмішати аудіо у трек експорту.
const playSlideVideos = (slide, mix) => {
    (slide?.objects || []).filter(o => (o.type === 'video' || o.type === 'audio') && o.src).forEach(o => {
        const v = videoCache.get(o.src);
        if (!v) return;
        const ts = o.trimStart || 0;
        const te = (o.trimEnd != null && o.trimEnd > ts) ? o.trimEnd : 0;
        const fitMode = o.videoFitMode || 'loop'; // 'loop' | 'stretch' | 'trim'

        const startNow = () => {
            try {
                v.muted = false;
                // Не перемотуємо вдруге, якщо відео вже на потрібній позиції (його
                // могли заздалегідь підготувати через primeSlideVideos) — щоб уникнути
                // зайвого сіку/ривка й затримки старту на початку слайда.
                if (Math.abs(v.currentTime - ts) > 0.05) v.currentTime = ts;

                if (fitMode === 'stretch') {
                    const naturalDur = v.duration - ts;
                    const timelineDur = (te > ts ? te : v.duration) - ts;
                    if (timelineDur > 0 && naturalDur > 0) {
                        v.playbackRate = Math.max(0.05, naturalDur / timelineDur);
                    } else {
                        v.playbackRate = 1.0;
                    }
                    v.ontimeupdate = () => {
                        if (v.currentTime >= v.duration - 0.05) {
                            v.pause();
                            v.ontimeupdate = null;
                        }
                    };
                } else if (fitMode === 'trim') {
                    v.playbackRate = 1.0;
                    v.ontimeupdate = () => {
                        const limit = te ? Math.min(te, v.duration - 0.05) : (v.duration - 0.05);
                        if (v.currentTime >= limit) {
                            v.pause();
                            v.ontimeupdate = null;
                        }
                    };
                } else { // 'loop'
                    v.playbackRate = 1.0;
                    v.ontimeupdate = () => {
                        const limit = te ? Math.min(te, v.duration - 0.05) : (v.duration - 0.05);
                        if (v.currentTime >= limit) {
                            v.currentTime = ts;
                            const p = v.play();
                            if (p && p.catch) p.catch(() => { });
                        }
                    };
                }

                // Захоплення аудіо з відео для експорту через captureStream().
                // captureStream() — це нативний браузерний механізм, який бере аудіо
                // та відео БЕЗПОСЕРЕДНЬО з декодера елемента <video>. Тому звукова
                // доріжка ЗАВЖДИ ідеально синхронізована з картинкою — без жодних
                // додаткових затримок чи зміщень. Будь-яка інша схема (клони,
                // createMediaElementSource через окремий AudioContext) неминуче додає
                // затримку обробки і зміщує аудіо відносно відео.
                if (mix && mix.audioCtx && mix.dest && typeof v.captureStream === 'function' && !videoAudioSources.has(v)) {
                    const stream = v.captureStream();
                    if (stream.getAudioTracks().length) {
                        const node = mix.audioCtx.createMediaStreamSource(stream);
                        node.connect(mix.dest);
                        videoAudioSources.set(v, { node });
                    }
                }
                const p = v.play(); if (p && p.catch) p.catch(() => { });
            } catch (e) { /* ignore */ }
        };
        // Старт за obj.animation.delay — AI-анімація вирішує, КОЛИ відео програється
        const delayMs = Math.max(0, (o.animation && o.animation.delay ? o.animation.delay : 0) * 1000);
        if (delayMs > 50) { const id = setTimeout(startNow, delayMs); videoStartTimers.set(v, id); }
        else startNow();
    });
};
const stopSlideVideos = (slide) => {
    (slide?.objects || []).filter(o => (o.type === 'video' || o.type === 'audio') && o.src).forEach(o => {
        const v = videoCache.get(o.src);
        if (!v) return;
        try {
            const tid = videoStartTimers.get(v); if (tid) { clearTimeout(tid); videoStartTimers.delete(v); }
            v.ontimeupdate = null;
            v.playbackRate = 1.0;
            v.pause(); v.currentTime = (o.trimStart || 0);
            const s = videoAudioSources.get(v);
            if (s) { try { s.node.disconnect(); } catch (e) { /* ignore */ } videoAudioSources.delete(v); }
        } catch (e) { /* ignore */ }
    });
};

// Підготувати вбудовані відео слайда ПЕРЕД стартом озвучки: перемотати кожне
// відео (яке починається на старті слайда) на його trimStart і дочекатися події
// 'seeked' — тобто поки кадр реально декодовано й показано. Лише після цього
// можна одночасно запускати відео, озвучку та годинник кадрів, і картинка не
// відставатиме від звуку (раніше звук стартував миттєво, а відео ще
// перемотувалось/декодувалось — тому звук «біг попереду» картинки).
const primeSlideVideos = (slide) => {
    const objs = (slide?.objects || []).filter(o =>
        (o.type === 'video' || o.type === 'audio') && o.src &&
        !(o.animation && o.animation.delay > 0.08) // лише ті, що стартують на початку слайда
    );
    return Promise.all(objs.map(o => new Promise(resolve => {
        const v = videoCache.get(o.src);
        if (!v) return resolve();
        const ts = o.trimStart || 0;
        let settled = false;
        const finish = () => { if (settled) return; settled = true; resolve(); };
        try {
            v.pause();
            if (v.readyState >= 2 && Math.abs(v.currentTime - ts) < 0.05) return finish();
            v.addEventListener('seeked', finish, { once: true });
            v.currentTime = ts;
            setTimeout(finish, 800); // фолбек, якщо 'seeked' не спрацював (наприклад, відео ще не готове)
        } catch (e) { finish(); }
    })));
};

const preloadSlideImages = async (slide) => {
    // Чекаємо, поки вбудовані шрифти PPTX стануть доступні (інакше перший кадр — системним шрифтом)
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (e) { /* ignore */ }
    }
    const srcs = (slide.objects || []).filter(o => o.type === 'image' && o.src).map(o => o.src);
    if (slide.bgImage) srcs.push(slide.bgImage);
    // Постери відео — як звичайні зображення; самі відео та аудіо — окремо
    (slide.objects || []).filter(o => o.type === 'video' && o.poster).forEach(o => srcs.push(o.poster));
    const videoSrcs = (slide.objects || []).filter(o => (o.type === 'video' || o.type === 'audio') && o.src).map(o => o.src);
    await Promise.all([...srcs.map(loadImage), ...videoSrcs.map(loadVideo)]);
};

// fillStyle для canvas: лінійний градієнт за визначенням заливки або суцільний колір
const makeFillStyle = (octx, obj) => {
    const g = obj.fillGradient;
    if (g && g.stops && g.stops.length > 1) {
        const ang = (g.angle || 0) * Math.PI / 180;
        const cx = obj.w / 2, cy = obj.h / 2;
        const len = (Math.abs(Math.cos(ang)) * obj.w + Math.abs(Math.sin(ang)) * obj.h) / 2;
        const grad = octx.createLinearGradient(
            cx - Math.cos(ang) * len, cy - Math.sin(ang) * len,
            cx + Math.cos(ang) * len, cy + Math.sin(ang) * len
        );
        for (const s of g.stops) grad.addColorStop(Math.max(0, Math.min(1, s.pos)), s.color);
        return grad;
    }
    return obj.fillColor;
};

// Детермінований псевдо-випадковий генератор (для смуг, шахівниці, розчинення)
const pseudoRandom = (i) => {
    const x = Math.sin(i * 12.9898) * 43758.5453;
    return x - Math.floor(x);
};

// Clip-контур анімацій появи (у локальних координатах об'єкта, із запасом на виступаючий текст)
const buildObjectClipPath = (clip, w, h) => {
    const path = new Path2D();
    switch (clip.type) {
        case 'wipe':
            if (clip.dir === 'left') path.rect(0, -h, w * clip.p, h * 3);
            else if (clip.dir === 'right') path.rect(w - w * clip.p, -h, w * clip.p, h * 3);
            else if (clip.dir === 'top') path.rect(-w, 0, w * 3, h * clip.p);
            else path.rect(-w, h - h * clip.p, w * 3, h * clip.p);
            break;
        case 'split':
            path.rect(w / 2 - (w * clip.p) / 2, -h, w * clip.p, h * 3);
            break;
        case 'blinds': {
            const n = 6, bh = h / n;
            for (let i = 0; i < n; i++) path.rect(-w, i * bh, w * 3, bh * clip.p);
            break;
        }
        case 'bars': {
            const n = 10, bh = h / n;
            for (let i = 0; i < n; i++) if (pseudoRandom(i + 1) < clip.p) path.rect(-w, i * bh, w * 3, bh + 1);
            break;
        }
        case 'circle':
            path.arc(w / 2, h / 2, Math.max(clip.p, 0.001) * Math.hypot(w, h) / 2 + 1, 0, Math.PI * 2);
            break;
        case 'wedge':
            path.moveTo(w / 2, h / 2);
            path.arc(w / 2, h / 2, Math.hypot(w, h), -Math.PI / 2, -Math.PI / 2 + clip.p * Math.PI * 2);
            path.closePath();
            break;
        default:
            path.rect(0, 0, w, h);
    }
    return path;
};

// Контур фігури для заливки/обведення: полігон, еліпс, скруглений або звичайний прямокутник
const traceShapePath = (ctx, obj) => {
    ctx.beginPath();
    const poly = SHAPE_POLYGONS[obj.shapeKind];
    if (poly) {
        ctx.moveTo(poly[0][0] * obj.w, poly[0][1] * obj.h);
        for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0] * obj.w, poly[i][1] * obj.h);
        ctx.closePath();
    } else if (obj.shapeKind === 'ellipse') {
        ctx.ellipse(obj.w / 2, obj.h / 2, obj.w / 2, obj.h / 2, 0, 0, Math.PI * 2);
    } else if (obj.shapeKind === 'roundRect') {
        const r = Math.min(obj.w, obj.h) * 0.16;
        if (ctx.roundRect) ctx.roundRect(0, 0, obj.w, obj.h, r);
        else ctx.rect(0, 0, obj.w, obj.h);
    } else {
        ctx.rect(0, 0, obj.w, obj.h);
    }
};

// Лінія/з'єднувач зі штрихом та стрілками на кінцях (як у PowerPoint)
// Наконечник стрілки у точці (tx,ty), що дивиться в напрямку dir (рад). Тип і розмір — як у PowerPoint.
// Повертає, на скільки px треба «вкоротити» лінію з цього кінця, щоб вістря збіглося з кінцем.
const drawArrowEnd = (ctx, tx, ty, dir, end, lw, color) => {
    const e = normArrowEnd(end);
    if (!e) return 0;
    const len = Math.max(lw * (ARROW_LEN[e.len] || ARROW_LEN.med), 7);
    const wid = Math.max(lw * (ARROW_WID[e.w] || ARROW_WID.med), 7);
    const ux = Math.cos(dir), uy = Math.sin(dir);       // напрямок «вперед» (куди дивиться вістря)
    const px = -uy, py = ux;                              // перпендикуляр
    const bx = tx - len * ux, by = ty - len * uy;        // центр основи
    const lX = bx + px * wid / 2, lY = by + py * wid / 2;
    const rX = bx - px * wid / 2, rY = by - py * wid / 2;
    ctx.fillStyle = color; ctx.strokeStyle = color;
    if (e.type === 'arrow') {
        // Відкрита стрілка (дві лінії «V»), без заливки
        ctx.lineWidth = lw; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(lX, lY); ctx.lineTo(tx, ty); ctx.lineTo(rX, rY); ctx.stroke();
        return 0;
    }
    if (e.type === 'oval') {
        const r = Math.max(wid, len) / 2;
        ctx.beginPath(); ctx.arc(tx, ty, r, 0, Math.PI * 2); ctx.fill();
        return r * 0.8;
    }
    if (e.type === 'diamond') {
        const fX = tx + ux * len / 2, fY = ty + uy * len / 2;
        const kX = tx - ux * len / 2, kY = ty - uy * len / 2;
        ctx.beginPath(); ctx.moveTo(fX, fY); ctx.lineTo(lX + ux * len / 2, lY + uy * len / 2);
        ctx.lineTo(kX, kY); ctx.lineTo(rX + ux * len / 2, rY + uy * len / 2); ctx.closePath(); ctx.fill();
        return len / 2;
    }
    if (e.type === 'stealth') {
        const nX = tx - len * 0.55 * ux, nY = ty - len * 0.55 * uy; // ввігнута основа
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(lX, lY); ctx.lineTo(nX, nY); ctx.lineTo(rX, rY); ctx.closePath(); ctx.fill();
        return len * 0.55;
    }
    // triangle (за замовчуванням)
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(lX, lY); ctx.lineTo(rX, rY); ctx.closePath(); ctx.fill();
    return len * 0.9;
};

// На скільки px вкоротити лінію під наконечником, щоб вістря збіглося з кінцем (без малювання)
const arrowCut = (end, lw) => {
    const e = normArrowEnd(end);
    if (!e) return 0;
    const len = Math.max(lw * (ARROW_LEN[e.len] || ARROW_LEN.med), 7);
    const wid = Math.max(lw * (ARROW_WID[e.w] || ARROW_WID.med), 7);
    if (e.type === 'arrow') return 0;
    if (e.type === 'oval') return Math.max(wid, len) / 2 * 0.8;
    if (e.type === 'diamond') return len / 2;
    if (e.type === 'stealth') return len * 0.55;
    return len * 0.9; // triangle
};

const drawLineWithArrows = (ctx, obj) => {
    const x1 = obj.flipH ? obj.w : 0, y1 = obj.flipV ? obj.h : 0;
    const x2 = obj.flipH ? 0 : obj.w, y2 = obj.flipV ? 0 : obj.h;
    const color = obj.lineColor || obj.fillColor || '#64748b';
    const lw = obj.lineWidth || 2;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const ux = Math.cos(angle), uy = Math.sin(angle);

    // Вкорочуємо лінію під заливними наконечниками, щоб вістря точно збіглося з кінцем
    const headCut = arrowCut(obj.arrowHead, lw);
    const tailCut = arrowCut(obj.arrowTail, lw);
    const sx = x1 + ux * headCut, sy = y1 + uy * headCut;
    const ex = x2 - ux * tailCut, ey = y2 - uy * tailCut;

    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    if (obj.lineDash) ctx.setLineDash(obj.lineDash);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.setLineDash([]);

    if (obj.arrowTail) drawArrowEnd(ctx, x2, y2, angle, obj.arrowTail, lw, color);          // кінець → дивиться вперед
    if (obj.arrowHead) drawArrowEnd(ctx, x1, y1, angle + Math.PI, obj.arrowHead, lw, color); // початок → дивиться назад
};

// Малює один об'єкт з урахуванням стану анімації (alpha / зсув / масштаб / оберт / clip)
const drawObject = (ctx, obj, state, time = 0) => {
    if (!state.visible) return;
    ctx.save();
    const objOpacity = obj.opacity != null ? obj.opacity : 1;
    ctx.globalAlpha = Math.max(0, Math.min(1, state.alpha * objOpacity));

    const cx = obj.x + obj.w / 2 + state.dx;
    const cy = obj.y + obj.h / 2 + state.dy;
    ctx.translate(cx, cy);
    const totalRot = (obj.rot || 0) + (state.rot || 0);
    if (totalRot) ctx.rotate(totalRot * Math.PI / 180);
    const sx = state.scaleX != null ? state.scaleX : state.scale;
    const sy = state.scaleY != null ? state.scaleY : state.scale;
    ctx.scale(sx, sy);
    ctx.translate(-obj.w / 2, -obj.h / 2);

    // Clip появи застосовуємо лише поки анімація триває (p<1), щоб фінальний кадр не обрізав текст
    if (state.clip && state.clip.p < 1) {
        ctx.clip(buildObjectClipPath(state.clip, obj.w, obj.h));
    }

    if (obj.type === 'image') {
        const img = imageCache.get(obj.src);
        if (img) {
            // Заокруглення кутів — обрізаємо картинку скругленим прямокутником
            if (obj.cornerRadius > 0) {
                const rr = Math.min(obj.cornerRadius, Math.min(obj.w, obj.h) / 2);
                const rPath = new Path2D();
                if (rPath.roundRect) rPath.roundRect(0, 0, obj.w, obj.h, rr);
                else rPath.rect(0, 0, obj.w, obj.h);
                ctx.clip(rPath);
            }
            let sx = 0, sy = 0, sw = img.width, sh = img.height;
            if (obj.crop) {
                sx = img.width * obj.crop.l;
                sy = img.height * obj.crop.t;
                sw = Math.max(img.width * (1 - obj.crop.l - obj.crop.r), 1);
                sh = Math.max(img.height * (1 - obj.crop.t - obj.crop.b), 1);
            }
            if (obj.flipH || obj.flipV) {
                ctx.save();
                ctx.translate(obj.flipH ? obj.w : 0, obj.flipV ? obj.h : 0);
                ctx.scale(obj.flipH ? -1 : 1, obj.flipV ? -1 : 1);
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, obj.w, obj.h);
                ctx.restore();
            } else {
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, obj.w, obj.h);
            }
        }
        ctx.restore();
        return;
    }

    // Відео на слайді: малюємо поточний кадр (під час відтворення) або постер
    if (obj.type === 'video') {
        if (obj.cornerRadius > 0) {
            const rr = Math.min(obj.cornerRadius, Math.min(obj.w, obj.h) / 2);
            const rPath = new Path2D();
            if (rPath.roundRect) rPath.roundRect(0, 0, obj.w, obj.h, rr); else rPath.rect(0, 0, obj.w, obj.h);
            ctx.clip(rPath);
        }
        const v = videoCache.get(obj.src);
        const poster = obj.poster ? imageCache.get(obj.poster) : null;
        // Кроп (обрізка): видима область вихідного кадру
        const cr = obj.crop && (obj.crop.l || obj.crop.t || obj.crop.r || obj.crop.b) ? obj.crop : null;
        const cropSrc = (mw, mh) => {
            if (!cr) return [0, 0, mw, mh];
            return [mw * cr.l, mh * cr.t, Math.max(mw * (1 - cr.l - cr.r), 1), Math.max(mh * (1 - cr.t - cr.b), 1)];
        };
        let drew = false;
        if (v && v.readyState >= 2 && v.videoWidth) {
            try {
                const [sx, sy, sw, sh] = cropSrc(v.videoWidth, v.videoHeight);
                ctx.drawImage(v, sx, sy, sw, sh, 0, 0, obj.w, obj.h);
                drew = true;
                // Запам'ятовуємо вдалий кадр — на випадок, якщо наступні кілька
                // кадрів попадуть у момент сіку (readyState тимчасово < 2)
                let cache = videoLastFrameCache.get(obj.src);
                if (!cache) { cache = document.createElement('canvas'); videoLastFrameCache.set(obj.src, cache); }
                if (cache.width !== v.videoWidth || cache.height !== v.videoHeight) { cache.width = v.videoWidth; cache.height = v.videoHeight; }
                cache.getContext('2d').drawImage(v, 0, 0);
            } catch (e) { /* ignore */ }
        }
        if (!drew) {
            // Короткий провал readyState (наприклад, сік під час циклічного повтору
            // fitMode='loop') — показуємо останній реальний кадр відео, а не постер/
            // чорний прямокутник, щоб картинка не "миготіла" поки триває звук.
            const cache = videoLastFrameCache.get(obj.src);
            if (cache && cache.width > 0) {
                try { const [sx, sy, sw, sh] = cropSrc(cache.width, cache.height); ctx.drawImage(cache, sx, sy, sw, sh, 0, 0, obj.w, obj.h); drew = true; } catch (e) { /* ignore */ }
            }
        }
        if (!drew && poster) { const [sx, sy, sw, sh] = cropSrc(poster.width, poster.height); ctx.drawImage(poster, sx, sy, sw, sh, 0, 0, obj.w, obj.h); drew = true; }
        if (!drew) { ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, obj.w, obj.h); }
        // Значок ► показуємо тільки в стані спокою (редактор)
        if ((!v || v.paused) && time === 0) {
            const r = Math.min(obj.w, obj.h) * 0.13;
            const cx = obj.w / 2, cy = obj.h / 2;
            ctx.fillStyle = 'rgba(0,0,0,0.45)';
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(cx - r * 0.35, cy - r * 0.5);
            ctx.lineTo(cx + r * 0.55, cy);
            ctx.lineTo(cx - r * 0.35, cy + r * 0.5);
            ctx.closePath(); ctx.fill();
        }
        ctx.restore();
        return;
    }

    if (obj.type === 'audio') {
        const cx = obj.w / 2, cy = obj.h / 2;
        ctx.fillStyle = '#f43f5e';
        if (obj.cornerRadius > 0) {
            const rr = Math.min(obj.cornerRadius, Math.min(obj.w, obj.h) / 2);
            const rPath = new Path2D();
            if (rPath.roundRect) rPath.roundRect(0, 0, obj.w, obj.h, rr); else rPath.rect(0, 0, obj.w, obj.h);
            ctx.fill(rPath);
        } else {
            ctx.fillRect(0, 0, obj.w, obj.h);
        }
        ctx.fillStyle = '#fff';
        ctx.font = `${Math.max(16, obj.h * 0.4)}px Arial`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🎵', cx, cy);
        ctx.restore();
        return;
    }

    // Формула: на canvas (для відео) показуємо лінійний запис формули (MathML — лише в редакторі)
    if (obj.type === 'math') {
        const fs = Math.max(Math.min(obj.h * 0.5, 44), 14);
        const lines = [{
            text: obj.textFallback || '', align: 'ctr',
            runs: [{ text: obj.textFallback || '', color: obj.color || '#111827', fontSize: fs, bold: false, italic: true, font: null }]
        }];
        drawTextBlock(ctx, lines, obj.w, obj.h, 'ctr', 4, 4, true);
        ctx.restore();
        return;
    }

    // Інтерактив (H5P-стиль): у відео малюємо статичний вигляд (інтерактивність — у редакторі)
    if (obj.type === 'interactive') {
        const accent = obj.color || '#7c3aed';
        const run = (text, color, fontSize, bold, align) => ({ text, align: align || 'l', runs: [{ text, color, fontSize, bold: !!bold, font: null }] });
        const cardBg = (border) => {
            ctx.fillStyle = '#fff';
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(0, 0, obj.w, obj.h, 12); ctx.fill(); } else ctx.fillRect(0, 0, obj.w, obj.h);
            if (border) { ctx.strokeStyle = accent; ctx.lineWidth = 2; if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(1, 1, obj.w - 2, obj.h - 2, 12); ctx.stroke(); } else ctx.strokeRect(1, 1, obj.w - 2, obj.h - 2); }
        };
        if (obj.iType === 'hotspot') {
            const r = Math.min(obj.w, obj.h) / 2;
            ctx.fillStyle = accent;
            ctx.beginPath(); ctx.arc(obj.w / 2, obj.h / 2, r, 0, Math.PI * 2); ctx.fill();
            drawTextBlock(ctx, [run(obj.label || 'i', '#fff', Math.max(r, 14), true, 'ctr')], obj.w, obj.h, 'ctr', 2, 2, true);
        } else if (obj.iType === 'mcq' || obj.iType === 'summary') {
            cardBg(true);
            const lines = [run(obj.question || 'Питання?', '#1e293b', 20, true)];
            (obj.options || []).forEach((o, i) => lines.push(run(`${String.fromCharCode(65 + i)}. ${o}`, i === obj.correct ? '#059669' : '#475569', 16)));
            drawTextBlock(ctx, lines, obj.w, obj.h, 't', 14, 12, true);
        } else if (obj.iType === 'truefalse') {
            cardBg(true);
            drawTextBlock(ctx, [run(obj.question || 'Твердження?', '#1e293b', 20, true), run('Правда / Хибність', accent, 16, true)], obj.w, obj.h, 'ctr', 14, 12, true);
        } else if (obj.iType === 'fill') {
            cardBg(true);
            const shown = String(obj.text || '').replace(/\*[^*]+\*/g, '_____');
            drawTextBlock(ctx, [run(shown, '#1e293b', 18)], obj.w, obj.h, 'ctr', 14, 12, true);
        } else if (obj.iType === 'info') {
            cardBg(false);
            ctx.fillStyle = accent; ctx.fillRect(0, 0, 5, obj.h);
            drawTextBlock(ctx, [run(obj.content || 'Інфо', '#334155', 17)], obj.w, obj.h, 't', 14, 12, true);
        } else if (obj.iType === 'accordion') {
            cardBg(true);
            const lines = (obj.items || []).map(it => run('▸ ' + (it.title || ''), accent, 18, true));
            drawTextBlock(ctx, lines.length ? lines : [run('Акордеон', accent, 18, true)], obj.w, obj.h, 't', 14, 12, true);
        } else if (obj.iType === 'flashcard') {
            cardBg(true);
            drawTextBlock(ctx, [run(obj.front || 'Картка', '#1e293b', 22, true, 'ctr')], obj.w, obj.h, 'ctr', 14, 12, true);
        } else { // link
            ctx.fillStyle = accent;
            if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(0, 0, obj.w, obj.h, 12); ctx.fill(); } else ctx.fillRect(0, 0, obj.w, obj.h);
            drawTextBlock(ctx, [run('▶ ' + (obj.label || 'Перейти'), '#fff', 22, true, 'ctr')], obj.w, obj.h, 'ctr', 8, 8, true);
        }
        ctx.restore();
        return;
    }

    if (obj.type === 'shape' && obj.shapeKind === 'line') {
        drawLineWithArrows(ctx, obj);
        ctx.restore();
        return;
    }

    // Таблиця: сітка комірок із заливками, межами та текстом
    if (obj.type === 'table' && obj.rows) {
        let rowY = 0;
        for (const row of obj.rows) {
            let cellX = 0;
            for (const cell of row.cells) {
                if (!cell.merged) {
                    if (cell.fill) {
                        ctx.fillStyle = cell.fill;
                        ctx.fillRect(cellX, rowY, cell.w, row.h);
                    }
                    // Per-side borders (з PPTX tcPr lnL/lnR/lnT/lnB)
                    const bd = cell.borders;
                    const drawBorder = (b, x1, y1, x2, y2) => {
                        if (!b) return;
                        ctx.strokeStyle = b.color;
                        ctx.lineWidth = b.width;
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                    };
                    if (bd && (bd.l || bd.r || bd.t || bd.b)) {
                        drawBorder(bd.t, cellX, rowY, cellX + cell.w, rowY);
                        drawBorder(bd.b, cellX, rowY + row.h, cellX + cell.w, rowY + row.h);
                        drawBorder(bd.l, cellX, rowY, cellX, rowY + row.h);
                        drawBorder(bd.r, cellX + cell.w, rowY, cellX + cell.w, rowY + row.h);
                    } else {
                        ctx.strokeStyle = '#94A3B8';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(cellX, rowY, cell.w, row.h);
                    }
                    ctx.save();
                    ctx.translate(cellX, rowY);
                    ctx.beginPath();
                    ctx.rect(0, 0, cell.w, row.h);
                    ctx.clip();
                    drawTextBlock(ctx, cell.lines, cell.w, row.h, cell.vAlign, cell.padding || { l: 8, r: 8, t: 4, b: 4 });
                    ctx.restore();
                }
                cellX += cell.w;
            }
            rowY += row.h;
        }
        ctx.restore();
        return;
    }

    // Заливка та контур (для фігур і фону текстових блоків)
    if (obj.fillColor || obj.fillGradient) {
        traceShapePath(ctx, obj);
        ctx.fillStyle = makeFillStyle(ctx, obj);
        ctx.fill();
    }
    if (obj.lineColor) {
        traceShapePath(ctx, obj);
        ctx.strokeStyle = obj.lineColor;
        ctx.lineWidth = obj.lineWidth || 2;
        if (obj.lineDash) ctx.setLineDash(obj.lineDash);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Текст: рядки з рунами (стилі фрагментів), переноси, вирівнювання, відступи списків
    if (obj.type === 'text' && obj.lines && obj.lines.length > 0) {
        drawTextBlock(ctx, obj.lines, obj.w, obj.h, obj.vAlign, obj.textPadding || 6, 6, obj.autofit);
    }

    ctx.restore();
};

// Малює повний кадр слайду у момент часу time (сек від початку слайду)
const drawSlideFrame = (ctx, slide, time) => {
    ctx.globalAlpha = 1;
    const bgImg = slide.bgImage ? imageCache.get(slide.bgImage) : null;
    if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, CANVAS_W, CANVAS_H);
    } else if (slide.bgGradient) {
        ctx.fillStyle = makeFillStyle(ctx, { fillGradient: slide.bgGradient, fillColor: slide.background, w: CANVAS_W, h: CANVAS_H });
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    } else {
        ctx.fillStyle = slide.background || '#FFFFFF';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
    for (const obj of (slide.objects || [])) {
        drawObject(ctx, obj, getObjectRenderState(obj, time), time);
    }
};

// Рендерить слайд у офскрін-канвас (для кадрів переходу)
const renderSlideToCanvas = (slide, time) => {
    const off = document.createElement('canvas');
    off.width = CANVAS_W;
    off.height = CANVAS_H;
    drawSlideFrame(off.getContext('2d'), slide, time);
    return off;
};

// Малює один кадр переходу між двома слайдами (повний набір PowerPoint-переходів)
const drawTransitionFrame = (ctx, prevCanvas, nextCanvas, type, progress) => {
    const w = CANVAS_W, h = CANVAS_H;
    const p = Math.max(0, Math.min(1, progress));
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, w, h);

    // prev як фон, next крізь довільний clip-контур
    const drawNextThrough = (buildPath) => {
        ctx.drawImage(prevCanvas, 0, 0);
        const path = new Path2D();
        buildPath(path);
        ctx.save();
        ctx.clip(path);
        ctx.drawImage(nextCanvas, 0, 0);
        ctx.restore();
    };

    switch (type) {
        case 'cut':
            ctx.drawImage(p < 0.5 ? prevCanvas : nextCanvas, 0, 0);
            break;
        case 'fade':
            ctx.drawImage(prevCanvas, 0, 0);
            ctx.globalAlpha = p;
            ctx.drawImage(nextCanvas, 0, 0);
            ctx.globalAlpha = 1;
            break;
        case 'fadeThroughBlack':
            if (p < 0.5) {
                ctx.drawImage(prevCanvas, 0, 0);
                ctx.fillStyle = '#000000';
                ctx.globalAlpha = p * 2;
                ctx.fillRect(0, 0, w, h);
            } else {
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, w, h);
                ctx.globalAlpha = (p - 0.5) * 2;
                ctx.drawImage(nextCanvas, 0, 0);
            }
            ctx.globalAlpha = 1;
            break;
        case 'pushLeft':
            ctx.drawImage(prevCanvas, -w * p, 0);
            ctx.drawImage(nextCanvas, w - w * p, 0);
            break;
        case 'pushRight':
            ctx.drawImage(prevCanvas, w * p, 0);
            ctx.drawImage(nextCanvas, -w + w * p, 0);
            break;
        case 'pushUp':
            ctx.drawImage(prevCanvas, 0, -h * p);
            ctx.drawImage(nextCanvas, 0, h - h * p);
            break;
        case 'pushDown':
            ctx.drawImage(prevCanvas, 0, h * p);
            ctx.drawImage(nextCanvas, 0, -h + h * p);
            break;
        case 'wipeRight': drawNextThrough(path => path.rect(0, 0, w * p, h)); break;
        case 'wipeLeft': drawNextThrough(path => path.rect(w - w * p, 0, w * p, h)); break;
        case 'wipeDown': drawNextThrough(path => path.rect(0, 0, w, h * p)); break;
        case 'wipeUp': drawNextThrough(path => path.rect(0, h - h * p, w, h * p)); break;
        case 'splitVertical': drawNextThrough(path => path.rect(w / 2 - (w * p) / 2, 0, w * p, h)); break;
        case 'splitHorizontal': drawNextThrough(path => path.rect(0, h / 2 - (h * p) / 2, w, h * p)); break;
        case 'revealRight':
        case 'revealLeft': {
            const dirMul = type === 'revealRight' ? 1 : -1;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, w, h);
            if (p < 0.5) {
                const q = p * 2;
                ctx.globalAlpha = 1 - q;
                ctx.drawImage(prevCanvas, dirMul * w * 0.25 * q, 0);
            } else {
                const q = (p - 0.5) * 2;
                ctx.globalAlpha = q;
                ctx.drawImage(nextCanvas, -dirMul * w * 0.25 * (1 - q), 0);
            }
            ctx.globalAlpha = 1;
            break;
        }
        case 'coverLeft':
            ctx.drawImage(prevCanvas, 0, 0);
            ctx.drawImage(nextCanvas, w * (1 - p), 0);
            break;
        case 'coverRight':
            ctx.drawImage(prevCanvas, 0, 0);
            ctx.drawImage(nextCanvas, -w * (1 - p), 0);
            break;
        case 'coverUp':
            ctx.drawImage(prevCanvas, 0, 0);
            ctx.drawImage(nextCanvas, 0, h * (1 - p));
            break;
        case 'coverDown':
            ctx.drawImage(prevCanvas, 0, 0);
            ctx.drawImage(nextCanvas, 0, -h * (1 - p));
            break;
        case 'uncoverLeft':
            ctx.drawImage(nextCanvas, 0, 0);
            ctx.drawImage(prevCanvas, -w * p, 0);
            break;
        case 'uncoverRight':
            ctx.drawImage(nextCanvas, 0, 0);
            ctx.drawImage(prevCanvas, w * p, 0);
            break;
        case 'uncoverUp':
            ctx.drawImage(nextCanvas, 0, 0);
            ctx.drawImage(prevCanvas, 0, -h * p);
            break;
        case 'uncoverDown':
            ctx.drawImage(nextCanvas, 0, 0);
            ctx.drawImage(prevCanvas, 0, h * p);
            break;
        case 'flash':
            if (p < 0.4) {
                ctx.drawImage(prevCanvas, 0, 0);
                ctx.fillStyle = '#FFFFFF';
                ctx.globalAlpha = p / 0.4;
                ctx.fillRect(0, 0, w, h);
            } else if (p < 0.6) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, w, h);
            } else {
                ctx.drawImage(nextCanvas, 0, 0);
                ctx.fillStyle = '#FFFFFF';
                ctx.globalAlpha = (1 - p) / 0.4;
                ctx.fillRect(0, 0, w, h);
            }
            ctx.globalAlpha = 1;
            break;
        case 'dissolve':
            drawNextThrough(path => {
                const cols = 24, rows = 14, cw = w / cols, ch = h / rows;
                for (let r = 0; r < rows; r++)
                    for (let c = 0; c < cols; c++)
                        if (pseudoRandom(r * cols + c + 1) < p) path.rect(c * cw, r * ch, cw + 1, ch + 1);
            });
            break;
        case 'randomBarsH':
            drawNextThrough(path => {
                const n = 15, bh = h / n;
                for (let i = 0; i < n; i++) if (pseudoRandom(i + 1) < p) path.rect(0, i * bh, w, bh + 1);
            });
            break;
        case 'randomBarsV':
            drawNextThrough(path => {
                const n = 24, bw = w / n;
                for (let i = 0; i < n; i++) if (pseudoRandom(i + 1) < p) path.rect(i * bw, 0, bw + 1, h);
            });
            break;
        case 'blinds':
            drawNextThrough(path => {
                const n = 8, bh = h / n;
                for (let i = 0; i < n; i++) path.rect(0, i * bh, w, bh * p);
            });
            break;
        case 'checkerboard':
            drawNextThrough(path => {
                const cols = 10, rows = 6, cw = w / cols, ch = h / rows;
                for (let r = 0; r < rows; r++)
                    for (let c = 0; c < cols; c++) {
                        const phase = ((r + c) % 2) * 0.5;
                        const cp = Math.max(0, Math.min((p - phase) * 2, 1));
                        if (cp > 0) path.rect(c * cw, r * ch, cw * cp + (cp === 1 ? 1 : 0), ch + 1);
                    }
            });
            break;
        case 'shapeCircle':
            drawNextThrough(path => path.arc(w / 2, h / 2, Math.max(p, 0.001) * Math.hypot(w, h) / 2, 0, Math.PI * 2));
            break;
        case 'shapeDiamond':
            drawNextThrough(path => {
                const r = p * (w / 2 + h / 2);
                path.moveTo(w / 2, h / 2 - r);
                path.lineTo(w / 2 + r, h / 2);
                path.lineTo(w / 2, h / 2 + r);
                path.lineTo(w / 2 - r, h / 2);
                path.closePath();
            });
            break;
        case 'shapePlus':
            drawNextThrough(path => {
                path.rect(w / 2 - (w * p) / 2, 0, w * p, h);
                path.rect(0, h / 2 - (h * p) / 2, w, h * p);
            });
            break;
        case 'clock':
            drawNextThrough(path => {
                path.moveTo(w / 2, h / 2);
                path.arc(w / 2, h / 2, Math.hypot(w, h), -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2);
                path.closePath();
            });
            break;
        case 'wheel':
            drawNextThrough(path => {
                const R = Math.hypot(w, h);
                for (let k = 0; k < 4; k++) {
                    const a0 = -Math.PI / 2 + k * Math.PI / 2;
                    path.moveTo(w / 2, h / 2);
                    path.arc(w / 2, h / 2, R, a0, a0 + p * Math.PI / 2);
                    path.closePath();
                }
            });
            break;
        case 'zoom': {
            ctx.drawImage(prevCanvas, 0, 0);
            ctx.globalAlpha = p;
            const scale = 0.6 + 0.4 * p;
            const dw = w * scale;
            const dh = h * scale;
            ctx.drawImage(nextCanvas, (w - dw) / 2, (h - dh) / 2, dw, dh);
            ctx.globalAlpha = 1;
            break;
        }
        case 'newsflash':
            ctx.drawImage(prevCanvas, 0, 0);
            if (p > 0) {
                ctx.save();
                ctx.translate(w / 2, h / 2);
                ctx.rotate((1 - p) * Math.PI * 4);
                ctx.scale(Math.max(p, 0.001), Math.max(p, 0.001));
                ctx.drawImage(nextCanvas, -w / 2, -h / 2);
                ctx.restore();
            }
            break;
        default:
            ctx.drawImage(nextCanvas, 0, 0);
    }
};

// Повна тривалість слайду: аудіо + хвіст, або час завершення останньої анімації
const getSlideDuration = (slide) => {
    const animEnd = (slide.objects || []).reduce((m, o) => {
        const a = o.animation;
        if (!a || a.type === 'none') return m;
        return Math.max(m, (a.delay || 0) + (a.duration || 0.5));
    }, 0);

    // Тривалість слайду має вміщати вбудоване відео та аудіо об'єкти
    const mediaEnd = (slide.objects || []).reduce((m, o) => {
        if ((o.type !== 'video' && o.type !== 'audio') || !o.src) return m;
        const v = typeof videoCache !== 'undefined' ? videoCache.get(o.src) : null;
        const full = v && isFinite(v.duration) ? v.duration : 0;
        const ts = o.trimStart || 0;
        const te = (o.trimEnd != null && o.trimEnd > ts) ? o.trimEnd : full;
        const d = Math.max(te - ts, 0);
        return Math.max(m, (o.animation && o.animation.delay ? o.animation.delay : 0) + d);
    }, 0);

    const base = (slide.audioBase64 && slide.audioDuration > 0)
        ? Math.max(slide.audioDuration + 0.5, animEnd + 0.5)
        : Math.max(3, animEnd + 1);
    return Math.max(base, mediaEnd + 0.3);
};

/* ============================================================================
 * 5. REDUCER ПРЕЗЕНТАЦІЇ (нормалізовані екшени для слайдів та об'єктів)
 * ========================================================================== */

const initialVideoState = { slides: [] };

function videoReducer(state, action) {
    const mapSlide = (slideId, fn) => ({
        slides: state.slides.map(s => (s.id === slideId ? fn(s) : s))
    });

    switch (action.type) {
        case 'SET_SLIDES':
            return { slides: action.slides };

        case 'RESET':
            return { slides: [] };

        case 'UPDATE_SLIDE':
            return mapSlide(action.slideId, s => ({ ...s, ...action.updates }));

        case 'UPDATE_OBJECT':
            return mapSlide(action.slideId, s => ({
                ...s,
                objects: s.objects.map(o => (o.id === action.objectId ? { ...o, ...action.updates } : o))
            }));

        case 'SET_SLIDE_ANIMATIONS': {
            const animMap = new Map((action.animations || []).map(a => [a.objectId, a.animation]));
            return mapSlide(action.slideId, s => ({
                ...s,
                objects: s.objects.map(o => animMap.has(o.id) ? { ...o, animation: animMap.get(o.id) } : o)
            }));
        }

        case 'UPDATE_OBJECT_ANIMATION':
            return mapSlide(action.slideId, s => ({
                ...s,
                objects: s.objects.map(o => (o.id === action.objectId
                    ? { ...o, animation: { ...o.animation, ...action.updates } }
                    : o))
            }));

        case 'ADD_OBJECT':
            return mapSlide(action.slideId, s => ({ ...s, objects: [...s.objects, action.object] }));

        case 'DELETE_OBJECT':
            return mapSlide(action.slideId, s => ({
                ...s,
                objects: s.objects.filter(o => o.id !== action.objectId)
            }));

        case 'DELETE_OBJECTS':
            return mapSlide(action.slideId, s => ({
                ...s,
                objects: s.objects.filter(o => !action.objectIds.includes(o.id))
            }));

        case 'REORDER_OBJECT': {
            return mapSlide(action.slideId, s => {
                const idx = s.objects.findIndex(o => o.id === action.objectId);
                if (idx < 0) return s;
                const newIdx = action.direction === 'up' ? idx + 1 : idx - 1;
                if (newIdx < 0 || newIdx >= s.objects.length) return s;
                const objs = [...s.objects];
                [objs[idx], objs[newIdx]] = [objs[newIdx], objs[idx]];
                return { ...s, objects: objs };
            });
        }

        case 'REORDER_OBJECT_TO_INDEX': {
            return mapSlide(action.slideId, s => {
                const oldIdx = s.objects.findIndex(o => o.id === action.objectId);
                if (oldIdx < 0) return s;
                let newIdx = action.newIndex;
                if (newIdx < 0) newIdx = 0;
                if (newIdx > s.objects.length) newIdx = s.objects.length;

                // If we're moving it to an index greater than its current index, 
                // the target index actually shifts by 1 after removing the item.
                // But let's just use splice accurately.
                const objs = [...s.objects];
                const [item] = objs.splice(oldIdx, 1);

                // If the newIdx was originally > oldIdx, the actual insertion point in the shrunk array is newIdx - 1.
                // But wait, the standard logic: if I drag item 0 to position 3, I expect it to be at index 3.
                // So I just splice it at newIdx.
                if (oldIdx < newIdx) {
                    newIdx -= 1;
                }

                objs.splice(newIdx, 0, item);
                return { ...s, objects: objs };
            });
        }

        case 'DUPLICATE_OBJECT': {
            return mapSlide(action.slideId, s => {
                const src = s.objects.find(o => o.id === action.objectId);
                if (!src) return s;
                const clone = { ...src, id: action.newId, x: src.x + 20, y: src.y + 20 };
                if (clone.lines) clone.lines = clone.lines.map(l => ({ ...l }));
                if (clone.animation) clone.animation = { ...clone.animation };
                return { ...s, objects: [...s.objects, clone] };
            });
        }

        case 'MOVE_OBJECTS': {
            return mapSlide(action.slideId, s => ({
                ...s,
                objects: s.objects.map(o => action.moves[o.id]
                    ? { ...o, x: action.moves[o.id].x, y: action.moves[o.id].y }
                    : o)
            }));
        }

        case 'GROUP_OBJECTS': {
            return mapSlide(action.slideId, s => {
                const groupId = 'group-' + crypto.randomUUID();
                return {
                    ...s,
                    objects: s.objects.map(o => action.objectIds.includes(o.id) ? { ...o, groupId } : o)
                };
            });
        }

        case 'UNGROUP_OBJECTS': {
            return mapSlide(action.slideId, s => {
                return {
                    ...s,
                    objects: s.objects.map(o => action.objectIds.includes(o.id) ? { ...o, groupId: null } : o)
                };
            });
        }

        case 'CLEAR_ALL_AUDIO':
            return { slides: state.slides.map(s => ({ ...s, audioBase64: null, audioDuration: 0 })) };

        // Єдина анімація для всіх об'єктів усіх слайдів (за замовчуванням — фейд)
        case 'SET_ALL_ANIMATIONS': {
            const animType = action.animType || 'fadeIn';
            const duration = action.duration != null ? action.duration : 0.8;
            return {
                slides: state.slides.map(s => ({
                    ...s,
                    objects: s.objects.map(o => ({
                        ...o,
                        animation: { type: animType, delay: 0, duration }
                    }))
                }))
            };
        }

        // Єдиний перехід для всіх слайдів одразу (перший слайд лишається "Немає" —
        // йому немає попереднього кадру, з якого переходити).
        case 'SET_ALL_TRANSITIONS': {
            const transitionType = TRANSITIONS[action.transitionType] ? action.transitionType : 'fade';
            return {
                slides: state.slides.map((s, idx) => ({
                    ...s,
                    transition: idx === 0 ? 'none' : transitionType
                }))
            };
        }

        // Застосування плану від LLM: narration + transition + анімації об'єктів
        case 'APPLY_AI_PLAN': {
            const validTransitions = new Set(Object.keys(TRANSITIONS));
            const validAnimations = new Set(Object.keys(ANIMATIONS));
            return {
                slides: state.slides.map(slide => {
                    const p = action.plan.find(x => x.slideNumber === slide.slideNumber);
                    if (!p) return slide; // Якщо плану для слайда немає, лишаємо його без змін
                    const item = action.plan.find(p => p.slideNumber === slide.slideNumber);
                    if (!item) return slide;

                    const narration = (item.narration || '').trim();
                    const textChanged = !action.keepAudio && narration && narration !== slide.text;
                    const transition = validTransitions.has(item.transition) ? item.transition : slide.transition;

                    const animByObject = new Map(
                        (item.animations || [])
                            .filter(a => a && validAnimations.has(a.type))
                            .map(a => [a.objectId, a])
                    );

                    return {
                        ...slide,
                        text: (action.keepAudio || !narration) ? slide.text : narration,
                        transition,
                        audioBase64: textChanged ? null : slide.audioBase64,
                        audioDuration: textChanged ? 0 : slide.audioDuration,
                        objects: slide.objects.map(o => {
                            const a = animByObject.get(o.id);
                            if (!a) return o;
                            return {
                                ...o,
                                animation: {
                                    type: a.type,
                                    delay: Math.max(0, Math.min(Number(a.delay) || 0, 60)),
                                    duration: Math.max(0.2, Math.min(Number(a.duration) || 0.8, 5))
                                }
                            };
                        })
                    };
                })
            };
        }

        case 'SYNC_ANIMATIONS_TO_AUDIO': {
            return mapSlide(action.slideId, s => {
                const dur = s.audioDuration || 0;
                if (dur <= 0) return s;
                let objs = s.objects;
                const animObjs = objs.filter(o => o.animation && o.animation.type !== 'none');
                if (animObjs.length === 0) {
                    objs = objs.map(o => o.type !== 'image' || (o.w < 1280 && o.h < 720) ? { ...o, animation: { type: 'fadeIn', duration: 0.8, delay: 0 } } : o);
                }
                const narrationWords = (s.text || '').split(/\s+/).filter(Boolean).length;
                const wordsPerSec = narrationWords > 0 ? narrationWords / dur : 2.5;
                let cumWords = 0;
                const objWordPositions = objs.map(o => {
                    if (o.type === 'text') {
                        const objWords = (o.lines || []).map(l => l.text).join(' ').split(/\s+/).filter(Boolean).length;
                        const pos = cumWords;
                        cumWords += Math.max(objWords, 1);
                        return { id: o.id, wordPos: pos };
                    }
                    cumWords += 2;
                    return { id: o.id, wordPos: cumWords - 2 };
                });
                return {
                    ...s,
                    objects: objs.map(o => {
                        if (!o.animation || o.animation.type === 'none') return o;
                        const wp = objWordPositions.find(p => p.id === o.id);
                        const delay = wp ? parseFloat(Math.min(wp.wordPos / wordsPerSec, dur - 0.5).toFixed(1)) : 0;
                        const maxDur = Math.max(dur - delay, 0.3);
                        return { ...o, animation: { ...o.animation, delay: Math.max(0, delay), duration: Math.min(o.animation.duration || 0.8, maxDur) } };
                    })
                };
            });
        }

        default:
            return state;
    }
}


/* ============================================================================
 * VideoEditor — самодостатній відеоредактор (вкладка "Відео" зі Studio Pro),
 * винесений в окремий файл. Працює незалежно: власний стан, PPTX-імпорт,
 * TTS-озвучка, таймлайн, canvas-рендер, експорт у MP4/WebM.
 * ========================================================================== */
export default function VideoEditor() {
    const [isDragging, setIsDragging] = useState(false);
    const [fileError, setFileError] = useState(null);
    const [isExporting, setIsExporting] = useState(false); // експорт відео (MP4/WebM) — має власний exportProgress
    const [isExportingAudio, setIsExportingAudio] = useState(false); // експорт аудіодоріжки слайдів (MP3/WAV)
    const isVideoExportingRef = useRef(false); // захист від повторного запуску handleExportVideo (подвійний клік)

    // --- Стани Відеоредактора ---
    const [videoToolTab, setVideoToolTab] = useState(null);
    const [editingObjectId, setEditingObjectId] = useState(null);
    const [timelineZoom, setTimelineZoom] = useState(1);
    const [layerDrag, setLayerDrag] = useState(null); // { id: draggedObjId, targetId: overObjId, action: 'above' | 'merge' | 'below' }
    const [videoState, _rawDispatchVideo] = useReducer(videoReducer, initialVideoState);
    const slides = videoState.slides;
    const undoStackRef = useRef([]);
    const redoStackRef = useRef([]);
    const dispatchVideo = useCallback((action) => {
        if (action.type === 'UNDO') {
            if (undoStackRef.current.length === 0) return;
            redoStackRef.current = [...redoStackRef.current, videoState];
            const prev = undoStackRef.current[undoStackRef.current.length - 1];
            undoStackRef.current = undoStackRef.current.slice(0, -1);
            _rawDispatchVideo({ type: 'SET_SLIDES', slides: prev.slides });
            return;
        }
        if (action.type === 'REDO') {
            if (redoStackRef.current.length === 0) return;
            undoStackRef.current = [...undoStackRef.current, videoState];
            const next = redoStackRef.current[redoStackRef.current.length - 1];
            redoStackRef.current = redoStackRef.current.slice(0, -1);
            _rawDispatchVideo({ type: 'SET_SLIDES', slides: next.slides });
            return;
        }
        const skip = action.type === 'SET_SLIDES' || action.type === 'RESET';
        if (!skip) {
            undoStackRef.current = [...undoStackRef.current.slice(-49), videoState];
            redoStackRef.current = [];
        }
        _rawDispatchVideo(action);
    }, [videoState]);
    const canUndo = undoStackRef.current.length > 0;
    const canRedo = redoStackRef.current.length > 0;
    const [selectedSlideId, setSelectedSlideId] = useState(null);
    const [selectedObjectId, setSelectedObjectId] = useState(null);
    const [multiSelectedIds, setMultiSelectedIds] = useState([]);
    const clipboardRef = useRef(null);
    const [snapGuides, setSnapGuides] = useState([]);
    const [isProcessingPPTX, setIsProcessingPPTX] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [isAiAutoScripting, setIsAiAutoScripting] = useState(false);
    const [isGeneratingAll, setIsGeneratingAll] = useState(false); // пакетна озвучка всіх слайдів
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [editorScale, setEditorScale] = useState(0.6);
    const [assistantPrompt, setAssistantPrompt] = useState('');
    const [isAssistantProcessing, setIsAssistantProcessing] = useState(false);
    const [assistantError, setAssistantError] = useState(null);
    const [regeneratingSlideId, setRegeneratingSlideId] = useState(null);
    const [animPrompt, setAnimPrompt] = useState('');
    const [isAutoAnimating, setIsAutoAnimating] = useState(false);
    const [bulkTransition, setBulkTransition] = useState('fade');
    const [scrubTime, setScrubTime] = useState(null);
    const [playingSlideId, setPlayingSlideId] = useState(null); // id слайду, чия озвучка зараз відтворюється (кнопка play в панелі сценарію)
    const playingSlideSourceRef = useRef(null);
    const scrubCanvasRef = useRef(null);
    const [autoVoiceAfterScript, setAutoVoiceAfterScript] = useState(false);
    const transitionPreviewRef = useRef(null);
    const animPreviewTimerRef = useRef(null);

    // Профіль голосу презентації ("Voice Lock") — єдиний голос/темп/стиль/емоція
    // для озвучки УСІХ слайдів відео. Поки locked=true — зміна профілю очищає
    // вже згенероване аудіо слайдів, щоб переозвучка йшла в новому, однаковому тоні.
    const [videoVoice, setVideoVoice] = useState({ voice: 'Charon-UA', rate: 'normal', style: 'neutral', locked: true, delay: 0 });
    const updateVideoVoiceProfile = (updates) => {
        setVideoVoice(prev => {
            const next = { ...prev, ...updates };
            if (next.locked) {
                dispatchVideo({ type: 'CLEAR_ALL_AUDIO' });
                logChange('Озвучка', 'Профіль голосу презентації змінено — аудіо слайдів очищено для переозвучки', next);
            }
            return next;
        });
    };
    // Другий диктор (режим діалогу): у тексті [1] читає перший, [2] — другий
    const [videoVoice2, setVideoVoice2] = useState({ voice: 'Aoede-UA', rate: 'normal', style: 'neutral', delay: 0 });
    const [videoDialog, setVideoDialog] = useState(false);
    const [interactiveMode, setInteractiveMode] = useState(false); // режим «гра» для H5P-інтерактивів
    const [exportMenuOpen, setExportMenuOpen] = useState(false);    // меню форматів експорту
    const [pauseSeconds, setPauseSeconds] = useState(1);             // тривалість паузи (сек), яку вставляє кнопка [ПАУЗА]
    const updateVideoVoice2 = (updates) => {
        setVideoVoice2(prev => ({ ...prev, ...updates }));
        dispatchVideo({ type: 'CLEAR_ALL_AUDIO' });
    };
    const scriptRef = useRef(null);
    // Вставити маркер диктора в позицію курсора у полі сценарію
    const insertSpeakerTag = (n) => {
        const ta = scriptRef.current;
        if (!ta || !selectedSlide) return;
        const tag = typeof n === 'number' ? `[${n}] ` : `${n} `;
        const start = ta.selectionStart ?? (selectedSlide.text || '').length;
        const end = ta.selectionEnd ?? start;
        const txt = selectedSlide.text || '';
        const next = txt.slice(0, start) + tag + txt.slice(end);
        dispatchVideo({ type: 'UPDATE_SLIDE', slideId: selectedSlide.id, updates: { text: next, audioBase64: null, audioDuration: 0 } });
        setTimeout(() => { try { ta.focus(); const p = start + tag.length; ta.setSelectionRange(p, p); } catch (e) { /* ignore */ } }, 0);
    };
    // Вставити маркер паузи ([ПАУЗА:N]) заданої тривалості (сек, з поля pauseSeconds) у позицію курсора
    const insertPauseTag = () => {
        const ta = scriptRef.current;
        if (!ta || !selectedSlide) return;
        const secs = Math.max(0.1, Math.round((parseFloat(pauseSeconds) || 1) * 10) / 10);
        const tag = `[ПАУЗА:${secs}] `;
        const start = ta.selectionStart ?? (selectedSlide.text || '').length;
        const end = ta.selectionEnd ?? start;
        const txt = selectedSlide.text || '';
        const next = txt.slice(0, start) + tag + txt.slice(end);
        dispatchVideo({ type: 'UPDATE_SLIDE', slideId: selectedSlide.id, updates: { text: next, audioBase64: null, audioDuration: 0 } });
        setTimeout(() => { try { ta.focus(); const p = start + tag.length; ta.setSelectionRange(p, p); } catch (e) { /* ignore */ } }, 0);
    };
    // Розбити текст на сегменти за маркерами [1]/[2] (до першого маркера читає перший)
    // Пауза підтримує необов'язкову тривалість: [ПАУЗА], [ПАУЗА:2.5], [PAUSE:3] (за замовчуванням 1 сек)
    const splitNarrationSpeakers = (text) => {
        const segs = [];
        let speaker = 1;
        for (const part of String(text || '').split(/(\[[12]\]|\[(?:ПАУЗА|PAUSE)(?::[\d.]+)?\])/i)) {
            const mk = part.match(/^\[([12])\]$/);
            if (mk) { speaker = parseInt(mk[1], 10); continue; }
            const pm = part.match(/^\[(?:ПАУЗА|PAUSE)(?::([\d.]+))?\]$/i);
            if (pm) {
                const dur = pm[1] ? parseFloat(pm[1]) : 1;
                segs.push({ speaker, text: '[PAUSE]', duration: dur > 0 ? dur : 1 });
                continue;
            }
            if (part.trim()) segs.push({ speaker, text: part.trim() });
        }
        if (!segs.length && String(text || '').trim()) segs.push({ speaker: 1, text: text.trim() });
        return segs;
    };
    // Склейка кількох base64 PCM16 (однаковий sampleRate) в один base64
    const concatPcmBase64 = (list) => {
        const bufs = list.map(b64 => { const bin = atob(b64); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; });
        const total = bufs.reduce((a, b) => a + b.length, 0);
        const out = new Uint8Array(total); let off = 0;
        for (const b of bufs) { out.set(b, off); off += b.length; }
        let bin = ''; const chunk = 0x8000;
        for (let i = 0; i < out.length; i += chunk) bin += String.fromCharCode.apply(null, out.subarray(i, i + chunk));
        return btoa(bin);
    };

    // --- Журнал змін (logger.js) ---
    const [activityLog, setActivityLog] = useState([]);
    const [showLog, setShowLog] = useState(false);

    const workspaceRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const editorScaleRef = useRef(0.6);
    const objectDragRef = useRef(null);
    const timelineRef = useRef(null);
    const timelineDragRef = useRef(null);
    const previewStopRef = useRef(null);

    const selectedSlide = slides.find(s => s.id === selectedSlideId) || null;
    const selectedObject = selectedSlide?.objects.find(o => o.id === selectedObjectId) || null;

    // Підписка на журнал змін (logger.js) — оновлює UI-панель журналу
    useEffect(() => subscribeChangeLog(setActivityLog), []);

    useEffect(() => {
        if (!autoVoiceAfterScript || isAiAutoScripting) return;
        setAutoVoiceAfterScript(false);
        generateAllMissingSlidesAudio();
    }, [autoVoiceAfterScript, isAiAutoScripting, slides]);

    // Масштаб робочої області редактора (DOM-пікселі / координати слайду 1280x720)
    useEffect(() => {
        const measure = () => {
            if (workspaceRef.current) {
                const s = workspaceRef.current.clientWidth / CANVAS_W;
                setEditorScale(s);
                editorScaleRef.current = s;
            }
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [slides.length, selectedSlideId]);

    // --- Клавіатурні хоткеї відеоредактора ---
    useEffect(() => {
        const handler = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.target.isContentEditable) return;
            if (editingObjectId) return;
            const ctrl = e.ctrlKey || e.metaKey;
            const shift = e.shiftKey;

            if (ctrl && e.key === 'z') { e.preventDefault(); dispatchVideo({ type: 'UNDO' }); return; }
            if (ctrl && e.key === 'y') { e.preventDefault(); dispatchVideo({ type: 'REDO' }); return; }

            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedSlideId) {
                e.preventDefault();
                const ids = multiSelectedIds.length > 0 ? multiSelectedIds : (selectedObjectId ? [selectedObjectId] : []);
                if (ids.length > 0) {
                    dispatchVideo({ type: 'DELETE_OBJECTS', slideId: selectedSlideId, objectIds: ids });
                    setSelectedObjectId(null);
                    setMultiSelectedIds([]);
                }
                return;
            }

            if (ctrl && e.key === 'c' && selectedSlideId) {
                e.preventDefault();
                const slide = slides.find(s => s.id === selectedSlideId);
                const ids = multiSelectedIds.length > 0 ? multiSelectedIds : (selectedObjectId ? [selectedObjectId] : []);
                if (ids.length > 0 && slide) {
                    clipboardRef.current = ids.map(id => slide.objects.find(o => o.id === id)).filter(Boolean).map(o => ({ ...o }));
                }
                return;
            }

            if (ctrl && e.key === 'v' && selectedSlideId && clipboardRef.current?.length > 0) {
                e.preventDefault();
                const newIds = [];
                clipboardRef.current.forEach(src => {
                    const newId = 'obj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
                    const clone = { ...src, id: newId, x: src.x + 20, y: src.y + 20 };
                    if (clone.lines) clone.lines = clone.lines.map(l => ({ ...l }));
                    if (clone.animation) clone.animation = { ...clone.animation };
                    dispatchVideo({ type: 'ADD_OBJECT', slideId: selectedSlideId, object: clone });
                    newIds.push(newId);
                });
                if (newIds.length === 1) { setSelectedObjectId(newIds[0]); setMultiSelectedIds([]); }
                else { setMultiSelectedIds(newIds); setSelectedObjectId(null); }
                return;
            }

            if (ctrl && e.key === 'd' && selectedSlideId && selectedObjectId) {
                e.preventDefault();
                const newId = 'obj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
                dispatchVideo({ type: 'DUPLICATE_OBJECT', slideId: selectedSlideId, objectId: selectedObjectId, newId });
                setSelectedObjectId(newId);
                return;
            }

            if (e.key === 'Escape') {
                setSelectedObjectId(null);
                setMultiSelectedIds([]);
                return;
            }

            const step = shift ? 10 : 1;
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) && selectedSlideId) {
                e.preventDefault();
                const ids = multiSelectedIds.length > 0 ? multiSelectedIds : (selectedObjectId ? [selectedObjectId] : []);
                if (ids.length === 0) return;
                const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
                const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
                const slide = slides.find(s => s.id === selectedSlideId);
                if (!slide) return;
                const moves = {};
                ids.forEach(id => {
                    const o = slide.objects.find(ob => ob.id === id);
                    if (o) moves[id] = { x: o.x + dx, y: o.y + dy };
                });
                dispatchVideo({ type: 'MOVE_OBJECTS', slideId: selectedSlideId, moves });
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [editingObjectId, selectedSlideId, selectedObjectId, multiSelectedIds, slides, dispatchVideo]);

    /* ========================================================================
     * ФУНКЦІЇ ВІДЕОРЕДАКТОРА
     * ====================================================================== */

    const processPPTXFile = async (file) => {
        setIsProcessingPPTX(true);
        setFileError(null);
        try {
            const extracted = await extractPptxData(file);
            dispatchVideo({ type: 'SET_SLIDES', slides: extracted });
            setSelectedSlideId(extracted[0]?.id || null);
            setSelectedObjectId(null);
            logChange('Імпорт', `Завантажено файл "${file.name}"`, { slides: extracted.length });
        } catch (err) {
            setFileError("Помилка читання PPTX: " + err.message);
            logChange('Помилка', `Не вдалося прочитати PPTX "${file.name}"`, err.message);
        } finally {
            setIsProcessingPPTX(false);
        }
    };

    // --- Drag & Drop об'єктів у робочій області (move / resize) ---

    const handleObjectDragMove = useCallback((e) => {
        const d = objectDragRef.current;
        if (!d) return;
        d.moved = true;
        const s = editorScaleRef.current || 1;
        const dx = (e.clientX - d.startX) / s;
        const dy = (e.clientY - d.startY) / s;

        if (d.mode === 'move') {
            let nx = Math.round(d.origX + dx);
            let ny = Math.round(d.origY + dy);
            const slide = slides.find(sl => sl.id === d.slideId);
            const obj = slide?.objects.find(o => o.id === d.objectId);
            const ow = obj?.w || 100;
            const oh = obj?.h || 100;
            const SNAP = 5;
            const guides = [];
            const cx = CANVAS_W / 2, cy = CANVAS_H / 2;
            const anchors = [
                { x: 0 }, { x: cx }, { x: CANVAS_W },
                { y: 0 }, { y: cy }, { y: CANVAS_H }
            ];
            if (slide) {
                slide.objects.forEach(o => {
                    if (o.id === d.objectId) return;
                    if (d.groupIds && d.groupIds.includes(o.id)) return;
                    anchors.push({ x: o.x }, { x: o.x + o.w / 2 }, { x: o.x + o.w });
                    anchors.push({ y: o.y }, { y: o.y + o.h / 2 }, { y: o.y + o.h });
                });
            }
            const edges = [nx, nx + ow / 2, nx + ow];
            const vedges = [ny, ny + oh / 2, ny + oh];
            anchors.forEach(a => {
                if (a.x != null) {
                    edges.forEach(ex => { if (Math.abs(ex - a.x) < SNAP) { nx += a.x - ex; guides.push({ type: 'v', pos: a.x }); } });
                }
                if (a.y != null) {
                    vedges.forEach(ey => { if (Math.abs(ey - a.y) < SNAP) { ny += a.y - ey; guides.push({ type: 'h', pos: a.y }); } });
                }
            });
            setSnapGuides(guides.slice(0, 6));

            if (d.groupIds && d.groupIds.length > 1) {
                const moves = {};
                d.groupIds.forEach(id => {
                    const orig = d.groupOrig[id];
                    if (orig) moves[id] = { x: Math.round(orig.x + (nx - d.origX)), y: Math.round(orig.y + (ny - d.origY)) };
                });
                dispatchVideo({ type: 'MOVE_OBJECTS', slideId: d.slideId, moves });
            } else {
                dispatchVideo({
                    type: 'UPDATE_OBJECT', slideId: d.slideId, objectId: d.objectId,
                    updates: { x: nx, y: ny }
                });
            }
        } else {
            dispatchVideo({
                type: 'UPDATE_OBJECT', slideId: d.slideId, objectId: d.objectId,
                updates: { w: Math.max(20, Math.round(d.origW + dx)), h: Math.max(20, Math.round(d.origH + dy)) }
            });
        }
    }, [slides]);

    const handleObjectDragEnd = useCallback(() => {
        const d = objectDragRef.current;
        if (d && d.moved) {
            logChange('Об\'єкт', d.mode === 'move'
                ? 'Переміщено об\'єкт на слайді'
                : 'Змінено розмір об\'єкта', { slideId: d.slideId, objectId: d.objectId });
        } else if (d && !d.moved && d.wasSelected && d.mode === 'move') {
            // Повторний клік по вже активному об'єкті — зняти виділення (toggle)
            setSelectedObjectId(null);
        }
        objectDragRef.current = null;
        setSnapGuides([]);
        window.removeEventListener('mousemove', handleObjectDragMove);
        window.removeEventListener('mouseup', handleObjectDragEnd);
    }, [handleObjectDragMove]);

    const startObjectDrag = (e, slideId, obj, mode) => {
        e.preventDefault();
        e.stopPropagation();
        const isInMulti = multiSelectedIds.includes(obj.id);
        const wasSelected = selectedObjectId === obj.id && !isInMulti && !e.shiftKey;
        if (!e.shiftKey && !isInMulti) {
            setSelectedObjectId(obj.id);
            setMultiSelectedIds([]);
        }
        const groupIds = isInMulti && multiSelectedIds.length > 1 ? multiSelectedIds : [obj.id];
        const slide = slides.find(s => s.id === slideId);
        const groupOrig = {};
        if (slide) groupIds.forEach(id => {
            const o = slide.objects.find(ob => ob.id === id);
            if (o) groupOrig[id] = { x: o.x, y: o.y };
        });
        objectDragRef.current = {
            slideId, objectId: obj.id, mode, wasSelected,
            startX: e.clientX, startY: e.clientY,
            origX: obj.x, origY: obj.y, origW: obj.w, origH: obj.h,
            groupIds, groupOrig
        };
        window.addEventListener('mousemove', handleObjectDragMove);
        window.addEventListener('mouseup', handleObjectDragEnd);
    };

    // --- Перетягування блоків анімацій на таймлайні (зміна delay) ---

    const handleTimelineDragMove = useCallback((e) => {
        const d = timelineDragRef.current;
        if (!d) return;
        d.moved = true;
        const dxSec = ((e.clientX - d.startX) / d.trackWidth) * d.totalDuration;

        if (d.mode === 'resize') {
            const newDur = Math.max(0.2, Math.round((d.origDuration + dxSec) * 10) / 10);
            dispatchVideo({ type: 'UPDATE_OBJECT_ANIMATION', slideId: d.slideId, objectId: d.objectId, updates: { duration: newDur } });
        } else if (d.mode === 'trim-end') {
            const newTrimEnd = Math.max(d.origTrimStart + 0.2, Math.round((d.origTrimEnd + dxSec) * 10) / 10);
            dispatchVideo({ type: 'UPDATE_OBJECT', slideId: d.slideId, objectId: d.objectId, updates: { trimEnd: newTrimEnd } });
        } else if (d.mode === 'trim-start') {
            const newTrimStart = Math.max(0, Math.min(d.origTrimEnd - 0.2, Math.round((d.origTrimStart + dxSec) * 10) / 10));
            const diff = newTrimStart - d.origTrimStart;
            const newDelay = Math.max(0, Math.round((d.origDelay + diff) * 10) / 10);
            dispatchVideo({ type: 'UPDATE_OBJECT', slideId: d.slideId, objectId: d.objectId, updates: { trimStart: newTrimStart } });
            dispatchVideo({ type: 'UPDATE_OBJECT_ANIMATION', slideId: d.slideId, objectId: d.objectId, updates: { delay: newDelay } });
        } else {
            const newDelay = Math.max(0, Math.round((d.origDelay + dxSec) * 10) / 10);
            dispatchVideo({ type: 'UPDATE_OBJECT_ANIMATION', slideId: d.slideId, objectId: d.objectId, updates: { delay: newDelay } });
        }
    }, []);

    const handleTimelineDragEnd = useCallback(() => {
        const d = timelineDragRef.current;
        if (d && d.moved) {
            logChange('Таймлайн', d.mode === 'resize' ? 'Змінено тривалість анімації об\'єкта' : 'Змінено час появи анімації об\'єкта', { slideId: d.slideId, objectId: d.objectId });
        }
        timelineDragRef.current = null;
        window.removeEventListener('mousemove', handleTimelineDragMove);
        window.removeEventListener('mouseup', handleTimelineDragEnd);
    }, [handleTimelineDragMove]);

    const startTimelineDrag = (e, slideId, obj, totalDuration, mode = 'move') => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedObjectId(obj.id);
        if (!timelineRef.current) return;
        timelineDragRef.current = {
            slideId, objectId: obj.id, mode,
            startX: e.clientX,
            origDelay: obj.animation?.delay || 0,
            origDuration: obj.animation?.duration || 0.8,
            origTrimStart: obj.trimStart || 0,
            origTrimEnd: obj.trimEnd != null ? obj.trimEnd : (videoCache.get(obj.src)?.duration || 5),
            trackWidth: timelineRef.current.clientWidth,
            totalDuration,
            moved: false
        };
        window.addEventListener('mousemove', handleTimelineDragMove);
        window.addEventListener('mouseup', handleTimelineDragEnd);
    };

    // --- Озвучка слайдів (TTS) ---

    const generateSlideAudio = async (slideId) => {
        const slide = slides.find(s => s.id === slideId);
        if (!slide || !slide.text.trim()) return;
        dispatchVideo({ type: 'UPDATE_SLIDE', slideId, updates: { isGenerating: true, error: null } });
        try {
            let base64, sampleRate;
            const segs = splitNarrationSpeakers(slide.text);
            const parts = [];
            for (const seg of segs) {
                if (seg.text === '[PAUSE]') {
                    const sr = sampleRate || 24000;
                    const dur = seg.duration || 1;
                    const out = new Uint8Array(Math.max(1, Math.round(sr * dur)) * 2); // N sec of silence (1 channel, 16-bit)
                    let bin = '';
                    const chunk = 0x8000;
                    for (let i = 0; i < out.length; i += chunk) bin += String.fromCharCode.apply(null, out.subarray(i, i + chunk));
                    parts.push(btoa(bin));
                    sampleRate = sr;
                    continue;
                }
                const vp = (videoDialog && seg.speaker === 2) ? videoVoice2 : videoVoice;

                if (vp.delay && vp.delay > 0) {
                    const sr = sampleRate || 24000;
                    const samples = Math.floor(sr * vp.delay);
                    const out = new Uint8Array(samples * 2);
                    let bin = '';
                    const chunk = 0x8000;
                    for (let i = 0; i < out.length; i += chunk) bin += String.fromCharCode.apply(null, out.subarray(i, i + chunk));
                    parts.push(btoa(bin));
                    sampleRate = sr;
                }

                // Двомовний текст озвучуємо фрагментами: кожне речення — голосом своєї
                // мови (укр -> український, англ -> британська англійська)
                for (const langPart of splitTextByLanguage(seg.text)) {
                    const res = await fetchTTSWithRetry(langPart.text, pickVoiceForText(vp.voice, langPart.text), buildStyleDirection(vp.rate, vp.style));
                    parts.push(res.base64);
                    sampleRate = res.sampleRate;
                }
            }
            base64 = concatPcmBase64(parts);

            const dur = pcmDurationSec(base64, sampleRate);
            dispatchVideo({
                type: 'UPDATE_SLIDE', slideId,
                updates: {
                    isGenerating: false,
                    audioBase64: base64,
                    sampleRate,
                    audioDuration: dur
                }
            });
            logChange('Озвучка', `Згенеровано аудіо слайда ${slide.slideNumber}${videoDialog ? ' (2 диктори)' : ''}`, { duration: `${dur.toFixed(1)}с`, voice: videoVoice.voice });
            // Анімації більше не скидаються автоматично при переозвучці!
        } catch (e) {
            dispatchVideo({ type: 'UPDATE_SLIDE', slideId, updates: { isGenerating: false, error: e.message } });
            logChange('Помилка', `Озвучка слайда ${slide.slideNumber} не вдалася`, e.message);
        }
    };

    const generateAllMissingSlidesAudio = async () => {
        setIsGeneratingAll(true);
        const toGenerate = slides.filter(s => s.text.trim() && !s.audioBase64);
        for (const slide of toGenerate) {
            await generateSlideAudio(slide.id);
        }
        setIsGeneratingAll(false);
    };

    // --- AI-Оркестратор: сценарій диктора + переходи + анімації об'єктів ---

    const handleAiAutoScript = async () => {
        if (slides.length === 0) return;
        setIsAiAutoScripting(true);
        setFileError(null);
        try {
            const apiKey = "";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

            const transitionKeys = Object.keys(TRANSITIONS);
            const animationKeys = Object.keys(ANIMATIONS).filter(k => k !== 'none');

            // Компактний опис кожного слайду: нотатки + список об'єктів з id та змістом
            const slidesSummary = slides.map(s => ({
                slideNumber: s.slideNumber,
                existingNarration: s.text || '',
                objects: s.objects.map(o => ({
                    id: o.id,
                    type: o.type,
                    description: o.type === 'text'
                        ? (o.lines || []).map(l => l.text).join(' ').slice(0, 200)
                        : (o.type === 'image' ? 'зображення' : (o.type === 'table' ? 'таблиця' : `фігура (${o.shapeKind})`)),
                    x: Math.round(o.x), y: Math.round(o.y), w: Math.round(o.w), h: Math.round(o.h)
                }))
            }));

            const prompt = `Ти — режисер та сценарист відеопрезентацій. Ось слайди презентації з нотатками доповідача та списком об'єктів кожного слайду (id, тип, зміст, координати на канвасі 1280x720):\n\n${JSON.stringify(slidesSummary, null, 2)}\n\nДля КОЖНОГО слайду виконай:\n1. "narration" — текст диктора: природний усний коментар тією ж мовою, що й вміст слайду. Якщо вже є "existingNarration", доопрацюй і покращи його; якщо немає — створи з нуля на основі об'єктів слайду. Текст має звучати як жива розповідь, а не дослівне читання слайду. Орієнтовна тривалість озвучки слайду — 10–25 секунд.\n2. "transition" — перехід до цього слайду від попереднього, одне значення зі списку: ${transitionKeys.join(', ')}. Для першого слайду — "none". Урізноманітнюй переходи, але для текстонасичених слайдів обирай спокійні ("fade", "none").\n3. "animations" — масив анімацій появи для об'єктів слайду. Для кожного об'єкта вкажи: "objectId" (точний id зі списку), "type" (одне зі: ${animationKeys.join(', ')}), "delay" (секунди від початку слайду, число) та "duration" (тривалість ефекту 0.4–1.5 с). КЛЮЧОВЕ: синхронізуй появу об'єктів зі змістом narration — заголовок з'являється одразу (delay 0), а тези/зображення поступово, у момент, коли диктор орієнтовно говорить про них (рахуй ~2.5 слова narration за секунду). Не залишай великих "порожніх" пауз. Кожен objectId згадай не більше одного разу.\n\nПоверни JSON-масив об'єктів {"slideNumber", "narration", "transition", "animations"} для КОЖНОГО слайду в тому ж порядку, без додаткових коментарів.`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    slideNumber: { type: "NUMBER" },
                                    narration: { type: "STRING" },
                                    transition: { type: "STRING" },
                                    animations: {
                                        type: "ARRAY",
                                        items: {
                                            type: "OBJECT",
                                            properties: {
                                                objectId: { type: "STRING" },
                                                type: { type: "STRING" },
                                                delay: { type: "NUMBER" },
                                                duration: { type: "NUMBER" }
                                            },
                                            required: ["objectId", "type", "delay", "duration"]
                                        }
                                    }
                                },
                                required: ["slideNumber", "narration", "transition", "animations"]
                            }
                        }
                    }
                })
            });

            if (!response.ok) throw new Error(`Помилка API: ${response.status}`);
            const data = await response.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!rawText) throw new Error('Порожня відповідь від ШІ');

            const plan = JSON.parse(rawText);
            dispatchVideo({ type: 'APPLY_AI_PLAN', plan });
            logChange('AI-сценарій', `Згенеровано сценарій, переходи й анімації для ${slides.length} слайд(ів)`);
        } catch (err) {
            setFileError("Помилка AI-сценарію: " + err.message);
            logChange('Помилка', 'AI-сценарій не вдався', err.message);
        } finally {
            setIsAiAutoScripting(false);
        }
    };

    // --- AI-Асистент: точкові зміни анімацій/переходів/тексту за інструкцією користувача ---

    const handleAiAssistant = async () => {
        if (!assistantPrompt.trim() || slides.length === 0) return;
        setIsAssistantProcessing(true);
        setAssistantError(null);
        try {
            const apiKey = "";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

            const transitionKeys = Object.keys(TRANSITIONS);
            const animationKeys = Object.keys(ANIMATIONS);

            // Поточний стан: нотатки, переходи, об'єкти з їхніми анімаціями
            const slidesSummary = slides.map(s => ({
                slideNumber: s.slideNumber,
                narration: s.text || '',
                transition: s.transition,
                objects: s.objects.map(o => ({
                    id: o.id,
                    type: o.type,
                    description: o.type === 'text'
                        ? (o.lines || []).map(l => l.text).join(' ').slice(0, 150)
                        : (o.type === 'image' ? 'зображення' : (o.type === 'table' ? 'таблиця' : `фігура (${o.shapeKind})`)),
                    animation: o.animation
                }))
            }));

            const prompt = `Ти — асистент монтажу відеопрезентації. Ось ПОТОЧНИЙ стан усіх слайдів (текст диктора, переходи, об'єкти з анімаціями):\n\n${JSON.stringify(slidesSummary, null, 2)}\n\nІнструкція користувача: "${assistantPrompt}"\n\nЗміни ЛИШЕ те, про що просить користувач (типи анімацій об'єктів, їх delay/duration, переходи слайдів або текст диктора). Усе інше поверни БЕЗ ЗМІН — з поточними значеннями. Доступні переходи: ${transitionKeys.join(', ')}. Доступні типи анімацій: ${animationKeys.join(', ')}.\n\nПоверни JSON-масив об'єктів {"slideNumber", "narration", "transition", "animations"} для КОЖНОГО слайду, де "animations" — повний список УСІХ об'єктів слайду: [{"objectId", "type", "delay", "duration"}] (для "none" став delay 0 і duration 0.5). Без жодних коментарів.`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    slideNumber: { type: "NUMBER" },
                                    narration: { type: "STRING" },
                                    transition: { type: "STRING" },
                                    animations: {
                                        type: "ARRAY",
                                        items: {
                                            type: "OBJECT",
                                            properties: {
                                                objectId: { type: "STRING" },
                                                type: { type: "STRING" },
                                                delay: { type: "NUMBER" },
                                                duration: { type: "NUMBER" }
                                            },
                                            required: ["objectId", "type", "delay", "duration"]
                                        }
                                    }
                                },
                                required: ["slideNumber", "narration", "transition", "animations"]
                            }
                        }
                    }
                })
            });

            if (!response.ok) throw new Error(`Помилка API: ${response.status}`);
            const data = await response.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!rawText) throw new Error('Порожня відповідь від ШІ');

            const plan = JSON.parse(rawText);
            dispatchVideo({ type: 'APPLY_AI_PLAN', plan });
            logChange('AI-асистент', 'Застосовано інструкцію монтажу', assistantPrompt.trim());
            setAssistantPrompt('');
        } catch (err) {
            setAssistantError(err.message);
            logChange('Помилка', 'AI-асистент не зміг застосувати інструкцію', err.message);
        } finally {
            setIsAssistantProcessing(false);
        }
    };

    // --- Перегенерація розподілу анімацій ОДНОГО слайду ---
    // AI наново підбирає типи анімацій та їх тайминг для всіх об'єктів обраного слайду,
    // синхронізуючи появу зі змістом тексту диктора. Інші слайди не чіпаються.

    const handleRegenerateSlideAnimations = async (slideId) => {
        const slide = slides.find(s => s.id === slideId);
        if (!slide || slide.objects.length === 0) return;
        setRegeneratingSlideId(slideId);
        setFileError(null);
        try {
            const apiKey = "";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
            const animationKeys = Object.keys(ANIMATIONS).filter(k => k !== 'none');

            const objectsSummary = slide.objects.map(o => ({
                id: o.id,
                type: o.type,
                description: o.type === 'text'
                    ? (o.lines || []).map(l => l.text).join(' ').slice(0, 200)
                    : (o.type === 'image' ? 'зображення' : (o.type === 'table' ? 'таблиця' : `фігура (${o.shapeKind})`)),
                x: Math.round(o.x), y: Math.round(o.y), w: Math.round(o.w), h: Math.round(o.h)
            }));

            const prompt = `Ти — режисер анімацій відеопрезентації. Ось ОДИН слайд: текст диктора та список об'єктів (id, тип, зміст, координати на канвасі 1280x720).\n\nТекст диктора: "${slide.text || '(немає)'}"\n\nОб'єкти:\n${JSON.stringify(objectsSummary, null, 2)}\n\nПридумай НОВИЙ, природний розподіл анімацій появи для УСІХ об'єктів слайду. Для кожного об'єкта вкажи: "objectId" (точний id зі списку), "type" (одне зі: ${animationKeys.join(', ')}), "delay" (секунди від початку слайду) та "duration" (0.4–1.5 с). Заголовок з'являється першим (delay 0), решта — поступово, у момент, коли диктор орієнтовно говорить про них (рахуй ~2.5 слова за секунду). Уникай великих порожніх пауз і не повторюй однакові ефекти підряд. Кожен objectId згадай рівно один раз.\n\nПоверни JSON-масив об'єктів {"objectId", "type", "delay", "duration"} для КОЖНОГО об'єкта слайду, без коментарів.`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    objectId: { type: "STRING" },
                                    type: { type: "STRING" },
                                    delay: { type: "NUMBER" },
                                    duration: { type: "NUMBER" }
                                },
                                required: ["objectId", "type", "delay", "duration"]
                            }
                        }
                    }
                })
            });

            if (!response.ok) throw new Error(`Помилка API: ${response.status}`);
            const data = await response.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!rawText) throw new Error('Порожня відповідь від ШІ');

            const animations = JSON.parse(rawText);
            dispatchVideo({
                type: 'APPLY_AI_PLAN',
                plan: [{
                    slideNumber: slide.slideNumber,
                    narration: slide.text,
                    transition: slide.transition,
                    animations
                }]
            });
            logChange('Анімації', `Перерозподілено анімації слайда ${slide.slideNumber}`, { objects: animations.length });
        } catch (err) {
            setFileError("Помилка перегенерації анімацій: " + err.message);
            logChange('Помилка', `Перегенерація анімацій слайда ${slide.slideNumber} не вдалася`, err.message);
        } finally {
            setRegeneratingSlideId(null);
        }
    };

    // --- Авто-анімації по запиту: якщо поле порожнє — фейд на всі об'єкти всіх слайдів;
    // якщо є текст запиту — AI розставляє анімації згідно з побажанням ---

    // Встановити один перехід для ВСІХ слайдів одразу (перший слайд лишається "Немає")
    const handleSetAllTransitions = () => {
        if (slides.length === 0) return;
        dispatchVideo({ type: 'SET_ALL_TRANSITIONS', transitionType: bulkTransition });
        logChange('Перехід', `Усім слайдам встановлено перехід: ${TRANSITIONS[bulkTransition]?.label || bulkTransition}`);
    };

    const handleApplySlideAnimationPreset = (slideId, preset) => {
        const slide = slides.find(s => s.id === slideId);
        if (!slide || slide.objects.length === 0) return;
        const dur = Math.max(slide.audioDuration || 0, 2);
        const n = slide.objects.length;
        const animations = slide.objects.map((obj, i) => {
            let delay = 0, type = 'fadeIn', duration = 0.5;
            if (preset === 'together') {
                delay = 0; duration = 0.5;
            } else if (preset === 'cascade') {
                delay = parseFloat((i * 0.4).toFixed(1)); duration = 0.5;
            } else if (preset === 'narrator') {
                const step = dur / (n + 1);
                delay = parseFloat((i * step).toFixed(1));
                duration = parseFloat(Math.min(0.6, step * 0.8).toFixed(1));
            }
            return { objectId: obj.id, animation: { type, delay, duration } };
        });
        dispatchVideo({ type: 'SET_SLIDE_ANIMATIONS', slideId, animations });
        const names = { together: 'Разом', cascade: 'Каскад', narrator: 'По диктору' };
        logChange('Анімація', `Слайд ${slide.slideNumber}: пресет "${names[preset] || preset}"`, { objectCount: n });
    };

    const syncAnimationsToAudio = (slideId) => {
        const slide = slides.find(s => s.id === slideId);
        if (!slide || !slide.audioDuration) return;
        dispatchVideo({ type: 'SYNC_ANIMATIONS_TO_AUDIO', slideId });
        logChange('Синхронізація', `Анімації слайда ${slide.slideNumber} синхронізовано з аудіо (${slide.audioDuration.toFixed(1)}с)`);
    };

    // Синхронізувати з аудіо анімації УСІХ слайдів (де є озвучка) — одним кліком
    const syncAllAnimationsToAudio = () => {
        let n = 0;
        slides.forEach(s => {
            if (s.audioDuration) { dispatchVideo({ type: 'SYNC_ANIMATIONS_TO_AUDIO', slideId: s.id }); n++; }
        });
        logChange('Синхронізація', `Анімації синхронізовано з аудіо на ${n} слайд(ах)`);
    };

    const previewObjectAnimation = async (objId) => {
        if (!selectedSlide || isPreviewing) return;
        const slide = selectedSlide;
        const obj = slide.objects.find(o => o.id === objId);
        if (!obj || !obj.animation || obj.animation.type === 'none') return;
        await preloadSlideImages(slide);
        setIsPreviewing(true);
        setTimeout(() => {
            const canvas = previewCanvasRef.current;
            if (!canvas) { setIsPreviewing(false); return; }
            const ctx = canvas.getContext('2d');
            const tempSlide = { ...slide, objects: slide.objects.map(o => o.id === objId ? o : { ...o, animation: { type: 'none', delay: 0, duration: 0.5 } }) };
            const animDur = (obj.animation.delay || 0) + (obj.animation.duration || 0.8) + 0.3;
            const startTime = performance.now();
            let rafId;
            const cleanup = () => { if (rafId) cancelAnimationFrame(rafId); previewStopRef.current = null; setIsPreviewing(false); };
            const loop = (now) => {
                const t = (now - startTime) / 1000;
                drawSlideFrame(ctx, tempSlide, t);
                if (t < animDur) { rafId = requestAnimationFrame(loop); } else { cleanup(); }
            };
            previewStopRef.current = cleanup;
            rafId = requestAnimationFrame(loop);
        }, 50);
    };

    const handleAiAutoScriptAndVoice = () => {
        if (slides.length === 0) return;
        setAutoVoiceAfterScript(true);
        handleAiAutoScript();
    };

    const playTransitionPreview = (type) => {
        const canvas = transitionPreviewRef.current;
        if (!canvas) return;
        if (animPreviewTimerRef.current) { cancelAnimationFrame(animPreviewTimerRef.current); animPreviewTimerRef.current = null; }
        const ctx = canvas.getContext('2d');
        const prevC = document.createElement('canvas');
        prevC.width = CANVAS_W; prevC.height = CANVAS_H;
        const pc = prevC.getContext('2d');
        pc.fillStyle = '#7c3aed'; pc.fillRect(0, 0, CANVAS_W, CANVAS_H);
        pc.fillStyle = '#fff'; pc.font = 'bold 80px sans-serif'; pc.textAlign = 'center'; pc.textBaseline = 'middle';
        pc.fillText('A', CANVAS_W / 2, CANVAS_H / 2);
        const nextC = document.createElement('canvas');
        nextC.width = CANVAS_W; nextC.height = CANVAS_H;
        const nc = nextC.getContext('2d');
        nc.fillStyle = '#3b82f6'; nc.fillRect(0, 0, CANVAS_W, CANVAS_H);
        nc.fillStyle = '#fff'; nc.font = 'bold 80px sans-serif'; nc.textAlign = 'center'; nc.textBaseline = 'middle';
        nc.fillText('B', CANVAS_W / 2, CANVAS_H / 2);
        const dur = TRANSITIONS[type]?.duration || 0.7;
        if (dur <= 0) { ctx.drawImage(nextC, 0, 0, CANVAS_W, CANVAS_H); return; }
        const start = performance.now();
        const loop = (now) => {
            const elapsed = (now - start) / 1000;
            const cycleTime = elapsed % (dur + 0.8);
            if (cycleTime < dur) { drawTransitionFrame(ctx, prevC, nextC, type, cycleTime / dur); }
            else if (cycleTime < dur + 0.4) { ctx.drawImage(nextC, 0, 0, CANVAS_W, CANVAS_H); }
            else { ctx.drawImage(prevC, 0, 0, CANVAS_W, CANVAS_H); }
            animPreviewTimerRef.current = requestAnimationFrame(loop);
        };
        animPreviewTimerRef.current = requestAnimationFrame(loop);
    };

    const stopTransitionPreview = () => {
        if (animPreviewTimerRef.current) { cancelAnimationFrame(animPreviewTimerRef.current); animPreviewTimerRef.current = null; }
    };

    React.useEffect(() => {
        if (scrubTime === null || !selectedSlide || !scrubCanvasRef.current) return;
        const slide = selectedSlide;
        const canvas = scrubCanvasRef.current;
        const ctx = canvas.getContext('2d');
        (async () => {
            await preloadSlideImages(slide);
            drawSlideFrame(ctx, slide, scrubTime);
        })();
    }, [scrubTime, selectedSlide?.id]);

    const handleAutoAnimations = async () => {
        if (slides.length === 0) return;
        const userReq = animPrompt.trim();

        // Порожній запит -> фейд усюди (без виклику AI)
        if (!userReq) {
            dispatchVideo({ type: 'SET_ALL_ANIMATIONS', animType: 'fadeIn', duration: 0.8 });
            logChange('Анімації', 'Застосовано фейд (Fade) до всіх об\'єктів усіх слайдів');
            return;
        }

        setIsAutoAnimating(true);
        setFileError(null);
        try {
            const apiKey = "";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
            const animationKeys = Object.keys(ANIMATIONS).filter(k => k !== 'none');

            const slidesSummary = slides.map(s => ({
                slideNumber: s.slideNumber,
                narration: s.text || '',
                objects: s.objects.map(o => ({
                    id: o.id,
                    type: o.type,
                    description: o.type === 'text'
                        ? (o.lines || []).map(l => l.text).join(' ').slice(0, 150)
                        : (o.type === 'image' ? 'зображення' : (o.type === 'table' ? 'таблиця' : `фігура (${o.shapeKind})`)),
                    x: Math.round(o.x), y: Math.round(o.y), w: Math.round(o.w), h: Math.round(o.h)
                }))
            }));

            const prompt = `Ти — режисер анімацій відеопрезентації. Ось усі слайди з об'єктами (id, тип, зміст, координати на канвасі 1280x720):\n\n${JSON.stringify(slidesSummary, null, 2)}\n\nПобажання користувача щодо анімацій: "${userReq}"\n\nРозстав анімації появи для УСІХ об'єктів УСІХ слайдів згідно з побажанням. Для кожного об'єкта вкажи: "objectId" (точний id), "type" (одне зі: ${animationKeys.join(', ')}), "delay" (секунди від початку слайду) та "duration" (0.4–1.5 с). Синхронізуй появу зі змістом narration (рахуй ~2.5 слова за секунду), заголовок — першим. Кожен objectId згадай рівно один раз.\n\nПоверни JSON-масив об'єктів {"slideNumber", "animations": [{"objectId", "type", "delay", "duration"}]} для КОЖНОГО слайду, без коментарів.`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    slideNumber: { type: "NUMBER" },
                                    animations: {
                                        type: "ARRAY",
                                        items: {
                                            type: "OBJECT",
                                            properties: {
                                                objectId: { type: "STRING" },
                                                type: { type: "STRING" },
                                                delay: { type: "NUMBER" },
                                                duration: { type: "NUMBER" }
                                            },
                                            required: ["objectId", "type", "delay", "duration"]
                                        }
                                    }
                                },
                                required: ["slideNumber", "animations"]
                            }
                        }
                    }
                })
            });

            if (!response.ok) throw new Error(`Помилка API: ${response.status}`);
            const data = await response.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!rawText) throw new Error('Порожня відповідь від ШІ');

            const parsed = JSON.parse(rawText);
            // Зберігаємо поточні narration/transition кожного слайду — змінюємо лише анімації
            const plan = parsed.map(item => {
                const s = slides.find(x => x.slideNumber === item.slideNumber);
                return {
                    slideNumber: item.slideNumber,
                    narration: s ? s.text : '',
                    transition: s ? s.transition : 'fade',
                    animations: item.animations || []
                };
            });
            dispatchVideo({ type: 'APPLY_AI_PLAN', plan, keepAudio: true });
            logChange('Анімації', `Авто-анімації за запитом: "${userReq}"`);
            setAnimPrompt('');
        } catch (err) {
            setFileError("Помилка авто-анімацій: " + err.message);
            logChange('Помилка', 'Авто-анімації не вдалися', err.message);
        } finally {
            setIsAutoAnimating(false);
        }
    };

    // --- Повторна конвертація PPTX: оновлює об'єкти та фони слайдів,
    // зберігаючи текст диктора, озвучку й переходи вже зробленої роботи ---

    const reimportPPTXFile = async (file) => {
        if (!file) return;
        stopPreview();
        setIsProcessingPPTX(true);
        setFileError(null);
        try {
            const extracted = await extractPptxData(file);
            const prevBySlideNumber = new Map(slides.map(s => [s.slideNumber, s]));
            const prevSelectedNumber = selectedSlide ? selectedSlide.slideNumber : null;

            const merged = extracted.map(s => {
                const old = prevBySlideNumber.get(s.slideNumber);
                if (!old) return s;
                return {
                    ...s,
                    text: old.text || s.text,
                    transition: old.transition,
                    audioBase64: old.audioBase64,
                    sampleRate: old.sampleRate,
                    audioDuration: old.audioDuration
                };
            });

            dispatchVideo({ type: 'SET_SLIDES', slides: merged });
            const reselected = merged.find(s => s.slideNumber === prevSelectedNumber) || merged[0];
            setSelectedSlideId(reselected ? reselected.id : null);
            setSelectedObjectId(null);
            logChange('Імпорт', `Оновлено з PPTX "${file.name}" (текст, озвучка й переходи збережені)`, { slides: merged.length });
        } catch (err) {
            setFileError("Помилка повторної конвертації: " + err.message);
            logChange('Помилка', 'Повторна конвертація PPTX не вдалася', err.message);
        } finally {
            setIsProcessingPPTX(false);
        }
    };

    // Таймлайн поточного слайду: професійний трек із горизонтальним скролом
    const renderTimeline = () => {
        if (!selectedSlide) return null;
        const slide = selectedSlide;
        const totalDuration = Math.max(getSlideDuration(slide) || 1, 1);
        const secMarks = [];
        for (let s = 0; s <= Math.ceil(totalDuration); s++) secMarks.push(s);

        const typeColor = (obj) => obj.type === 'text' ? 'bg-indigo-400' : (obj.type === 'image' ? 'bg-emerald-400' : (obj.type === 'table' ? 'bg-sky-400' : (obj.type === 'audio' ? 'bg-rose-400' : 'bg-amber-400')));

        return (
            <div className="bg-white border-t border-[#F0EEE6] py-3 px-6 flex items-center gap-4 select-none shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
                {/* Play Button & Current Time */}
                <div className="flex items-center gap-3 w-28 flex-shrink-0">
                    <button
                        className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-700 shadow-sm"
                        onClick={(e) => { e.stopPropagation(); isPreviewing ? stopPreview() : startPreview(); }}
                    >
                        {isPreviewing ? <Square size={16} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                    </button>
                    <div className="font-mono text-[14px] text-slate-500 font-bold tracking-wide">
                        00:{(scrubTime || 0).toFixed(0).padStart(2, '0')}
                    </div>
                </div>

                {/* Timeline Track Scrollable */}
                <div className="flex-grow overflow-x-auto custom-scrollbar relative h-14 bg-slate-50 border border-slate-200 rounded-xl flex items-center p-1">
                    <div
                        className="relative w-full h-full cursor-crosshair min-w-[300px]"
                        style={{ minWidth: `${Math.max(100, Math.ceil(totalDuration) * 30)}px` }}
                        ref={timelineRef}
                        onClick={e => {
                            const tl = timelineRef.current;
                            if (!tl) return;
                            const rect = tl.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            if (x < 0 || rect.width <= 0) return;
                            setScrubTime(parseFloat(Math.min(totalDuration, (x / rect.width) * totalDuration).toFixed(2)));
                        }}
                        onMouseMove={e => {
                            const tl = timelineRef.current;
                            if (!tl) return;
                            const rect = tl.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            if (x < 0 || x > rect.width) return;
                            const pct = (x / rect.width) * 100;
                            tl.dataset.hoverPct = pct.toFixed(1);
                            tl.dataset.hoverT = ((x / rect.width) * totalDuration).toFixed(1);
                            const cursor = tl.querySelector('.scrub-cursor');
                            if (cursor) { cursor.style.left = `${pct}%`; cursor.style.opacity = '1'; }
                        }}
                        onMouseLeave={e => {
                            const tl = timelineRef.current;
                            if (tl) { const cursor = tl.querySelector('.scrub-cursor'); if (cursor) cursor.style.opacity = '0'; }
                        }}
                    >
                        {/* Ruler marks */}
                        <div className="absolute top-0 left-0 right-0 h-4 border-b border-slate-200 pointer-events-none">
                            {secMarks.map(s => (
                                <div key={s} className="absolute top-0 bottom-0 border-l border-slate-300 flex items-start pl-1" style={{ left: `${(s / totalDuration) * 100}%` }}>
                                    <span className="text-[9px] text-slate-400 font-mono tracking-tighter leading-none pt-[1px]">
                                        {s % 5 === 0 || totalDuration <= 15 ? `00:${s.toString().padStart(2, '0')}` : ''}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Slide background track */}
                        <div className="absolute top-[20px] left-0 right-0 h-6 bg-[#A7F3D0]/30 rounded-[4px] pointer-events-none border border-emerald-100"></div>

                        {/* Scrubber Line */}
                        <div className="scrub-cursor pointer-events-none absolute top-0 bottom-0 w-[1px] bg-emerald-500 z-30 opacity-0 transition-opacity"></div>
                        {scrubTime !== null && (
                            <div className="absolute top-0 bottom-0 w-[2px] bg-emerald-500 z-40 pointer-events-none transition-all duration-75" style={{ left: `${Math.min((scrubTime / totalDuration) * 100, 99.5)}%` }}></div>
                        )}

                        {/* Object Tracks */}
                        {slide.objects.map((obj, i) => {
                            const anim = obj.animation || { type: 'none', delay: 0, duration: 0.5 };
                            if (anim.type === 'none') return null;

                            const leftPct = (anim.delay / totalDuration) * 100;
                            const widthPct = (anim.duration / totalDuration) * 100;
                            const isSelected = obj.id === selectedObjectId;

                            // Stagger vertically
                            const trackOffsets = [24, 28, 20, 26];
                            const tOff = trackOffsets[i % trackOffsets.length];

                            return (
                                <div
                                    key={obj.id}
                                    className={`absolute h-3 rounded-full ${typeColor(obj)} opacity-90 cursor-ew-resize hover:opacity-100 transition-all flex items-center justify-center ${isSelected ? 'ring-2 ring-emerald-500 z-20 opacity-100 shadow-md' : 'z-10'} shadow-sm`}
                                    style={{
                                        left: `${Math.min(leftPct, 99)}%`,
                                        width: `${Math.max(widthPct, 1.5)}%`,
                                        top: `${tOff}px`
                                    }}
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        setSelectedObjectId(obj.id);
                                        startTimelineDrag(e, slide.id, obj, totalDuration, 'move');
                                    }}
                                    title={`${getObjectLabel(obj)} (${anim.delay.toFixed(1)}с – ${(anim.delay + anim.duration).toFixed(1)}с)`}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Right side stats */}
                <div className="flex items-center gap-4 w-28 flex-shrink-0 justify-end text-slate-500 text-[14px] font-bold tracking-wide">
                    <span className="font-mono">00:{Math.ceil(totalDuration).toString().padStart(2, '0')}</span>
                    <span className="text-[12px] whitespace-nowrap">{slide.objects.length} об'єкт.</span>
                </div>
            </div>
        );
    };

    // --- Ручне керування слайдами (без PPTX): додати / дублювати / видалити ---

    const addBlankSlide = () => {
        const newSlide = {
            id: crypto.randomUUID(),
            slideNumber: slides.length + 1,
            text: '',
            audioBase64: null,
            audioDuration: 0,
            sampleRate: 24000,
            background: '#ffffff',
            objects: [],
            transition: slides.length > 0 ? 'fade' : 'none'
        };
        dispatchVideo({ type: 'SET_SLIDES', slides: [...slides, newSlide] });
        setSelectedSlideId(newSlide.id);
        setSelectedObjectId(null);
        logChange('Слайд', 'Додано новий порожній слайд');
    };

    const duplicateSlide = (slideId) => {
        const idx = slides.findIndex(s => s.id === slideId);
        if (idx === -1) return;
        const src = slides[idx];
        const clone = {
            ...src,
            id: crypto.randomUUID(),
            slideNumber: idx + 2,
            objects: (src.objects || []).map(o => ({
                ...o,
                id: 'obj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
                lines: o.lines ? o.lines.map(l => ({ ...l })) : o.lines,
                animation: o.animation ? { ...o.animation } : o.animation
            }))
        };
        const next = [...slides.slice(0, idx + 1), clone, ...slides.slice(idx + 1)];
        dispatchVideo({ type: 'SET_SLIDES', slides: next });
        setSelectedSlideId(clone.id);
        setSelectedObjectId(null);
        logChange('Слайд', `Дубльовано слайд ${idx + 1}`);
    };

    const deleteSlide = (slideId) => {
        if (slides.length <= 1) return; // завжди лишаємо хоча б один слайд
        const idx = slides.findIndex(s => s.id === slideId);
        if (idx === -1) return;
        const next = slides.filter(s => s.id !== slideId);
        dispatchVideo({ type: 'SET_SLIDES', slides: next });
        if (selectedSlideId === slideId) {
            const fallback = next[Math.max(0, idx - 1)] || next[0] || null;
            setSelectedSlideId(fallback ? fallback.id : null);
            setSelectedObjectId(null);
        }
        logChange('Слайд', `Видалено слайд ${idx + 1}`);
    };

    // --- Додавання власних об'єктів ---

    const addTextObject = () => {
        if (!selectedSlide) return;
        const object = {
            id: crypto.randomUUID(),
            type: 'text',
            x: 340, y: 300, w: 600, h: 120,
            fillColor: null, lineColor: null,
            lines: [{ text: 'Новий текст', color: '#1e293b', fontSize: 40, bold: true, align: 'ctr' }],
            animation: { type: 'fadeIn', delay: 0, duration: 0.8 }
        };
        dispatchVideo({ type: 'ADD_OBJECT', slideId: selectedSlide.id, object });
        setSelectedObjectId(object.id);
        logChange('Об\'єкт', `Додано текстовий об'єкт на слайд ${selectedSlide.slideNumber}`);
    };

    const addImageObject = (file) => {
        if (!file || !selectedSlide) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const object = {
                id: crypto.randomUUID(),
                type: 'image',
                src: e.target.result,
                x: 320, y: 180, w: 640, h: 360,
                animation: { type: 'fadeIn', delay: 0, duration: 0.8 }
            };
            dispatchVideo({ type: 'ADD_OBJECT', slideId: selectedSlide.id, object });
            setSelectedObjectId(object.id);
            logChange('Об\'єкт', `Додано зображення на слайд ${selectedSlide.slideNumber}`, file.name);
        };
        reader.readAsDataURL(file);
    };

    const addAudioObject = (file) => {
        if (!file || !selectedSlide) return;
        const url = URL.createObjectURL(file);
        const object = {
            id: crypto.randomUUID(),
            type: 'audio',
            src: url,
            x: 320, y: 180, w: 120, h: 120,
            animation: { type: 'fadeIn', delay: 0, duration: 0.8 },
            videoFitMode: 'trim'
        };
        dispatchVideo({ type: 'ADD_OBJECT', slideId: selectedSlide.id, object });
        setSelectedObjectId(object.id);
        logChange('Об\'єкт', `Додано аудіо на слайд ${selectedSlide.slideNumber}`, file.name);
    };

    const addVideoObject = (file) => {
        if (!file || !selectedSlide) return;
        const url = URL.createObjectURL(file);
        const object = {
            id: crypto.randomUUID(),
            type: 'video',
            src: url,
            x: 320, y: 180, w: 640, h: 360,
            animation: { type: 'fadeIn', delay: 0, duration: 0.8 },
            videoFitMode: 'loop'
        };
        dispatchVideo({ type: 'ADD_OBJECT', slideId: selectedSlide.id, object });
        setSelectedObjectId(object.id);
        logChange('Об\'єкт', `Додано відео на слайд ${selectedSlide.slideNumber}`, file.name);
    };

    const addShapeObject = (shapeKind) => {
        if (!selectedSlide) return;
        const object = {
            id: crypto.randomUUID(),
            type: 'shape',
            shapeKind,
            x: 320, y: 180, w: 100, h: 100,
            fillColor: '#E2E8F0', lineColor: '#94A3B8', lineWidth: 2, lineDash: null,
            animation: { type: 'fadeIn', delay: 0, duration: 0.8 }
        };
        if (shapeKind === 'line' || shapeKind === 'rightArrow' || shapeKind === 'leftArrow' || shapeKind === 'leftRightArrow') {
            object.h = 40;
            object.w = 150;
        } else if (shapeKind === 'upArrow' || shapeKind === 'downArrow') {
            object.w = 40;
            object.h = 150;
        }
        dispatchVideo({ type: 'ADD_OBJECT', slideId: selectedSlide.id, object });
        setSelectedObjectId(object.id);
        logChange('Об\'єкт', `Додано фігуру (${shapeKind}) на слайд ${selectedSlide.slideNumber}`);
    };

    // Додати інтерактив (повний H5P-набір)
    const addInteractive = (iType) => {
        if (!selectedSlide) return;
        const base = { id: crypto.randomUUID(), type: 'interactive', iType, color: '#7c3aed', x: 320, y: 240, animation: { type: 'none', delay: 0, duration: 0.5 } };
        const D = {
            hotspot: { x: 600, y: 320, w: 56, h: 56, label: 'i', content: 'Текст підказки' },
            mcq: { w: 460, h: 230, question: 'Ваше питання?', options: ['Варіант 1', 'Варіант 2', 'Варіант 3'], correct: 0 },
            summary: { w: 460, h: 230, question: 'Оберіть правильне твердження:', options: ['Хибне твердження', 'Правильне твердження', 'Ще одне хибне'], correct: 1 },
            truefalse: { w: 420, h: 150, question: 'Це твердження правдиве?', correct: true },
            fill: { w: 480, h: 140, text: 'Столиця Франції — *Париж*.' },
            info: { w: 420, h: 160, content: 'Інформаційний текст для учня.' },
            accordion: { w: 440, h: 260, items: [{ title: 'Розділ 1', body: 'Текст розділу 1' }, { title: 'Розділ 2', body: 'Текст розділу 2' }] },
            flashcard: { w: 320, h: 200, front: 'Питання на картці', back: 'Відповідь' },
            link: { color: '#16a34a', w: 220, h: 60, label: 'Перейти', url: 'https://' },
        };
        const object = { ...base, w: 420, h: 180, ...(D[iType] || D.info) };
        dispatchVideo({ type: 'ADD_OBJECT', slideId: selectedSlide.id, object });
        setSelectedObjectId(object.id);
        setInteractiveMode(false);
        logChange('Інтерактив', `Додано інтерактив (${iType}) на слайд ${selectedSlide.slideNumber}`);
    };

    // Вставка з буфера (Ctrl+V) прямо з PowerPoint: скопійований елемент/слайд
    // потрапляє у буфер як зображення — додаємо його як об'єкт на слайд,
    // намагаючись зберегти оригінальні розміри та координати.
    useEffect(() => {
        const onPaste = (e) => {
            if (!selectedSlide) return;
            const tag = document.activeElement?.tagName;
            if (tag === 'TEXTAREA' || tag === 'INPUT') return; // не заважаємо вводу тексту

            // Спробуємо витягти розміри та позицію з HTML (якщо скопійовано з PowerPoint чи іншого редактора)
            let pptxRect = null;
            try {
                const htmlData = e.clipboardData.getData('text/html');
                if (htmlData) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlData, 'text/html');

                    const tryParse = (val) => {
                        if (!val) return null;
                        if (val.includes('pt')) return parseFloat(val) * 1.3333;
                        if (val.includes('in')) return parseFloat(val) * 96;
                        if (val.includes('px')) return parseFloat(val);
                        return parseFloat(val);
                    };

                    const elements = doc.querySelectorAll('*');
                    for (const el of elements) {
                        if (el.style && (el.style.width || el.style.height)) {
                            let tw = tryParse(el.style.width);
                            let th = tryParse(el.style.height);
                            let tx = tryParse(el.style.left);
                            let ty = tryParse(el.style.top);
                            if (tw || th) {
                                if (!pptxRect || (tx != null && ty != null)) {
                                    pptxRect = { w: tw, h: th, x: tx, y: ty };
                                }
                                if (tx != null && ty != null) break;
                            }
                        }
                    }
                    if (!pptxRect) {
                        const img = doc.querySelector('img');
                        if (img) {
                            pptxRect = {
                                w: parseFloat(img.getAttribute('width') || img.style.width),
                                h: parseFloat(img.getAttribute('height') || img.style.height),
                                x: null, y: null
                            };
                        }
                    }
                }
            } catch (err) { }

            const items = (e.clipboardData && e.clipboardData.items) || [];
            for (const it of items) {
                if (it.type && it.type.indexOf('video') === 0) {
                    const file = it.getAsFile();
                    if (file) {
                        e.preventDefault();
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            let finalW = (pptxRect && pptxRect.w && !isNaN(pptxRect.w)) ? pptxRect.w : 640;
                            let finalH = (pptxRect && pptxRect.h && !isNaN(pptxRect.h)) ? pptxRect.h : 360;
                            let finalX = (pptxRect && pptxRect.x != null && !isNaN(pptxRect.x)) ? pptxRect.x : (1280 - finalW) / 2;
                            let finalY = (pptxRect && pptxRect.y != null && !isNaN(pptxRect.y)) ? pptxRect.y : (720 - finalH) / 2;
                            const object = {
                                id: crypto.randomUUID(),
                                type: 'video',
                                src: ev.target.result,
                                x: finalX, y: finalY, w: finalW, h: finalH,
                                animation: { type: 'fadeIn', delay: 0, duration: 0.8 },
                                videoFitMode: 'loop'
                            };
                            dispatchVideo({ type: 'ADD_OBJECT', slideId: selectedSlide.id, object });
                            setSelectedObjectId(object.id);
                            logChange('Вставка', 'Вставлено відео з буфера (PowerPoint)');
                        };
                        reader.readAsDataURL(file);
                        return;
                    }
                }
                if (it.type && it.type.indexOf('image') === 0) {
                    const file = it.getAsFile();
                    if (file) {
                        e.preventDefault();
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            const img = new Image();
                            img.onload = () => {
                                let finalW = (pptxRect && pptxRect.w && !isNaN(pptxRect.w)) ? pptxRect.w : img.width;
                                let finalH = (pptxRect && pptxRect.h && !isNaN(pptxRect.h)) ? pptxRect.h : img.height;
                                // Запобіжник: якщо зображення більше за канвас, зменшуємо зі збереженням пропорцій
                                if (finalW > 1280 || finalH > 720) {
                                    const scale = Math.min(1280 / finalW, 720 / finalH) * 0.8;
                                    finalW *= scale;
                                    finalH *= scale;
                                }
                                let finalX = (pptxRect && pptxRect.x != null && !isNaN(pptxRect.x)) ? pptxRect.x : (1280 - finalW) / 2;
                                let finalY = (pptxRect && pptxRect.y != null && !isNaN(pptxRect.y)) ? pptxRect.y : (720 - finalH) / 2;

                                const object = {
                                    id: crypto.randomUUID(),
                                    type: 'image',
                                    src: ev.target.result,
                                    x: finalX, y: finalY, w: finalW, h: finalH,
                                    animation: { type: 'fadeIn', delay: 0, duration: 0.8 }
                                };
                                dispatchVideo({ type: 'ADD_OBJECT', slideId: selectedSlide.id, object });
                                setSelectedObjectId(object.id);
                                logChange('Вставка', 'Вставлено зображення з буфера (PowerPoint)');
                            };
                            img.src = ev.target.result;
                        };
                        reader.readAsDataURL(file);
                        return;
                    }
                }
            }
        };
        window.addEventListener('paste', onPaste);
        return () => window.removeEventListener('paste', onPaste);
    }, [selectedSlide?.id]);

    // Швидке відтворення/зупинка озвучки одного слайду (кнопка play в панелі сценарію)
    const toggleSlidePlayback = (id, base64PCM, sampleRate) => {
        if (playingSlideSourceRef.current) {
            try { playingSlideSourceRef.current.stop(); } catch (e) { /* already stopped */ }
            playingSlideSourceRef.current = null;
        }
        if (playingSlideId === id) { setPlayingSlideId(null); return; }
        if (!currentCtx) currentCtx = new (window.AudioContext || window.webkitAudioContext)();
        const buffer = base64ToAudioBuffer(currentCtx, base64PCM, sampleRate);
        const source = currentCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(currentCtx.destination);
        source.onended = () => setPlayingSlideId(prev => (prev === id ? null : prev));
        source.start();
        playingSlideSourceRef.current = source;
        setPlayingSlideId(id);
    };

    // --- Прев'ю слайду (анімації + озвучка) на canvas поверх робочої області ---

    const stopPreview = () => {
        if (previewStopRef.current) previewStopRef.current();
    };

    const startPreview = async () => {
        if (!selectedSlide || isPreviewing) return;
        const slide = selectedSlide;
        await preloadSlideImages(slide);
        setIsPreviewing(true);

        // Малювання починаємо після монтування canvas (наступний тік)
        setTimeout(() => {
            const canvas = previewCanvasRef.current;
            if (!canvas) { setIsPreviewing(false); return; }
            const ctx = canvas.getContext('2d');
            const duration = getSlideDuration(slide);

            let rafId = null;
            let source = null;
            let bgAudioEl = null;

            if (slide.audioBase64) {
                if (!currentCtx) currentCtx = new (window.AudioContext || window.webkitAudioContext)();
                const buffer = base64ToAudioBuffer(currentCtx, slide.audioBase64, slide.sampleRate);
                source = currentCtx.createBufferSource();
                source.buffer = buffer;
                source.connect(currentCtx.destination);
                source.start();
            }

            if (slide.bgAudio) {
                bgAudioEl = new Audio(slide.bgAudio);
                bgAudioEl.crossOrigin = 'anonymous';
                bgAudioEl.play().catch(e => console.error("Preview bgAudio play error:", e));
            }

            playSlideVideos(slide); // відтворюємо вбудовані відео слайду

            const cleanup = () => {
                if (rafId) cancelAnimationFrame(rafId);
                if (source) { try { source.stop(); } catch (e) { /* вже зупинено */ } }
                if (bgAudioEl) { try { bgAudioEl.pause(); bgAudioEl.src = ''; } catch (e) { } }
                stopSlideVideos(slide);
                previewStopRef.current = null;
                setIsPreviewing(false);
                setScrubTime(null); // прибрати бігунок після завершення
            };

            const startTime = performance.now();
            const loop = (now) => {
                const t = (now - startTime) / 1000;
                drawSlideFrame(ctx, slide, t);
                // Фіолетовий бігунок таймлайну рухається разом із програванням
                const tr = Math.min(Math.round(t * 10) / 10, duration);
                setScrubTime(prev => (prev === tr ? prev : tr));
                if (t < duration) {
                    rafId = requestAnimationFrame(loop);
                } else {
                    cleanup();
                }
            };

            previewStopRef.current = cleanup;
            rafId = requestAnimationFrame(loop);
        }, 50);
    };

    // --- Прев'ю всієї презентації: всі слайди + переходи між ними + озвучка ---

    const startFullPreview = async () => {
        if (slides.length === 0 || isPreviewing) return;
        for (const s of slides) await preloadSlideImages(s);
        setIsPreviewing(true);

        setTimeout(() => {
            const canvas = previewCanvasRef.current;
            if (!canvas) { setIsPreviewing(false); return; }
            const ctx = canvas.getContext('2d');

            // Розклад відтворення: [перехід] -> слайд -> [перехід] -> слайд -> ...
            const segments = [];
            let prev = null;
            for (const s of slides) {
                const def = TRANSITIONS[s.transition] || TRANSITIONS.none;
                if (prev && def.duration > 0) {
                    segments.push({ kind: 'transition', prev, next: s, type: s.transition, dur: def.duration });
                }
                segments.push({ kind: 'slide', slide: s, dur: getSlideDuration(s) });
                prev = s;
            }
            if (segments.length === 0) { setIsPreviewing(false); return; }

            let rafId = null;
            let source = null;
            let segIdx = -1;
            let segStartMs = 0;
            let playingVideoSlide = null;

            const cleanup = () => {
                if (rafId) cancelAnimationFrame(rafId);
                if (source) { try { source.stop(); } catch (e) { /* вже зупинено */ } }
                if (playingVideoSlide) { stopSlideVideos(playingVideoSlide); playingVideoSlide = null; }
                previewStopRef.current = null;
                setIsPreviewing(false);
            };

            const enterSegment = (i, nowMs) => {
                segIdx = i;
                segStartMs = nowMs;
                const seg = segments[i];
                if (seg.kind === 'transition') {
                    // Кадри переходу: фінальний стан попереднього слайду -> стартовий нового
                    seg.prevCanvas = renderSlideToCanvas(seg.prev, getSlideDuration(seg.prev) + 10);
                    seg.nextCanvas = renderSlideToCanvas(seg.next, 0);
                } else {
                    setSelectedSlideId(seg.slide.id);
                    if (playingVideoSlide) stopSlideVideos(playingVideoSlide);
                    playSlideVideos(seg.slide);
                    playingVideoSlide = seg.slide;
                    if (source) { try { source.stop(); } catch (e) { /* вже зупинено */ } source = null; }
                    if (seg.slide.audioBase64) {
                        if (!currentCtx) currentCtx = new (window.AudioContext || window.webkitAudioContext)();
                        const buffer = base64ToAudioBuffer(currentCtx, seg.slide.audioBase64, seg.slide.sampleRate);
                        source = currentCtx.createBufferSource();
                        source.buffer = buffer;
                        source.connect(currentCtx.destination);
                        source.start();
                    }
                }
            };

            const loop = (now) => {
                if (segIdx === -1) enterSegment(0, now);
                let t = (now - segStartMs) / 1000;
                while (t >= segments[segIdx].dur) {
                    if (segIdx + 1 >= segments.length) { cleanup(); return; }
                    enterSegment(segIdx + 1, segStartMs + segments[segIdx].dur * 1000);
                    t = (now - segStartMs) / 1000;
                }
                const seg = segments[segIdx];
                if (seg.kind === 'transition') {
                    drawTransitionFrame(ctx, seg.prevCanvas, seg.nextCanvas, seg.type, t / seg.dur);
                } else {
                    drawSlideFrame(ctx, seg.slide, t);
                }
                rafId = requestAnimationFrame(loop);
            };

            previewStopRef.current = cleanup;
            rafId = requestAnimationFrame(loop);
        }, 50);
    };

    // --- Експорт відео: кадри через canvas.captureStream + аудіо через MediaRecorder ---

    // opts: { withAudio } — withAudio:false → відео без звуку
    const handleExportVideo = async (opts = {}) => {
        if (slides.length === 0) return;
        if (isVideoExportingRef.current) return; // вже триває експорт відео — ігноруємо повторний виклик (подвійний клік)
        isVideoExportingRef.current = true;
        const withAudio = (opts && opts.withAudio) !== false;
        stopPreview();
        setIsExporting(true);
        setExportProgress(0);
        logChange('Експорт', `Старт експорту відео 1080p ${withAudio ? 'зі звуком' : 'без звуку'} (${slides.length} слайд(ів))`);

        // Оголошені зовні try, щоб finally міг завжди їх прибрати (стрім-треки,
        // AudioContext) — без цього кожен виклик експорту "витікав" ресурси і
        // за кілька спроб браузер починав відмовляти в новому AudioContext
        // або captureStream, через що монтаж ставав нестабільним/скидався.
        let stream = null;
        let audioCtx = null;
        let recorder = null;

        try {
            // Попередньо завантажуємо всі зображення/відео всіх слайдів
            for (const slide of slides) await preloadSlideImages(slide);

            // Full HD 1920×1080: рендеримо 1280×720-координати з масштабом 1.5
            const EXPORT_W = 1920, EXPORT_H = 1080;
            const canvas = document.createElement('canvas');
            canvas.width = EXPORT_W;
            canvas.height = EXPORT_H;
            const ctx = canvas.getContext('2d');
            ctx.scale(EXPORT_W / CANVAS_W, EXPORT_H / CANVAS_H);

            if (!canvas.captureStream) throw new Error('Цей браузер не підтримує запис відео з canvas (captureStream).');
            stream = canvas.captureStream(30);
            let dest = null;
            if (withAudio) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                await audioCtx.resume();
                dest = audioCtx.createMediaStreamDestination();
                const audioTracks = dest.stream.getAudioTracks();
                if (audioTracks.length > 0) stream.addTrack(audioTracks[0]);
            }

            if (typeof MediaRecorder === 'undefined') throw new Error('Цей браузер не підтримує запис відео (MediaRecorder).');
            // Кодек H.264 (avc1) у MP4 — пріоритетно; інакше webm-фолбек, з перевіркою
            // підтримки кожного варіанту (раніше фолбек на vp9 брався "на віру" без
            // isTypeSupported — на браузерах без vp9 це кидало помилку на КОЖНІЙ спробі).
            let mimeType = null;
            let extension = 'webm';
            for (const c of ['video/mp4;codecs=avc1.640028', 'video/mp4;codecs=avc1.42E01E', 'video/mp4;codecs=h264', 'video/mp4']) {
                if (MediaRecorder.isTypeSupported(c)) { mimeType = c; extension = 'mp4'; break; }
            }
            if (!mimeType) {
                for (const c of ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']) {
                    if (MediaRecorder.isTypeSupported(c)) { mimeType = c; extension = 'webm'; break; }
                }
            }
            if (!mimeType) throw new Error('Цей браузер не підтримує жоден із придатних відеокодеків для запису.');

            // Бітрейт ~9 Мбіт/с (вимога 8–10 Мбіт/с) для 1080p/30fps
            recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 9_000_000 });
            const chunks = [];
            recorder.ondataavailable = e => { if (e.data && e.data.size > 0) chunks.push(e.data); };

            const recordingComplete = new Promise((resolve, reject) => {
                recorder.onstop = resolve;
                recorder.onerror = (e) => reject(e.error || new Error('Помилка запису відео (MediaRecorder)'));
            });
            recorder.start();

            const fps = 30;
            const wait = ms => new Promise(r => setTimeout(r, Math.max(0, ms)));
            // Кадри малюються за РЕАЛЬНИМ часом (performance.now()), а не фіксованою
            // кількістю ітерацій із незмінною паузою between них. Раніше пауза між
            // кадрами (1000/fps) додавалась ПОВЕРХ часу, витраченого на саме
            // малювання — тому цикл систематично відставав від реального часу.
            // Вставлені на слайд відео/аудіо (playSlideVideos) та озвучка слайду
            // (source.start()) програються в реальному часі незалежно від цього
            // циклу, тож будь-яке відставання циклу зсувало картинку відносно
            // звуку — саме це й спричиняло розсинхрон озвучки з відео на слайдах.
            // Малюючи кожен кадр рівно для того часу, який справді минув, картинка
            // завжди відповідає тому, що в цей момент реально звучить/програється.
            const drawTimed = async (durationSec, drawFn) => {
                const start = performance.now();
                let frame = 0;
                while (true) {
                    const elapsed = (performance.now() - start) / 1000;
                    const t = Math.min(elapsed, durationSec);
                    drawFn(t, frame);
                    if (elapsed >= durationSec) break;
                    frame++;
                    await wait(start + frame * (1000 / fps) - performance.now());
                }
            };

            let prevSlide = null;

            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i];
                const slideDuration = getSlideDuration(slide);
                const transitionDef = TRANSITIONS[slide.transition] || TRANSITIONS.none;

                // Спершу ПІДГОТОВКА вбудованих відео та аудіо (асинхронно).
                await primeSlideVideos(slide);

                let ttsSource = null;
                if (withAudio && slide.audioBase64) {
                    const buffer = base64ToAudioBuffer(audioCtx, slide.audioBase64, slide.sampleRate);
                    ttsSource = audioCtx.createBufferSource();
                    ttsSource.buffer = buffer;
                    ttsSource.connect(dest);
                }

                let bgAudioEl = null;
                if (withAudio && slide.bgAudio) {
                    bgAudioEl = new Audio(slide.bgAudio);
                    bgAudioEl.crossOrigin = 'anonymous';
                    const source = audioCtx.createMediaElementSource(bgAudioEl);
                    source.connect(dest);
                }

                // Анімація переходу: попередній слайд (фінальний стан) -> поточний (стан t=0)
                if (i > 0 && prevSlide && transitionDef.duration > 0) {
                    const prevCanvas = renderSlideToCanvas(prevSlide, getSlideDuration(prevSlide) + 10);
                    const nextCanvas = renderSlideToCanvas(slide, 0);
                    await drawTimed(transitionDef.duration, (t) => {
                        drawTransitionFrame(ctx, prevCanvas, nextCanvas, slide.transition, t / transitionDef.duration);
                    });
                }

                // Відео запускаємо ПЕРШИМ (у play() трохи більша затримка старту), а
                // одразу за ним — озвучку (миттєвий AudioBufferSourceNode), щоб картинка
                // й звук збіглися.
                playSlideVideos(slide, withAudio ? { audioCtx, dest } : undefined); // відео в кадр (+ аудіо у трек, якщо зі звуком)

                // Старт озвучки слайду (лише якщо експорт зі звуком)
                if (ttsSource) {
                    ttsSource.start();
                }

                if (bgAudioEl) {
                    bgAudioEl.play().catch(e => console.error("bgAudio export play error:", e));
                }

                // Покадровий рендер слайду з анімаціями об'єктів, синхронізований з реальним часом
                await drawTimed(slideDuration, (t, frame) => {
                    drawSlideFrame(ctx, slide, t);
                    if (frame % 10 === 0) {
                        setExportProgress(Math.round(((i + t / slideDuration) / slides.length) * 100));
                    }
                });
                stopSlideVideos(slide);

                prevSlide = slide;
            }

            setExportProgress(100);
            recorder.stop();
            await recordingComplete;

            const videoBlob = new Blob(chunks, { type: mimeType });
            // Вшиваємо проєкт у кінець файлу (маркер + base64 JSON), щоб MP4 можна було
            // відкрити НАЗАД у редакторі (зворотна конвертація). Плеєри ігнорують хвіст.
            let finalBlob = videoBlob;
            try {
                const snapshot = { studioProVideo: 1, exportedAt: Date.now(), slides };
                const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(snapshot))));
                finalBlob = new Blob([videoBlob, `\n${VIDEO_PROJECT_START}\n${b64}\n${VIDEO_PROJECT_END}\n`], { type: mimeType });
            } catch (e) {
                finalBlob = videoBlob; // надто великий проєкт — лишаємо чисте відео
                logChange('Експорт', 'Проєкт не вшито у відео (завеликий) — файл лише для перегляду', e.message);
            }
            const fname = `presentation_video${withAudio ? '' : '_silent'}.${extension}`;
            const url = URL.createObjectURL(finalBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fname;
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            logChange('Експорт', `Відео збережено: ${fname}`, { format: mimeType, resolution: '1920x1080', fps: 30, bitrate: '~9 Mbps' });

        } catch (err) {
            setFileError("Помилка під час експорту відео: " + (err?.message || String(err)));
            logChange('Помилка', 'Експорт відео не вдався', err?.message || String(err));
        } finally {
            // Зупиняємо відео/аудіо-об'єкти УСІХ слайдів (а не лише того, на якому
            // могла статись помилка) — інакше при збої посеред монтажу відео-елемент
            // лишається "захопленим" у videoAudioSources/videoStartTimers, і наступна
            // спроба експорту для цього ж слайду піде БЕЗ звуку вбудованого відео.
            for (const s of slides) { try { stopSlideVideos(s); } catch (e) { /* ignore */ } }
            // Обов'язково прибираємо MediaRecorder/стрім/AudioContext незалежно від
            // результату — інакше вони лишаються "живими" і кожна наступна спроба
            // монтажу стає нестабільнішою (аж до відмов у створенні нового AudioContext).
            if (recorder) {
                try { recorder.ondataavailable = null; recorder.onstop = null; recorder.onerror = null; } catch (e) { /* ignore */ }
                try { if (recorder.state !== 'inactive') recorder.stop(); } catch (e) { /* ignore */ }
            }
            if (stream) {
                try { stream.getTracks().forEach(t => t.stop()); } catch (e) { /* ignore */ }
            }
            if (audioCtx) {
                try { if (audioCtx.state !== 'closed') audioCtx.close(); } catch (e) { /* ignore */ }
            }
            isVideoExportingRef.current = false;
            setIsExporting(false);
            setExportProgress(0);
        }
    };

    // --- Експорт аудіо доріжки (озвучка по таймлайну слайдів) у WAV / MP3 ---
    const buildVideoPcm = () => {
        const sr = 24000;
        let t = 0; const placements = [];
        for (let i = 0; i < slides.length; i++) {
            const s = slides[i];
            if (i > 0) { const td = TRANSITIONS[s.transition] || TRANSITIONS.none; t += td.duration || 0; }
            if (s.audioBase64) {
                const bin = atob(s.audioBase64); const bytes = new Uint8Array(bin.length);
                for (let k = 0; k < bin.length; k++) bytes[k] = bin.charCodeAt(k);
                placements.push({ at: t, pcm: new Int16Array(bytes.buffer) });
            }
            t += getSlideDuration(s);
        }
        const out = new Int16Array(Math.max(1, Math.ceil(t * sr)));
        for (const p of placements) {
            const off = Math.floor(p.at * sr);
            if (off < out.length) out.set(p.pcm.subarray(0, out.length - off), off);
        }
        return { pcm: out, sampleRate: sr, hasAudio: placements.length > 0 };
    };
    const pcmToWavBlob = (pcm, sr) => {
        const buffer = new ArrayBuffer(44 + pcm.length * 2);
        const view = new DataView(buffer);
        const ws = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
        ws(0, 'RIFF'); view.setUint32(4, 36 + pcm.length * 2, true); ws(8, 'WAVE'); ws(12, 'fmt ');
        view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
        view.setUint32(24, sr, true); view.setUint32(28, sr * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
        ws(36, 'data'); view.setUint32(40, pcm.length * 2, true);
        new Int16Array(buffer, 44).set(pcm);
        return new Blob([buffer], { type: 'audio/wav' });
    };
    const pcmToMp3Blob = async (pcm, sr) => {
        if (!window.lamejs) {
            await new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js'; sc.onload = res; sc.onerror = () => rej(new Error('Не вдалося завантажити MP3-кодер')); document.head.appendChild(sc); });
        }
        const enc = new window.lamejs.Mp3Encoder(1, sr, 192);
        const data = []; const block = 1152;
        for (let i = 0; i < pcm.length; i += block) {
            const buf = enc.encodeBuffer(pcm.subarray(i, i + block));
            if (buf.length > 0) data.push(new Int8Array(buf));
        }
        const fin = enc.flush(); if (fin.length > 0) data.push(new Int8Array(fin));
        return new Blob(data, { type: 'audio/mpeg' });
    };
    const handleExportAudio = async (format) => {
        if (slides.length === 0) return;
        setIsExportingAudio(true); setFileError(null);
        try {
            for (const slide of slides) await preloadSlideImages(slide);
            const { pcm, sampleRate, hasAudio } = buildVideoPcm();
            if (!hasAudio) throw new Error('Немає озвучки слайдів для експорту аудіо.');
            const blob = format === 'mp3' ? await pcmToMp3Blob(pcm, sampleRate) : pcmToWavBlob(pcm, sampleRate);
            const a = document.createElement('a');
            const url = URL.createObjectURL(blob);
            a.href = url; a.download = `presentation_audio.${format}`; a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            logChange('Експорт', `Аудіо збережено: presentation_audio.${format}`);
        } catch (e) {
            setFileError('Експорт аудіо: ' + e.message);
            logChange('Помилка', 'Експорт аудіо не вдався', e.message);
        } finally { setIsExportingAudio(false); }
    };

    // Зворотна конвертація: відкрити раніше експортований MP4/WebM назад у редактор.
    // Дані проєкту вшито у хвіст файлу при експорті (маркер + base64 JSON слайдів).
    const importVideoProject = async (file) => {
        if (!file) return;
        setIsProcessingPPTX(true);
        setFileError(null);
        try {
            const buf = new Uint8Array(await file.arrayBuffer());
            const enc = new TextEncoder();
            const startBytes = enc.encode(VIDEO_PROJECT_START);
            const sIdx = indexOfBytes(buf, startBytes);
            if (sIdx === -1) throw new Error('У файлі немає вшитого проєкту. Відкрити для редагування можна лише MP4/WebM, експортований цим редактором.');
            let dataStart = sIdx + startBytes.length;
            if (buf[dataStart] === 0x0a) dataStart++; // пропустити \n після маркера
            const endBytes = enc.encode(VIDEO_PROJECT_END);
            let eIdx = indexOfBytes(buf, endBytes, dataStart);
            let dataEnd = eIdx === -1 ? buf.length : eIdx;
            const b64 = new TextDecoder('latin1').decode(buf.slice(dataStart, dataEnd)).trim();
            const snapshot = JSON.parse(decodeURIComponent(escape(atob(b64))));
            if (!snapshot.slides || !snapshot.slides.length) throw new Error('Вшиті дані проєкту порожні або пошкоджені.');
            dispatchVideo({ type: 'SET_SLIDES', slides: snapshot.slides });
            setSelectedSlideId(snapshot.slides[0]?.id || null);
            setSelectedObjectId(null);
            logChange('Імпорт', `Відкрито відео для редагування: "${file.name}"`, { slides: snapshot.slides.length });
        } catch (err) {
            setFileError('Зворотна конвертація: ' + err.message);
            logChange('Помилка', 'Не вдалося відкрити відео для редагування', err.message);
        } finally {
            setIsProcessingPPTX(false);
        }
    };

    // Завантаження файлу на початковому екрані: .pptx → розбір слайдів,
    // .mp4/.webm (експортований цим редактором) → відновлення проєкту.
    const handleIncomingFile = (file) => {
        if (!file) return;
        const isVideoFile = /\.(mp4|webm)$/i.test(file.name || '') || /^video\//.test(file.type || '');
        if (isVideoFile) importVideoProject(file);
        else processPPTXFile(file);
    };
    const handleFileUpload = (e) => handleIncomingFile(e.target.files[0]);
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleIncomingFile(e.dataTransfer.files[0]);
    };
    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

    const slidesWithAudio = slides.filter(s => s.audioBase64).length;

    /* ========================================================================
     * РЕНДЕР: допоміжні підкомпоненти відеоредактора (inline-функції)
     * ====================================================================== */

    // Короткий підпис об'єкта для списків і таймлайну
    const getObjectLabel = (obj) => {
        if (obj.type === 'text') {
            const t = (obj.lines || []).map(l => l.text).join(' ');
            return t.length > 28 ? t.slice(0, 28) + '…' : (t || 'Текст');
        }
        if (obj.type === 'image') return 'Зображення';
        if (obj.type === 'video') return 'Відео';
        if (obj.type === 'table') return 'Таблиця';
        if (obj.type === 'math') return 'Формула';
        if (obj.type === 'interactive') return (H5P_TYPES.find(t => t[0] === obj.iType) || [null, 'Інтерактив'])[1];
        return `Фігура (${obj.shapeKind})`;
    };

    // DOM-вміст об'єкта у робочій області (WYSIWYG): зображення (з обрізкою), SVG-фігури зі
    // стрілками/штрихами/градієнтами (як у PowerPoint), таблиці та текст із рунами
    const renderObjectDom = (obj, scale) => {
        const fillCss = (o) => o.fillGradient
            ? { backgroundImage: cssGradient(o.fillGradient) }
            : { backgroundColor: o.fillColor || 'transparent' };

        // Рядки тексту з рунами (стилі окремих фрагментів) — для текстів і комірок таблиць
        const renderLinesDom = (lines) => (lines || []).map((line, idx) => {
            const runs = getRenderRuns(line);
            return (
                <div
                    key={idx}
                    style={{
                        fontSize: Math.max((line.fontSize || 24) * scale, 6),
                        lineHeight: 1.25 * (line.lineSpacing || 1),
                        textAlign: line.align === 'ctr' ? 'center' : (line.align === 'r' ? 'right' : 'left'),
                        marginLeft: (line.indent || 0) * 28 * scale,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                    }}
                >
                    {runs.length === 0 ? ' ' : runs.map((r, j) => (
                        r.math && r.mathml ? (
                            // Формула у тексті: інлайн MathML (WYSIWYG у редакторі)
                            <span
                                key={j}
                                style={{
                                    color: r.color || '#1e293b',
                                    fontSize: Math.max((r.fontSize || 24) * scale, 6),
                                    display: 'inline-block',
                                    verticalAlign: 'middle'
                                }}
                                dangerouslySetInnerHTML={{ __html: r.mathml }}
                            />
                        ) : (
                            <span
                                key={j}
                                style={{
                                    color: r.color || '#1e293b',
                                    fontSize: Math.max((r.fontSize || 24) * scale, 6),
                                    fontWeight: r.bold ? 700 : 400,
                                    fontStyle: r.italic ? 'italic' : 'normal',
                                    fontFamily: r.font ? `"${r.font}", ${PPT_FALLBACK_FONTS}` : PPT_FALLBACK_FONTS,
                                    textDecorationLine: [r.underline ? 'underline' : '', r.strike ? 'line-through' : ''].join(' ').trim() || undefined
                                }}
                            >
                                {r.text}
                            </span>
                        )
                    ))}
                </div>
            );
        });

        if (obj.type === 'video') {
            const radius = obj.cornerRadius > 0 ? Math.min(obj.cornerRadius, Math.min(obj.w, obj.h) / 2) * scale : 0;
            // Тримінг через media-fragment #t=start,end; кроп — масштабуванням у overflow-обгортці
            const ts = obj.trimStart || 0;
            const te = (obj.trimEnd != null && obj.trimEnd > ts) ? obj.trimEnd : 0;
            const frag = (ts || te) ? `#t=${ts}${te ? ',' + te : ''}` : '';
            const cr = obj.crop && (obj.crop.l || obj.crop.t || obj.crop.r || obj.crop.b) ? obj.crop : null;
            const videoEl = (extra) => (
                <video src={obj.src + frag} poster={obj.poster || undefined} controls playsInline preload="auto"
                    onMouseDown={(e) => e.stopPropagation()} className="select-none bg-black" style={extra} />
            );
            if (cr) {
                const fw = Math.max(1 - cr.l - cr.r, 0.01), fh = Math.max(1 - cr.t - cr.b, 0.01);
                return (
                    <div className="w-full h-full overflow-hidden bg-black" style={{ borderRadius: radius || undefined }}>
                        {videoEl({ width: `${100 / fw}%`, height: `${100 / fh}%`, marginLeft: `${-(cr.l / fw) * 100}%`, marginTop: `${-(cr.t / fh) * 100}%`, objectFit: 'fill' })}
                    </div>
                );
            }
            return videoEl({ width: '100%', height: '100%', objectFit: 'contain', borderRadius: radius || undefined });
        }

        if (obj.type === 'math') {
            return (
                <div
                    className="w-full h-full flex items-center justify-center overflow-hidden"
                    style={{ fontSize: Math.max(Math.min(obj.h * 0.45, 48) * scale, 10), color: obj.color || '#111827', lineHeight: 1 }}
                    dangerouslySetInnerHTML={{ __html: obj.mathml || `<span>${obj.textFallback || ''}</span>` }}
                />
            );
        }

        if (obj.type === 'interactive') {
            return <InteractiveWidget obj={obj} scale={scale} interactive={interactiveMode} />;
        }

        if (obj.type === 'image') {
            const flip = `${obj.flipH ? 'scaleX(-1) ' : ''}${obj.flipV ? 'scaleY(-1)' : ''}`.trim();
            const radius = obj.cornerRadius > 0
                ? Math.min(obj.cornerRadius, Math.min(obj.w, obj.h) / 2) * scale
                : 0;
            if (obj.crop) {
                // Обрізка srcRect: збільшуємо картинку і зсуваємо видиму область
                const fw = Math.max(1 - obj.crop.l - obj.crop.r, 0.01);
                const fh = Math.max(1 - obj.crop.t - obj.crop.b, 0.01);
                return (
                    <div className="w-full h-full overflow-hidden" style={{ transform: flip || undefined, borderRadius: radius || undefined }}>
                        <img
                            src={obj.src} alt="" draggable={false}
                            className="select-none max-w-none"
                            style={{
                                width: `${100 / fw}%`, height: `${100 / fh}%`,
                                marginLeft: `${-(obj.crop.l / fw) * 100}%`, marginTop: `${-(obj.crop.t / fh) * 100}%`
                            }}
                        />
                    </div>
                );
            }
            return (
                <img
                    src={obj.src} alt="" draggable={false}
                    className="w-full h-full select-none"
                    style={{
                        objectFit: 'fill',
                        transform: flip || undefined,
                        borderRadius: radius || undefined
                    }}
                />
            );
        }

        if (obj.type === 'table') {
            return (
                <div className="w-full h-full overflow-hidden flex flex-col select-none">
                    {(obj.rows || []).map((row, ri) => (
                        <div key={ri} className="flex" style={{ height: `${(row.h / obj.h) * 100}%` }}>
                            {row.cells.filter(c => !c.merged).map((cell, ci) => (
                                <div
                                    key={ci}
                                    className="overflow-hidden"
                                    style={{
                                        width: `${(cell.w / obj.w) * 100}%`,
                                        backgroundColor: cell.fill || undefined,
                                        border: '1px solid #94A3B8',
                                        padding: 4 * scale,
                                        display: 'flex', flexDirection: 'column',
                                        justifyContent: cell.vAlign === 'ctr' ? 'center' : (cell.vAlign === 'b' ? 'flex-end' : 'flex-start')
                                    }}
                                >
                                    {renderLinesDom(cell.lines)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            );
        }

        if (obj.type === 'shape') {
            const stroke = obj.lineColor || (obj.shapeKind === 'line' ? (obj.fillColor || '#64748b') : null);
            const sw = obj.lineWidth || 2;
            const dash = obj.lineDash ? obj.lineDash.join(' ') : undefined;

            // Лінія/з'єднувач зі стрілками на кінцях
            if (obj.shapeKind === 'line') {
                const x1 = obj.flipH ? obj.w : 0, y1 = obj.flipV ? obj.h : 0;
                const x2 = obj.flipH ? 0 : obj.w, y2 = obj.flipV ? 0 : obj.h;
                const markerId = `arr-${obj.id}`;
                return (
                    <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${Math.max(obj.w, 1)} ${Math.max(obj.h, 1)}`} preserveAspectRatio="none">
                        <defs>
                            <marker id={markerId} markerWidth="10" markerHeight="8" refX="8" refY="3" orient="auto-start-reverse" markerUnits="strokeWidth">
                                <path d="M0,0 L9,3 L0,6 Z" fill={stroke || '#64748b'} />
                            </marker>
                        </defs>
                        <line
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke={stroke || '#64748b'} strokeWidth={sw} strokeDasharray={dash}
                            markerEnd={obj.arrowTail ? `url(#${markerId})` : undefined}
                            markerStart={obj.arrowHead ? `url(#${markerId})` : undefined}
                        />
                    </svg>
                );
            }

            // Полігональні фігури (стрілки, трикутники, ромби, зірки, шеврони...)
            const poly = SHAPE_POLYGONS[obj.shapeKind];
            if (poly) {
                const pts = poly.map(([px, py]) => `${px * obj.w},${py * obj.h}`).join(' ');
                const gradId = `grad-${obj.id}`;
                return (
                    <svg className="w-full h-full" viewBox={`0 0 ${Math.max(obj.w, 1)} ${Math.max(obj.h, 1)}`} preserveAspectRatio="none">
                        {obj.fillGradient && (
                            <defs>
                                <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0" gradientTransform={`rotate(${obj.fillGradient.angle || 0}, 0.5, 0.5)`}>
                                    {obj.fillGradient.stops.map((s, si) => (
                                        <stop key={si} offset={`${Math.round(s.pos * 100)}%`} stopColor={s.color} />
                                    ))}
                                </linearGradient>
                            </defs>
                        )}
                        <polygon
                            points={pts}
                            fill={obj.fillGradient ? `url(#${gradId})` : (obj.fillColor || 'transparent')}
                            stroke={stroke || 'none'} strokeWidth={sw} strokeDasharray={dash}
                        />
                    </svg>
                );
            }

            // Прямокутник / скруглений / еліпс
            return (
                <div
                    className="w-full h-full"
                    style={{
                        ...fillCss(obj),
                        border: stroke ? `${Math.max(sw * scale, 1)}px ${obj.lineDash ? 'dashed' : 'solid'} ${stroke}` : 'none',
                        borderRadius: obj.shapeKind === 'ellipse' ? '50%' : (obj.shapeKind === 'roundRect' ? Math.max(12 * scale, 4) : 0)
                    }}
                />
            );
        }

        // Текстовий блок (фон може бути фігурою: еліпс / скруглений прямокутник)
        return (
            <div
                className="w-full h-full overflow-hidden select-none flex flex-col"
                style={{
                    ...fillCss(obj),
                    border: obj.lineColor ? `${Math.max((obj.lineWidth || 2) * scale, 1)}px ${obj.lineDash ? 'dashed' : 'solid'} ${obj.lineColor}` : 'none',
                    borderRadius: obj.shapeKind === 'ellipse' ? '50%' : (obj.shapeKind === 'roundRect' ? Math.max(12 * scale, 4) : 0),
                    padding: 4 * scale,
                    justifyContent: obj.vAlign === 'ctr' ? 'center' : (obj.vAlign === 'b' ? 'flex-end' : 'flex-start')
                }}
            >
                {renderLinesDom(obj.lines)}
            </div>
        );
    };

    // Робоча область слайду: DOM-об'єкти з Drag & Drop, поверх — canvas прев'ю
    const renderSlideWorkspace = () => {
        if (!selectedSlide) return null;
        const slide = selectedSlide;

        return (
            <div
                ref={workspaceRef}
                className="relative w-full rounded-xl border border-[#F0EEE6] shadow-inner overflow-hidden"
                style={{
                    aspectRatio: '16 / 9',
                    backgroundColor: slide.background || '#FFFFFF',
                    backgroundImage: slide.bgImage
                        ? `url(${slide.bgImage})`
                        : (slide.bgGradient ? cssGradient(slide.bgGradient) : undefined),
                    backgroundSize: '100% 100%'
                }}
                onMouseDown={() => setSelectedObjectId(null)}
            >
                {slide.objects.map((obj, idx) => {
                    const isSelected = obj.id === selectedObjectId;
                    return (
                        <div
                            key={obj.id}
                            onMouseDown={(e) => startObjectDrag(e, slide.id, obj, 'move')}
                            className={`absolute cursor-move ${isSelected ? 'ring-2 ring-indigo-500' : 'hover:ring-1 hover:ring-indigo-300'}`}
                            style={{
                                left: obj.x * editorScale,
                                top: obj.y * editorScale,
                                width: obj.w * editorScale,
                                height: obj.h * editorScale,
                                zIndex: idx + 1,
                                opacity: isPreviewing ? 0 : (obj.opacity != null ? obj.opacity : 1),
                                visibility: isPreviewing ? 'hidden' : 'visible',
                                transform: obj.rot ? `rotate(${obj.rot}deg)` : undefined
                            }}
                        >
                            {renderObjectDom(obj, editorScale)}

                            {isSelected && (
                                <>
                                    {/* Бейдж анімації */}
                                    {obj.animation?.type !== 'none' && (
                                        <div className="absolute -top-6 left-0 px-1.5 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded whitespace-nowrap pointer-events-none">
                                            {ANIMATIONS[obj.animation.type]?.label} · {obj.animation.delay}с
                                        </div>
                                    )}
                                    {/* Ручка resize */}
                                    <div
                                        onMouseDown={(e) => startObjectDrag(e, slide.id, obj, 'resize')}
                                        className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-600 border-2 border-white rounded-full cursor-se-resize shadow"
                                    />
                                </>
                            )}
                        </div>
                    );
                })}

                {slide.objects.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm font-semibold pointer-events-none">
                        Порожній слайд — додайте текст або зображення
                    </div>
                )}

                {/* Canvas прев'ю поверх робочої області */}
                {isPreviewing && (
                    <canvas
                        ref={previewCanvasRef}
                        width={CANVAS_W}
                        height={CANVAS_H}
                        className="absolute inset-0 w-full h-full z-[999]"
                    />
                )}
            </div>
        );
    };

    // Права панель: властивості виділеного об'єкта АБО налаштування слайду
    const renderPropertiesPanel = () => {
        if (!selectedSlide) return null;
        const slide = selectedSlide;

        // --- Панель об'єкта ---
        if (selectedObject) {
            const obj = selectedObject;
            const anim = obj.animation || { type: 'none', delay: 0, duration: 0.8 };
            const updateObj = (updates) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: slide.id, objectId: obj.id, updates });
            const updateAnim = (updates) => dispatchVideo({ type: 'UPDATE_OBJECT_ANIMATION', slideId: slide.id, objectId: obj.id, updates });

            return (
                <div className="bg-white rounded-2xl border border-[#F0EEE6] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Layers size={15} className="text-indigo-600" /> {getObjectLabel(obj)}
                        </h4>
                        <button
                            onClick={() => {
                                dispatchVideo({ type: 'DELETE_OBJECT', slideId: slide.id, objectId: obj.id });
                                logChange('Об\'єкт', `Видалено об'єкт зі слайда ${slide.slideNumber}`, getObjectLabel(obj));
                                setSelectedObjectId(null);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Видалити об'єкт"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>

                    {/* Перехід до слайду (доступний і коли виділено об'єкт) */}
                    <label className="flex flex-col gap-1 border-b border-[#F0EEE6] pb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                            <Film size={11} /> Перехід до слайду {slide.slideNumber}
                        </span>
                        <select
                            value={slide.transition}
                            onChange={(e) => {
                                dispatchVideo({ type: 'UPDATE_SLIDE', slideId: slide.id, updates: { transition: e.target.value } });
                                logChange('Перехід', `Слайд ${slide.slideNumber}: перехід → ${TRANSITIONS[e.target.value]?.label || e.target.value}`);
                            }}
                            className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#16a34a] bg-white"
                        >
                            {Object.entries(TRANSITIONS).map(([key, def]) => (
                                <option key={key} value={key}>{def.label}</option>
                            ))}
                        </select>
                    </label>

                    {/* Позиція та розмір */}
                    <div className="grid grid-cols-4 gap-2">
                        {[['X', 'x'], ['Y', 'y'], ['W', 'w'], ['H', 'h']].map(([label, key]) => (
                            <label key={key} className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-slate-400">{label}</span>
                                <input
                                    type="number"
                                    value={Math.round(obj[key])}
                                    onChange={(e) => updateObj({ [key]: parseInt(e.target.value, 10) || 0 })}
                                    className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-white"
                                />
                            </label>
                        ))}
                    </div>

                    {/* Прозорість блоку */}
                    <label className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Прозорість — {Math.round((obj.opacity != null ? obj.opacity : 1) * 100)}%
                        </span>
                        <input
                            type="range" min="0" max="100" step="1"
                            value={Math.round((obj.opacity != null ? obj.opacity : 1) * 100)}
                            onChange={(e) => updateObj({ opacity: (parseInt(e.target.value, 10) || 0) / 100 })}
                            className="w-full accent-indigo-600 cursor-pointer"
                        />
                    </label>

                    {/* Заокруглення кутів зображення */}
                    {obj.type === 'image' && (
                        <label className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                                Заокруглення кутів — {obj.cornerRadius || 0} px
                            </span>
                            <input
                                type="range"
                                min="0"
                                max={Math.max(Math.round(Math.min(obj.w, obj.h) / 2), 1)}
                                step="1"
                                value={Math.min(obj.cornerRadius || 0, Math.round(Math.min(obj.w, obj.h) / 2))}
                                onChange={(e) => updateObj({ cornerRadius: parseInt(e.target.value, 10) || 0 })}
                                className="w-full accent-indigo-600 cursor-pointer"
                            />
                            <span className="text-[10px] text-slate-400">
                                Максимум робить картинку круглою/овальною
                            </span>
                        </label>
                    )}

                    {/* Обрізка зображення з чотирьох боків */}
                    {obj.type === 'image' && (
                        <div className="space-y-1.5 border-t border-[#F0EEE6] pt-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Обрізка картинки</span>
                                {obj.crop && (
                                    <button
                                        onClick={() => updateObj({ crop: null })}
                                        className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        Скинути
                                    </button>
                                )}
                            </div>
                            {[['Зліва', 'l', 'r'], ['Справа', 'r', 'l'], ['Зверху', 't', 'b'], ['Знизу', 'b', 't']].map(([label, key, opp]) => {
                                const crop = obj.crop || { l: 0, t: 0, r: 0, b: 0 };
                                const value = Math.round((crop[key] || 0) * 100);
                                return (
                                    <label key={key} className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                                        <span className="w-12 flex-shrink-0">{label}</span>
                                        <input
                                            type="range" min="0" max="90" step="1"
                                            value={value}
                                            onChange={(e) => {
                                                // Протилежні боки разом не можуть з'їсти більше 90% картинки
                                                const limit = 0.9 - (crop[opp] || 0);
                                                const v = Math.min((parseInt(e.target.value, 10) || 0) / 100, Math.max(limit, 0));
                                                const next = { ...crop, [key]: Math.round(v * 100) / 100 };
                                                const isEmpty = !next.l && !next.t && !next.r && !next.b;
                                                updateObj({ crop: isEmpty ? null : next });
                                            }}
                                            className="flex-grow accent-emerald-600 cursor-pointer"
                                        />
                                        <span className="w-9 text-right flex-shrink-0">{value}%</span>
                                    </label>
                                );
                            })}
                            <span className="text-[10px] text-slate-400 block">
                                Видима частина розтягується на весь блок (як у PowerPoint)
                            </span>
                        </div>
                    )}

                    {/* Текстовий вміст */}
                    {obj.type === 'text' && (
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Текст</span>
                            <textarea
                                value={(obj.lines || []).map(l => l.text).join('\n')}
                                onChange={(e) => {
                                    const base = obj.lines?.[0] || { color: '#1e293b', fontSize: 24, bold: false, align: 'l' };
                                    // Незмінені рядки лишаємо як є (руни, формули й стилі збережено);
                                    // руни скидаються лише в реально відредагованих рядках
                                    const newLines = e.target.value.split('\n').map((t, i) => {
                                        const prev = obj.lines?.[i];
                                        if (prev && prev.text === t) return prev;
                                        return { ...(prev || base), text: t, runs: undefined, bullet: undefined };
                                    });
                                    updateObj({ lines: newLines });
                                }}
                                className="w-full min-h-[70px] p-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-400 resize-y bg-white"
                            />
                            {/* Форматування: стиль шрифту, горизонтальне та вертикальне вирівнювання */}
                            {(() => {
                                // Стан тумблера — за першим стильованим руном/рядком об'єкта
                                const allRuns = (obj.lines || []).flatMap(l => (l.runs && l.runs.length ? l.runs : [l])).filter(r => !r.math);
                                const st = (k) => allRuns.length > 0 && allRuns.every(r => !!r[k]);
                                // Стильовий патч на всі рядки й руни (формули-руни не чіпаємо)
                                const setTextStyle = (patch) => updateObj({
                                    lines: (obj.lines || []).map(l => ({
                                        ...l, ...patch,
                                        runs: l.runs ? l.runs.map(r => (r.math ? r : { ...r, ...patch })) : l.runs
                                    }))
                                });
                                const setAlign = (align) => updateObj({ lines: (obj.lines || []).map(l => ({ ...l, align })) });
                                const tgl = (on) => `px-2 py-1 text-xs font-bold rounded border ${on ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`;
                                const curAlign = obj.lines?.[0]?.align || 'l';
                                const fontList = [...new Set([
                                    ...(obj.lines || []).flatMap(l => (l.runs || []).map(r => r.font)).filter(Boolean),
                                    ...embeddedFontFamilies, // вбудовані шрифти імпортованої презентації
                                    'Calibri', 'Arial', 'Times New Roman', 'Georgia', 'Verdana', 'Tahoma',
                                    'Trebuchet MS', 'Comic Sans MS', 'Courier New', 'Impact'
                                ])];
                                const curFont = obj.lines?.[0]?.runs?.[0]?.font || obj.lines?.[0]?.font || '';
                                return (
                                    <>
                                        <div className="flex flex-wrap items-center gap-1">
                                            <button className={tgl(st('bold'))} style={{ fontWeight: 800 }} title="Жирний"
                                                onClick={() => setTextStyle({ bold: !st('bold') })}>B</button>
                                            <button className={tgl(st('italic'))} style={{ fontStyle: 'italic' }} title="Курсив"
                                                onClick={() => setTextStyle({ italic: !st('italic') })}>I</button>
                                            <button className={tgl(st('underline'))} style={{ textDecoration: 'underline' }} title="Підкреслений"
                                                onClick={() => setTextStyle({ underline: !st('underline') })}>U</button>
                                            <button className={tgl(st('strike'))} style={{ textDecoration: 'line-through' }} title="Закреслений"
                                                onClick={() => setTextStyle({ strike: !st('strike') })}>S</button>
                                            <span className="w-px h-5 bg-slate-200 mx-1" />
                                            {[['l', 'Л', 'Ліворуч'], ['ctr', 'Ц', 'По центру'], ['r', 'П', 'Праворуч']].map(([a, ic, tip]) => (
                                                <button key={a} className={tgl(curAlign === a)} title={tip}
                                                    onClick={() => setAlign(a)}>{ic}</button>
                                            ))}
                                            <span className="w-px h-5 bg-slate-200 mx-1" />
                                            {[['t', 'В', 'Догори'], ['ctr', 'С', 'Посередині'], ['b', 'Н', 'Донизу']].map(([va, ic, tip]) => (
                                                <button key={va} className={tgl((obj.vAlign || 't') === va)} title={tip}
                                                    onClick={() => updateObj({ vAlign: va })}>{ic}</button>
                                            ))}
                                        </div>
                                        <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                                            Шрифт
                                            <select
                                                value={curFont}
                                                onChange={(e) => {
                                                    const f = e.target.value || null;
                                                    updateObj({
                                                        lines: (obj.lines || []).map(l => ({
                                                            ...l, font: f,
                                                            runs: l.runs ? l.runs.map(r => (r.math ? r : { ...r, font: f })) : l.runs
                                                        }))
                                                    });
                                                }}
                                                className="flex-1 px-1.5 py-1 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-white"
                                            >
                                                <option value="">(тема)</option>
                                                {fontList.map(f => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                        </label>
                                    </>
                                );
                            })()}
                            <div className="grid grid-cols-2 gap-2">
                                <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                                    Колір
                                    <input
                                        type="color"
                                        value={obj.lines?.[0]?.color || '#1e293b'}
                                        onChange={(e) => updateObj({
                                            lines: (obj.lines || []).map(l => ({
                                                ...l,
                                                color: e.target.value,
                                                runs: l.runs ? l.runs.map(r => ({ ...r, color: e.target.value })) : l.runs
                                            }))
                                        })}
                                        className="w-7 h-7 border border-slate-200 rounded cursor-pointer"
                                    />
                                </label>
                                <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                                    Кегль
                                    <input
                                        type="number"
                                        min="8"
                                        value={obj.lines?.[0]?.fontSize || 24}
                                        onChange={(e) => {
                                            const fs = parseInt(e.target.value, 10) || 24;
                                            updateObj({
                                                lines: (obj.lines || []).map(l => ({
                                                    ...l,
                                                    fontSize: fs,
                                                    runs: l.runs ? l.runs.map(r => ({ ...r, fontSize: fs })) : l.runs
                                                }))
                                            });
                                        }}
                                        className="w-14 px-1.5 py-1 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-white"
                                    />
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Кольори фігури / фону текстового блоку */}
                    {(obj.type === 'shape' || obj.type === 'text') && (
                        <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                                Заливка
                                <input
                                    type="color"
                                    value={obj.fillColor || '#ffffff'}
                                    onChange={(e) => updateObj({ fillColor: e.target.value, fillGradient: null })}
                                    className="w-7 h-7 border border-slate-200 rounded cursor-pointer"
                                />
                            </label>
                            <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                                Контур
                                <input
                                    type="color"
                                    value={obj.lineColor || '#94a3b8'}
                                    onChange={(e) => updateObj({ lineColor: e.target.value })}
                                    className="w-7 h-7 border border-slate-200 rounded cursor-pointer"
                                />
                            </label>
                        </div>
                    )}

                    {/* Анімація появи */}
                    <div className="space-y-2 border-t border-[#F0EEE6] pt-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                            <Sparkles size={11} /> Анімація появи
                        </span>
                        <select
                            value={anim.type}
                            onChange={(e) => {
                                updateAnim({ type: e.target.value });
                                logChange('Анімація', `Анімація об'єкта → ${ANIMATIONS[e.target.value]?.label || e.target.value}`, { slideId: slide.id, objectId: obj.id });
                            }}
                            className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-white"
                        >
                            <optgroup label="— Без анімації —">
                                <option value="none">Немає (видимий одразу)</option>
                                <option value="appear">✦ Виникнення (Appear)</option>
                            </optgroup>
                            <optgroup label="— Прозорість —">
                                <option value="fadeIn">◐ Вицвітання (Fade In)</option>
                                <option value="floatIn">↑◐ Спливання вгору (Float In)</option>
                                <option value="floatDown">↓◐ Спливання вниз (Float Down)</option>
                            </optgroup>
                            <optgroup label="— Виліт (Fly In) —">
                                <option value="flyInLeft">← Виліт зліва</option>
                                <option value="flyInRight">→ Виліт справа</option>
                                <option value="flyInTop">↑ Виліт згори</option>
                                <option value="flyInBottom">↓ Виліт знизу</option>
                            </optgroup>
                            <optgroup label="— Витирання (Wipe) —">
                                <option value="wipeFromLeft">▷ Витирання зліва</option>
                                <option value="wipeFromRight">◁ Витирання справа</option>
                                <option value="wipeFromTop">▽ Витирання згори</option>
                                <option value="wipeFromBottom">△ Витирання знизу</option>
                            </optgroup>
                            <optgroup label="— Фігурні маски —">
                                <option value="splitIn">⬡ Розтин (Split)</option>
                            </optgroup>
                            <optgroup label="— Масштаб / Оберт —">
                                <option value="zoomIn">⊕ Масштабування (Zoom)</option>
                                <option value="growTurn">↻⊕ Збільшення з поворотом</option>
                                <option value="swivel">↔ Вертушка (Swivel)</option>
                                <option value="stretch">↔↕ Розтягування (Stretch)</option>
                                <option value="spinIn">↺ Оберт (Spin In)</option>
                            </optgroup>
                            <optgroup label="— Ефектні —">
                                <option value="bounce">⤵ Відскік (Bounce)</option>
                                <option value="pop">💥 Pop (пружний)</option>
                            </optgroup>
                        </select>
                        {anim.type !== 'none' && (
                            <div className="grid grid-cols-2 gap-2">
                                <label className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-bold text-slate-400">Затримка (с)</span>
                                    <input
                                        type="number" step="0.1" min="0"
                                        value={anim.delay}
                                        onChange={(e) => updateAnim({ delay: Math.max(0, parseFloat(e.target.value) || 0) })}
                                        className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-white"
                                    />
                                </label>
                                <label className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-bold text-slate-400">Тривалість (с)</span>
                                    <input
                                        type="number" step="0.1" min="0.2"
                                        value={anim.duration}
                                        onChange={(e) => updateAnim({ duration: Math.max(0.2, parseFloat(e.target.value) || 0.2) })}
                                        className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-white"
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // --- Панель слайду (нічого не виділено) ---
        return (
            <div className="bg-white rounded-2xl border border-[#F0EEE6] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Presentation size={15} className="text-[#16a34a]" /> Слайд {slide.slideNumber}
                </h4>

                <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Перехід до слайду</span>
                    <select
                        value={slide.transition}
                        onChange={(e) => {
                            dispatchVideo({ type: 'UPDATE_SLIDE', slideId: slide.id, updates: { transition: e.target.value } });
                            logChange('Перехід', `Слайд ${slide.slideNumber}: перехід → ${TRANSITIONS[e.target.value]?.label || e.target.value}`);
                        }}
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#16a34a] bg-white"
                    >
                        {Object.entries(TRANSITIONS).map(([key, def]) => (
                            <option key={key} value={key}>{def.label}</option>
                        ))}
                    </select>
                </label>

                {/* Швидкі пресети анімацій (без AI) */}
                <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        <Sparkles size={11} /> Пресети анімацій
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                        <button
                            onClick={() => handleApplySlideAnimationPreset(slide.id, 'together')}
                            disabled={slide.objects.length === 0}
                            className="px-2 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 disabled:opacity-40 rounded-xl text-[11px] font-bold transition-colors flex flex-col items-center gap-0.5"
                            title="Усі об'єкти з'являються одночасно (затримка 0)"
                        >
                            <span className="text-base leading-none">⚡</span>
                            Разом
                        </button>
                        <button
                            onClick={() => handleApplySlideAnimationPreset(slide.id, 'cascade')}
                            disabled={slide.objects.length === 0}
                            className="px-2 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-40 rounded-xl text-[11px] font-bold transition-colors flex flex-col items-center gap-0.5"
                            title="Об'єкти з'являються по черзі з кроком 0.4с"
                        >
                            <span className="text-base leading-none">🎯</span>
                            Каскад
                        </button>
                        <button
                            onClick={() => handleApplySlideAnimationPreset(slide.id, 'narrator')}
                            disabled={slide.objects.length === 0}
                            className="px-2 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 rounded-xl text-[11px] font-bold transition-colors flex flex-col items-center gap-0.5"
                            title="Об'єкти рівномірно розподілені по тривалості аудіо"
                        >
                            <span className="text-base leading-none">🎙️</span>
                            По диктору
                        </button>
                    </div>
                </div>

                {/* Перегенерація розподілу анімацій цього слайду через AI */}
                <button
                    onClick={() => handleRegenerateSlideAnimations(slide.id)}
                    disabled={regeneratingSlideId === slide.id || slide.objects.length === 0}
                    className="w-full px-3 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 disabled:opacity-50 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    title="AI наново розподілить анімації об'єктів цього слайду"
                >
                    {regeneratingSlideId === slide.id
                        ? <Loader2 size={13} className="animate-spin" />
                        : <Wand2 size={13} />}
                    Перегенерувати анімації (AI)
                </button>

                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        <Type size={11} /> Текст диктора (нотатки)
                    </span>
                    <textarea
                        value={slide.text}
                        onChange={(e) => dispatchVideo({
                            type: 'UPDATE_SLIDE', slideId: slide.id,
                            updates: { text: e.target.value, audioBase64: null, audioDuration: 0 }
                        })}
                        placeholder="Введіть текст, який має прочитати диктор на цьому слайді..."
                        className="w-full min-h-[120px] p-2.5 text-xs leading-relaxed border border-slate-200 rounded-lg outline-none focus:border-[#16a34a] resize-y bg-white"
                    />
                </div>

                {slide.error && (
                    <div className="p-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 flex items-center gap-2">
                        <AlertCircle size={14} /> {slide.error}
                    </div>
                )}

                <div className="flex items-center justify-between border-t border-[#F0EEE6] pt-3">
                    {slide.isGenerating ? (
                        <span className="text-xs font-semibold text-[#16a34a] flex items-center gap-1">
                            <Loader2 size={12} className="animate-spin" /> Генерується...
                        </span>
                    ) : slide.audioBase64 ? (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            <CheckCircle size={12} /> Аудіо ({slide.audioDuration.toFixed(1)}с)
                        </span>
                    ) : (
                        <span className="text-xs font-semibold text-amber-600">✎ Потребує озвучки</span>
                    )}

                    <div className="flex items-center gap-2">
                        {slide.audioBase64 && (
                            <button
                                onClick={() => toggleSlidePlayback(slide.id, slide.audioBase64, slide.sampleRate)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${playingSlideId === slide.id
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-[#FAF9F5] text-[#16a34a] hover:bg-[#16a34a] hover:text-white border border-[#F0EEE6]'}`}
                            >
                                {playingSlideId === slide.id ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                            </button>
                        )}
                        <button
                            onClick={() => generateSlideAudio(slide.id)}
                            disabled={slide.isGenerating || !slide.text.trim()}
                            className="px-3 py-1.5 bg-[#FAF9F5] border border-[#F0EEE6] text-[#16a34a] text-xs font-bold rounded-lg hover:bg-green-50 transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                            <RefreshCw size={12} className={slide.isGenerating ? 'animate-spin' : ''} />
                            Озвучити
                        </button>
                    </div>
                </div>

                <div className="border-t border-[#F0EEE6] pt-3 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Додати об'єкт</span>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={addTextObject}
                            className="px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                            <Type size={13} /> Текст
                        </button>
                        <label className="cursor-pointer px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                            <ImagePlus size={13} /> Зображення
                            <input type="file" accept="image/*" onChange={(e) => { addImageObject(e.target.files[0]); e.target.value = ''; }} className="hidden" />
                        </label>
                        <label className="cursor-pointer px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                            <Film size={13} /> Відео
                            <input type="file" accept="video/*" onChange={(e) => { addVideoObject(e.target.files[0]); e.target.value = ''; }} className="hidden" />
                        </label>
                        <label className="cursor-pointer px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                            <Music size={13} /> Аудіо
                            <input type="file" accept="audio/*" onChange={(e) => { addAudioObject(e.target.files[0]); e.target.value = ''; }} className="hidden" />
                        </label>
                        <button
                            onClick={() => addShapeObject('ellipse')}
                            className="col-span-2 px-3 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                            <Combine size={13} /> Фігури
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Лівий сайдбар: список слайдів
    const renderSlideList = () => (
        <div className="space-y-2">
            {slides.map(slide => {
                const isActive = slide.id === selectedSlideId;
                const firstText = slide.objects.find(o => o.type === 'text');
                const snippet = firstText ? (firstText.lines || []).map(l => l.text).join(' ').slice(0, 40) : '(без тексту)';
                return (
                    <button
                        key={slide.id}
                        onClick={() => { setSelectedSlideId(slide.id); setSelectedObjectId(null); stopPreview(); }}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${isActive
                            ? 'bg-white border-[#16a34a] shadow-sm ring-1 ring-[#16a34a]/30'
                            : 'bg-white/60 border-[#F0EEE6] hover:border-[#16a34a]/40'}`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-bold ${isActive ? 'text-[#16a34a]' : 'text-slate-400'}`}>
                                СЛАЙД {slide.slideNumber}
                            </span>
                            <span className="flex items-center gap-1">
                                {slide.audioBase64
                                    ? <CheckCircle size={12} className="text-emerald-500" />
                                    : <span className="w-2 h-2 rounded-full bg-amber-400" title="Потребує озвучки" />}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-snug truncate">{snippet}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                            {slide.objects.length} об'єкт(ів) · {TRANSITIONS[slide.transition]?.label}
                        </p>
                    </button>
                );
            })}
        </div>
    );

    /* ========================================================================
     * ГОЛОВНИЙ РЕНДЕР
     * ====================================================================== */

    const vSlide = selectedSlide;
    const vTotalDuration = vSlide ? getSlideDuration(vSlide) : 0;

    const videoToolTabs = [
        ['motion', Sparkles, 'Анімація'],
        ['media', ImagePlus, 'Медіа'],
        ['text', Type, 'Текст'],
        ['shape', Combine, 'Фігури'],
        ['interactive', Zap, 'Інтерактив'],
        ['ai', Wand2, 'AI'],
    ];

    return (
        <div className="flex flex-col bg-[#f8f8f8] overflow-hidden text-[#3D3D3A]" style={{ height: '100vh', boxSizing: 'border-box', fontFamily: '"Onest", system-ui, -apple-system, sans-serif' }}>
            <div className="h-12 flex-shrink-0 bg-white border-b border-slate-200 flex items-center px-4 gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#7c3aed] text-white flex items-center justify-center"><Film size={15} /></div>
                <span className="text-sm font-bold text-[#3D3D3A]">AI Video Studio</span>
            </div>

            {slides.length === 0 ? (
                /* ===== ЕКРАН ЗАВАНТАЖЕННЯ PPTX ===== */
                <div className="flex-1 flex items-center justify-center p-8">
                    <div
                        className={`w-full max-w-xl bg-white rounded-3xl shadow-lg transition-all overflow-hidden relative ${isDragging ? 'border-2 border-[#7c3aed] bg-purple-50/30' : 'border border-slate-200'}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        {isProcessingPPTX && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-3xl">
                                <Loader2 size={48} className="text-[#7c3aed] animate-spin mb-4" />
                                <h3 className="text-xl font-bold">Розбираємо презентацію...</h3>
                                <p className="text-sm text-slate-500 mt-2">Витягуємо об'єкти слайдів, стилі та нотатки</p>
                            </div>
                        )}
                        {isDragging && !isProcessingPPTX && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center border-2 border-dashed border-[#7c3aed] rounded-3xl pointer-events-none">
                                <Presentation size={48} className="text-[#7c3aed] mb-4" />
                                <h3 className="text-xl font-bold text-[#7c3aed]">Відпустіть PPTX файл тут</h3>
                            </div>
                        )}
                        <div className="p-12 flex flex-col items-center text-center space-y-5">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#7c3aed] to-[#a855f7] text-white rounded-2xl flex items-center justify-center shadow-lg">
                                <MonitorPlay size={36} />
                            </div>
                            <h2 className="text-2xl font-bold">AI Video Studio</h2>
                            <p className="text-slate-500 max-w-md text-sm leading-relaxed">
                                Завантажте <strong>.pptx</strong> файл — ми розберемо слайди на об'єкти, AI складе сценарій та підбере анімації, а ви зможете редагувати, озвучити та експортувати відео.
                            </p>
                            {fileError && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2 w-full">
                                    <AlertCircle size={16} /> {fileError}
                                </div>
                            )}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <label className="cursor-pointer px-8 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2">
                                    <UploadCloud size={20} /> Вибрати файл .pptx
                                    <input type="file" accept=".pptx" onChange={handleFileUpload} className="hidden" />
                                </label>
                                <label className="cursor-pointer px-8 py-3 bg-white text-[#7c3aed] border-2 border-[#7c3aed] hover:bg-purple-50 rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2" title="Відкрити раніше збережене відео для подальшого редагування">
                                    <Film size={20} /> Редагувати відео
                                    <input type="file" accept="video/mp4,video/webm" onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            importVideoProject(e.target.files[0]);
                                            e.target.value = '';
                                        }
                                    }} className="hidden" />
                                </label>
                            </div>
                            <button
                                onClick={addBlankSlide}
                                className="text-sm font-semibold text-slate-400 hover:text-[#7c3aed] underline underline-offset-2 transition-colors"
                            >
                                або почати з порожнього слайду
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* ===== ОСНОВНИЙ РЕДАКТОР (Synthesia layout) ===== */
                <div className="flex-1 flex overflow-hidden">

                    {/* ── ЛІВА ПАНЕЛЬ: сцени ── */}
                    <div className="w-[154px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
                        <button
                            onClick={() => {
                                const fileIn = document.createElement('input');
                                fileIn.type = 'file'; fileIn.accept = '.pptx';
                                fileIn.onchange = (ev) => { reimportPPTXFile(ev.target.files[0]); ev.target.value = ''; };
                                fileIn.click();
                            }}
                            className="m-2 mb-1 px-3 py-2 text-xs font-semibold text-[#7c3aed] bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                            <UploadCloud size={13} /> Оновити PPTX
                        </button>
                        <button
                            onClick={() => {
                                const fileIn = document.createElement('input');
                                fileIn.type = 'file'; fileIn.accept = 'video/mp4,video/webm';
                                fileIn.onchange = (ev) => { importVideoProject(ev.target.files[0]); ev.target.value = ''; };
                                fileIn.click();
                            }}
                            className="mx-2 mb-2 px-3 py-2 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                            title="Відкрити раніше збережене відео для подальшого редагування"
                        >
                            <Film size={13} /> Імпорт з відео
                        </button>
                        <button
                            onClick={addBlankSlide}
                            className="mx-2 mb-2 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                            title="Додати порожній слайд"
                        >
                            <Plus size={13} /> Новий слайд
                        </button>
                        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1.5">
                            {slides.map((sl, idx) => {
                                const isActive = sl.id === selectedSlideId;
                                return (
                                    <div key={sl.id} className="relative group/slide">
                                        {idx > 0 && (
                                            <div className="flex items-center justify-center gap-1 py-0.5" title="Перехід від попереднього слайда">
                                                <Zap size={9} className="text-slate-300 flex-shrink-0" />
                                                <select
                                                    value={sl.transition || 'none'}
                                                    onChange={(e) => { dispatchVideo({ type: 'UPDATE_SLIDE', slideId: sl.id, updates: { transition: e.target.value } }); logChange('Перехід', `Слайд ${idx + 1}: перехід → ${TRANSITIONS[e.target.value]?.label || e.target.value}`); }}
                                                    className="text-[9px] text-slate-500 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 outline-none max-w-[108px] cursor-pointer hover:border-[#7c3aed]"
                                                >
                                                    {Object.entries(TRANSITIONS).map(([k, d]) => <option key={k} value={k}>{d.label.split('(')[0].trim()}</option>)}
                                                </select>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => { setSelectedSlideId(sl.id); setSelectedObjectId(null); setEditingObjectId(null); stopPreview(); }}
                                            className={`w-full rounded-lg overflow-hidden border-2 transition-all ${isActive
                                                ? 'border-[#7c3aed] shadow-md'
                                                : 'border-transparent hover:border-slate-300'}`}
                                        >
                                            <div
                                                className="w-full aspect-video relative"
                                                style={{
                                                    backgroundColor: sl.background || '#fff',
                                                    backgroundImage: sl.bgImage ? `url(${sl.bgImage})` : (sl.bgGradient ? cssGradient(sl.bgGradient) : undefined),
                                                    backgroundSize: '100% 100%'
                                                }}
                                            >
                                                <span className={`absolute top-1 left-1 text-[9px] font-bold px-1 rounded ${isActive ? 'bg-[#7c3aed] text-white' : 'bg-black/40 text-white'}`}>
                                                    {idx + 1}
                                                </span>
                                                {sl.audioBase64 && (
                                                    <CheckCircle size={10} className="absolute top-1 right-1 text-emerald-400 drop-shadow" />
                                                )}
                                                {sl.objects.map((o, oi) => (
                                                    <div key={o.id} className="absolute overflow-hidden" style={{
                                                        left: `${(o.x / CANVAS_W) * 100}%`,
                                                        top: `${(o.y / CANVAS_H) * 100}%`,
                                                        width: `${(o.w / CANVAS_W) * 100}%`,
                                                        height: `${(o.h / CANVAS_H) * 100}%`,
                                                        opacity: o.opacity != null ? o.opacity : 1,
                                                        zIndex: oi + 1
                                                    }}>
                                                        {o.type === 'image' && <img src={o.src} alt="" className="w-full h-full object-fill" draggable={false} />}
                                                        {o.type === 'video' && (o.poster
                                                            ? <img src={o.poster} alt="" className="w-full h-full object-fill" draggable={false} />
                                                            : <div className="w-full h-full bg-slate-800" />)}
                                                        {o.type === 'math' && (
                                                            <div className="w-full h-full overflow-hidden" style={{ fontSize: 3, color: '#111' }} dangerouslySetInnerHTML={{ __html: o.mathml || '' }} />
                                                        )}
                                                        {o.type === 'text' && (
                                                            <div className="w-full h-full overflow-hidden" style={{
                                                                backgroundColor: o.fillColor || 'transparent',
                                                                fontSize: 3, lineHeight: 1.1, color: o.lines?.[0]?.color || '#333'
                                                            }}>
                                                                {(o.lines || []).map(l => l.text).join(' ').slice(0, 60)}
                                                            </div>
                                                        )}
                                                        {o.type === 'shape' && (
                                                            <div className="w-full h-full" style={{
                                                                backgroundColor: o.fillColor || '#e2e8f0',
                                                                borderRadius: o.shapeKind === 'ellipse' ? '50%' : 0
                                                            }} />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </button>
                                        <div className="absolute bottom-1 right-1 flex items-center gap-1 opacity-0 group-hover/slide:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); duplicateSlide(sl.id); }}
                                                className="w-5 h-5 rounded bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
                                                title="Дублювати слайд"
                                            >
                                                <Copy size={10} />
                                            </button>
                                            {slides.length > 1 && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteSlide(sl.id); }}
                                                    className="w-5 h-5 rounded bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center"
                                                    title="Видалити слайд"
                                                >
                                                    <Trash2 size={10} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── ЦЕНТРАЛЬНА ОБЛАСТЬ ── */}
                    <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                        {/* Тулбар (Synthesia-стиль) */}
                        <div className="bg-white border-b border-slate-200 px-4 py-1.5 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                                {videoToolTabs.map(([key, Ic, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => setVideoToolTab(videoToolTab === key ? null : key)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${videoToolTab === key
                                            ? 'bg-[#7c3aed] text-white'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                                    >
                                        <Ic size={14} /> {label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5 mr-1 border-r border-slate-200 pr-2">
                                    <button onClick={() => dispatchVideo({ type: 'UNDO' })} disabled={!canUndo} className="p-1.5 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors" title="Undo (Ctrl+Z)">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
                                    </button>
                                    <button onClick={() => dispatchVideo({ type: 'REDO' })} disabled={!canRedo} className="p-1.5 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors" title="Redo (Ctrl+Y)">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" /></svg>
                                    </button>
                                </div>
                                <button
                                    onClick={isPreviewing ? stopPreview : startFullPreview}
                                    disabled={slides.length === 0}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${isPreviewing
                                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                >
                                    {isPreviewing ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                                    {isPreviewing ? 'Стоп' : "Прев'ю"}
                                </button>
                                <div className="relative">
                                    <button
                                        onClick={() => setExportMenuOpen(o => !o)}
                                        disabled={isExporting || isExportingAudio || slides.length === 0}
                                        className="px-4 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-slate-300 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                                    >
                                        {(isExporting || isExportingAudio) ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                        {isExporting ? `${exportProgress}%` : (isExportingAudio ? '...' : 'Завантажити')}
                                        {!isExporting && !isExportingAudio && <ChevronDown size={12} />}
                                    </button>
                                    {exportMenuOpen && !isExporting && !isExportingAudio && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setExportMenuOpen(false)} />
                                            <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                                                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-slate-50">Відео · 1920×1080 · H.264 · 30 fps · ~9 Мбіт/с</div>
                                                <button onClick={() => { setExportMenuOpen(false); handleExportVideo({ withAudio: true }); }} className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-violet-50 flex items-center gap-2"><Film size={14} className="text-[#7c3aed]" /> MP4 зі звуком</button>
                                                <button onClick={() => { setExportMenuOpen(false); handleExportVideo({ withAudio: false }); }} className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-violet-50 flex items-center gap-2"><Film size={14} className="text-slate-400" /> MP4 без звуку</button>
                                                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-slate-50 border-t border-slate-100">Лише аудіо (озвучка)</div>
                                                <button onClick={() => { setExportMenuOpen(false); handleExportAudio('mp3'); }} className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 flex items-center gap-2"><Mic size={14} className="text-emerald-500" /> Аудіо MP3</button>
                                                <button onClick={() => { setExportMenuOpen(false); handleExportAudio('wav'); }} className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 flex items-center gap-2"><Mic size={14} className="text-emerald-500" /> Аудіо WAV (без стиснення)</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Розкривна панель інструментів */}
                        {videoToolTab && (
                            <div className="bg-white border-b border-slate-200 px-4 py-3">
                                {videoToolTab === 'ai' && (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2 flex-wrap items-center">
                                            <button
                                                onClick={generateAllMissingSlidesAudio}
                                                disabled={isGeneratingAll}
                                                className="px-4 py-2 bg-gradient-to-r from-emerald-100 via-teal-100 to-emerald-100 text-emerald-700 hover:from-emerald-200 hover:to-teal-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-60 border border-emerald-200 shadow-sm"
                                            >
                                                {isGeneratingAll ? <Loader2 size={14} className="animate-spin" /> : <Mic size={14} />}
                                                Озвучити все
                                            </button>
                                            <button
                                                onClick={handleAutoAnimations}
                                                disabled={isAutoAnimating || slides.length === 0}
                                                title="Застосувати анімації появи до всіх об'єктів усіх слайдів (порожній стиль = фейд)"
                                                className="px-4 py-2 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-60 border border-purple-200 shadow-sm"
                                            >
                                                {isAutoAnimating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                                Анімувати все
                                            </button>
                                            <button
                                                onClick={syncAllAnimationsToAudio}
                                                disabled={slides.every(s => !s.audioDuration)}
                                                title="Рівномірно розподілити появу об'єктів під аудіо на всіх слайдах"
                                                className="px-4 py-2 bg-gradient-to-r from-sky-100 via-indigo-100 to-sky-100 text-sky-700 hover:from-sky-200 hover:to-indigo-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-60 border border-sky-200 shadow-sm"
                                            >
                                                <Zap size={14} /> Синхронізувати все з аудіо
                                            </button>
                                        </div>
                                        {/* Зворотна конвертація: відкрити експортований MP4 назад у редактор */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <button
                                                onClick={() => { const fi = document.createElement('input'); fi.type = 'file'; fi.accept = '.mp4,.webm,video/mp4,video/webm'; fi.onchange = (ev) => { importVideoProject(ev.target.files[0]); ev.target.value = ''; }; fi.click(); }}
                                                disabled={isProcessingPPTX}
                                                className="px-4 py-2 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 text-amber-800 hover:from-amber-200 hover:to-orange-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-60 border border-amber-200 shadow-sm"
                                            >
                                                {isProcessingPPTX ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                                                Відкрити MP4 для редагування
                                            </button>
                                            <span className="text-[10px] text-slate-400">Зворотна конвертація: відкриває раніше експортоване відео назад у редактор</span>
                                        </div>
                                    </div>
                                )}
                                {videoToolTab === 'motion' && (
                                    <div className="flex flex-col gap-3" style={{ maxWidth: '100%' }}>
                                        <div className="flex gap-3 items-start">
                                            <div className="flex-shrink-0">
                                                <canvas ref={transitionPreviewRef} width={CANVAS_W} height={CANVAS_H}
                                                    className="rounded border border-slate-200 bg-slate-50 shadow-sm"
                                                    style={{ width: 128, height: 72 }} />
                                            </div>
                                            <div className="flex flex-col gap-1.5 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold text-slate-500">Перехід сцени:</span>
                                                    {vSlide && <span className="text-[10px] text-[#7c3aed] font-semibold">{TRANSITIONS[vSlide.transition]?.label || '—'}</span>}
                                                </div>
                                                <div className="flex gap-1 flex-wrap">
                                                    <button onClick={handleSetAllTransitions} className="px-2 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded text-[10px] font-semibold transition-colors whitespace-nowrap">Усім слайдам</button>
                                                    <button onClick={() => vSlide && syncAnimationsToAudio(vSlide.id)} disabled={!vSlide?.audioDuration} className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 rounded text-[10px] font-semibold transition-colors whitespace-nowrap flex items-center gap-1"><Zap size={10} /> Синхр. з аудіо</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', maxHeight: 130, overflowY: 'auto' }}>
                                            {Object.entries(TRANSITIONS).map(([key, def]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => { setBulkTransition(key); if (vSlide) { dispatchVideo({ type: 'UPDATE_SLIDE', slideId: vSlide.id, updates: { transition: key } }); logChange('Перехід', `Слайд ${vSlide.slideNumber}: → ${def.label}`); } }}
                                                    onMouseEnter={() => playTransitionPreview(key)}
                                                    onMouseLeave={stopTransitionPreview}
                                                    className={`px-1.5 py-1 rounded text-[9px] font-semibold transition-all truncate text-left ${vSlide?.transition === key ? 'bg-[#7c3aed] text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-purple-700'}`}
                                                    title={def.label}
                                                >
                                                    {def.label.split('(')[0].trim()}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="border-t border-slate-100 pt-2 flex gap-2">
                                            <input type="text" value={animPrompt} onChange={(e) => setAnimPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAutoAnimations()} placeholder="Стиль анімацій (порожнє = фейд усюди)" className="flex-grow px-3 py-1.5 rounded-lg border border-slate-200 focus:border-[#7c3aed] outline-none text-xs transition-all" />
                                            <button onClick={handleAutoAnimations} disabled={isAutoAnimating} className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap">
                                                {isAutoAnimating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                                {animPrompt.trim() ? 'Згенерувати' : 'Фейд усюди'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {videoToolTab === 'media' && vSlide && (
                                    <div className="flex gap-2">
                                        <label className="cursor-pointer px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
                                            <ImagePlus size={14} /> Додати зображення
                                            <input type="file" accept="image/*" onChange={(e) => { addImageObject(e.target.files[0]); e.target.value = ''; }} className="hidden" />
                                        </label>
                                        <label className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
                                            <Film size={14} /> Додати відео
                                            <input type="file" accept="video/*" onChange={(e) => { addVideoObject(e.target.files[0]); e.target.value = ''; }} className="hidden" />
                                        </label>
                                        <label className="cursor-pointer px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
                                            <Music size={14} /> Додати аудіо
                                            <input type="file" accept="audio/*" onChange={(e) => { addAudioObject(e.target.files[0]); e.target.value = ''; }} className="hidden" />
                                        </label>
                                    </div>
                                )}
                                {videoToolTab === 'text' && vSlide && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={addTextObject}
                                            className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                                        >
                                            <Type size={14} /> Додати текст
                                        </button>
                                    </div>
                                )}
                                {videoToolTab === 'shape' && vSlide && (
                                    <div className="flex flex-col gap-2 max-w-3xl">
                                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">Геометричні фігури та стрілки</span>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                ['ellipse', 'Коло'],
                                                ['rect', 'Прямокутник'],
                                                ['triangle', 'Трикутник'],
                                                ['cross', 'Хрестик'],
                                                ['check', 'Галочка'],
                                                ['rightArrow', 'Стрілка (Вправо)'],
                                                ['leftRightArrow', 'Двостороння стрілка'],
                                            ].map(([k, lbl]) => (
                                                <button key={k} onClick={() => addShapeObject(k)}
                                                    className="px-3 py-1.5 bg-purple-50 border border-purple-100 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-semibold transition-colors">
                                                    {lbl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {videoToolTab === 'interactive' && vSlide && (
                                    <div className="flex flex-col gap-2 max-w-3xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1"><Zap size={12} /> Інтерактиви (H5P-набір) — оберіть тип, щоб накласти на слайд</span>
                                            <button onClick={() => setInteractiveMode(m => !m)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${interactiveMode ? 'bg-[#7c3aed] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                                {interactiveMode ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                                                {interactiveMode ? 'Режим гри: УВІМК' : 'Грати (тест)'}
                                            </button>
                                        </div>
                                        <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
                                            {H5P_TYPES.map(([key, label, icon]) => (
                                                <button key={key} onClick={() => addInteractive(key)}
                                                    className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:border-[#7c3aed] hover:bg-violet-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors text-left">
                                                    <span className="w-6 h-6 rounded-md bg-violet-100 text-[#7c3aed] flex items-center justify-center flex-shrink-0">{icon}</span>
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-[11px] text-slate-400">«Грати» — клікай інтерактиви як учень; вимкни, щоб редагувати/рухати. У відео вони показуються статично.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Канвас слайду */}
                        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden bg-[#e8e8ec]">
                            {vSlide ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <div
                                        ref={workspaceRef}
                                        className="relative rounded-md shadow-2xl overflow-hidden"
                                        style={{
                                            width: '100%',
                                            maxWidth: '960px',
                                            aspectRatio: '16 / 9',
                                            backgroundColor: vSlide.background || '#FFFFFF',
                                            backgroundImage: vSlide.bgImage ? `url(${vSlide.bgImage})` : (vSlide.bgGradient ? cssGradient(vSlide.bgGradient) : undefined),
                                            backgroundSize: '100% 100%'
                                        }}
                                    >
                                        {vSlide.objects.map((obj, idx) => {
                                            const isObjSelected = obj.id === selectedObjectId;
                                            const isMultiSelected = multiSelectedIds.includes(obj.id);
                                            const isEditing = obj.id === editingObjectId && obj.type === 'text';
                                            const firstLine = obj.lines?.[0] || {};
                                            return (
                                                <div
                                                    key={obj.id}
                                                    onMouseDown={(e) => {
                                                        if (isEditing) { e.stopPropagation(); return; }
                                                        if (interactiveMode) return; // режим «гра»: клік іде у віджет
                                                        e.stopPropagation();
                                                        if (e.shiftKey) {
                                                            setMultiSelectedIds(prev => {
                                                                const has = prev.includes(obj.id);
                                                                let next = has ? prev.filter(id => id !== obj.id) : [...prev, obj.id];
                                                                if (selectedObjectId && !next.includes(selectedObjectId)) next = [selectedObjectId, ...next];
                                                                return next;
                                                            });
                                                            setSelectedObjectId(null);
                                                            return;
                                                        }
                                                        startObjectDrag(e, vSlide.id, obj, 'move');
                                                    }}
                                                    onDoubleClick={(e) => {
                                                        if (obj.type === 'text') { e.stopPropagation(); setSelectedObjectId(obj.id); setEditingObjectId(obj.id); setMultiSelectedIds([]); }
                                                    }}
                                                    className={`absolute ${isEditing ? 'cursor-text' : 'cursor-move'} ${isObjSelected ? 'ring-2 ring-[#7c3aed]' : isMultiSelected ? 'ring-2 ring-[#7c3aed]/60' : 'hover:ring-1 hover:ring-[#7c3aed]/40'}`}
                                                    style={{
                                                        left: obj.x * editorScale,
                                                        top: obj.y * editorScale,
                                                        width: obj.w * editorScale,
                                                        height: obj.h * editorScale,
                                                        zIndex: isEditing ? 999 : idx + 1,
                                                        opacity: obj.opacity != null ? obj.opacity : 1,
                                                        transform: obj.rot ? `rotate(${obj.rot}deg)` : undefined,
                                                        ...(isMultiSelected && !isObjSelected ? { outline: '2px dashed rgba(124,58,237,0.5)', outlineOffset: '-1px' } : {})
                                                    }}
                                                >
                                                    {isEditing ? (
                                                        <textarea
                                                            autoFocus
                                                            defaultValue={(obj.lines || []).map(l => l.text).join('\n')}
                                                            onMouseDown={(e) => e.stopPropagation()}
                                                            onBlur={(e) => {
                                                                const base = obj.lines?.[0] || { color: '#1e293b', fontSize: 24, bold: false, align: 'l' };
                                                                const newLines = e.target.value.split('\n').map((t, i) => ({
                                                                    ...(obj.lines?.[i] || base), text: t, runs: undefined, bullet: undefined
                                                                }));
                                                                dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: obj.id, updates: { lines: newLines } });
                                                                setEditingObjectId(null);
                                                            }}
                                                            onKeyDown={(e) => { if (e.key === 'Escape') { e.target.blur(); } }}
                                                            className="w-full h-full resize-none outline-none border-0 bg-white/90 p-1"
                                                            style={{
                                                                fontSize: Math.max((firstLine.fontSize || 24) * editorScale, 8),
                                                                color: firstLine.color || '#1e293b',
                                                                fontWeight: firstLine.bold ? 700 : 400,
                                                                textAlign: firstLine.align === 'ctr' ? 'center' : (firstLine.align === 'r' ? 'right' : 'left'),
                                                                lineHeight: 1.25
                                                            }}
                                                        />
                                                    ) : (
                                                        renderObjectDom(obj, editorScale)
                                                    )}
                                                    {isObjSelected && !isEditing && (
                                                        <>
                                                            {obj.type === 'text' && (
                                                                <div className="absolute -top-5 right-0 px-1.5 py-0.5 bg-[#7c3aed]/80 text-white text-[8px] font-semibold rounded whitespace-nowrap pointer-events-none">
                                                                    2× клік — редагувати
                                                                </div>
                                                            )}
                                                            {/* Інлайн-пікер анімації появи — обираєш ефект прямо на об'єкті */}
                                                            <div
                                                                onMouseDown={(e) => e.stopPropagation()}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className={`absolute ${obj.y * editorScale < 38 ? 'top-full mt-1' : '-top-9'} left-0 flex items-center gap-1 bg-white border border-[#7c3aed]/30 rounded-lg shadow-md px-1 py-0.5 z-[1000]`}
                                                                style={{ transform: obj.rot ? `rotate(${-obj.rot}deg)` : undefined, transformOrigin: 'top left' }}
                                                            >
                                                                <Sparkles size={11} className="text-[#7c3aed] flex-shrink-0" />
                                                                <select
                                                                    value={obj.animation?.type || 'none'}
                                                                    onChange={(e) => { dispatchVideo({ type: 'UPDATE_OBJECT_ANIMATION', slideId: vSlide.id, objectId: obj.id, updates: { type: e.target.value } }); logChange('Анімація', `Анімація об'єкта → ${ANIMATIONS[e.target.value]?.label || e.target.value}`, { slideId: vSlide.id, objectId: obj.id }); }}
                                                                    className="text-[10px] font-semibold text-slate-700 bg-transparent outline-none cursor-pointer max-w-[120px]"
                                                                >
                                                                    {ANIMATION_OPTION_GROUPS.map(g => (
                                                                        <optgroup key={g.label} label={g.label}>
                                                                            {g.items.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                                                                        </optgroup>
                                                                    ))}
                                                                </select>
                                                                {obj.animation?.type && obj.animation.type !== 'none' && (
                                                                    <>
                                                                        <span className="text-[9px] text-slate-400 font-semibold whitespace-nowrap">{obj.animation.delay || 0}с</span>
                                                                        <button
                                                                            onClick={() => previewObjectAnimation(obj.id)}
                                                                            disabled={isPreviewing}
                                                                            className="flex-shrink-0 text-[#7c3aed] hover:bg-purple-50 disabled:opacity-40 rounded p-0.5"
                                                                            title="Прев'ю анімації"
                                                                        >
                                                                            <Eye size={11} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => { dispatchVideo({ type: 'UPDATE_OBJECT_ANIMATION', slideId: vSlide.id, objectId: obj.id, updates: { type: 'none' } }); logChange('Анімація', 'Видалено анімацію об\'єкта', { slideId: vSlide.id, objectId: obj.id }); }}
                                                                            className="flex-shrink-0 text-red-500 hover:bg-red-50 rounded p-0.5"
                                                                            title="Видалити анімацію"
                                                                        >
                                                                            <Trash2 size={11} />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <div
                                                                onMouseDown={(e) => { e.stopPropagation(); startObjectDrag(e, vSlide.id, obj, 'resize'); }}
                                                                className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#7c3aed] border-2 border-white rounded-full cursor-se-resize shadow"
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {vSlide.objects.length === 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm font-semibold pointer-events-none">
                                                Порожній слайд
                                            </div>
                                        )}
                                        {isPreviewing && (
                                            <canvas ref={previewCanvasRef} width={CANVAS_W} height={CANVAS_H} className="absolute inset-0 w-full h-full z-40" />
                                        )}
                                        {snapGuides.length > 0 && snapGuides.map((g, i) => (
                                            g.type === 'v'
                                                ? <div key={i} className="absolute top-0 bottom-0 pointer-events-none z-50" style={{ left: `${(g.pos / CANVAS_W) * 100}%`, width: 1, backgroundColor: '#7c3aed', opacity: 0.6 }} />
                                                : <div key={i} className="absolute left-0 right-0 pointer-events-none z-50" style={{ top: `${(g.pos / CANVAS_H) * 100}%`, height: 1, backgroundColor: '#7c3aed', opacity: 0.6 }} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-slate-400">
                                    <Presentation size={48} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm font-semibold">Оберіть сцену зліва</p>
                                </div>
                            )}
                        </div>

                        {/* Таймлайн (мінімалістичний, як у Synthesia) */}
                        {vSlide && (
                            <div className="bg-white border-t border-slate-200">
                                <div className="px-4 py-2 flex items-center gap-3">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); isPreviewing ? stopPreview() : startPreview(); }}
                                        disabled={!vSlide}
                                        className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                    >
                                        {isPreviewing ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
                                    </button>
                                    <span className="text-[10px] font-mono text-slate-400 w-12 flex-shrink-0">
                                        {scrubTime !== null ? formatTime(scrubTime) : '00:00'}
                                    </span>

                                    {/* Панель зуму */}
                                    <div className="flex items-center gap-1.5 ml-2 mr-2">
                                        <ZoomOut size={14} className="text-slate-400 cursor-pointer hover:text-[#7c3aed]" onClick={() => setTimelineZoom(z => Math.max(1, z - 0.5))} />
                                        <input
                                            type="range" min="1" max="10" step="0.5"
                                            value={timelineZoom}
                                            onChange={e => setTimelineZoom(parseFloat(e.target.value))}
                                            className="w-16 h-1 accent-[#7c3aed] cursor-pointer"
                                            title="Масштаб таймлайну"
                                        />
                                        <ZoomIn size={14} className="text-slate-400 cursor-pointer hover:text-[#7c3aed]" onClick={() => setTimelineZoom(z => Math.min(10, z + 0.5))} />
                                    </div>

                                    <div
                                        className="flex-grow overflow-x-auto overflow-y-hidden"
                                        ref={timelineRef}
                                    >
                                        <div
                                            className="tl-track h-16 relative bg-slate-50 rounded-lg overflow-hidden border border-slate-100 cursor-pointer"
                                            style={{ width: `${timelineZoom * 100}%`, minWidth: '100%' }}
                                            onClick={e => {
                                                const bar = e.currentTarget;
                                                const rect = bar.getBoundingClientRect();
                                                const x = Math.max(0, e.clientX - rect.left);
                                                const pct = Math.min(x / rect.width, 1);
                                                setScrubTime(parseFloat((pct * vTotalDuration).toFixed(2)));
                                            }}
                                        >
                                            {/* Межа між доріжкою озвучки та доріжкою об'єктів */}
                                            <div className="absolute left-0 right-0 top-7 border-t border-slate-200/80 pointer-events-none" />

                                            {/* Доріжка озвучки (голос) — окрема виразна смуга з псевдо-хвилею */}
                                            <div className="absolute top-1 left-0 right-0 h-5 pointer-events-none">
                                                {vSlide.audioBase64 && vSlide.audioDuration > 0 ? (
                                                    <div
                                                        className="absolute top-0 h-full rounded-md bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-sm flex items-center gap-1 px-1.5 overflow-hidden pointer-events-auto"
                                                        style={{ left: 0, width: `${Math.min((vSlide.audioDuration / vTotalDuration) * 100, 100)}%`, minWidth: 22 }}
                                                        title={`Озвучка слайду: ${vSlide.audioDuration.toFixed(1)}с`}
                                                    >
                                                        <Mic size={9} className="text-white/90 flex-shrink-0" />
                                                        <div className="flex items-center gap-[2px] h-full flex-grow overflow-hidden py-[3px]">
                                                            {Array.from({ length: 48 }, (_, wi) => {
                                                                const seed = (vSlide.id ? vSlide.id.length * 7 : 3) + wi;
                                                                const hgt = 20 + Math.abs(Math.sin(seed * 12.9898) * Math.cos(seed * 3.51)) * 80;
                                                                return <div key={wi} className="w-[2px] bg-white/55 rounded-full flex-shrink-0" style={{ height: `${hgt}%` }} />;
                                                            })}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="absolute top-0 left-0 h-full flex items-center gap-1 px-1.5 rounded-md border border-dashed border-slate-200 text-slate-300 pointer-events-none">
                                                        <Mic size={9} />
                                                        <span className="text-[8px] font-semibold whitespace-nowrap">Без озвучки</span>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Блоки анімацій та МЕДІА */}
                                            {vSlide.objects.map(obj => {
                                                const isVideo = obj.type === 'video';
                                                const isAudio = obj.type === 'audio';
                                                const isMedia = isVideo || isAudio;
                                                const a = obj.animation || { type: 'none', delay: 0, duration: 0.5 };
                                                if (a.type === 'none' && !isMedia) return null;

                                                let delay = a.delay || 0;
                                                let duration = a.duration || 0.5;

                                                let mDur = 5;
                                                if (isMedia) {
                                                    const mEl = videoCache.get(obj.src);
                                                    if (mEl && mEl.duration) mDur = mEl.duration;
                                                    const ts = obj.trimStart || 0;
                                                    const te = obj.trimEnd != null ? obj.trimEnd : mDur;
                                                    duration = Math.max(0.2, te - ts);
                                                }

                                                const clr = isVideo ? '#ef4444' : isAudio ? '#fb7185' : obj.type === 'text' ? '#818cf8' : obj.type === 'image' ? '#34d399' : obj.type === 'table' ? '#38bdf8' : '#fbbf24';
                                                const sel = obj.id === selectedObjectId;

                                                return (
                                                    <div
                                                        key={obj.id}
                                                        className="absolute bottom-0.5 h-3.5 rounded-full group/tlb"
                                                        onMouseDown={(e) => { e.stopPropagation(); startTimelineDrag(e, vSlide.id, obj, vTotalDuration, 'move'); }}
                                                        style={{
                                                            left: `${Math.min((delay / vTotalDuration) * 100, 98)}%`,
                                                            width: `${Math.max((duration / vTotalDuration) * 100, 3)}%`,
                                                            minWidth: 10,
                                                            backgroundColor: clr,
                                                            opacity: sel ? 1 : 0.55,
                                                            cursor: 'grab',
                                                            outline: sel ? '2px solid #7c3aed' : 'none',
                                                            outlineOffset: 1,
                                                            zIndex: sel ? 7 : 6
                                                        }}
                                                        title={isMedia ? `${getObjectLabel(obj)} · Затримка: ${delay}с · Обрізка: ${(obj.trimStart || 0).toFixed(1)}с – ${(obj.trimEnd || mDur).toFixed(1)}с` : `${getObjectLabel(obj)}: ${ANIMATIONS[a.type]?.label} · ${delay}с–${(delay + duration).toFixed(1)}с`}
                                                    >
                                                        {isMedia && (
                                                            <div
                                                                onMouseDown={(e) => { e.stopPropagation(); startTimelineDrag(e, vSlide.id, obj, vTotalDuration, 'trim-start'); }}
                                                                className="absolute top-0 left-0 h-full w-2 rounded-l-full bg-black/40 cursor-ew-resize opacity-0 group-hover/tlb:opacity-100"
                                                                title="Обрізати початок"
                                                            />
                                                        )}
                                                        <div
                                                            onMouseDown={(e) => { e.stopPropagation(); startTimelineDrag(e, vSlide.id, obj, vTotalDuration, isMedia ? 'trim-end' : 'resize'); }}
                                                            className="absolute top-0 right-0 h-full w-2 rounded-r-full bg-black/40 cursor-ew-resize opacity-0 group-hover/tlb:opacity-100"
                                                            title={isMedia ? "Обрізати кінець" : "Розтягнути тривалість анімації"}
                                                        />
                                                        {sel && (
                                                            <button
                                                                onMouseDown={(e) => e.stopPropagation()}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (isMedia && a.type === 'none') {
                                                                        dispatchVideo({ type: 'DELETE_OBJECTS', slideId: vSlide.id, objectIds: [obj.id] });
                                                                    } else {
                                                                        dispatchVideo({ type: 'UPDATE_OBJECT_ANIMATION', slideId: vSlide.id, objectId: obj.id, updates: { type: 'none' } });
                                                                        logChange('Анімація', 'Видалено анімацію об\'єкта', { slideId: vSlide.id, objectId: obj.id });
                                                                    }
                                                                }}
                                                                className="absolute -top-4 -right-1 w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow z-10"
                                                                title={isMedia && a.type === 'none' ? 'Видалити медіа' : 'Видалити цю анімацію'}
                                                            >
                                                                <Trash2 size={9} />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {/* Лінійка секунд */}
                                            {Array.from({ length: Math.ceil(vTotalDuration) + 1 }, (_, s) => (
                                                <div key={s} className="absolute top-0 h-full border-l border-slate-100" style={{ left: `${(s / vTotalDuration) * 100}%` }}>
                                                    <span className="absolute left-0.5 top-[26px] text-[8px] text-slate-300 leading-none">{formatTime(s)}</span>
                                                </div>
                                            ))}
                                            {/* Скраббер */}
                                            {scrubTime !== null && (
                                                <div className="absolute top-0 bottom-0 w-0.5 bg-[#7c3aed] z-10 pointer-events-none" style={{ left: `${Math.min((scrubTime / vTotalDuration) * 100, 99.5)}%` }}>
                                                    <div className="absolute -top-0.5 -left-1.5 w-3.5 h-3.5 bg-[#7c3aed] rounded-sm rotate-45 shadow" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400 w-12 flex-shrink-0 text-right">
                                        {formatTime(vTotalDuration)}
                                    </span>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        {selectedObject && selectedObject.animation && selectedObject.animation.type !== 'none' ? (
                                            <>
                                                <select
                                                    value={selectedObject.animation.type}
                                                    onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT_ANIMATION', slideId: vSlide.id, objectId: selectedObject.id, updates: { type: e.target.value } })}
                                                    title="Замінити анімацію виділеного об'єкта"
                                                    className="text-[10px] font-semibold text-slate-600 border border-slate-200 rounded px-1 py-0.5 outline-none max-w-[130px] bg-white"
                                                >
                                                    {ANIMATION_OPTION_GROUPS.map(g => (
                                                        <optgroup key={g.label} label={g.label}>
                                                            {g.items.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                                        </optgroup>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => { dispatchVideo({ type: 'UPDATE_OBJECT_ANIMATION', slideId: vSlide.id, objectId: selectedObject.id, updates: { type: 'none' } }); logChange('Анімація', 'Видалено анімацію об\'єкта', { slideId: vSlide.id, objectId: selectedObject.id }); }}
                                                    title="Видалити анімацію цього об'єкта"
                                                    className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-[10px] text-slate-400 font-semibold">{vSlide.objects.length} об'єкт.</span>
                                        )}
                                    </div>
                                </div>

                            </div>
                        )}



                        {/* Зона сценарію (скрипт) — як у Synthesia */}
                        {vSlide && (
                            <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-start gap-3">
                                {/* Голосовий профіль */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${vSlide.audioBase64 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <Mic size={18} />
                                    </div>
                                    <select
                                        value={videoVoice.voice}
                                        onChange={(e) => updateVideoVoiceProfile({ voice: e.target.value })}
                                        className="w-24 text-[9px] font-semibold text-center border border-slate-200 rounded px-0.5 py-0.5 outline-none focus:border-[#7c3aed] bg-white truncate"
                                    >
                                        {renderVoiceOptions()}
                                    </select>
                                    {videoDialog && <span className="text-[8px] font-bold text-indigo-500">Диктор 1</span>}
                                </div>
                                {/* Текст сценарію */}
                                <div className="flex-grow min-w-0">
                                    <textarea
                                        ref={scriptRef}
                                        value={vSlide.text}
                                        onChange={(e) => dispatchVideo({
                                            type: 'UPDATE_SLIDE', slideId: vSlide.id,
                                            updates: { text: e.target.value, audioBase64: null, audioDuration: 0 }
                                        })}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        onCopy={(e) => e.stopPropagation()}
                                        placeholder="Введіть текст сценарію для цієї сцени. Без озвучки — додайте паузу ([ПАУЗА:N] секунд):"
                                        className="w-full min-h-[60px] max-h-[120px] p-2.5 text-sm leading-relaxed border border-slate-200 rounded-lg outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 resize-y bg-[#fafafa] placeholder:text-slate-300 font-mono"
                                    />
                                    {/* Два диктори: познач у тексті [1]/[2], хто що читає */}
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                        <div className="flex items-center gap-1 rounded bg-amber-50 border border-amber-100 pl-0.5 pr-1.5 py-0.5">
                                            <button onClick={insertPauseTag} className="px-1.5 py-0.5 rounded text-amber-700 text-[10px] font-bold hover:bg-amber-100" title={`Додати тишу (${pauseSeconds} с) у текст`}>[ПАУЗА]</button>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0.1"
                                                value={pauseSeconds}
                                                onChange={(e) => setPauseSeconds(parseFloat(e.target.value) || 1)}
                                                title="Тривалість паузи в секундах"
                                                className="w-9 text-[10px] font-bold text-amber-700 text-center outline-none bg-white/70 rounded border border-amber-200 py-0.5"
                                            />
                                            <span className="text-[9px] text-amber-600 font-semibold">с</span>
                                        </div>
                                        <label className="flex items-center gap-1 text-[10px] font-bold text-slate-600 cursor-pointer ml-2">
                                            <input type="checkbox" checked={videoDialog} onChange={(e) => setVideoDialog(e.target.checked)} className="accent-[#7c3aed]" />
                                            🎭 Два диктори
                                        </label>
                                        {videoDialog && (
                                            <>
                                                <button onClick={() => insertSpeakerTag(1)} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold hover:bg-indigo-100" title="Вставити мітку: далі читає Диктор 1">[1] Диктор 1</button>
                                                <button onClick={() => insertSpeakerTag(2)} className="px-2 py-0.5 rounded bg-pink-50 text-pink-700 text-[10px] font-bold hover:bg-pink-100" title="Вставити мітку: далі читає Диктор 2">[2] Диктор 2</button>
                                                <span className="text-[9px] text-slate-400 font-semibold ml-1">Голос 2:</span>
                                                <select value={videoVoice2.voice} onChange={(e) => updateVideoVoice2({ voice: e.target.value })} className="text-[9px] border border-slate-200 rounded px-1 py-0.5 outline-none bg-white max-w-[110px] truncate">
                                                    {renderVoiceOptions()}
                                                </select>
                                                <select value={videoVoice2.rate} onChange={(e) => updateVideoVoice2({ rate: e.target.value })} className="text-[9px] border border-slate-200 rounded px-1 py-0.5 outline-none bg-white">
                                                    <option value="slow">Повільно</option><option value="normal">Нормально</option><option value="fast">Швидко</option>
                                                </select>
                                                <select value={videoVoice2.style} onChange={(e) => updateVideoVoice2({ style: e.target.value })} className="text-[9px] border border-slate-200 rounded px-1 py-0.5 outline-none bg-white">
                                                    <option value="neutral">Нейтральний</option><option value="cheerful">Радісний</option><option value="serious">Серйозний</option><option value="calm">Спокійний</option><option value="dramatic">Драматичний</option><option value="storytelling">Розповідний</option>
                                                </select>
                                                <div className="flex items-center gap-1 border border-slate-200 rounded px-1 py-0.5 bg-white">
                                                    <span className="text-[9px] text-slate-400" title="Затримка перед початком читання">Затримка:</span>
                                                    <input type="number" step="0.1" min="0" value={videoVoice2.delay || 0} onChange={(e) => updateVideoVoice2({ delay: parseFloat(e.target.value) || 0 })} className="w-8 text-[9px] outline-none text-center bg-transparent" />
                                                    <span className="text-[8px] text-slate-400">с</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <div className="flex items-center gap-1">
                                            <select
                                                value={videoVoice.rate}
                                                onChange={(e) => updateVideoVoiceProfile({ rate: e.target.value })}
                                                className="text-[10px] border border-slate-200 rounded px-1.5 py-0.5 outline-none focus:border-[#7c3aed] bg-white"
                                            >
                                                <option value="slow">Повільно</option>
                                                <option value="normal">Нормально</option>
                                                <option value="fast">Швидко</option>
                                            </select>
                                            <select
                                                value={videoVoice.style}
                                                onChange={(e) => updateVideoVoiceProfile({ style: e.target.value })}
                                                className="text-[10px] border border-slate-200 rounded px-1.5 py-0.5 outline-none focus:border-[#7c3aed] bg-white"
                                            >
                                                <option value="neutral">Нейтральний</option>
                                                <option value="cheerful">Радісний</option>
                                                <option value="serious">Серйозний</option>
                                                <option value="calm">Спокійний</option>
                                                <option value="dramatic">Драматичний</option>
                                                <option value="storytelling">Розповідний</option>
                                            </select>
                                            <div className="flex items-center gap-1 border border-slate-200 rounded px-1 py-0.5 bg-white focus-within:border-[#7c3aed]">
                                                <span className="text-[10px] text-slate-400" title="Затримка перед початком читання">Затримка:</span>
                                                <input type="number" step="0.1" min="0" value={videoVoice.delay || 0} onChange={(e) => updateVideoVoiceProfile({ delay: parseFloat(e.target.value) || 0 })} className="w-8 text-[10px] outline-none text-center bg-transparent" />
                                                <span className="text-[9px] text-slate-400">с</span>
                                            </div>
                                            <button
                                                onClick={() => setVideoVoice(prev => ({ ...prev, locked: !prev.locked }))}
                                                title={videoVoice.locked ? 'Голос зафіксовано' : 'Голос не зафіксовано'}
                                                className={`p-1 rounded transition-colors ${videoVoice.locked ? 'text-[#7c3aed]' : 'text-slate-300'}`}
                                            >
                                                {videoVoice.locked ? <Lock size={12} /> : <Unlock size={12} />}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-1.5 ml-auto">
                                            {vSlide.audioBase64 && (
                                                <button
                                                    onClick={() => toggleSlidePlayback(vSlide.id, vSlide.audioBase64, vSlide.sampleRate)}
                                                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${playingSlideId === vSlide.id
                                                        ? 'bg-amber-100 text-amber-600'
                                                        : 'bg-slate-100 text-slate-500 hover:text-[#7c3aed]'}`}
                                                >
                                                    {playingSlideId === vSlide.id ? <Square size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" className="ml-0.5" />}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => generateSlideAudio(vSlide.id)}
                                                disabled={vSlide.isGenerating || !vSlide.text.trim()}
                                                className="px-3 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-40 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
                                            >
                                                {vSlide.isGenerating ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
                                                Озвучити
                                            </button>
                                            {vSlide.audioBase64 && (
                                                <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5">
                                                    <CheckCircle size={10} /> {vSlide.audioDuration.toFixed(1)}с
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Прогрес-бар експорту */}
                        {isExporting && (
                            <div className="bg-white border-t border-slate-200 px-4 py-2">
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#7c3aed] transition-all duration-300 rounded-full" style={{ width: `${exportProgress}%` }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── ПРАВА ПАНЕЛЬ: властивості сцени ── */}
                    <div className="w-[280px] flex-shrink-0 bg-white border-l border-slate-200 overflow-y-auto">
                        {vSlide ? (
                            <div className="divide-y divide-slate-100">
                                {/* Заголовок */}
                                <div className="px-4 py-3 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700">
                                        {selectedObject ? getObjectLabel(selectedObject) : `Сцена ${vSlide.slideNumber}`}
                                    </span>
                                    <div className="flex gap-1">
                                        {selectedObject && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        const newId = 'obj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
                                                        dispatchVideo({ type: 'DUPLICATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, newId });
                                                        setSelectedObjectId(newId);
                                                    }}
                                                    className="p-1 text-slate-400 hover:text-[#7c3aed] rounded transition-colors"
                                                    title="Дублювати (Ctrl+D)"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        dispatchVideo({ type: 'DELETE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id });
                                                        setSelectedObjectId(null);
                                                    }}
                                                    className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                                                    title="Видалити (Del)"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => {
                                                stopPreview();
                                                dispatchVideo({ type: 'RESET' });
                                                setSelectedSlideId(null); setSelectedObjectId(null);
                                            }}
                                            className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                                            title="Закрити проект"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {selectedObject ? (
                                    <>
                                        {/* Позиція та розмір */}
                                        <div className="px-4 py-3">
                                            <div className="grid grid-cols-4 gap-1.5">
                                                {[['X', 'x'], ['Y', 'y'], ['W', 'w'], ['H', 'h']].map(([label, key]) => (
                                                    <label key={key} className="flex flex-col gap-0.5">
                                                        <span className="text-[9px] font-bold text-slate-400">{label}</span>
                                                        <input
                                                            type="number"
                                                            value={Math.round(selectedObject[key])}
                                                            onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { [key]: parseInt(e.target.value, 10) || 0 } })}
                                                            className="w-full px-1.5 py-1 text-[11px] border border-slate-200 rounded outline-none focus:border-[#7c3aed] bg-white"
                                                        />
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Прозорість */}
                                        <div className="px-4 py-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-slate-500">Opacity</span>
                                                <span className="text-[10px] font-mono text-slate-400">
                                                    {Math.round((selectedObject.opacity != null ? selectedObject.opacity : 1) * 100)} %
                                                </span>
                                            </div>
                                            <input
                                                type="range" min="0" max="100" step="1"
                                                value={Math.round((selectedObject.opacity != null ? selectedObject.opacity : 1) * 100)}
                                                onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { opacity: (parseInt(e.target.value, 10) || 0) / 100 } })}
                                                className="w-full accent-[#7c3aed] cursor-pointer"
                                            />
                                        </div>

                                        {/* Заокруглення (для image) */}
                                        {selectedObject.type === 'image' && (
                                            <div className="px-4 py-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-bold text-slate-500">Заокруглення</span>
                                                    <span className="text-[10px] font-mono text-slate-400">{selectedObject.cornerRadius || 0} px</span>
                                                </div>
                                                <input
                                                    type="range" min="0"
                                                    max={Math.max(Math.round(Math.min(selectedObject.w, selectedObject.h) / 2), 1)}
                                                    value={Math.min(selectedObject.cornerRadius || 0, Math.round(Math.min(selectedObject.w, selectedObject.h) / 2))}
                                                    onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { cornerRadius: parseInt(e.target.value, 10) || 0 } })}
                                                    className="w-full accent-[#7c3aed] cursor-pointer"
                                                />
                                            </div>
                                        )}

                                        {/* Обрізка (для image) */}
                                        {selectedObject.type === 'image' && (
                                            <div className="px-4 py-3 space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-slate-500">Crop</span>
                                                    {selectedObject.crop && (
                                                        <button
                                                            onClick={() => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { crop: null } })}
                                                            className="text-[9px] font-bold text-slate-400 hover:text-red-500"
                                                        >
                                                            Скинути
                                                        </button>
                                                    )}
                                                </div>
                                                {[['L', 'l', 'r'], ['R', 'r', 'l'], ['T', 't', 'b'], ['B', 'b', 't']].map(([label, key, opp]) => {
                                                    const crop = selectedObject.crop || { l: 0, t: 0, r: 0, b: 0 };
                                                    const value = Math.round((crop[key] || 0) * 100);
                                                    return (
                                                        <label key={key} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                                                            <span className="w-4">{label}</span>
                                                            <input type="range" min="0" max="90" step="1" value={value}
                                                                onChange={(e) => {
                                                                    const limit = 0.9 - (crop[opp] || 0);
                                                                    const v = Math.min((parseInt(e.target.value, 10) || 0) / 100, Math.max(limit, 0));
                                                                    const next = { ...crop, [key]: Math.round(v * 100) / 100 };
                                                                    const isEmpty = !next.l && !next.t && !next.r && !next.b;
                                                                    dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { crop: isEmpty ? null : next } });
                                                                }}
                                                                className="flex-grow accent-[#7c3aed] cursor-pointer" />
                                                            <span className="w-7 text-right">{value}%</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Текст (для text) */}
                                        {selectedObject.type === 'text' && (
                                            <div className="px-4 py-3 space-y-2">
                                                <span className="text-[10px] font-bold text-slate-500">Текст</span>
                                                <textarea
                                                    value={(selectedObject.lines || []).map(l => l.text).join('\n')}
                                                    onChange={(e) => {
                                                        const base = selectedObject.lines?.[0] || { color: '#1e293b', fontSize: 24, bold: false, align: 'l' };
                                                        const newLines = e.target.value.split('\n').map((t, i) => ({
                                                            ...(selectedObject.lines?.[i] || base),
                                                            text: t, runs: undefined, bullet: undefined
                                                        }));
                                                        dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { lines: newLines } });
                                                    }}
                                                    className="w-full min-h-[60px] p-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#7c3aed] resize-y bg-white"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                                                        Колір
                                                        <input type="color"
                                                            value={selectedObject.lines?.[0]?.color || '#1e293b'}
                                                            onChange={(e) => dispatchVideo({
                                                                type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: {
                                                                    lines: (selectedObject.lines || []).map(l => ({
                                                                        ...l, color: e.target.value,
                                                                        runs: l.runs ? l.runs.map(r => ({ ...r, color: e.target.value })) : l.runs
                                                                    }))
                                                                }
                                                            })}
                                                            className="w-6 h-6 border border-slate-200 rounded cursor-pointer"
                                                        />
                                                    </label>
                                                    <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                                                        Кегль
                                                        <input type="number" min="8"
                                                            value={selectedObject.lines?.[0]?.fontSize || 24}
                                                            onChange={(e) => {
                                                                const fs = parseInt(e.target.value, 10) || 24;
                                                                dispatchVideo({
                                                                    type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: {
                                                                        lines: (selectedObject.lines || []).map(l => ({
                                                                            ...l, fontSize: fs,
                                                                            runs: l.runs ? l.runs.map(r => ({ ...r, fontSize: fs })) : l.runs
                                                                        }))
                                                                    }
                                                                });
                                                            }}
                                                            className="w-12 px-1 py-0.5 text-[11px] border border-slate-200 rounded outline-none focus:border-[#7c3aed] bg-white"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        )}

                                        {/* Налаштування інтерактиву (H5P-стиль) */}
                                        {selectedObject.type === 'interactive' && (
                                            <div className="px-4 py-3 space-y-2 border-b border-slate-100">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1"><Zap size={11} /> {getObjectLabel(selectedObject)}</div>
                                                <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">Колір
                                                    <input type="color" value={selectedObject.color || '#7c3aed'} onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { color: e.target.value } })} className="w-6 h-6 border border-slate-200 rounded cursor-pointer" />
                                                </label>
                                                {selectedObject.iType === 'hotspot' && (
                                                    <>
                                                        <input value={selectedObject.label || ''} onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { label: e.target.value } })} placeholder="Мітка (напр. i, ?)" className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#7c3aed]" />
                                                        <textarea value={selectedObject.content || ''} onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { content: e.target.value } })} placeholder="Текст підказки" className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#7c3aed] resize-y min-h-[56px]" />
                                                    </>
                                                )}
                                                {selectedObject.iType === 'link' && (
                                                    <>
                                                        <input value={selectedObject.label || ''} onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { label: e.target.value } })} placeholder="Напис кнопки" className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#7c3aed]" />
                                                        <input value={selectedObject.url || ''} onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { url: e.target.value } })} placeholder="https://..." className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#7c3aed]" />
                                                    </>
                                                )}
                                                {(selectedObject.iType === 'mcq' || selectedObject.iType === 'summary') && (
                                                    <>
                                                        <textarea value={selectedObject.question || ''} onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { question: e.target.value } })} placeholder="Питання" className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#7c3aed] resize-y min-h-[44px]" />
                                                        {(selectedObject.options || []).map((opt, i) => (
                                                            <div key={i} className="flex items-center gap-1">
                                                                <input type="radio" checked={selectedObject.correct === i} onChange={() => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { correct: i } })} title="Правильна відповідь" className="accent-emerald-600" />
                                                                <input value={opt} onChange={(e) => { const opts = [...selectedObject.options]; opts[i] = e.target.value; dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { options: opts } }); }} className="flex-1 text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#7c3aed]" />
                                                                <button onClick={() => { const opts = selectedObject.options.filter((_, x) => x !== i); dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { options: opts, correct: Math.max(0, Math.min(selectedObject.correct, opts.length - 1)) } }); }} className="text-red-400 hover:text-red-600 text-xs px-1" title="Видалити">✕</button>
                                                            </div>
                                                        ))}
                                                        <button onClick={() => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { options: [...(selectedObject.options || []), 'Новий варіант'] } })} className="text-[10px] font-bold text-violet-600 hover:text-violet-800">+ варіант</button>
                                                        <p className="text-[9px] text-slate-400">Познач правильний варіант кружечком зліва.</p>
                                                    </>
                                                )}
                                                {selectedObject.iType === 'truefalse' && (
                                                    <>
                                                        <textarea value={selectedObject.question || ''} onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { question: e.target.value } })} placeholder="Твердження" className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#7c3aed] resize-y min-h-[44px]" />
                                                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                                                            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" checked={!!selectedObject.correct} onChange={() => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { correct: true } })} className="accent-emerald-600" /> Правда</label>
                                                            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" checked={!selectedObject.correct} onChange={() => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { correct: false } })} className="accent-emerald-600" /> Хибність</label>
                                                        </div>
                                                    </>
                                                )}
                                                {selectedObject.iType === 'fill' && (
                                                    <>
                                                        <textarea value={selectedObject.text || ''} onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { text: e.target.value } })} placeholder="Текст із пропуском" className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#7c3aed] resize-y min-h-[56px]" />
                                                        <p className="text-[9px] text-slate-400">Познач пропуск зірочками: <code>*правильна відповідь*</code> (можна кілька).</p>
                                                    </>
                                                )}
                                                {selectedObject.iType === 'info' && (
                                                    <textarea value={selectedObject.content || ''} onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { content: e.target.value } })} placeholder="Текст інфо-блоку" className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#7c3aed] resize-y min-h-[70px]" />
                                                )}
                                                {selectedObject.iType === 'flashcard' && (
                                                    <>
                                                        <input value={selectedObject.front || ''} onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { front: e.target.value } })} placeholder="Лицьова сторона (питання)" className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#7c3aed]" />
                                                        <input value={selectedObject.back || ''} onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { back: e.target.value } })} placeholder="Зворот (відповідь)" className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#7c3aed]" />
                                                    </>
                                                )}
                                                {selectedObject.iType === 'accordion' && (
                                                    <>
                                                        {(selectedObject.items || []).map((it, i) => (
                                                            <div key={i} className="border border-slate-100 rounded p-1.5 space-y-1">
                                                                <div className="flex items-center gap-1">
                                                                    <input value={it.title} onChange={(e) => { const items = selectedObject.items.map((x, k) => k === i ? { ...x, title: e.target.value } : x); dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { items } }); }} placeholder="Заголовок" className="flex-1 text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#7c3aed] font-semibold" />
                                                                    <button onClick={() => { const items = selectedObject.items.filter((_, k) => k !== i); dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { items } }); }} className="text-red-400 hover:text-red-600 text-xs px-1" title="Видалити">✕</button>
                                                                </div>
                                                                <textarea value={it.body} onChange={(e) => { const items = selectedObject.items.map((x, k) => k === i ? { ...x, body: e.target.value } : x); dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { items } }); }} placeholder="Текст" className="w-full text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#7c3aed] resize-y min-h-[36px]" />
                                                            </div>
                                                        ))}
                                                        <button onClick={() => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { items: [...(selectedObject.items || []), { title: 'Новий розділ', body: 'Текст' }] } })} className="text-[10px] font-bold text-violet-600 hover:text-violet-800">+ розділ</button>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Медіа (відео/аудіо): скоротити (тримінг) та обрізати (кроп) */}
                                        {(selectedObject.type === 'video' || selectedObject.type === 'audio') && (() => {
                                            const isAudio = selectedObject.type === 'audio';
                                            const mEl = videoCache.get(selectedObject.src);
                                            const dur = mEl && isFinite(mEl.duration) ? mEl.duration : null;
                                            const upd = (u) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: u });
                                            const cropLbl = { l: 'Зліва', t: 'Згори', r: 'Справа', b: 'Знизу' };
                                            const fitMode = selectedObject.videoFitMode || 'loop';
                                            return (
                                                <div className="px-4 py-3 space-y-2 border-b border-slate-100">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                                                        {isAudio ? <Music size={11} /> : <Film size={11} />}
                                                        {isAudio ? 'Аудіо' : 'Відео'}{dur != null ? ` · ${dur.toFixed(1)}с` : ''}
                                                    </div>

                                                    <div className="text-[9px] font-bold text-slate-400">Поведінка при розтягуванні</div>
                                                    <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
                                                        {[
                                                            { id: 'trim', label: 'Обрізати/Стоп' },
                                                            { id: 'stretch', label: 'Загальмувати' },
                                                            { id: 'loop', label: 'Зациклити' }
                                                        ].map(opt => (
                                                            <button
                                                                key={opt.id}
                                                                onClick={() => upd({ videoFitMode: opt.id })}
                                                                className={`flex-1 text-[9px] font-semibold py-1 rounded transition-colors ${fitMode === opt.id ? 'bg-white shadow-sm text-[#7c3aed]' : 'text-slate-500 hover:text-slate-700'}`}
                                                            >
                                                                {opt.label}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <div className="text-[9px] font-bold text-slate-400 mt-1">Скоротити (секунди)</div>
                                                    <div className="grid grid-cols-2 gap-1.5">
                                                        <label className="flex flex-col gap-0.5"><span className="text-[9px] text-slate-400">Початок</span>
                                                            <input type="number" step="0.1" min="0" value={selectedObject.trimStart || 0} onChange={(e) => upd({ trimStart: Math.max(0, parseFloat(e.target.value) || 0) })} className="w-full text-[11px] border border-slate-200 rounded px-1.5 py-1 outline-none focus:border-[#7c3aed]" />
                                                        </label>
                                                        <label className="flex flex-col gap-0.5"><span className="text-[9px] text-slate-400">Кінець</span>
                                                            <input type="number" step="0.1" min="0" value={selectedObject.trimEnd ?? ''} placeholder={dur != null ? dur.toFixed(1) : 'до кінця'} onChange={(e) => { const val = e.target.value; upd({ trimEnd: val === '' ? null : Math.max(0, parseFloat(val) || 0) }); }} className="w-full text-[11px] border border-slate-200 rounded px-1.5 py-1 outline-none focus:border-[#7c3aed]" />
                                                        </label>
                                                    </div>
                                                    {!isAudio && (
                                                        <>
                                                            <div className="text-[9px] font-bold text-slate-400">Обрізати кадр (%)</div>
                                                            <div className="grid grid-cols-4 gap-1">
                                                                {['l', 't', 'r', 'b'].map((k) => (
                                                                    <label key={k} className="flex flex-col items-center gap-0.5">
                                                                        <span className="text-[8px] text-slate-400">{cropLbl[k]}</span>
                                                                        <input type="number" step="1" min="0" max="90" value={Math.round(((selectedObject.crop?.[k]) || 0) * 100)} onChange={(e) => { const c = { l: 0, t: 0, r: 0, b: 0, ...(selectedObject.crop || {}) }; c[k] = Math.max(0, Math.min(0.9, (parseFloat(e.target.value) || 0) / 100)); upd({ crop: c }); }} className="w-full text-[10px] border border-slate-200 rounded px-1 py-0.5 outline-none text-center focus:border-[#7c3aed]" />
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                    <button onClick={() => upd({ trimStart: 0, trimEnd: null, crop: null })} className="text-[10px] font-bold text-slate-500 hover:text-slate-700">↺ Скинути тримінг/обрізку</button>
                                                </div>
                                            );
                                        })()}

                                        {/* Заливка/контур (shape/text) */}
                                        {(selectedObject.type === 'shape' || selectedObject.type === 'text') && (
                                            <div className="px-4 py-3 flex gap-3">
                                                <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                                                    Заливка
                                                    <input type="color" value={selectedObject.fillColor || '#ffffff'}
                                                        onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { fillColor: e.target.value, fillGradient: null } })}
                                                        className="w-6 h-6 border border-slate-200 rounded cursor-pointer" />
                                                </label>
                                                <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                                                    Контур
                                                    <input type="color" value={selectedObject.lineColor || '#94a3b8'}
                                                        onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT', slideId: vSlide.id, objectId: selectedObject.id, updates: { lineColor: e.target.value } })}
                                                        className="w-6 h-6 border border-slate-200 rounded cursor-pointer" />
                                                </label>
                                            </div>
                                        )}

                                        {/* Анімація */}
                                        <div className="px-4 py-3 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                                    <Sparkles size={10} /> Анімація
                                                </span>
                                                {(selectedObject.animation || {}).type && (selectedObject.animation || {}).type !== 'none' && (
                                                    <button
                                                        onClick={() => previewObjectAnimation(selectedObject.id)}
                                                        disabled={isPreviewing}
                                                        className="px-2 py-0.5 bg-purple-50 text-purple-600 hover:bg-purple-100 disabled:opacity-40 rounded text-[9px] font-bold transition-colors flex items-center gap-1"
                                                    >
                                                        <Eye size={10} /> Прев'ю
                                                    </button>
                                                )}
                                            </div>
                                            <select
                                                value={(selectedObject.animation || {}).type || 'none'}
                                                onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT_ANIMATION', slideId: vSlide.id, objectId: selectedObject.id, updates: { type: e.target.value } })}
                                                className="w-full px-2 py-1.5 text-[11px] border border-slate-200 rounded-lg outline-none focus:border-[#7c3aed] bg-white"
                                            >
                                                <optgroup label="Базові">
                                                    <option value="none">Немає</option>
                                                    <option value="appear">Виникнення</option>
                                                    <option value="fadeIn">Вицвітання</option>
                                                </optgroup>
                                                <optgroup label="Виліт">
                                                    <option value="flyInLeft">← Зліва</option>
                                                    <option value="flyInRight">→ Справа</option>
                                                    <option value="flyInTop">↑ Згори</option>
                                                    <option value="flyInBottom">↓ Знизу</option>
                                                </optgroup>
                                                <optgroup label="Спливання">
                                                    <option value="floatIn">↑ Вгору</option>
                                                    <option value="floatDown">↓ Вниз</option>
                                                </optgroup>
                                                <optgroup label="Витирання">
                                                    <option value="wipeFromLeft">Зліва</option>
                                                    <option value="wipeFromRight">Справа</option>
                                                    <option value="wipeFromTop">Згори</option>
                                                    <option value="wipeFromBottom">Знизу</option>
                                                </optgroup>
                                                <optgroup label="Маски">
                                                    <option value="splitIn">Розтин</option>
                                                    <option value="zoomIn">Масштаб</option>
                                                </optgroup>
                                                <optgroup label="Ефектні">
                                                    <option value="bounce">Відскік</option>
                                                    <option value="pop">Pop</option>
                                                    <option value="spinIn">Оберт</option>
                                                    <option value="growTurn">Збільш. з поворотом</option>
                                                </optgroup>
                                            </select>
                                            {(selectedObject.animation || {}).type !== 'none' && (selectedObject.animation || {}).type && (
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    <label className="flex flex-col gap-0.5">
                                                        <span className="text-[9px] font-bold text-slate-400">Затримка</span>
                                                        <input type="number" step="0.1" min="0"
                                                            value={(selectedObject.animation || {}).delay || 0}
                                                            onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT_ANIMATION', slideId: vSlide.id, objectId: selectedObject.id, updates: { delay: Math.max(0, parseFloat(e.target.value) || 0) } })}
                                                            className="w-full px-1.5 py-1 text-[11px] border border-slate-200 rounded outline-none focus:border-[#7c3aed] bg-white" />
                                                    </label>
                                                    <label className="flex flex-col gap-0.5">
                                                        <span className="text-[9px] font-bold text-slate-400">Тривалість</span>
                                                        <input type="number" step="0.1" min="0.2"
                                                            value={(selectedObject.animation || {}).duration || 0.8}
                                                            onChange={(e) => dispatchVideo({ type: 'UPDATE_OBJECT_ANIMATION', slideId: vSlide.id, objectId: selectedObject.id, updates: { duration: Math.max(0.2, parseFloat(e.target.value) || 0.2) } })}
                                                            className="w-full px-1.5 py-1 text-[11px] border border-slate-200 rounded outline-none focus:border-[#7c3aed] bg-white" />
                                                    </label>
                                                </div>
                                            )}
                                            {/* Пресети анімацій */}
                                            {vSlide && (
                                                <div className="flex gap-1 pt-1">
                                                    {[['together', 'Разом'], ['cascade', 'Каскад'], ['narrator', 'По аудіо']].map(([preset, label]) => (
                                                        <button key={preset} onClick={() => handleApplySlideAnimationPreset(vSlide.id, preset)} className="px-2 py-0.5 bg-slate-50 text-slate-500 hover:bg-purple-50 hover:text-purple-600 rounded text-[9px] font-semibold transition-colors">{label}</button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Scene transition */}
                                        <div className="px-4 py-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-slate-500">Scene transition</span>
                                            </div>
                                            <select
                                                value={vSlide.transition}
                                                onChange={(e) => {
                                                    dispatchVideo({ type: 'UPDATE_SLIDE', slideId: vSlide.id, updates: { transition: e.target.value } });
                                                    logChange('Перехід', `Слайд ${vSlide.slideNumber}: → ${TRANSITIONS[e.target.value]?.label}`);
                                                }}
                                                className="w-full px-2 py-1.5 text-[11px] border border-slate-200 rounded-lg outline-none focus:border-[#7c3aed] bg-white"
                                            >
                                                {Object.entries(TRANSITIONS).map(([key, def]) => (
                                                    <option key={key} value={key}>{def.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Background media */}
                                        <div className="px-4 py-3 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-500">Background media</span>
                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${vSlide.bgImage ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    {vSlide.bgImage ? 'ON' : 'OFF'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] font-bold text-slate-500 w-16">Color</span>
                                                <input
                                                    type="color"
                                                    value={vSlide.background || '#FFFFFF'}
                                                    onChange={(e) => dispatchVideo({ type: 'UPDATE_SLIDE', slideId: vSlide.id, updates: { background: e.target.value } })}
                                                    className="w-6 h-6 border border-slate-200 rounded cursor-pointer"
                                                />
                                                <span className="text-[10px] font-mono text-slate-400 ml-1">{(vSlide.background || '#FFFFFF').toUpperCase()}</span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-2">
                                                <span className="text-[10px] font-bold text-slate-500 w-16">Audio</span>
                                                <label className="flex items-center justify-center w-6 h-6 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded cursor-pointer transition-colors" title="Завантажити фонове аудіо">
                                                    <span className="font-bold text-[10px]">+</span>
                                                    <input type="file" accept="audio/*" className="hidden" onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onload = (evt) => dispatchVideo({ type: 'UPDATE_SLIDE', slideId: vSlide.id, updates: { bgAudio: evt.target.result } });
                                                            reader.readAsDataURL(file);
                                                        }
                                                        e.target.value = '';
                                                    }} />
                                                </label>
                                                {vSlide.bgAudio && (
                                                    <button onClick={() => dispatchVideo({ type: 'UPDATE_SLIDE', slideId: vSlide.id, updates: { bgAudio: null } })} className="text-[9px] text-red-500 hover:underline font-bold ml-2">Видалити</button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Пресети анімацій */}
                                        <div className="px-4 py-3 space-y-2">
                                            <span className="text-[10px] font-bold text-slate-500">Пресети анімацій</span>
                                            <div className="grid grid-cols-3 gap-1">
                                                {[['together', '⚡', 'Разом'], ['cascade', '🎯', 'Каскад'], ['narrator', '🎙️', 'По диктору']].map(([preset, icon, label]) => (
                                                    <button key={preset}
                                                        onClick={() => handleApplySlideAnimationPreset(vSlide.id, preset)}
                                                        disabled={vSlide.objects.length === 0}
                                                        className="px-1 py-1.5 bg-slate-50 hover:bg-purple-50 hover:text-[#7c3aed] disabled:opacity-40 rounded-lg text-[10px] font-semibold transition-colors flex flex-col items-center gap-0.5"
                                                    >
                                                        <span className="text-sm leading-none">{icon}</span>
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => handleRegenerateSlideAnimations(vSlide.id)}
                                                disabled={regeneratingSlideId === vSlide.id || vSlide.objects.length === 0}
                                                className="w-full px-2 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 disabled:opacity-40 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                                            >
                                                {regeneratingSlideId === vSlide.id ? <Loader2 size={11} className="animate-spin" /> : <Wand2 size={11} />}
                                                AI-анімації
                                            </button>
                                            <button
                                                onClick={() => syncAnimationsToAudio(vSlide.id)}
                                                disabled={!vSlide.audioDuration || vSlide.objects.length === 0}
                                                className="w-full px-2 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-40 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Zap size={11} />
                                                Синхронізувати з аудіо {vSlide.audioDuration ? `(${vSlide.audioDuration.toFixed(1)}с)` : ''}
                                            </button>
                                        </div>

                                        {/* Додати об'єкт */}
                                        <div className="px-4 py-3 space-y-2">
                                            <span className="text-[10px] font-bold text-slate-500">Додати об'єкт</span>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <button
                                                    onClick={addTextObject}
                                                    className="px-2 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <Type size={12} /> Текст
                                                </button>
                                                <label className="cursor-pointer px-2 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1">
                                                    <ImagePlus size={12} /> Картинка
                                                    <input type="file" accept="image/*" onChange={(e) => { addImageObject(e.target.files[0]); e.target.value = ''; }} className="hidden" />
                                                </label>
                                                <label className="cursor-pointer px-2 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1">
                                                    <Film size={12} /> Відео
                                                    <input type="file" accept="video/*" onChange={(e) => { addVideoObject(e.target.files[0]); e.target.value = ''; }} className="hidden" />
                                                </label>
                                                <label className="cursor-pointer px-2 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1">
                                                    <Music size={12} /> Аудіо
                                                    <input type="file" accept="audio/*" onChange={(e) => { addAudioObject(e.target.files[0]); e.target.value = ''; }} className="hidden" />
                                                </label>
                                                <button
                                                    onClick={() => addShapeObject('ellipse')}
                                                    className="col-span-2 px-2 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <Combine size={12} /> Фігури
                                                </button>
                                            </div>
                                        </div>

                                        {/* Статистика */}
                                        <div className="px-4 py-3">
                                            <div className="text-[10px] text-slate-400 space-y-0.5">
                                                <p>{slides.length} сцен · {slidesWithAudio} озвучено</p>
                                                <p>{vSlide.objects.length} об'єктів на сцені</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Панель шарів (Layers) */}
                                <div className="px-4 py-3 border-t border-slate-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                            <Layers size={10} /> Шари ({vSlide.objects.length})
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            {(() => {
                                                const curSel = multiSelectedIds.length > 1 ? multiSelectedIds : (selectedObjectId ? [selectedObjectId] : []);
                                                const canGroup = curSel.length > 1;
                                                const hasGroups = curSel.some(id => { const o = vSlide.objects.find(x => x.id === id); return o && o.groupId; });
                                                return (
                                                    <>
                                                        {canGroup && (
                                                            <button onClick={() => { dispatchVideo({ type: 'GROUP_OBJECTS', slideId: vSlide.id, objectIds: curSel }); logChange('Групування', 'Згруповано об\'єкти'); }} className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold transition-colors">
                                                                Згрупувати
                                                            </button>
                                                        )}
                                                        {hasGroups && (
                                                            <button onClick={() => { dispatchVideo({ type: 'UNGROUP_OBJECTS', slideId: vSlide.id, objectIds: curSel }); logChange('Групування', 'Розгруповано об\'єкти'); }} className="text-[9px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold transition-colors">
                                                                Розгрупувати
                                                            </button>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                            {multiSelectedIds.length > 1 && (
                                                <span className="text-[9px] text-[#7c3aed] font-semibold bg-[#7c3aed]/10 px-1.5 py-0.5 rounded ml-1">{multiSelectedIds.length} обрано</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-0.5 max-h-[180px] overflow-y-auto">
                                        {[...vSlide.objects].reverse().map((obj, ri) => {
                                            const realIdx = vSlide.objects.length - 1 - ri;
                                            const isSel = obj.id === selectedObjectId;
                                            const isMulti = multiSelectedIds.includes(obj.id);

                                            let dragStyle = 'border-2 border-transparent';
                                            if (layerDrag && layerDrag.targetId === obj.id) {
                                                if (layerDrag.action === 'above') dragStyle = 'border-2 border-transparent border-t-[#7c3aed]';
                                                else if (layerDrag.action === 'below') dragStyle = 'border-2 border-transparent border-b-[#7c3aed]';
                                                else dragStyle = 'border-2 border-[#7c3aed] bg-[#7c3aed]/20';
                                            }

                                            return (
                                                <div key={obj.id}
                                                    draggable={true}
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData('text/plain', obj.id);
                                                        e.dataTransfer.effectAllowed = 'move';
                                                    }}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const y = e.clientY - rect.top;
                                                        const h = rect.height;
                                                        let action = 'merge';
                                                        if (y < h * 0.25) action = 'above';
                                                        else if (y > h * 0.75) action = 'below';

                                                        if (!layerDrag || layerDrag.targetId !== obj.id || layerDrag.action !== action) {
                                                            setLayerDrag({ targetId: obj.id, action });
                                                        }
                                                    }}
                                                    onDragLeave={() => setLayerDrag(null)}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        const fromId = e.dataTransfer.getData('text/plain');
                                                        const action = layerDrag ? layerDrag.action : 'merge';
                                                        setLayerDrag(null);

                                                        if (!fromId || fromId === obj.id) return;

                                                        if (action === 'merge') {
                                                            dispatchVideo({ type: 'GROUP_OBJECTS', slideId: vSlide.id, objectIds: [fromId, obj.id] });
                                                            logChange('Групування', 'Об\'єднано шари через перетягування');
                                                        } else {
                                                            let newIdx = action === 'above' ? realIdx + 1 : realIdx;
                                                            dispatchVideo({ type: 'REORDER_OBJECT_TO_INDEX', slideId: vSlide.id, objectId: fromId, newIndex: newIdx });
                                                            logChange('Шари', 'Змінено порядок шарів');
                                                        }
                                                    }}
                                                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] cursor-grab active:cursor-grabbing transition-colors ${dragStyle} ${isSel ? 'bg-[#7c3aed]/10 text-[#7c3aed] font-bold' : isMulti ? 'bg-[#7c3aed]/5 text-slate-600 font-semibold' : 'hover:bg-slate-50 text-slate-500'}`}
                                                    onClick={(e) => {
                                                        let newMulti = [];
                                                        if (e.shiftKey || e.metaKey || e.ctrlKey) {
                                                            if (multiSelectedIds.includes(obj.id)) {
                                                                newMulti = multiSelectedIds.filter(id => id !== obj.id);
                                                                if (obj.groupId) newMulti = newMulti.filter(id => { const o = vSlide.objects.find(x => x.id === id); return !(o && o.groupId === obj.groupId); });
                                                            } else {
                                                                newMulti = [...new Set([...multiSelectedIds, selectedObjectId, obj.id].filter(Boolean))];
                                                                if (obj.groupId) {
                                                                    const gm = vSlide.objects.filter(o => o.groupId === obj.groupId).map(o => o.id);
                                                                    newMulti = [...new Set([...newMulti, ...gm])];
                                                                }
                                                            }
                                                            setMultiSelectedIds(newMulti);
                                                        } else {
                                                            if (obj.groupId) {
                                                                const gm = vSlide.objects.filter(o => o.groupId === obj.groupId).map(o => o.id);
                                                                setMultiSelectedIds(gm);
                                                            } else {
                                                                setMultiSelectedIds([]);
                                                            }
                                                            setSelectedObjectId(obj.id);
                                                        }
                                                    }}
                                                >
                                                    <span className="w-4 text-[8px] text-slate-300 font-mono text-right flex-shrink-0">
                                                        {obj.groupId ? <Combine size={8} className="inline-block text-indigo-400" title="Згруповано" /> : realIdx + 1}
                                                    </span>
                                                    <span className="flex-grow truncate pointer-events-none">{getObjectLabel(obj)}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); dispatchVideo({ type: 'REORDER_OBJECT', slideId: vSlide.id, objectId: obj.id, direction: 'up' }); }}
                                                        disabled={realIdx >= vSlide.objects.length - 1}
                                                        className="p-0.5 hover:text-[#7c3aed] disabled:opacity-20 transition-colors"
                                                        title="Вгору (вище)"
                                                    >
                                                        <ChevronUp size={10} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); dispatchVideo({ type: 'REORDER_OBJECT', slideId: vSlide.id, objectId: obj.id, direction: 'down' }); }}
                                                        disabled={realIdx <= 0}
                                                        className="p-0.5 hover:text-[#7c3aed] disabled:opacity-20 transition-colors"
                                                        title="Вниз (нижче)"
                                                    >
                                                        <ChevronDown size={10} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        {vSlide.objects.length === 0 && (
                                            <p className="text-[10px] text-slate-300 text-center py-2">Немає об'єктів</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 text-center text-slate-400 text-xs mt-8">
                                Оберіть сцену зліва
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}