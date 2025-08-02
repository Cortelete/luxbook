import React, { useState, useEffect, memo, useCallback, FormEvent } from 'react';
import { UserData, CourseSection, CourseType, Role } from '../lib/types';
import { graduationCodes } from '../data/graduationCodes';
import { aiChatCodes } from '../data/aiChatCodes';
import { registerUser, getUsers } from '../services/authService';
import { UserIcon, KeyIcon, BookOpenIcon, PencilSquareIcon, AtSymbolIcon, LockClosedIcon, AcademicCapIcon, ShieldCheckIcon, RocketIcon, MegaphoneIcon, ConstructionIcon } from './icons';

type AdminTab = 'students' | 'add_student' | 'codes' | 'modules' | 'permissions' | 'messages';

const InputField: React.FC<{id:string, type:string, value:string, onChange: (val:string) => void, placeholder:string, Icon: React.FC<any>, required?: boolean}> = memo(({ id, type, value, onChange, placeholder, Icon, required = true }) => (
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-gray-400" />
        </span>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className="w-full pl-10 pr-4 py-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-gold transition-all"
            placeholder={placeholder}
        />
    </div>
));

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

const AddStudentPanel: React.FC<{ sessionToken: string | null, onUserAdded: () => void }> = memo(({ sessionToken, onUserAdded }) => {
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [profileName, setProfileName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginAlias, setLoginAlias] = useState('');
    const [courseType, setCourseType] = useState<CourseType>('Lash Profissional');

    const handleRegisterSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!sessionToken) {
            setError('Sessão inválida. Faça login novamente.');
            return;
        }

        if (password.length < 6 || !/\d/.test(password)) {
            setError('A senha deve ter no mínimo 6 caracteres e incluir um número.');
            return;
        }

        setIsLoading(true);

        try {
            const result = await registerUser({
                profileName,
                email,
                password,
                courseType,
                loginAlias: loginAlias || undefined,
                roles: ['student'] // Default role for new users
            }, sessionToken);

            if (result.success) {
                setSuccessMessage(result.message);
                setProfileName('');
                setEmail('');
                setPassword('');
                setLoginAlias('');
                onUserAdded(); // Callback to refresh the user list
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Ocorreu um erro de conexão ao tentar registrar.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [profileName, email, password, courseType, loginAlias, sessionToken, onUserAdded]);

    return (
        <div className="animate-fade-in-slide-up">
            <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Adicionar Nova Aluna</h3>
            <form onSubmit={handleRegisterSubmit} className="space-y-4 max-w-lg mx-auto">
                <InputField id="profileName" type="text" value={profileName} onChange={setProfileName} placeholder="Nome Completo da Aluna" Icon={UserIcon} />
                <InputField id="email" type="email" value={email} onChange={setEmail} placeholder="Email (obrigatório)" Icon={AtSymbolIcon} />
                <InputField id="loginAlias" type="text" value={loginAlias} onChange={setLoginAlias} placeholder="ID de Login (opcional)" Icon={UserIcon} required={false} />
                <InputField id="password" type="text" value={password} onChange={setPassword} placeholder="Defina a Senha" Icon={LockClosedIcon} />
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                    </span>
                    <select 
                        id="courseType" 
                        value={courseType} 
                        onChange={e => setCourseType(e.target.value as CourseType)}
                        className="w-full pl-10 pr-4 py-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                    >
                        <option value="Lash Profissional">Lash Profissional</option>
                        <option value="Lash Empreendedora">Lash Empreendedora</option>
                        <option value="Lash Empresária VIP">Lash Empresária VIP</option>
                    </select>
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                {successMessage && <p className="text-sm text-green-400 text-center">{successMessage}</p>}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 bg-gold text-dark-bg font-bold rounded-lg shadow-lg hover:bg-gold/90 transition-all disabled:bg-gold/50"
                    >
                        {isLoading ? 'Cadastrando...' : 'Cadastrar Aluna'}
                    </button>
                </div>
            </form>
        </div>
    );
});

const StudentsPanel: React.FC<{ sessionToken: string | null, currentUser: UserData | null }> = memo(({ sessionToken, currentUser }) => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = useCallback(async () => {
        if (!sessionToken) {
            setError('Sessão inválida.');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const fetchedUsers = await getUsers(sessionToken);
            setUsers(fetchedUsers);
        } catch (err: any) {
            setError(err.message || 'Falha ao buscar usuárias.');
        } finally {
            setIsLoading(false);
        }
    }, [sessionToken]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
    
    const formatRoles = (roles: Role[]): string => {
        const roleHierarchy = ['boss', 'admin', 'mentor', 'student'];
        return roles
          .sort((a, b) => roleHierarchy.indexOf(a) - roleHierarchy.indexOf(b))
          .map(role => role.charAt(0).toUpperCase() + role.slice(1))
          .join(', ');
    }

    if (isLoading) return <p className="text-center text-light-text-secondary dark:text-dark-text-secondary">Carregando lista de usuárias...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="animate-fade-in-slide-up">
            <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Gerenciar Alunas</h3>
            <div className="overflow-x-auto">
                 <table className="min-w-full bg-light-card dark:bg-dark-card">
                    <thead className="bg-light-hover dark:bg-dark-hover">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gold uppercase tracking-wider">Nome</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gold uppercase tracking-wider">Email / Alias</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gold uppercase tracking-wider">Curso</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gold uppercase tracking-wider">Cargos</th>
                            {currentUser?.roles.includes('boss') && <th className="px-4 py-2 text-left text-xs font-bold text-gold uppercase tracking-wider">Ações</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border dark:divide-dark-border">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-light-hover dark:hover:bg-dark-hover/50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">{user.name}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                    {user.email}
                                    {user.loginAlias && <span className="block text-xs italic opacity-75">Alias: {user.loginAlias}</span>}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-light-text-secondary dark:text-dark-text-secondary">{user.courseType}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-light-text-secondary dark:text-dark-text-secondary font-medium">{formatRoles(user.roles)}</td>
                                {currentUser?.roles.includes('boss') && (
                                     <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        <a 
                                            href={`https://app.supabase.com/`} // Simplified link
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gold hover:underline text-xs font-bold"
                                        >
                                           Gerenciar no Supabase
                                        </a>
                                    </td>
                                )}
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
    sessionToken: string | null;
}

const AdminPanel: React.FC<AdminPanelProps> = memo(({ allSections, onUpdateSection, authenticatedUser, sessionToken }) => {
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

    const [userListVersion, setUserListVersion] = useState(0);
    const refreshUserList = useCallback(() => setUserListVersion(v => v + 1), []);

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
                        {activeTab === 'students' && <StudentsPanel key={userListVersion} sessionToken={sessionToken} currentUser={authenticatedUser} />}
                        
                        {activeTab === 'add_student' && <AddStudentPanel sessionToken={sessionToken} onUserAdded={refreshUserList} />}

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
                                  <p className="text-light-text-secondary dark:text-dark-text-secondary">A alteração de cargos e permissões de usuárias é uma ação crítica e deve ser feita com máxima segurança diretamente no seu painel da Supabase.</p>
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