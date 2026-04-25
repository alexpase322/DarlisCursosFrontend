// Espejo de server/config/affiliateConfig.js (subset usado por la UI).
// Mantener sincronizado si cambias colores o nombres.
import { User, Sparkles, Award, Crown } from 'lucide-react';

export const PARTNER_LEVELS = {
  1: { name: 'Alumna',           color: '#94a3b8', icon: User,     blurb: 'En formación, aún sin vender.' },
  2: { name: 'Partner activada', color: '#905361', icon: Sparkles, blurb: 'Punto de entrada. Recibes link y kit.' },
  3: { name: 'Seller autorizada',color: '#1B3854', icon: Award,    blurb: 'Capacitación comercial + CRM interno.' },
  4: { name: 'Closer interna',   color: '#D4AF37', icon: Crown,    blurb: 'Solo por invitación. High-ticket.' }
};

export function levelInfo(level) {
  return PARTNER_LEVELS[level] || PARTNER_LEVELS[1];
}
