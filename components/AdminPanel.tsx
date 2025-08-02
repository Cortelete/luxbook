import React, { useState, useEffect, memo, useCallback } from 'react';
import { UserData, CourseSection, AuthenticatedUser, Role } from '../lib/types';
import { graduationCodes } from '../data/graduationCodes';
import { aiChatCodes } from '../data/aiChatCodes';
import { UserIcon, KeyIcon, BookOpenIcon, PencilSquareIcon, AcademicCapIcon } from './icons';

type AdminTab = 'students' | 'codes' | 'modules';

const TabButton: React.FC<{ Icon: React.FC<any>, label: string, isActive: boolean, onClick: () => void }> = memo(({ Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold transition-all duration-300 border-b-2 ${
            isActive 
            ? 'border-gold text-gold' 
            : 'border-transparent text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover hover:text-gold'
        }`}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
));

const EditModuleForm: React.FC<{ section: CourseSection, onSave: (id: string, newTitle: string, newBrief: string) => void, onCancel: () => void }> = memo(({ section, onSave, onCancel }) => {
    const [title, setTitle] = useState(section.title);
    const [brief, setBrief] = useState(section.brief);

    const handleSave = useCallback(() => {
        onSave(section.id, title, brief);
    }, [onSave, section.id, title, brief]);

    return (
        <div className="bg-light-hover dark:bg-dark-hover p-4 rounded-lg my-4 border border-light-border dark:border-dark-border">
            <h4 className="text-lg font-bold text-gold mb-4">Editando: {section.title}</h4>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Título do Módulo</label>
                    <input 
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full p-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md focus:ring-2 focus:ring-gold focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Resumo do Módulo</label>
                    <textarea 
                        value={brief}
                        onChange={e => setBrief(e.target.value)}
                        rows={3}
                        className="w-full p-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md focus:ring-2 focus:ring-gold focus:outline-none"
                    />
                </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
                <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-light-border dark:hover:bg-dark-border transition-colors">Cancelar</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-bold bg-gold text-dark-bg rounded-md hover:bg-gold/80 transition-colors">Salvar Alterações</button>
            </div>
        </div>
    )
});


const AdminPanel: React.FC<{ allSections: CourseSection[], onUpdateSection: (id: string, newTitle: string, newBrief: string) => void }> = memo(({ allSections, onUpdateSection }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('students');
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

    const handleSaveModule = useCallback((id: string, newTitle: string, newBrief: string) => {
        onUpdateSection(id, newTitle, newBrief);
        setEditingSectionId(null);
    }, [onUpdateSection]);
    
    const handleCancelEdit = useCallback(() => setEditingSectionId(null), []);
    const handleSetEditingId = useCallback((id: string) => setEditingSectionId(id), []);

    return (
        <div className="p-4 sm:p-6 md:p-10 animate-page-enter">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-gold mb-2">Painel de Administração</h1>
                <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-8">Gerencie alunas, códigos de acesso e o conteúdo dos módulos.</p>

                <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-lg border border-light-border dark:border-dark-border">
                    <div className="flex border-b border-light-border dark:border-dark-border">
                        <TabButton Icon={UserIcon} label="Alunas" isActive={activeTab === 'students'} onClick={() => setActiveTab('students')} />
                        <TabButton Icon={KeyIcon} label="Códigos" isActive={activeTab === 'codes'} onClick={() => setActiveTab('codes')} />
                        <TabButton Icon={BookOpenIcon} label="Módulos" isActive={activeTab === 'modules'} onClick={() => setActiveTab('modules')} />
                    </div>

                    <div className="p-4 md:p-6">
                        {activeTab === 'students' && (
                            <div className="animate-fade-in-slide-up">
                                <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Gerenciar Alunas</h3>
                                <div className="bg-light-hover dark:bg-dark-hover p-6 rounded-lg border border-light-border dark:border-dark-border space-y-4 text-center">
                                  <p className="text-light-text-secondary dark:text-dark-text-secondary">O gerenciamento de alunas (visualizar, editar cargos, deletar) agora é feito diretamente no seu painel da Supabase para maior segurança e controle.</p>
                                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Para adicionar novas alunas, use a opção "Acesso Restrito" na tela de login.</p>
                                   <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-all">
                                        Acessar Painel Supabase
                                   </a>
                                </div>
                            </div>
                        )}

                        {activeTab === 'codes' && (
                            <div className="animate-fade-in-slide-up grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Códigos do Tutor IA</h3>
                                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3">Estes códigos liberam o acesso ao chat com IA.</p>
                                    <div className="bg-light-hover dark:bg-dark-hover p-4 rounded-lg space-y-2">
                                        {Array.from(aiChatCodes).map(code => (
                                            <p key={code} className="font-mono text-gold bg-dark-bg p-2 rounded text-center">{code}</p>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Códigos de Formatura</h3>
                                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3">Estes códigos liberam o acesso ao módulo final.</p>
                                    <div className="bg-light-hover dark:bg-dark-hover p-4 rounded-lg space-y-2">
                                        {Array.from(graduationCodes).map(code => (
                                            <p key={code} className="font-mono text-gold bg-dark-bg p-2 rounded text-center">{code}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'modules' && (
                             <div className="animate-fade-in-slide-up">
                                <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Gerenciar Módulos</h3>
                                <div className="space-y-2">
                                    {allSections.filter(s => s.id !== 'admin').map(section => (
                                        editingSectionId === section.id ? (
                                            <EditModuleForm 
                                                key={`${section.id}-edit`}
                                                section={section}
                                                onSave={handleSaveModule}
                                                onCancel={handleCancelEdit}
                                            />
                                        ) : (
                                            <div key={section.id} className="flex justify-between items-center p-3 bg-light-hover dark:bg-dark-hover rounded-lg">
                                                <div>
                                                    <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">{section.title}</p>
                                                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{section.brief}</p>
                                                </div>
                                                <button onClick={() => handleSetEditingId(section.id)} className="p-2 rounded-md hover:bg-gold/20 text-gold transition-colors">
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )
                                    ))}
                                </div>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AdminPanel;