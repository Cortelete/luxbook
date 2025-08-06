import React, { useState, FormEvent, useCallback, memo } from 'react';
import { verifyAiChatCode } from '../services/aiChatAccessService';
import { KeyIcon, SparklesIcon, CloseIcon } from './icons';

interface AiChatGateProps {
    onSuccess: () => void;
    onClose: () => void;
}

const AiChatGate: React.FC<AiChatGateProps> = memo(({ onSuccess, onClose }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            if (verifyAiChatCode(code)) {
                onSuccess();
            } else {
                setError('Código inválido. Verifique se digitou corretamente.');
                const input = document.getElementById('ai-code-input');
                input?.classList.add('animate-shake');
                setTimeout(() => input?.classList.remove('animate-shake'), 500);
            }
            setIsLoading(false);
            setCode('');
        }, 300);
    }, [code, onSuccess]);

    return (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
          onClick={onClose}
        >
            <style>
                {`
                @keyframes shake {
                    10%, 90% { transform: translateX(-1px); }
                    20%, 80% { transform: translateX(2px); }
                    30%, 50%, 70% { transform: translateX(-4px); }
                    40%, 60% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                `}
            </style>
            <div 
                className="w-full max-w-md mx-auto bg-light-card dark:bg-dark-card rounded-2xl shadow-2xl border border-light-border dark:border-dark-border animate-page-enter"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gold/10">
                                <SparklesIcon className="h-6 w-6 text-gold" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">Acesso ao Tutor IA</h2>
                                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Recurso exclusivo para alunas.</p>
                            </div>
                        </div>
                         <button onClick={onClose} className="text-light-text-secondary dark:text-dark-text-secondary hover:text-gold transition-colors p-1 -mt-1 -mr-1">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6 text-sm">
                        Insira o Código de Acesso, fornecido pela Joy, para desbloquear seu assistente de estudos com Inteligência Artificial.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="ai-code-input" className="sr-only">Código de Acesso IA</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                    <KeyIcon className="h-5 w-5 text-gray-400" />
                                </span>
                                <input
                                    id="ai-code-input"
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border rounded-lg text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-gold transition-all text-lg placeholder:text-light-text-secondary/70"
                                    placeholder="Seu código aqui"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center -mb-2">{error}</p>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || !code}
                                className="w-full flex justify-center py-3 px-4 bg-gold text-dark-bg font-bold rounded-lg shadow-lg hover:bg-gold/90 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 transition-all transform hover:scale-105 disabled:bg-gold/50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Verificando...' : 'Desbloquear Tutor IA'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
});

export default AiChatGate;