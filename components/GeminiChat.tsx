import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { askAiTutor } from '../services/geminiService';
import { ChatIcon, CloseIcon, SendIcon, SparklesIcon, LockClosedIcon } from './icons';
import { CourseSection } from '../lib/types';
import { marked } from 'marked';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface GeminiChatProps {
    activeSection: CourseSection | undefined;
    isUnlocked: boolean;
    onRequestUnlock: () => void;
}

const IS_UNDER_CONSTRUCTION = false;

const GeminiChat: React.FC<GeminiChatProps> = memo(({ activeSection, isUnlocked, onRequestUnlock }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef({
      startX: 0,
      startY: 0,
      initialX: 0,
      initialY: 0,
      bubbleSize: 0,
  });
  const hasDragged = useRef(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    if (activeSection && isOpen && isUnlocked) {
      setMessages([
        { 
          sender: 'ai', 
          text: `Olá! Sou seu tutor IA da Luxury Academy. Como posso ajudar com o conteúdo de "<strong>${activeSection.title.replace(/^\d+\.\s*/, '')}</strong>"?` 
        }
      ]);
    }
  }, [activeSection, isOpen, isUnlocked]);

  const handleSendMessage = useCallback(async () => {
    if (input.trim() === '' || isLoading || !activeSection) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await askAiTutor(input, activeSection);
    
    const aiMessage: Message = { sender: 'ai', text: aiResponseText };
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  }, [input, isLoading, activeSection]);

  const handleBubbleClick = useCallback(() => {
    if (isUnlocked) {
      setIsOpen(prev => !prev);
    } else {
      onRequestUnlock();
    }
  }, [isUnlocked, onRequestUnlock]);
  
  // --- Lógica para arrastar o botão (apenas se desbloqueado) ---
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const dx = e.clientX - dragInfo.current.startX;
    const dy = e.clientY - dragInfo.current.startY;

    if (!hasDragged.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        hasDragged.current = true;
    }

    let newX = dragInfo.current.initialX + dx;
    let newY = dragInfo.current.initialY + dy;

    const { bubbleSize } = dragInfo.current;
    const margin = 24;
    const minX = margin + bubbleSize - window.innerWidth;
    const maxX = margin;
    const minY = margin + bubbleSize - window.innerHeight;
    const maxY = margin;

    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));
    
    setPosition({ x: newX, y: newY });
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    
    if (!hasDragged.current) {
        handleBubbleClick();
    }
    
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleBubbleClick]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!isUnlocked) {
        handleBubbleClick();
        return;
    }

    const bubbleEl = e.currentTarget.parentElement;
    if (!bubbleEl) return;

    hasDragged.current = false;
    setIsDragging(true);

    dragInfo.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: position.x,
        initialY: position.y,
        bubbleSize: bubbleEl.offsetWidth,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [position, handleMouseMove, handleMouseUp, isUnlocked, handleBubbleClick]);


  return (
    <>
      {/* Chat Bubble */}
      <div 
        className="fixed bottom-6 right-6 z-40"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <button
          onMouseDown={handleMouseDown}
          className={`relative bg-gold text-dark-bg p-4 rounded-full shadow-lg hover:bg-gold/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transform hover:scale-110 ${isUnlocked && isDragging ? 'cursor-grabbing' : isUnlocked ? 'cursor-grab' : 'cursor-pointer'}`}
          aria-label={isUnlocked ? "Abrir ou Arrastar chat do tutor IA" : "Desbloquear Tutor IA"}
        >
          {isUnlocked ? (
            isOpen ? <CloseIcon className="w-8 h-8"/> : <ChatIcon className="w-8 h-8"/>
          ) : (
             <ChatIcon className="w-8 h-8"/>
          )}

          {!isUnlocked && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-red-600 border-2 border-light-bg dark:border-dark-bg">
                <LockClosedIcon className="w-2.5 h-2.5 text-white" />
              </span>
            </span>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isUnlocked && (
          <div
            className={`fixed bottom-24 right-6 w-[calc(100%-3rem)] max-w-md bg-light-card/80 dark:bg-dark-card/70 backdrop-blur-lg rounded-xl shadow-2xl z-50 transition-all duration-300 ease-in-out ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
          >
            <div className="p-4 border-b border-light-border/50 dark:border-dark-border/50 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="w-6 h-6 text-gold" />
                <h3 className="font-bold text-lg text-light-text-primary dark:text-dark-text-primary">Tutor IA</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${msg.sender === 'user' ? 'bg-gold text-dark-bg' : 'bg-light-hover dark:bg-dark-hover text-light-text-primary dark:text-dark-text-primary'} p-3 rounded-lg max-w-xs lg:max-w-sm`}>
                    {msg.sender === 'user' ? (
                      <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                    ) : (
                      <div 
                        className="text-sm prose prose-sm dark:prose-invert max-w-none [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.text, { gfm: true, breaks: true }) as string }} 
                      />
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-light-hover dark:bg-dark-hover p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce"></div>
                      </div>
                    </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-light-border/50 dark:border-dark-border/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={"Pergunte algo sobre o módulo..."}
                  className="flex-1 bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border rounded-full py-2 px-4 text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-60"
                  disabled={isLoading || IS_UNDER_CONSTRUCTION}
                />
                <button
                  type="submit"
                  disabled={isLoading || input.trim() === '' || IS_UNDER_CONSTRUCTION}
                  className="bg-gold text-dark-bg p-3 rounded-full disabled:bg-light-border dark:disabled:bg-dark-border disabled:cursor-not-allowed hover:bg-gold/80 transition-all"
                  aria-label="Enviar mensagem"
                >
                  <SendIcon className="w-5 h-5"/>
                </button>
              </form>
            </div>
          </div>
      )}
    </>
  );
});

export default GeminiChat;