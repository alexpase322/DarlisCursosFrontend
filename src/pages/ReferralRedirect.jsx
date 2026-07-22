import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { saveReferral } from "../utils/referral";
import { Loader2, CheckCircle2 } from "lucide-react";

// Ruta /r/:code — captura la atribución de la afiliada y redirige a la landing.
const ReferralRedirect = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [affiliate, setAffiliate] = useState(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            // Guardamos el código de inmediato (aunque la validación falle o vaya lenta),
            // así no perdemos la atribución si la red va mal.
            saveReferral(code);

            try {
                const { data } = await axios.get(`/affiliate/r/${encodeURIComponent(code)}`);
                if (!cancelled && data?.valid) setAffiliate(data.affiliate);
            } catch {
                // Código inválido: seguimos igual a la landing, sin atribución válida.
            }

            // Pequeña pausa para que se vea el mensaje de bienvenida.
            setTimeout(() => {
                if (!cancelled) navigate("/", { replace: true });
            }, 1400);
        })();

        return () => { cancelled = true; };
    }, [code, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1B3854] to-[#0d1f30] flex items-center justify-center p-6 text-white">
            <div className="text-center max-w-sm">
                {affiliate ? (
                    <>
                        <img
                            src={affiliate.avatar}
                            alt={affiliate.username}
                            className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-[#FDE5E5]"
                        />
                        <CheckCircle2 size={22} className="text-emerald-400 mx-auto mb-2" />
                        <p className="text-lg font-bold">
                            {affiliate.username} te invitó
                        </p>
                        <p className="text-sm text-white/70 mt-1">
                            Te estamos llevando a Arquitecta de tu Propio Éxito...
                        </p>
                    </>
                ) : (
                    <>
                        <Loader2 size={32} className="animate-spin mx-auto mb-4 text-[#FDE5E5]" />
                        <p className="text-lg font-bold">Un momento...</p>
                        <p className="text-sm text-white/70 mt-1">Preparando tu acceso</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReferralRedirect;
