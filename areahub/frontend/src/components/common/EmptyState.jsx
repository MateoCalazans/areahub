export default function EmptyState({ icon = 'inbox', message, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="material-symbols-outlined mb-3 text-5xl text-outline-variant">
        {icon}
      </span>
      <p className="font-headline text-lg font-medium text-on-surface">
        {message}
      </p>
      {description && (
        <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
      )}
    </div>
  );
}
