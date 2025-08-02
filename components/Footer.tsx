import React, { useState, useEffect, memo } from 'react';
import { BrainIcon } from './icons';

const DateTimeDisplay = memo(() => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const formattedDate = dateTime.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const formattedTime = dateTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <div className="text-center md:text-left md:flex-1">
            <span>{formattedDate}</span>
            <span className="mx-2 hidden md:inline">|</span>
            <br className="md:hidden" />
            <span>{formattedTime}</span>
        </div>
    );
});

const Footer: React.FC = memo(() => {
    return (
        <footer
            className="w-full mt-auto bg-light-card dark:bg-dark-bg text-light-text-secondary dark:text-dark-text-secondary 
                     flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0
                     p-4 border-t border-light-border dark:border-dark-border/50 text-xs font-mono"
        >
            <DateTimeDisplay />

            <div className="order-first md:order-none md:flex-1 text-center">
                <a
                    href="https://www.instagram.com/InteligenciArte.IA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                >
                    <span className="block sm:inline">Desenvolvido por Davi Cortelete</span>
                    <span className="hidden sm:inline"> - </span>
                    <span className="block sm:inline">CEO @InteligenciArte.IA</span>
                </a>
            </div>

            <div className="text-center md:text-right md:flex-1">
                <BrainIcon className="w-5 h-5 text-gold inline-block" />
            </div>
        </footer>
    );
});

export default Footer;