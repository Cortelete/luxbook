import React, { useState, FormEvent, useCallback, memo } from 'react';
import { login, registerUser } from '../services/authService';
import { UserIcon, LockClosedIcon, ShieldCheckIcon, CloseIcon, AcademicCapIcon, RocketIcon } from './icons';
import { UserData, CourseType } from '../lib/types';

interface LoginProps {
    onLoginSuccess: (user: UserData) => void;
}

const InputField: React.FC<{id:string, type:string, value:string, onChange: (val:string) => void, placeholder:string, Icon: React.FC<any>}> = memo(({ id, type, value, onChange, placeholder, Icon }) => (
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-gray-400" />
        </span>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border rounded-lg text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-gold transition-all"
            placeholder={placeholder}
        />
    </div>
));


const AdminGateModal: React.FC<{ onClose: () => void, onAdminSuccess: () => void, onBossSuccess: () => void }> = memo(({ onClose, onAdminSuccess, onBossSuccess }) => {
    const [accessType, setAccessType] = useState<'admin' | 'boss' | null>(null);
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');
    
    // Códigos de acesso locais para abrir os painéis. NÃO são senhas de usuário.
    const ADMIN_CODE = 'luxadmin24';
    const BOSS_CODE = 'i4rt3i4';

    const handleAccessSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (accessType === 'admin') {
            if (accessCode.trim().toLowerCase() === ADMIN_CODE) {
                onAdminSuccess();
            } else {
                setError('Código de administrador inválido.');
            }
        } else if (accessType === 'boss') {
            if (accessCode.trim() === BOSS_CODE) {
                onBossSuccess();
            } else {
                setError('Código de Boss inválido.');
            }
        }
    };
    
    if (!accessType) {
        return (
             <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-dark-card p-8 rounded-2xl shadow-2xl border border-dark-border w-full max-w-sm animate-page-enter" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gold">Acesso Restrito</h3>
                        <button onClick={onClose} className="text-dark-text-secondary hover:text-gold"><CloseIcon className="w-6 h-6"/></button>
                    </div>
                    <div className="space-y-4">
                        <button onClick={() => setAccessType('admin')} className="w-full text-left flex items-center space-x-4 p-4 bg-dark-hover rounded-lg hover:border-gold border border-transparent transition-all">
                            <ShieldCheckIcon className="w-8 h-8 text-gold"/>
                            <div>
                                <p className="font-bold text-white">Cadastrar Aluna</p>
                                <p className="text-sm text-dark-text-secondary">Criar um novo acesso de aluna.</p>
                            </div>
                        </button>
                        <button onClick={() => setAccessType('boss')} className="w-full text-left flex items-center space-x-4 p-4 bg-dark-hover rounded-lg hover:border-gold border border-transparent transition-all">
                            <RocketIcon className="w-8 h-8 text-red-500"/>
                            <div>
                                <p className="font-bold text-white">Acesso Boss</p>
                                <p className="text-sm text-dark-text-secondary">Gerenciamento avançado de sistema.</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-dark-card p-8 rounded-2xl shadow-2xl border border-dark-border w-full max-w-sm animate-page-enter" onClick={e => e.stopPropagation()}>
                 <button onClick={() => setAccessType(null)} className="text-sm text-gold hover:underline font-semibold mb-4">&larr; Voltar</button>
                <h3 className="text-xl font-bold text-gold mb-2">Verificação de {accessType === 'admin' ? 'Admin' : 'Boss'}</h3>
                <p className="text-dark-text-secondary mb-6 text-sm">Insira o código de acesso para continuar.</p>
                <form onSubmit={handleAccessSubmit} className="space-y-4">
                     <InputField id="admin_code" type="password" value={accessCode} onChange={setAccessCode} placeholder={`Código de ${accessType === 'admin' ? 'Admin' : 'Boss'}`} Icon={accessType === 'admin' ? ShieldCheckIcon : RocketIcon} />
                     {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                     <button type="submit" className="w-full py-3 bg-gold text-dark-bg font-bold rounded-lg hover:bg-gold/90 transition-all">
                        Verificar
                     </button>
                </form>
            </div>
        </div>
    );
});


const Login: React.FC<LoginProps> = memo(({ onLoginSuccess }) => {
    const [view, setView] = useState<'login' | 'register' | 'bossPanel'>('login');
    const [showAdminGate, setShowAdminGate] = useState(false);
    
    // Shared state
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Login state
    const [loginId, setLoginId] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register state
    const [profileName, setProfileName] = useState('');
    const [registerId, setRegisterId] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [courseType, setCourseType] = useState<CourseType>('Lash Profissional');

    const handleLoginSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);
        
        try {
            const userData = await login(loginId, loginPassword);
            if (userData) {
                onLoginSuccess(userData);
            } else {
                 // A função de login agora lança um erro, então isso é um fallback
                setError('ID de login ou senha inválidos.');
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro ao tentar fazer login.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [loginId, loginPassword, onLoginSuccess]);

    const handleRegisterSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Validação de senha no frontend
        if (registerPassword.length < 6 || !/\d/.test(registerPassword)) {
            setError('A senha deve ter no mínimo 6 caracteres e incluir um número.');
            return;
        }

        setIsLoading(true);

        try {
            const result = await registerUser({
                profileName,
                loginId: registerId,
                password: registerPassword,
                courseType,
            });

            if (result.success) {
                setSuccessMessage(result.message);
                // Limpar campos após o sucesso
                setProfileName('');
                setRegisterId('');
                setRegisterPassword('');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Ocorreu um erro ao tentar registrar.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [profileName, registerId, registerPassword, courseType]);

    const onAdminSuccess = useCallback(() => {
        setShowAdminGate(false);
        setView('register');
        setError('');
        setSuccessMessage('');
    }, []);
    
    const onBossSuccess = useCallback(() => {
        setShowAdminGate(false);
        setView('bossPanel');
        setError('');
        setSuccessMessage('');
    }, []);

    const resetView = useCallback(() => {
        setView('login');
        setError('');
        setSuccessMessage('');
        setProfileName('');
        setRegisterId('');
        setRegisterPassword('');
    }, []);

    const loginView = (
        <form id="login-form" onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
                <label htmlFor="loginId" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">ID de Login (Email)</label>
                <InputField id="loginId" type="email" value={loginId} onChange={setLoginId} placeholder="Insira seu email" Icon={UserIcon}/>
            </div>
            <div>
                <label htmlFor="loginPassword"className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Senha</label>
                <InputField id="loginPassword" type="password" value={loginPassword} onChange={setLoginPassword} placeholder="Insira sua senha" Icon={LockClosedIcon}/>
            </div>
        </form>
    );

    const registerView = (
        <form id="register-form" onSubmit={handleRegisterSubmit} className="space-y-4">
            <button type="button" onClick={resetView} className="text-sm text-gold hover:underline font-semibold mb-4">&larr; Voltar para Login</button>
            <h3 className="text-xl font-bold text-center text-white pb-2">Cadastro de Nova Aluna</h3>
            <InputField id="profileName" type="text" value={profileName} onChange={setProfileName} placeholder="Nome Completo da Aluna" Icon={UserIcon} />
            <InputField id="registerId" type="email" value={registerId} onChange={setRegisterId} placeholder="ID de Login (email da aluna)" Icon={UserIcon} />
            <InputField id="registerPassword" type="text" value={registerPassword} onChange={setRegisterPassword} placeholder="Defina a Senha" Icon={LockClosedIcon} />
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                </span>
                <select 
                    id="courseType" 
                    value={courseType} 
                    onChange={e => setCourseType(e.target.value as CourseType)}
                    className="w-full pl-10 pr-4 py-2 bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border rounded-lg text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                >
                    <option>Lash Profissional</option>
                    <option>Lash Empreendedora</option>
                    <option>Lash Empresária VIP</option>
                </select>
            </div>
        </form>
    );
    
    const bossPanelView = (
        <div className="text-center">
             <button type="button" onClick={resetView} className="text-sm text-gold hover:underline font-semibold mb-4">&larr; Voltar para Login</button>
            <h3 className="text-xl font-bold text-white pb-2">Painel Boss</h3>
            <p className="text-dark-text-secondary text-sm">O gerenciamento avançado de cargos e permissões de usuárias é feito diretamente no seu painel da Supabase para máxima segurança.</p>
             <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block w-full py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-all">
                Acessar Supabase
             </a>
        </div>
    );

    const currentViewContent = () => {
        switch (view) {
            case 'login': return loginView;
            case 'register': return registerView;
            case 'bossPanel': return bossPanelView;
            default: return loginView;
        }
    }
    
    const getTitle = () => {
         switch (view) {
            case 'login': return 'Acesso exclusivo para alunas';
            case 'register': return 'Ferramenta de Cadastro Admin';
            case 'bossPanel': return 'Gerenciador de Sistema';
            default: return 'Acesso exclusivo para alunas';
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg p-4 font-sans">
            {showAdminGate && <AdminGateModal onClose={() => setShowAdminGate(false)} onAdminSuccess={onAdminSuccess} onBossSuccess={onBossSuccess} />}
            <div className="w-full max-w-sm mx-auto">
                <div className="text-center mb-8">
                     <h1 className="text-4xl font-bold text-gold">Luxury Academy</h1>
                     <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
                        {getTitle()}
                     </p>
                </div>

                <div className="bg-light-card dark:bg-dark-card p-8 rounded-2xl shadow-2xl border border-light-border dark:border-dark-border">
                    {currentViewContent()}
                    
                    {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
                    {successMessage && <p className="mt-4 text-sm text-green-400 text-center">{successMessage}</p>}


                    {view !== 'bossPanel' && <div className="mt-6">
                        <button
                            type="submit"
                            form={view === 'login' ? 'login-form' : 'register-form'}
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 bg-gold text-dark-bg font-bold rounded-lg shadow-lg hover:bg-gold/90 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 transition-all transform hover:scale-105 disabled:bg-gold/50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Aguarde...' : (view === 'login' ? 'Entrar' : 'Cadastrar Aluna')}
                        </button>
                    </div>}

                    {view === 'login' && (
                        <div className="mt-6 text-center">
                            <button onClick={() => setShowAdminGate(true)} className="text-sm text-gray-400 hover:text-gold hover:underline font-semibold">
                                Acesso Restrito
                            </button>
                        </div>
                    )}
                </div>
                 <footer className="text-center text-light-text-secondary dark:text-dark-text-secondary text-xs mt-8">
                    <p>
                    Por Joyci Almeida • <a href="https://instagram.com/luxury.joycialmeida" target="_blank" rel="noopener noreferrer" className="hover:text-gold">@luxury.joycialmeida</a>
                    </p>
                    <p className="mt-2">
                    Desenvolvido por <a href="https://www.instagram.com/InteligenciArte.IA" target="_blank" rel="noopener noreferrer" className="hover:text-gold">@InteligenciArte.IA</a>
                    </p>
                 </footer>
            </div>
        </div>
    );
});

export default Login;