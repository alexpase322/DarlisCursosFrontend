import { useCallback, useEffect, useState } from 'react';
import axios from '../api/axios';

const urlBase64ToUint8Array = (b64) => {
    const padding = '='.repeat((4 - b64.length % 4) % 4);
    const base64 = (b64 + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(base64);
    const out = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; ++i) out[i] = raw.charCodeAt(i);
    return out;
};

export function usePushNotifications() {
    const [supported, setSupported] = useState(false);
    const [permission, setPermission] = useState('default');
    const [subscribed, setSubscribed] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        const ok = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
        setSupported(ok);
        if (ok) setPermission(Notification.permission);
        (async () => {
            if (!ok) return;
            try {
                const reg = await navigator.serviceWorker.ready;
                const sub = await reg.pushManager.getSubscription();
                setSubscribed(!!sub);
            } catch { /* noop */ }
        })();
    }, []);

    const subscribe = useCallback(async () => {
        if (!supported || busy) return false;
        setBusy(true);
        try {
            const perm = await Notification.requestPermission();
            setPermission(perm);
            if (perm !== 'granted') return false;

            const { data } = await axios.get('/push/public-key');
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(data.publicKey)
            });

            const json = sub.toJSON();
            await axios.post('/push/subscribe', {
                endpoint: json.endpoint,
                keys: { p256dh: json.keys.p256dh, auth: json.keys.auth }
            });
            setSubscribed(true);
            return true;
        } catch (e) {
            console.error('subscribe push:', e);
            return false;
        } finally {
            setBusy(false);
        }
    }, [supported, busy]);

    const unsubscribe = useCallback(async () => {
        if (!supported || busy) return;
        setBusy(true);
        try {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.getSubscription();
            if (sub) {
                await axios.post('/push/unsubscribe', { endpoint: sub.endpoint }).catch(() => {});
                await sub.unsubscribe();
            }
            setSubscribed(false);
        } finally {
            setBusy(false);
        }
    }, [supported, busy]);

    return { supported, permission, subscribed, busy, subscribe, unsubscribe };
}
