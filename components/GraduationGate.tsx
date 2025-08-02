import React, { useState, FormEvent, useCallback, memo } from 'react';
import { verifyGraduationCode } from '../services/graduationService';
import { LockClosedIcon, KeyIcon } from './icons';

interface GraduationGateProps {
    onSuccess: () => void;
}

const GraduationGate: React.FC<GraduationGateProps> = memo(({ onSuccess }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            if (verifyGraduationCode(code)) {
                onSuccess();
            } else {
                setError('Código inválido. Verifique se digitou corretamente.');
                // Vibrate the input on error
                const input = document.getElementById('graduation-code');
                input?.classList.add('animate-shake');
                setTimeout(() => input?.classList.remove('animate-shake'), 500);
            }
            setIsLoading(false);
        }, 300);
    }, [code, onSuccess]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 text-center animate-page-enter">
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
            <div className="w-full max-w-lg mx-auto">
                <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center bg-gold/10 rounded-full">
                    <LockClosedIcon className="w-10 h-10 text-gold" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gold mb-3">Módulo Exclusivo para Formandas</h1>
                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8">
                    Parabéns por chegar até aqui! Insira o Código de Formanda, fornecido pela Joy, para desbloquear este conteúdo especial.
                </p>

                <div className="bg-light-card dark:bg-dark-card p-8 rounded-2xl shadow-xl border border-light-border dark:border-dark-border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="graduation-code" className="sr-only">Código de Formanda</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                    <KeyIcon className="h-5 w-5 text-gray-400" />
                                </span>
                                <input
                                    id="graduation-code"
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
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || !code}
                                className="w-full flex justify-center py-3 px-4 bg-gold text-dark-bg font-bold rounded-lg shadow-lg hover:bg-gold/90 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 transition-all transform hover:scale-105 disabled:bg-gold/50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Verificando...' : 'Desbloquear Módulo'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
});

export default GraduationGate;