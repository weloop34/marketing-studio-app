
import React from 'react';

interface DetailItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, icon }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-[0.1em]">{label}</span>
    </div>
    <p className="text-[13px] font-extrabold text-[#0f172a] dark:text-slate-100 leading-tight truncate" title={value}>
      {value || '-'}
    </p>
  </div>
);

export default DetailItem;
