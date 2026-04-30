import { Industria, Mecanismo, Seccion } from '@/lib/types';

interface TagBadgeProps {
  tipo: 'seccion' | 'industria' | 'mecanismo';
  valor: Seccion | Industria | Mecanismo | string;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export default function TagBadge({ tipo, valor, className = '', onClick, selected = false }: TagBadgeProps) {
  let baseStyles = "inline-flex items-center text-[10px] md:text-xs uppercase tracking-wider font-medium px-2 py-1 transition-colors ";
  
  if (tipo === 'seccion') {
    baseStyles += selected 
      ? "bg-foreground text-background border border-foreground " 
      : "bg-background border border-foreground text-foreground hover:bg-foreground hover:text-background ";
  } else if (tipo === 'industria') {
    baseStyles += selected
      ? "bg-muted text-background border border-muted "
      : "bg-background border border-muted text-muted hover:bg-muted hover:text-background ";
  } else {
    // mecanismo
    baseStyles += selected
      ? "bg-accent text-background border border-accent "
      : "bg-background border border-accent text-accent hover:bg-accent hover:text-background ";
  }

  const badge = (
    <span 
      className={`${baseStyles} ${onClick ? 'cursor-pointer' : ''} ${className}`} 
      onClick={onClick}
    >
      {valor}
    </span>
  );

  return badge;
}
