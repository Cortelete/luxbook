import React, { useState, useEffect, memo, useCallback, FormEvent } from 'react';
import { UserData, CourseSection, CourseType, Role } from '../lib/types';
import { graduationCodes } from '../data/graduationCodes';
import { aiChatCodes } from '../data/aiChatCodes';
import { getUsers } from '../services/authService';
import { UserIcon, KeyIcon, BookOpenIcon, PencilSquareIcon, AtSymbolIcon, LockClosedIcon, AcademicCapIcon, ShieldCheckIcon, RocketIcon, MegaphoneIcon, ConstructionIcon } from './icons';

type AdminTab = 'students' | 'add_student' | 'codes' | 'modules' | 'permissions' | 'messages';

const TabButton: React.FC<{ Icon: React.FC<any>, label: string, isActive: boolean, onClick: () => void, isVisible?: boolean }> = memo(({ Icon, label, isActive, onClick, isVisible = true }) => {
    if (!isVisible) return null;
    return (
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
    );
});

const AddStudentPanel: React.FC = memo(() => {
    return (
        <div className="animate-fade-in-slide-up text-center">
            <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Como Adicionar Nova Aluna</h3>
            <div className="bg-light-hover dark:bg-dark-hover p-6 rounded-lg border border-light-border dark:border-dark-border space-y-4 text-left max-w-2xl mx-auto">
                <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">O processo de cadastro de alunas segue o sistema de Código de Acesso como chave:</p>
                <ol className="list-decimal list-inside space-y-3 text-light-text-secondary dark:text-dark-text-secondary">
                    <li>
                        <strong>Defina o Código de Acesso:</strong>
                        <p className="ml-4 mt-1">Crie um código de acesso único e secreto para a nova aluna (ex: <code className="bg-dark-bg text-gold px-1 rounded-md text-xs">'NOVATURMA2024'</code>).</p>
                    </li>
                    <li>
                        <strong>Edite o Arquivo de Credenciais:</strong>
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                            <li>Abra o arquivo <code className="bg-dark-bg text-gold px-2 py-1 rounded-md text-sm">data/userCredentials.ts</code> no código-fonte da aplicação.</li>
                            <li>No objeto <code className="bg-dark-bg text-gold px-1 rounded-md text-xs">userAccessCodes</code>, adicione uma nova entrada.</li>
                            <li>A <strong>chave</strong> será o código de acesso que você criou (entre aspas e em maiúsculas).</li>
                            <li>O <strong>valor</strong> será um objeto com os dados da aluna: <code className="bg-dark-bg text-gold px-1 rounded-md text-xs">id</code> (único, minúsculo), <code className="bg-dark-bg text-gold px-1 rounded-md text-xs">name</code>, <code className="bg-dark-bg text-gold px-1 rounded-md text-xs">email</code>, e <code className="bg-dark-bg text-gold px-1 rounded-md text-xs">courseType</code>.</li>
                        </ul>
                    </li>
                     <li>
                        <strong>Exemplo:</strong>
                        <pre className="bg-dark-bg text-xs text-dark-text-primary p-3 rounded-md overflow-x-auto mt-2">
{`'NOVATURMA2024': {
  id: 'nomealuna',
  name: 'Nome Completo da Aluna',
  email: 'email@aluna.com',
  roles: ['student'],
  courseType: 'Lash Profissional',
},`}
                        </pre>
                    </li>
                    <li>
                        <strong>Publique a Atualização:</strong>
                        <p className="ml-4 mt-1">Salve o arquivo e faça o "deploy" (publicação) da nova versão na Vercel para que as mudanças entrem em vigor.</p>
                    </li>
                </ol>
                 <p className="mt-4 text-sm text-yellow-600 dark:text-yellow-400">
                    <strong>Atenção:</strong> Este sistema é muito direto, mas lembre-se que os códigos de acesso são visíveis no código-fonte.
                </p>
            </div>
        </div>
    );
});

const StudentsPanel: React.FC<{ currentUser: UserData | null }> = memo(({ currentUser }) => {
    const [users, setUsers] = useState<UserData[]>([]);

    useEffect(() => {
        // Busca as usuárias do serviço local, não mais de uma API
        setUsers(getUsers());
    }, []);
    
    const formatRoles = (roles: Role[]): string => {
        const roleHierarchy = ['boss', 'admin', 'mentor', 'student'];
        return roles
          .sort((a, b) => roleHierarchy.indexOf(a) - roleHierarchy.indexOf(b))
          .map(role => role.charAt(0).toUpperCase() + role.slice(1))
          .join(', ');
    }

    return (
        <div className="animate-fade-in-slide-up">
            <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Gerenciar Alunas</h3>
            <div className="overflow-x-auto">
                 <table className="min-w-full bg-light-card dark:bg-dark-card">
                    <thead className="bg-light-hover dark:bg-dark-hover">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gold uppercase tracking-wider">Nome</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gold uppercase tracking-wider">Email</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gold uppercase tracking-wider">Curso</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gold uppercase tracking-wider">Cargos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border dark:divide-dark-border">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-light-hover dark:hover:bg-dark-hover/50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">{user.name}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-light-text-secondary dark:text-dark-text-secondary">{user.email}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-light-text-secondary dark:text-dark-text-secondary">{user.courseType}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-light-text-secondary dark:text-dark-text-secondary font-medium">{formatRoles(user.roles)}</td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    );
});


const EditModuleForm: React.FC<{
    section: CourseSection;
    title: string;
    brief: string;
    onTitleChange: (v: string) => void;
    onBriefChange: (v: string) => void;
    onSave: () => void;
    onCancel: () => void;
}> = memo(({ section, title, brief, onTitleChange, onBriefChange, onSave, onCancel }) => {
    return (
        <div className="bg-light-hover dark:bg-dark-hover p-4 rounded-lg my-2 border border-gold/50 animate-fade-in-slide-up">
            <h4 className="text-lg font-bold text-gold mb-4">Editando: {section.title}</h4>
            <div className="space-y-4">
                <div>
                    <label htmlFor="edit-title" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Título do Módulo</label>
                    <input id="edit-title" type="text" value={title} onChange={e => onTitleChange(e.target.value)} className="w-full p-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md" />
                </div>
                <div>
                    <label htmlFor="edit-brief" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">Descrição Breve</label>
                    <textarea id="edit-brief" value={brief} onChange={e => onBriefChange(e.target.value)} className="w-full p-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md" rows={3}></textarea>
                </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
                <button onClick={onCancel} className="px-4 py-2 text-sm rounded-md hover:bg-light-border dark:hover:bg-dark-border transition-colors">Cancelar</button>
                <button onClick={onSave} className="px-4 py-2 text-sm rounded-md bg-gold text-dark-bg font-semibold hover:bg-gold/90 transition-colors">Salvar Alterações</button>
            </div>
        </div>
    );
});


interface AdminPanelProps {
    allSections: CourseSection[];
    onUpdateSection: (id: string, newTitle: string, newBrief: string) => void;
    authenticatedUser: UserData | null;
}

const AdminPanel: React.FC<AdminPanelProps> = memo(({ allSections, onUpdateSection, authenticatedUser }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('students');
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [editingBrief, setEditingBrief] = useState('');

    const handleEditClick = useCallback((section: CourseSection) => {
        setEditingSectionId(section.id);
        setEditingTitle(section.title);
        setEditingBrief(section.brief);
    }, []);

    const handleSaveModule = useCallback((id: string) => {
        onUpdateSection(id, editingTitle, editingBrief);
        setEditingSectionId(null);
    }, [onUpdateSection, editingTitle, editingBrief]);
    
    const handleCancelEdit = useCallback(() => setEditingSectionId(null), []);

    const isBoss = authenticatedUser?.roles.includes('boss') ?? false;
    const isAdmin = authenticatedUser?.roles.includes('admin') ?? false;
    const isMentor = authenticatedUser?.roles.includes('mentor') ?? false;

    return (
        <div className="p-4 sm:p-6 md:p-10 animate-page-enter">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-gold mb-2">Painel de Administração</h1>
                <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-8">Gerencie alunas, códigos de acesso e o conteúdo dos módulos.</p>

                <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-lg border border-light-border dark:border-dark-border">
                    <div className="flex border-b border-light-border dark:border-dark-border overflow-x-auto">
                        <TabButton Icon={UserIcon} label="Alunas" isActive={activeTab === 'students'} onClick={() => setActiveTab('students')} />
                        <TabButton Icon={UserIcon} label="Adicionar Aluna" isActive={activeTab === 'add_student'} onClick={() => setActiveTab('add_student')} isVisible={isAdmin || isBoss} />
                        <TabButton Icon={KeyIcon} label="Códigos" isActive={activeTab === 'codes'} onClick={() => setActiveTab('codes')} />
                        <TabButton Icon={BookOpenIcon} label="Módulos" isActive={activeTab === 'modules'} onClick={() => setActiveTab('modules')} />
                        <TabButton Icon={RocketIcon} label="Permissões" isActive={activeTab === 'permissions'} onClick={() => setActiveTab('permissions')} isVisible={isBoss} />
                        <TabButton Icon={MegaphoneIcon} label="Mensagens" isActive={activeTab === 'messages'} onClick={() => setActiveTab('messages')} isVisible={isBoss || isAdmin || isMentor} />
                    </div>

                    <div className="p-4 md:p-6">
                        {activeTab === 'students' && <StudentsPanel currentUser={authenticatedUser} />}
                        
                        {activeTab === 'add_student' && <AddStudentPanel />}

                        {activeTab === 'messages' && (
                            <div className="animate-fade-in-slide-up text-center">
                                <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Mensagens Internas</h3>
                                <div className="bg-light-hover dark:bg-dark-hover p-6 rounded-lg border border-light-border dark:border-dark-border space-y-4">
                                    <ConstructionIcon className="w-12 h-12 text-gold/50 mx-auto" />
                                    <p className="text-light-text-secondary dark:text-dark-text-secondary">O sistema de mensagens internas para mentoras solicitarem alterações de conteúdo está em desenvolvimento e será implementado em breve.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'permissions' && isBoss && (
                             <div className="animate-fade-in-slide-up text-center">
                                <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Gerenciamento de Permissões (Boss)</h3>
                                <div className="bg-light-hover dark:bg-dark-hover p-6 rounded-lg border border-light-border dark:border-dark-border space-y-4">
                                  <p className="text-light-text-secondary dark:text-dark-text-secondary">A alteração de cargos (roles) de uma usuária é uma ação crítica. Para garantir a segurança, ela deve ser feita diretamente no arquivo de configuração <code className="bg-dark-bg text-gold px-2 py-1 rounded-md text-sm">data/userCredentials.ts</code>.</p>
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
                                                title={editingTitle}
                                                brief={editingBrief}
                                                onTitleChange={setEditingTitle}
                                                onBriefChange={setEditingBrief}
                                                onSave={() => handleSaveModule(section.id)}
                                                onCancel={handleCancelEdit}
                                            />
                                        ) : (
                                            <div key={section.id} className="flex justify-between items-center p-3 bg-light-hover dark:bg-dark-hover rounded-lg">
                                                <div>
                                                    <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">{section.title}</p>
                                                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{section.brief}</p>
                                                </div>
                                                <button onClick={() => handleEditClick(section)} className="p-2 rounded-md hover:bg-gold/20 text-gold transition-colors">
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
