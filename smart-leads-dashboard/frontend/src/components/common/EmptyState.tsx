import React from 'react';
import { Database } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-darkBorder bg-white/30 dark:bg-darkCard/10 backdrop-blur-sm">
      <div className="p-4 rounded-full bg-slate-50 dark:bg-darkCard text-slate-400 dark:text-slate-500 mb-4 shadow-sm">
        {icon || <Database className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
