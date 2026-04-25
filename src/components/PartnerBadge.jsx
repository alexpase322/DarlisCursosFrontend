import { levelInfo } from '../config/partnerLevels';

const PartnerBadge = ({ level, size = 'md', showName = true, className = '' }) => {
  if (!level) return null;
  const info = levelInfo(level);
  const Icon = info.icon;

  const sizes = {
    sm: { padding: 'px-2 py-0.5', text: 'text-[11px]', icon: 12, gap: 'gap-1' },
    md: { padding: 'px-3 py-1',   text: 'text-xs',     icon: 14, gap: 'gap-1.5' },
    lg: { padding: 'px-4 py-1.5', text: 'text-sm',     icon: 16, gap: 'gap-2' }
  };
  const s = sizes[size] || sizes.md;

  return (
    <span
      className={`inline-flex items-center ${s.gap} ${s.padding} ${s.text} font-bold rounded-full text-white shadow-sm ${className}`}
      style={{ backgroundColor: info.color }}
    >
      <Icon size={s.icon} />
      {showName && <span>{info.name}</span>}
    </span>
  );
};

export default PartnerBadge;
