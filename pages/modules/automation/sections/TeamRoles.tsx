
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { autoTranslations } from '../i18n';
// Added Clock to the imported icons
import { Users, UserPlus, Shield, MoreVertical, Hash, Mail, ChevronRight, Check, Clock } from 'lucide-react';

const TeamRoles: React.FC = () => {
  const { language } = useApp();

  const members = [
    { id: '1', name: 'Alex Cooper', role: 'ADMIN', status: 'active', email: 'alex@company.com' },
    { id: '2', name: 'Sam Taylor', role: 'MANAGER', status: 'active', email: 'sam@company.com' },
    { id: '3', name: 'Jordan Lee', role: 'MEMBER', status: 'invited', email: 'jordan@company.com' },
  ];

  const getRoleStyle = (role: string) => {
    switch(role) {
      case 'ADMIN': return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20';
      case 'MANAGER': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'text-slate-500 bg-gray-50 dark:bg-slate-900';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg">My Team</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-200 dark:shadow-none active:scale-95 transition-all">
          <UserPlus size={16} /> Invite
        </button>
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{member.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{member.email}</p>
                </div>
              </div>
              <button className="text-slate-300"><MoreVertical size={16} /></button>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-700">
               <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${getRoleStyle(member.role)}`}>
                {member.role}
               </span>
               <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase">
                  {member.status === 'active' ? <Check size={12} className="text-emerald-500" /> : <Clock size={12} />}
                  {member.status}
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl" />
        <div className="flex items-center gap-3 mb-4">
          <Shield size={24} className="text-orange-500" />
          <h4 className="text-lg font-bold">Permissions</h4>
        </div>
        <p className="text-xs text-slate-400 mb-6">Configure what each role can do within your automation workspace.</p>
        <button className="w-full py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-all">
          Manage Roles
        </button>
      </div>
    </div>
  );
};

export default TeamRoles;
