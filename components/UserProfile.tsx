import React, { memo } from 'react';
import { UserData } from '../lib/types';
import { CloseIcon, UserIcon, AtSymbolIcon, AcademicCapIcon, IdentificationIcon } from './icons';

interface UserProfileProps {
  user: UserData;
  onClose: () => void;
}

const InfoRow: React.FC<{ Icon: React.FC<any>, label: string, value: string | undefined }> = memo(({ Icon, label, value }) => {
    if (!value) return null;
    
    return (
        <div className="flex items-start space-x-4 py-3">
            <Icon className="w-6 h-6 text-gold mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{label}</p>
                <p className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary break-all">{value}</p>
            </div>
        </div>
    );
});


const UserProfile: React.FC<UserProfileProps> = memo(({ user, onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
        onClick={onClose}
    >
        <div 
            className="relative bg-light-card dark:bg-dark-card rounded-xl shadow-2xl w-full max-w-md text-left border border-light-border dark:border-dark-border animate-page-enter"
            onClick={e => e.stopPropagation()}
        >
            <div className="p-5 border-b border-light-border dark:border-dark-border flex justify-between items-center">
                <h3 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">Perfil da Aluna</h3>
                <button onClick={onClose} className="text-light-text-secondary dark:text-dark-text-secondary hover:text-gold transition-colors">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="p-6 divide-y divide-light-border dark:divide-dark-border">
                <InfoRow Icon={UserIcon} label="Nome da Aluna" value={user.name} />
                <InfoRow Icon={AtSymbolIcon} label="Email" value={user.email} />
                <InfoRow Icon={AcademicCapIcon} label="Plano de Curso" value={user.courseType} />
            </div>
        </div>
    </div>
  );
});

export default UserProfile;