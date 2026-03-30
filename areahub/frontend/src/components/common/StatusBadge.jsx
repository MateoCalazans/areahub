const statusConfig = {
  PENDENTE: {
    bg: 'bg-warning-light',
    text: 'text-warning',
    label: 'Pendente',
  },
  APROVADA: {
    bg: 'bg-success-light',
    text: 'text-success',
    label: 'Aprovada',
  },
  CANCELADA: {
    bg: 'bg-error-container',
    text: 'text-on-error-container',
    label: 'Cancelada',
  },
  REJEITADA: {
    bg: 'bg-error-container',
    text: 'text-on-error-container',
    label: 'Rejeitada',
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.PENDENTE;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
