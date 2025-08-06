import React, { useState, FormEvent, useCallback, memo, useRef, useEffect } from 'react';
import { KeyIcon, IdentificationIcon, EyeIcon, EyeSlashIcon } from './icons';
import { UserData } from '../lib/types';

interface LoginProps {
    onLoginSuccess: (user: UserData) => void;
}

const InputField: React.FC<{
    id:string, 
    type:string, 
    value:string, 
    onChange: (val:string) => void, 
    placeholder:string, 
    Icon: React.FC<any>, 
    required?: boolean,
    autoCapitalize?: 'on' | 'off' | 'none' | 'sentences' | 'words' | 'characters',
    className?: string;
}> = memo(({ id, type, value, onChange, placeholder, Icon, required = true, autoCapitalize = 'none', className = '' }) => (
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
            autoCapitalize={autoCapitalize}
            className={`w-full pl-10 pr-4 py-3 bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border rounded-lg text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-gold transition-all ${className}`}
            placeholder={placeholder}
        />
    </div>
));

const Login: React.FC<LoginProps> = memo(({ onLoginSuccess }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [isCodeVisible, setIsCodeVisible] = useState(false);
    const visibilityTimerRef = useRef<number | null>(null);

    const handleLoginSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, accessCode }),
            });

            const data = await response.json();

            if (response.ok) {
                onLoginSuccess(data as UserData);
            } else {
                setError(data.error || 'ID de Usuário ou Código de Acesso inválido.');
            }
        } catch (err: any) {
            setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
            console.error("Login API call failed:", err);
        } finally {
            setIsLoading(false);
        }
    }, [userId, accessCode, onLoginSuccess]);

    const showCodeTemporarily = useCallback(() => {
        if (visibilityTimerRef.current) {
            clearTimeout(visibilityTimerRef.current);
        }
        setIsCodeVisible(true);
        visibilityTimerRef.current = window.setTimeout(() => {
            setIsCodeVisible(false);
        }, 5000);
    }, []);

    useEffect(() => {
        return () => {
            if (visibilityTimerRef.current) {
                clearTimeout(visibilityTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg p-4 font-sans">
            <div className="w-full max-w-sm mx-auto">
                <div className="text-center mb-8">
                     <h1 className="text-4xl font-bold text-gold">Luxury Academy</h1>
                     <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
                        Acesso exclusivo para alunas
                     </p>
                </div>

                <div className="bg-light-card dark:bg-dark-card p-8 rounded-2xl shadow-2xl border border-light-border dark:border-dark-border">
                    <form id="login-form" onSubmit={handleLoginSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="user-id" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">ID de Usuário</label>
                            <InputField 
                                id="user-id" 
                                type="text" 
                                value={userId} 
                                onChange={setUserId} 
                                placeholder="SEU ID DE USUÁRIO" 
                                Icon={IdentificationIcon}
                                autoCapitalize="none"
                            />
                        </div>
                        <div>
                            <label htmlFor="access-code" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Código de Acesso</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <KeyIcon className="h-5 w-5 text-gray-400" />
                                </span>
                                <input
                                    id="access-code"
                                    type={isCodeVisible ? 'text' : 'password'}
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                    required
                                    autoCapitalize="characters"
                                    className="w-full pl-10 pr-12 py-3 bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border rounded-lg text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                                    placeholder="INSIRA SEU CÓDIGO"
                                />
                                <button
                                    type="button"
                                    onClick={showCodeTemporarily}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gold"
                                    aria-label="Mostrar código de acesso"
                                >
                                    {isCodeVisible ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                         <div className="pt-2">
                            <button
                                type="submit"
                                form="login-form"
                                disabled={isLoading || !accessCode || !userId}
                                className="w-full flex justify-center py-3 px-4 bg-gold text-dark-bg font-bold rounded-lg shadow-lg hover:bg-gold/90 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 transition-all transform hover:scale-105 disabled:bg-gold/50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Verificando...' : 'Entrar'}
                            </button>
                        </div>
                    </form>
                    
                    {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

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