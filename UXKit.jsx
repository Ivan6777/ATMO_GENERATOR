import React from 'react';

/* ============================================================================
 * UXKit — набір UI/UX-примітивів Studio Pro (Спринт 1 з UX_UPDATES_CHECKLIST.md)
 *
 * Окремий модуль без залежностей (крім React): токени дизайн-системи, тости
 * з кнопкою дії (undo-снекбари), модал гарячих клавіш, автозбереження проєкту
 * в IndexedDB (включно з блобами відео/аудіо), банер відновлення сесії,
 * оверлей прогресу імпорту, чекліст готовності до експорту та валідація PPTX.
 *
 * Покриває: U-01, U-02, U-03, U-04, U-07, U-08, U-17, U-18, U-19, U-21,
 *           U-22, U-70, U-71, U-72, U-73, U-94 (базові токени).
 * ========================================================================== */

/* ── U-94. Токени дизайн-системи ── */
export const TOKENS = {
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    success: '#059669',
    danger: '#dc2626',
    textMain: '#1e293b',
    textMuted: '#64748b',
    border: '#e2e8f0',
    surface: '#ffffff',
    surfaceAlt: '#f8fafc',
    radiusS: 8,
    radiusM: 12
};

/* ── U-18. Система тостів (глобальна шина, без контексту — сумісно з
 *    babel-standalone). toast('success'|'error'|'info', 'текст', { action }) ── */
let __toastId = 0;
const __toastListeners = new Set();

export const toast = (type, message, opts = {}) => {
    const t = {
        id: ++__toastId,
        type,
        message,
        action: opts.action || null, // { label, onClick } — напр. «Повернути» (U-07/U-08)
        duration: opts.duration != null ? opts.duration : (opts.action ? 6000 : 3500)
    };
    __toastListeners.forEach(fn => fn(t));
    return t.id;
};

export const ToastHost = () => {
    const [items, setItems] = React.useState([]);
    React.useEffect(() => {
        const onToast = (t) => {
            setItems(list => [...list.slice(-3), t]);
            if (t.duration > 0) {
                setTimeout(() => setItems(list => list.filter(x => x.id !== t.id)), t.duration);
            }
        };
        __toastListeners.add(onToast);
        return () => __toastListeners.delete(onToast);
    }, []);
    const dismiss = (id) => setItems(list => list.filter(x => x.id !== id));
    const ICON = { success: '✓', error: '⚠', info: 'ℹ' };
    const BG = { success: '#059669', error: '#dc2626', info: '#1e293b' };
    return (
        <div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none"
            aria-live="polite"
        >
            {items.map(t => (
                <div
                    key={t.id}
                    className="text-white rounded-xl shadow-2xl px-4 py-2.5 text-xs font-semibold flex items-center gap-3 pointer-events-auto max-w-[80vw]"
                    style={{ backgroundColor: BG[t.type] || BG.info }}
                >
                    <span aria-hidden="true">{ICON[t.type] || ''}</span>
                    <span>{t.message}</span>
                    {t.action && (
                        <button
                            onClick={() => { try { t.action.onClick(); } finally { dismiss(t.id); } }}
                            className="underline font-bold text-white/90 hover:text-white whitespace-nowrap"
                        >
                            {t.action.label}
                        </button>
                    )}
                    <button onClick={() => dismiss(t.id)} aria-label="Закрити сповіщення" className="text-white/60 hover:text-white ml-1">✕</button>
                </div>
            ))}
        </div>
    );
};

/* ── U-73. Клавіша у стилі клавіатури ── */
export const Kbd = ({ children }) => (
    <kbd className="inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-300 rounded shadow-[0_1px_0_#cbd5e1] font-sans">
        {children}
    </kbd>
);

/* ── U-72. Модал гарячих клавіш (список — з реального keydown-обробника) ── */
export const SHORTCUTS = [
    { keys: ['Ctrl', 'Z'], label: 'Скасувати останню дію' },
    { keys: ['Ctrl', 'Y'], label: 'Повторити скасовану дію' },
    { keys: ['Ctrl', 'C'], label: 'Копіювати виділені об\'єкти' },
    { keys: ['Ctrl', 'V'], label: 'Вставити (також слайд/об\'єкт прямо з PowerPoint)' },
    { keys: ['Ctrl', 'D'], label: 'Дублювати виділений об\'єкт' },
    { keys: ['Delete'], label: 'Видалити виділені об\'єкти' },
    { keys: ['Esc'], label: 'Зняти виділення' },
    { keys: ['←', '↑', '→', '↓'], label: 'Посунути об\'єкт на 1 px' },
    { keys: ['Shift', 'стрілки'], label: 'Посунути об\'єкт на 10 px' },
    { keys: ['Shift', 'клік'], label: 'Додати об\'єкт до виділення' },
    { keys: ['?'], label: 'Показати це вікно' }
];

export const ShortcutsModal = ({ open, onClose }) => {
    React.useEffect(() => {
        if (!open) return;
        const h = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [open, onClose]);
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Гарячі клавіші">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] max-w-[92vw] max-h-[80vh] overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-slate-800">Гарячі клавіші</h2>
                    <button onClick={onClose} aria-label="Закрити" className="text-slate-400 hover:text-slate-600 p-1">✕</button>
                </div>
                <div className="space-y-2">
                    {SHORTCUTS.map((s, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 text-xs text-slate-600">
                            <span>{s.label}</span>
                            <span className="flex items-center gap-1 flex-shrink-0">
                                {s.keys.map((k, j) => (
                                    <React.Fragment key={j}>
                                        {j > 0 && <span className="text-slate-300">+</span>}
                                        <Kbd>{k}</Kbd>
                                    </React.Fragment>
                                ))}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ============================================================================
 * U-01/U-02/U-03. Автозбереження проєкту в IndexedDB
 * Блоби відео/аудіо (blob:-URL живуть лише до перезавантаження) зберігаються
 * у сховищі "media" і при відновленні перетворюються назад на object-URL.
 * ========================================================================== */
const DB_NAME = 'atmo-studio-pro';
const openDb = () => new Promise((resolve, reject) => {
    const rq = indexedDB.open(DB_NAME, 1);
    rq.onupgradeneeded = () => {
        const db = rq.result;
        if (!db.objectStoreNames.contains('project')) db.createObjectStore('project');
        if (!db.objectStoreNames.contains('media')) db.createObjectStore('media');
    };
    rq.onsuccess = () => resolve(rq.result);
    rq.onerror = () => reject(rq.error);
});
const idbReq = (db, store, mode, fn) => new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const rq = fn(tx.objectStore(store));
    tx.oncomplete = () => resolve(rq ? rq.result : undefined);
    tx.onerror = () => reject(tx.error);
});

// Кеш "blob:-URL -> ключ у сховищі media" на сесію: великі відео не
// перечитуються з пам'яті при кожному автозбереженні
const __savedMediaKeys = new Map();

export const saveProjectSnapshot = async (slides) => {
    const db = await openDb();
    const serializable = [];
    for (const s of slides) {
        const objects = [];
        for (const o of (s.objects || [])) {
            if ((o.type === 'video' || o.type === 'audio') && o.src && o.src.startsWith('blob:')) {
                let key = __savedMediaKeys.get(o.src);
                if (!key) {
                    try {
                        const blob = await fetch(o.src).then(r => r.blob());
                        key = 'media_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
                        await idbReq(db, 'media', 'readwrite', st => st.put(blob, key));
                        __savedMediaKeys.set(o.src, key);
                    } catch (e) { key = null; }
                }
                objects.push(key ? { ...o, src: 'idb:' + key } : { ...o, src: null });
            } else {
                objects.push(o);
            }
        }
        serializable.push({ ...s, objects, isGenerating: false });
    }
    await idbReq(db, 'project', 'readwrite', st => st.put({ savedAt: Date.now(), slides: serializable }, 'autosave'));
};

export const loadProjectSnapshot = async () => {
    try {
        const db = await openDb();
        const snap = await idbReq(db, 'project', 'readonly', st => st.get('autosave'));
        if (!snap || !snap.slides || !snap.slides.length) return null;
        const slides = [];
        for (const s of snap.slides) {
            const objects = [];
            for (const o of (s.objects || [])) {
                if (o.src && typeof o.src === 'string' && o.src.startsWith('idb:')) {
                    const blob = await idbReq(db, 'media', 'readonly', st => st.get(o.src.slice(4)));
                    objects.push(blob ? { ...o, src: URL.createObjectURL(blob) } : { ...o, src: null });
                } else {
                    objects.push(o);
                }
            }
            slides.push({ ...s, objects });
        }
        return { slides, savedAt: snap.savedAt };
    } catch (e) {
        return null;
    }
};

export const clearProjectSnapshot = async () => {
    try {
        const db = await openDb();
        await idbReq(db, 'project', 'readwrite', st => st.clear());
        await idbReq(db, 'media', 'readwrite', st => st.clear());
        __savedMediaKeys.clear();
    } catch (e) { /* ignore */ }
};

// U-01/U-04. Дебаунс-автозбереження; повертає стан для індикатора в топбарі
// та dirtyRef для beforeunload-запобіжника
export const useAutosave = (slides, enabled = true) => {
    const [state, setState] = React.useState({ status: 'idle', savedAt: null });
    const timerRef = React.useRef(null);
    const busyRef = React.useRef(false);
    const dirtyRef = React.useRef(false);
    React.useEffect(() => {
        if (!enabled || !slides || slides.length === 0) return undefined;
        dirtyRef.current = true;
        setState(s => (s.status === 'saving' ? s : { ...s, status: 'pending' }));
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(async () => {
            if (busyRef.current) return;
            busyRef.current = true;
            setState(s => ({ ...s, status: 'saving' }));
            try {
                await saveProjectSnapshot(slides);
                dirtyRef.current = false;
                setState({ status: 'saved', savedAt: Date.now() });
            } catch (e) {
                setState(s => ({ ...s, status: 'error' }));
            } finally {
                busyRef.current = false;
            }
        }, 2500);
        return () => clearTimeout(timerRef.current);
    }, [slides, enabled]);
    return { ...state, dirtyRef };
};

// U-03. Попередження браузера при закритті вкладки з незбереженими змінами
export const useBeforeUnloadGuard = (shouldWarn) => {
    React.useEffect(() => {
        const h = (e) => {
            if (shouldWarn()) { e.preventDefault(); e.returnValue = ''; }
        };
        window.addEventListener('beforeunload', h);
        return () => window.removeEventListener('beforeunload', h);
    }, [shouldWarn]);
};

// U-04. Компактний індикатор стану автозбереження для топбара
export const AutosaveIndicator = ({ status, savedAt }) => {
    if (status === 'idle') return null;
    const time = savedAt ? new Date(savedAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) : '';
    const LABEL = {
        pending: '● Незбережені зміни…',
        saving: 'Зберігаємо…',
        saved: `Збережено · ${time}`,
        error: '⚠ Не вдалося зберегти'
    };
    const COLOR = { pending: '#f59e0b', saving: '#64748b', saved: '#059669', error: '#dc2626' };
    return (
        <span className="text-[10px] font-semibold whitespace-nowrap" style={{ color: COLOR[status] }} title="Проєкт автоматично зберігається у сховищі браузера">
            {LABEL[status]}
        </span>
    );
};

/* ── U-02. Банер відновлення попередньої сесії ── */
export const RestoreBanner = ({ savedAt, slidesCount, onRestore, onDismiss }) => (
    <div className="max-w-xl mx-auto mb-4 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="text-lg" aria-hidden="true">🕘</span>
        <div className="flex-1 text-left">
            <div className="text-xs font-bold text-slate-700">Знайдено незавершений проєкт</div>
            <div className="text-[11px] text-slate-500">
                {slidesCount} слайд(ів) · збережено {new Date(savedAt).toLocaleString('uk-UA')}
            </div>
        </div>
        <button onClick={onRestore} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: TOKENS.primary }}>
            Відновити
        </button>
        <button onClick={onDismiss} className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-violet-100" title="Видалити збережену сесію">
            Відхилити
        </button>
    </div>
);

/* ── U-19. Оверлей прогресу імпорту PPTX ── */
export const ImportProgressOverlay = ({ progress }) => {
    if (!progress) return null;
    const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;
    return (
        <div className="fixed inset-0 z-[95] bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
            <div className="w-10 h-10 border-4 border-violet-200 rounded-full animate-spin" style={{ borderTopColor: TOKENS.primary }} />
            <div className="text-sm font-bold text-slate-700">{progress.stage}</div>
            {progress.total > 0 && (
                <div className="w-64">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: TOKENS.primary }} />
                    </div>
                    <div className="text-[11px] text-slate-500 text-center mt-1">{progress.current} з {progress.total}</div>
                </div>
            )}
        </div>
    );
};

/* ── U-70/U-71. Чекліст готовності до експорту (шапка меню «Завантажити») ── */
export const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
};

export const ExportReadiness = ({ slidesTotal, unvoiced, durationSec, isGenerating, onGenerateMissing }) => (
    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <span>✅ Слайдів: {slidesTotal}</span>
            <span title="Орієнтовна тривалість готового відео">⏱ {formatDuration(durationSec)}</span>
        </div>
        {unvoiced > 0 ? (
            <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-amber-600">⚠ Без озвучки: {unvoiced}</span>
                <button
                    onClick={onGenerateMissing}
                    disabled={isGenerating}
                    className="text-[11px] font-bold underline disabled:opacity-50"
                    style={{ color: TOKENS.primary }}
                >
                    {isGenerating ? 'Генеруємо…' : 'Згенерувати'}
                </button>
            </div>
        ) : (
            <div className="text-[11px] font-semibold text-emerald-600">✅ Усі слайди з текстом озвучено</div>
        )}
    </div>
);

/* ── U-17. Валідація файлу ДО парсингу: зрозуміла відповідь замість помилки
 *    парсера («Failed to read zip») ── */
export const validatePptxFile = async (file) => {
    if (!file) return { ok: false, reason: 'Файл не обрано.' };
    if (/\.pps[xm]?$|\.pptm$/i.test(file.name)) return { ok: true }; // родинні формати — теж ZIP/OOXML
    if (!/\.pptx$/i.test(file.name)) {
        if (/\.ppt$/i.test(file.name)) {
            return { ok: false, reason: 'Це старий формат .ppt. Відкрийте файл у PowerPoint і збережіть як .pptx.' };
        }
        if (/\.(odp|key)$/i.test(file.name)) {
            return { ok: false, reason: `Формат «.${file.name.split('.').pop()}» не підтримується. Експортуйте презентацію у .pptx.` };
        }
        return { ok: false, reason: `«${file.name}» не схожий на презентацію PowerPoint (.pptx).` };
    }
    try {
        const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
        if (!(head[0] === 0x50 && head[1] === 0x4B)) {
            return { ok: false, reason: 'Файл пошкоджено або це не справжній .pptx (немає ZIP-сигнатури).' };
        }
    } catch (e) { /* не вдалося прочитати заголовок — нехай спробує парсер */ }
    return { ok: true };
};

/* ============================================================================
 * U-102. Словник вимови TTS: пари «термін → як читати». Підставляється в текст
 * ЛИШЕ перед генерацією озвучки (на слайді видно оригінал). Зберігається у
 * localStorage — терміни користувача спільні для всіх його проєктів.
 * ========================================================================== */
const PRON_DICT_KEY = 'atmo-pronunciation-dict';

export const loadPronunciationDict = () => {
    try {
        const raw = JSON.parse(localStorage.getItem(PRON_DICT_KEY) || '[]');
        return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
};

export const savePronunciationDict = (dict) => {
    try { localStorage.setItem(PRON_DICT_KEY, JSON.stringify(dict || [])); } catch (e) { /* ignore */ }
};

// Заміна цілих слів без урахування регістру (без lookbehind — сумісно зі старими Safari)
export const applyPronunciationDict = (text, dict) => {
    let out = String(text || '');
    for (const pair of (dict || [])) {
        const from = (pair.from || '').trim();
        const to = (pair.to || '').trim();
        if (!from || !to) continue;
        const esc = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        out = out.replace(
            new RegExp(`(^|[^\\p{L}\\p{N}])${esc}(?=$|[^\\p{L}\\p{N}])`, 'giu'),
            (m, lead) => lead + to
        );
    }
    return out;
};

export const PronunciationDictModal = ({ open, onClose, dict, onChange }) => {
    React.useEffect(() => {
        if (!open) return;
        const h = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [open, onClose]);
    if (!open) return null;
    const rows = dict && dict.length ? dict : [];
    const setRow = (i, patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
    const delRow = (i) => onChange(rows.filter((_, j) => j !== i));
    const addRow = () => onChange([...rows, { from: '', to: '' }]);
    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Словник вимови">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-[460px] max-w-[94vw] max-h-[82vh] overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-sm font-bold text-slate-800">Словник вимови</h2>
                    <button onClick={onClose} aria-label="Закрити" className="text-slate-400 hover:text-slate-600 p-1">✕</button>
                </div>
                <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                    Диктор читатиме терміни так, як ви запишете їх у правій колонці (на слайдах текст не змінюється).
                    Наголос можна підказати подвоєнням наголошеної голосної або дефісами:
                    «Python → пАйтон», «кафедра → кАфедра», «ArcGIS → арк-джі-ай-ес».
                </p>
                <div className="space-y-2">
                    <div className="grid grid-cols-[1fr_1fr_28px] gap-2 text-[10px] font-bold text-slate-400 uppercase">
                        <span>Термін у тексті</span><span>Як читати</span><span />
                    </div>
                    {rows.map((r, i) => (
                        <div key={i} className="grid grid-cols-[1fr_1fr_28px] gap-2">
                            <input
                                value={r.from}
                                onChange={(e) => setRow(i, { from: e.target.value })}
                                placeholder="OSINT"
                                className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-violet-400 bg-white"
                            />
                            <input
                                value={r.to}
                                onChange={(e) => setRow(i, { to: e.target.value })}
                                placeholder="о-сІнт"
                                className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-violet-400 bg-white"
                            />
                            <button onClick={() => delRow(i)} aria-label="Видалити пару" className="text-slate-300 hover:text-red-500 text-sm">✕</button>
                        </div>
                    ))}
                    {rows.length === 0 && (
                        <div className="text-[11px] text-slate-400 italic py-2 text-center">Поки що порожньо — додайте перший термін</div>
                    )}
                </div>
                <button
                    onClick={addRow}
                    className="mt-3 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: TOKENS.primary }}
                >+ Додати термін</button>
            </div>
        </div>
    );
};

/* ============================================================================
 * U-110. Error boundary: збій рендера показує картку відновлення, а не
 * «білий екран». key={selectedSlideId} у місці використання гарантує, що
 * перемикання слайда автоматично скидає помилку.
 * ========================================================================== */
export class UIErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error) { return { error }; }
    componentDidCatch(error, info) {
        if (this.props.onError) this.props.onError(error, info);
    }
    render() {
        if (this.state.error) {
            return (
                <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
                    <div className="bg-white border border-red-200 rounded-2xl shadow-lg p-6 max-w-md text-center space-y-3">
                        <div className="text-2xl" aria-hidden="true">⚠️</div>
                        <div className="text-sm font-bold text-slate-800">Не вдалося відобразити {this.props.label || 'вміст'}</div>
                        <div className="text-[11px] text-slate-500 break-words">{String(this.state.error && this.state.error.message || this.state.error)}</div>
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => this.setState({ error: null })}
                                className="px-4 py-2 rounded-lg text-xs font-bold text-white"
                                style={{ backgroundColor: TOKENS.primary }}
                            >Спробувати ще раз</button>
                            {this.props.onUndo && (
                                <button
                                    onClick={() => { this.props.onUndo(); this.setState({ error: null }); }}
                                    className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                                >Скасувати останню дію</button>
                            )}
                        </div>
                        <div className="text-[10px] text-slate-400">Проєкт не втрачено: він автоматично збережений у сховищі браузера.</div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

/* ── U-21. Людські пояснення помилок API озвучки ── */
export const humanizeTtsError = (message) => {
    const m = String(message || '');
    if (m.includes('429')) return 'Сервіс озвучки перевантажено (забагато запитів). Зачекайте хвилину і спробуйте ще раз.';
    if (m.includes('403') || m.includes('401')) return 'Немає доступу до сервісу озвучки. Перевірте ключ API.';
    if (m.includes('Failed to fetch') || m.includes('NetworkError')) return 'Немає з\'єднання з інтернетом. Перевірте мережу і повторіть.';
    if (m.includes('Не отримано аудіо')) return 'Сервіс не повернув аудіо. Спробуйте коротший текст або повторіть пізніше.';
    return m;
};
