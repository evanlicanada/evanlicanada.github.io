export interface StatusConfig {
  color: string;
  textClass: string;
  borderClass: string;
  bgClass: string;
}

export function getStatusConfig(status?: string): StatusConfig {
  const norm = (status || '').trim().toUpperCase();

  switch (norm) {
    case 'OPERATIONAL':
    case 'ACTIVE':
    case 'ONLINE':
      return {
        color: '#00E676',
        textClass: 'text-nasa-green',
        borderClass: 'border-[#00E676]/40',
        bgClass: 'bg-[#00E676]/10',
      };
    case 'DEPLOYED':
      return {
        color: '#00E5FF',
        textClass: 'text-nasa-cyan',
        borderClass: 'border-[#00E5FF]/40',
        bgClass: 'bg-[#00E5FF]/10',
      };
    case 'COMPLETED':
      return {
        color: '#38BDF8',
        textClass: 'text-sky-400',
        borderClass: 'border-sky-400/40',
        bgClass: 'bg-sky-400/10',
      };
    case 'IN DEVELOPMENT':
    case 'IN PROGRESS':
    case 'DEVELOPMENT':
      return {
        color: '#FF9900',
        textClass: 'text-nasa-amber',
        borderClass: 'border-[#FF9900]/40',
        bgClass: 'bg-[#FF9900]/10',
      };
    case 'PROTOTYPE':
    case 'TESTING':
    case 'EXPERIMENTAL':
      return {
        color: '#FACC15',
        textClass: 'text-yellow-400',
        borderClass: 'border-yellow-400/40',
        bgClass: 'bg-yellow-400/10',
      };
    default:
      return {
        color: '#94A3B8',
        textClass: 'text-nasa-muted',
        borderClass: 'border-white/20',
        bgClass: 'bg-white/5',
      };
  }
}
