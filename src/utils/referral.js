// Atribución de afiliada: guarda quién refirió a la visitante para que, cuando
// compre (aunque sea días después), la comisión se le acredite a la afiliada correcta.

const STORAGE_KEY = 'arq_ref';
const ATTRIBUTION_DAYS = 60; // ventana de atribución

// Guarda el código de referida con fecha de expiración.
export function saveReferral(code) {
    if (!code || typeof code !== 'string') return;
    const payload = {
        code: code.trim().toLowerCase(),
        exp: Date.now() + ATTRIBUTION_DAYS * 24 * 60 * 60 * 1000
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch { /* modo incógnito o storage lleno */ }

    // Cookie de respaldo (por si se limpia el localStorage).
    try {
        const maxAge = ATTRIBUTION_DAYS * 24 * 60 * 60;
        document.cookie = `${STORAGE_KEY}=${encodeURIComponent(payload.code)};path=/;max-age=${maxAge};SameSite=Lax`;
    } catch { /* noop */ }
}

// Devuelve el código vigente, o null si no hay / ya expiró.
export function getReferral() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.code && (!parsed.exp || parsed.exp > Date.now())) return parsed.code;
            localStorage.removeItem(STORAGE_KEY); // expirado
        }
    } catch { /* noop */ }

    // Fallback a la cookie
    try {
        const match = document.cookie.match(new RegExp(`(?:^|; )${STORAGE_KEY}=([^;]*)`));
        if (match) return decodeURIComponent(match[1]);
    } catch { /* noop */ }

    return null;
}

export function clearReferral() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    try { document.cookie = `${STORAGE_KEY}=;path=/;max-age=0`; } catch { /* noop */ }
}

// Lee ?ref=CODE de la URL actual (permite links tipo /?ref=darlis-a3f9 además de /r/darlis-a3f9)
export function captureReferralFromUrl() {
    try {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref) {
            saveReferral(ref);
            return ref;
        }
    } catch { /* noop */ }
    return null;
}
