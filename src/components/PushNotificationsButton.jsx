import { Bell, BellOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usePushNotifications } from '../hooks/usePushNotifications';

const PushNotificationsButton = ({ className = '' }) => {
    const { supported, permission, subscribed, busy, subscribe, unsubscribe } = usePushNotifications();

    if (!supported) return null;
    if (permission === 'denied') {
        return (
            <div className={`text-xs text-gray-500 flex items-center gap-1 ${className}`}>
                <BellOff size={14} /> Notificaciones bloqueadas en el navegador
            </div>
        );
    }

    const onClick = async () => {
        if (subscribed) {
            await unsubscribe();
            toast.success('Notificaciones desactivadas');
        } else {
            const ok = await subscribe();
            if (ok) toast.success('¡Listo! Te avisaremos.');
            else toast.error('No se pudieron activar');
        }
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={busy}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-bold transition disabled:opacity-60 ${
                subscribed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-white border-[#905361]/30 text-[#905361] hover:bg-[#FDE5E5]'
            } ${className}`}
        >
            {busy ? <Loader2 size={16} className="animate-spin" /> : (subscribed ? <Bell size={16} /> : <BellOff size={16} />)}
            {subscribed ? 'Notificaciones activas' : 'Activar notificaciones'}
        </button>
    );
};

export default PushNotificationsButton;
