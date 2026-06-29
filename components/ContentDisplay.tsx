
import React, { memo, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { CourseSection, ContentItem, TableData, ImageCarouselData, TipCategoryData } from '../lib/types';
import { 
    CheckSquareIcon, MailIcon, WhatsappIcon, InstagramIcon, BookOpenIcon, 
    PencilSquareIcon, SparklesIcon, CloseIcon, ChevronDownIcon, 
    AcademicCapIcon, MegaphoneIcon, HeartIcon, BriefcaseIcon, CurrencyDollarIcon, 
    ChevronLeftIcon, ChevronRightIcon 
} from './icons';
import ImageCarousel from './ImageCarousel';
import GraduationGate from './GraduationGate';
import AdminPanel from './AdminPanel'; // Import AdminPanel
import { actionTipsContent } from '../data/modules/11_horaDaAcao/index';
import { UserData } from '../lib/types';

const NavigationControls: React.FC<{
  section: CourseSection;
  allSections: CourseSection[];
  onNavigate: (id: string) => void;
}> = memo(({ section, allSections, onNavigate }) => {
    const currentIndex = allSections.findIndex(s => s.id === section.id);
    const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
    const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

    // Don't show navigation on the final "thank you" page or admin page.
    if (section.id === 'horaDaAcao' || section.id === 'admin') {
        return null;
    }

    return (
        <div className="flex justify-between items-center mt-10 md:mt-16 pt-6 border-t border-light-border dark:border-dark-border">
            {prevSection && prevSection.id !== 'admin' ? (
                <button
                    onClick={() => onNavigate(prevSection.id)}
                    className="text-left group transition-transform duration-300 hover:-translate-x-1"
                >
                    <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Anterior</span>
                    <p className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary group-hover:text-gold transition-colors">
                        &larr; {prevSection.title.replace(/^\d+\.\s*/, '')}
                    </p>
                </button>
            ) : <div className="w-1/3" />}
            
            {nextSection && nextSection.id !== 'horaDaAcao' && nextSection.id !== 'admin' ? (
                 <button
                    onClick={() => onNavigate(nextSection.id)}
                    className="text-right group transition-transform duration-300 hover:translate-x-1"
                >
                    <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Próximo</span>
                    <p className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary group-hover:text-gold transition-colors">
                        {nextSection.title.replace(/^\d+\.\s*/, '')} &rarr;
                    </p>
                </button>
            ) : <div className="w-1/3" />}
        </div>
    );
});

// Memoized component to prevent re-rendering if props don't change
const ContentItemParser = memo(({ item }: { item: ContentItem }) => {
  // A simple markdown-like parser to handle **bold** text, %%gold%% highlights and basic <a> tags.
  const createMarkup = (text: string) => {
    const withGold = text.replace(/%%(.*?)%%/g, '<span class="text-gold font-semibold">$1</span>');
    const withBold = withGold.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-light-text-primary dark:text-dark-text-primary">$1</strong>');
    return { __html: withBold };
  };

  const ContactButton = ({ href, icon, platform, handle }: { href: string; icon: React.ReactNode; platform: string; handle: string; }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-4 p-4 sm:p-6 bg-light-hover dark:bg-dark-card rounded-lg shadow-sm hover:shadow-md hover:scale-105 transform transition-all duration-300 ease-in-out group border border-light-border dark:border-dark-border"
    >
      {icon}
      <div className="flex-grow text-left">
        <p className="font-bold text-lg text-light-text-primary dark:text-dark-text-primary group-hover:text-gold transition-colors">{platform}</p>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{handle}</p>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
    </a>
  );
  
  switch (item.type) {
    case 'paragraph':
      return <p className="mb-4 text-light-text-primary dark:text-dark-text-primary leading-relaxed" dangerouslySetInnerHTML={createMarkup(item.content as string)} />;
    
    case 'subsection_title':
       // This is now handled by the AccordionItem header, so we render nothing here.
       // The ID is still used for linking.
      return <div id={item.id} className="scroll-mt-20"></div>;

    case 'subtitle':
      return <h4 className="text-xl font-semibold text-gold mt-6 mb-3" dangerouslySetInnerHTML={createMarkup(item.content as string)} />;
    
    case 'list':
      return (
        <ul className="space-y-3 mb-4 list-disc list-inside text-light-text-secondary dark:text-dark-text-primary">
          {(item.content as string[]).map((listItem, index) => (
            <li key={index} className="leading-relaxed" dangerouslySetInnerHTML={createMarkup(listItem)} />
          ))}
        </ul>
      );

    case 'checklist':
        return (
            <ul className="space-y-4 mb-4">
                {(item.content as string[]).map((checkItem, index) => (
                    <li key={index} className="flex items-start">
                        <CheckSquareIcon className="w-6 h-6 text-gold mr-3 flex-shrink-0 mt-1" />
                        <span className="text-light-text-secondary dark:text-dark-text-primary leading-relaxed" dangerouslySetInnerHTML={createMarkup(checkItem)} />
                    </li>
                ))}
            </ul>
        );
    
    case 'table':
      const { headers, rows } = item.content as TableData;
      return (
        <div className="overflow-x-auto my-6">
          <table className="min-w-full bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg">
            <thead className="bg-light-hover dark:bg-dark-hover">
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-bold text-gold uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border dark:divide-dark-border">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-light-hover dark:hover:bg-dark-hover/50 transition-colors">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-normal text-sm text-light-text-secondary dark:text-dark-text-primary" dangerouslySetInnerHTML={createMarkup(cell)} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      
    case 'note':
      return (
        <div className="my-5 p-4 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500 text-yellow-800 dark:text-yellow-200 rounded-r-lg">
          <p className="font-medium text-left" dangerouslySetInnerHTML={createMarkup(item.content as string)}></p>
        </div>
      );

    case 'image_carousel':
        return <ImageCarousel data={item.content as ImageCarouselData} />;
    
    case 'contact_details':
      const whatsappMessage = encodeURIComponent("Olá Joy! Vi seu guia Luxury Academy: Profissional e gostaria de saber mais.");
      return (
        <div className="my-8 grid grid-cols-1 gap-6">
           <ContactButton
              href={`https://wa.me/5542999722042?text=${whatsappMessage}`}
              icon={<WhatsappIcon className="w-10 h-10 text-emerald-500"/>}
              platform="WhatsApp"
              handle="Falar com Joy"
            />
            <ContactButton
              href="https://instagram.com/luxury.joycialmeida"
              icon={<InstagramIcon className="w-10 h-10 text-pink-600"/>}
              platform="Instagram"
              handle="@luxury.joycialmeida"
            />
            <ContactButton
              href="mailto:luxury.joycialmeida@gmail.com"
              icon={<MailIcon className="w-10 h-10 text-cyan-500"/>}
              platform="Email"
              handle="luxury.joycialmeida@gmail.com"
            />
        </div>
      );
    
    case 'tip_category':
    case 'course_offer':
    case 'final_quote':
        // These are handled by special page layouts, not the parser.
        return null;

    default:
      return null;
  }
});

interface ContentDisplayProps {
  section: CourseSection | undefined;
  allSections: CourseSection[];
  onUpdateSection: (id: string, newTitle: string, newBrief: string) => void;
  activeSubSectionId?: string;
  onNavigate: (sectionId: string) => void;
  isGraduated: boolean;
  onGraduationSuccess: () => void;
  authenticatedUser: UserData | null;
}

const HomePageLayout: React.FC<{section: CourseSection; allSections: CourseSection[]; onNavigate: (id: string) => void}> = memo(({ section, allSections, onNavigate }) => {
    const courseModules = allSections.filter(s => !['intro', 'contato', 'nossosCursos', 'horaDaAcao', 'admin'].includes(s.id));
    
    const instructionsTitleItem = section.content.find(item => item.id === 'how-to-use');
    const instructionsTitleIndex = section.content.findIndex(item => item.id === 'how-to-use');
    const instructionsListItem = (instructionsTitleIndex !== -1 && section.content.length > instructionsTitleIndex + 1)
        ? section.content[instructionsTitleIndex + 1]
        : null;
    const instructions = (instructionsListItem && instructionsListItem.type === 'list')
        ? instructionsListItem.content as string[]
        : [];

    const modulesTitleItem = section.content.find(item => item.id === 'modules-title');

    const getInstructionIcon = (index: number) => {
        if (index === 0) return <BookOpenIcon className="w-8 h-8 text-gold" />;
        if (index === 1) return <PencilSquareIcon className="w-8 h-8 text-gold" />;
        return null;
    }

    const createMarkup = (text: string) => {
        const withGold = text.replace(/%%(.*?)%%/g, '<span class="text-gold font-semibold">$1</span>');
        const withBold = withGold.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-light-text-primary dark:text-dark-text-primary">$1</strong>');
        return { __html: withBold };
    };

    return (
        <div className="animate-page-enter">
            {/* Hero Section */}
            <div className="text-center pt-16 pb-12 md:pt-24 md:pb-20 px-4">
                <h1 className="text-5xl md:text-7xl font-bold text-gold mb-4 tracking-tight">{section.title}</h1>
                <p className="text-lg md:text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">{section.brief}</p>
                <div className="mt-6 text-base text-light-text-secondary dark:text-dark-text-primary max-w-3xl mx-auto space-y-4">
                    <p dangerouslySetInnerHTML={createMarkup(section.content[0].content as string)} />
                    <p dangerouslySetInnerHTML={createMarkup(section.content[1].content as string)} />
                </div>
            </div>

            {/* Instructions Section */}
            {instructions.length > 0 && (
                <div className="max-w-5xl mx-auto py-12 px-4">
                     <h2 className="text-3xl font-bold text-center text-gold mb-12">{instructionsTitleItem?.content as string}</h2>
                     <div className="grid md:grid-cols-2 gap-8 text-center">
                        {instructions.map((inst, index) => (
                            <div key={index} className="flex flex-col items-center p-6 bg-light-card dark:bg-dark-card rounded-xl shadow-lg border border-light-border dark:border-dark-border">
                                <div className="p-4 bg-gold/10 rounded-full mb-4">
                                   {getInstructionIcon(index)}
                                </div>
                                <div className="text-light-text-secondary dark:text-dark-text-primary" dangerouslySetInnerHTML={createMarkup(inst)}></div>
                            </div>
                        ))}
                     </div>
                </div>
            )}
            
            {/* Modules Section */}
            <div className="max-w-7xl mx-auto py-12 px-4">
                <h2 className="text-4xl font-bold text-center text-gold mb-12">{modulesTitleItem?.content as string}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {courseModules.map((module) => (
                        <button
                            key={module.id}
                            onClick={() => onNavigate(module.id)}
                            className="text-left p-6 bg-light-card dark:bg-dark-card rounded-2xl shadow-lg border border-light-border dark:border-dark-border group hover:border-gold transition-all duration-300 transform hover:-translate-y-2 hover:shadow-glow-gold-light dark:hover:shadow-glow-gold-dark focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50"
                        >
                            <h3 className="text-xl font-bold text-gold mb-2">{module.title}</h3>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm flex-grow mb-4">{module.brief}</p>
                            <span className="mt-4 inline-block text-sm font-semibold text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Ver Módulo &rarr;
                            </span>
                        </button>
                    ))}
                </div>
            </div>
             <div className="px-4 py-8">
                <ContentItemParser item={section.content.find(item => item.type === 'note')!} />
             </div>
             <div className="px-4">
                <NavigationControls section={section} allSections={allSections} onNavigate={onNavigate} />
             </div>
        </div>
    );
});

const ActionTipsModal: React.FC<{onClose: () => void}> = memo(({ onClose }) => {
    const { categories, getCategoryIcon } = useMemo(() => {
        const cats = actionTipsContent.content
            .filter(item => item.type === 'tip_category')
            .map(item => item.content as TipCategoryData);

        const getIcon = (iconName: TipCategoryData['icon'], props: { className: string }) => {
            switch (iconName) {
                case 'MegaphoneIcon': return <MegaphoneIcon {...props} />;
                case 'HeartIcon': return <HeartIcon {...props} />;
                case 'BriefcaseIcon': return <BriefcaseIcon {...props} />;
                case 'CurrencyDollarIcon': return <CurrencyDollarIcon {...props} />;
                default: return <SparklesIcon {...props} />;
            }
        };
        return { categories: cats, getCategoryIcon: getIcon };
    }, []);

    const [selectedCategory, setSelectedCategory] = useState<TipCategoryData | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSelectCategory = useCallback((category: TipCategoryData) => {
        setSelectedCategory(category);
        setCurrentIndex(0);
    }, []);

    const handleGoBack = useCallback(() => {
        setSelectedCategory(null);
    }, []);

    const goToNext = useCallback(() => {
        if (selectedCategory) {
            setCurrentIndex(prev => (prev < selectedCategory.tips.length - 1 ? prev + 1 : prev));
        }
    }, [selectedCategory]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
    }, []);

    const createMarkup = (text: string) => {
        const withGold = text.replace(/%%(.*?)%%/g, '<span class="text-gold font-semibold">$1</span>');
        const withBold = withGold.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-dark-text-primary">$1</strong>');
        return { __html: withBold };
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="relative bg-dark-card rounded-xl shadow-2xl w-full max-w-2xl text-left border-2 border-gold/30 animate-page-enter flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
                style={{ height: 'clamp(500px, 80vh, 600px)' }}
            >
                {/* Modal Header */}
                <div className="p-5 border-b border-dark-border flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center space-x-3 min-w-0">
                        {selectedCategory ? (
                            <>
                                <button onClick={handleGoBack} className="text-dark-text-secondary hover:text-gold transition-colors p-1 rounded-full -ml-2 flex-shrink-0">
                                    <ChevronLeftIcon className="w-6 h-6" />
                                </button>
                                <div className="flex-shrink-0">{getCategoryIcon(selectedCategory.icon, { className: "w-7 h-7 text-gold" })}</div>
                                <h3 className="text-xl font-bold text-dark-text-primary truncate">{selectedCategory.title}</h3>
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-7 h-7 text-gold flex-shrink-0" />
                                <h3 className="text-xl font-bold text-dark-text-primary">Dicas de Ouro</h3>
                            </>
                        )}
                    </div>
                    <button onClick={onClose} className="text-dark-text-secondary hover:text-gold transition-colors ml-4 flex-shrink-0">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-grow p-6 md:p-8 overflow-y-auto">
                    {!selectedCategory ? (
                        // Category Selection View
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-slide-up">
                            {categories.map((category) => (
                                <button
                                    key={category.title}
                                    onClick={() => handleSelectCategory(category)}
                                    className="bg-dark-hover p-6 rounded-lg border border-dark-border text-left group hover:border-gold transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                >
                                    <div className="flex items-center space-x-4 mb-3">
                                        {getCategoryIcon(category.icon, { className: "w-8 h-8 text-gold flex-shrink-0" })}
                                        <h4 className="text-lg font-bold text-dark-text-primary group-hover:text-gold transition-colors">{category.title}</h4>
                                    </div>
                                    <p className="text-sm text-dark-text-secondary">{category.summary}</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        // Tips Carousel View
                        <div className="w-full h-full flex flex-col items-center justify-center text-center">
                            <div key={currentIndex} className="w-full flex-grow flex items-center justify-center animate-fade-in-slide-up">
                                <p 
                                    className="text-dark-text-secondary text-xl leading-relaxed"
                                    dangerouslySetInnerHTML={createMarkup(selectedCategory.tips[currentIndex])}
                                >
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer (for carousel navigation) */}
                {selectedCategory && (
                    <div className="flex-shrink-0 p-4 border-t border-dark-border flex items-center justify-between">
                        <button
                            onClick={goToPrevious}
                            disabled={currentIndex === 0}
                            className="flex items-center space-x-2 text-dark-text-secondary hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md px-3 py-2"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                            <span>Anterior</span>
                        </button>

                        <span className="font-mono text-sm text-dark-text-secondary">
                            {currentIndex + 1} / {selectedCategory.tips.length}
                        </span>

                        <button
                            onClick={goToNext}
                            disabled={currentIndex === selectedCategory.tips.length - 1}
                            className="flex items-center space-x-2 text-dark-text-secondary hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md px-3 py-2"
                        >
                            <span>Próxima</span>
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});


const CoursesPageLayout: React.FC<{section: CourseSection; allSections: CourseSection[]; onNavigate: (id: string) => void;}> = memo(({ section, allSections, onNavigate }) => {
    return (
        <div className="p-4 sm:p-6 md:p-10 flex flex-col items-center min-h-[calc(100vh-80px)] text-center animate-page-enter">
             <div className="max-w-3xl w-full">
                <h1 className="text-4xl md:text-5xl font-bold text-gold mb-2">{section.title}</h1>
                <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-8">{section.brief}</p>
                 <div className="text-left space-y-4 mb-12">
                   {section.content.filter(item => item.type === 'paragraph').map((item, index) => (
                        <ContentItemParser key={index} item={item} />
                   ))}
                </div>

                <div className="bg-light-card dark:bg-dark-card border-2 border-dashed border-gold p-8 rounded-xl shadow-xl">
                    <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Sua Jornada Continua!</h3>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">Como aluna do Guia Profissional, use seu novo conhecimento como um trampolim para o próximo nível e continue sua jornada de especialização!</p>
                    <a 
                        href="http://luxacademy.vercel.app" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-4 bg-gold text-dark-bg font-bold text-lg rounded-lg shadow-lg hover:bg-gold/90 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500/50"
                    >
                        Ver Cursos Avançados
                    </a>
                </div>
            </div>
            <div className="w-full max-w-5xl mt-12">
                <NavigationControls section={section} allSections={allSections} onNavigate={onNavigate} />
            </div>
        </div>
    );
});

const FinalPageLayout: React.FC<{ section: CourseSection }> = memo(({ section }) => {
    const [showTipsModal, setShowTipsModal] = useState(false);

    // Standard markup for most text.
    const createMarkup = (text: string) => {
        const withGold = text.replace(/%%(.*?)%%/g, '<span class="text-gold font-semibold">$1</span>');
        const withBold = withGold.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-light-text-primary dark:text-dark-text-primary">$1</strong>');
        return { __html: withBold };
    };

    // Special renderer for the values paragraph to create tags.
    const renderValueTags = (content: string) => {
        const textPart = content.split(':')[0] + ':';
        const tags = content.match(/%%(.*?)%%/g)?.map(v => v.replace(/%%/g, '')) || [];
        const textAfter = content.substring(content.lastIndexOf('%%') + 2);

        return (
            <p>
                {textPart}
                {tags.map((tag, index) => (
                    <span key={index} className="inline-block mx-1.5 px-3 py-1 bg-gold/10 text-gold font-semibold rounded-full text-sm border border-gold/20 shadow-sm">
                        {tag}
                    </span>
                ))}
                {textAfter}
            </p>
        );
    };

    return (
        <div className="p-4 sm:p-6 md:p-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] animate-page-enter">
            {showTipsModal && <ActionTipsModal onClose={() => setShowTipsModal(false)} />}
            <div className="max-w-3xl w-full bg-light-card dark:bg-dark-card p-8 md:p-12 rounded-2xl shadow-2xl border border-light-border dark:border-dark-border">
                <div className="text-center mb-8 animate-fade-in-slide-up" style={{ animationDelay: '100ms' }}>
                    <AcademicCapIcon className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h1 className="text-3xl md:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        {section.title.replace(/^\d+\.\s*/, '')}
                    </h1>
                    <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mt-2">{section.brief}</p>
                </div>

                <div className="text-left space-y-6 text-light-text-primary dark:text-dark-text-primary leading-relaxed text-base md:text-lg">
                    {section.content.map((item, index) => {
                        const animationDelay = `${200 + index * 100}ms`;
                        const animationClass = "animate-fade-in-slide-up";

                        if (item.id === 'achievement_quote') {
                            return (
                                <blockquote key={index} className={`my-6 p-6 bg-gold/5 border-l-4 border-gold text-lg italic ${animationClass}`} style={{ animationDelay }}>
                                    <p dangerouslySetInnerHTML={createMarkup(item.content as string)} />
                                </blockquote>
                            );
                        }
                        if (item.id === 'values_paragraph') {
                            return (
                                <div key={index} className={animationClass} style={{ animationDelay }}>
                                    {renderValueTags(item.content as string)}
                                </div>
                            );
                        }
                        if (item.type === 'paragraph') {
                            return <p key={index} className={animationClass} style={{ animationDelay }} dangerouslySetInnerHTML={createMarkup(item.content as string)} />;
                        }
                        if (item.type === 'final_quote') {
                            return (
                                <blockquote key={index} className={`text-center italic text-xl text-gold border-t border-b border-gold/30 py-6 my-8 ${animationClass}`} style={{ animationDelay }}>
                                    <p dangerouslySetInnerHTML={createMarkup(item.content as string)} />
                                </blockquote>
                            );
                        }
                        return null;
                    })}
                </div>

                <div className="mt-10 text-center animate-fade-in-slide-up" style={{ animationDelay: `${200 + section.content.length * 100}ms` }}>
                    <button
                        onClick={() => setShowTipsModal(true)}
                        className="px-8 py-4 bg-gold text-dark-bg font-bold text-lg rounded-full shadow-lg transition-all transform focus:outline-none focus:ring-4 focus:ring-yellow-500/50"
                        style={{ animation: 'pulse-glow 2.5s infinite ease-in-out' }}
                    >
                        Pegar Dicas de Ouro
                    </button>
                </div>
            </div>
        </div>
    );
});


const AccordionItem: React.FC<{titleItem: ContentItem, contentItems: ContentItem[], isOpen: boolean, onToggle: () => void}> = memo(({ titleItem, contentItems, isOpen, onToggle }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card rounded-lg overflow-hidden transition-all duration-300">
            <button
                onClick={onToggle}
                aria-expanded={isOpen}
                className="w-full flex justify-between items-center p-4 sm:p-5 text-left hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
                <h3 className="text-xl font-semibold text-gold" dangerouslySetInnerHTML={{ __html: (titleItem.content as string).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                <ChevronDownIcon className={`w-6 h-6 text-light-text-secondary dark:text-dark-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                ref={contentRef}
                style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px' }}
                className="overflow-hidden transition-all duration-500 ease-in-out"
            >
                <div className="p-4 sm:p-5 border-t border-light-border dark:border-dark-border prose prose-invert max-w-none">
                    {contentItems.map((item, index) => (
                        // Add a div wrapper for the animation
                        <div key={index} className="animate-fade-in-slide-up" style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'backwards' }}>
                           <ContentItemParser item={item} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

const AccordionPageLayout: React.FC<{section: CourseSection, activeSubSectionId?: string, onNavigate: (id: string) => void, allSections: CourseSection[]}> = memo(({ section, activeSubSectionId, onNavigate, allSections }) => {
    const subsections = useMemo(() => {
        if (!section?.content) return [];
        const grouped: { titleItem: ContentItem, contentItems: ContentItem[] }[] = [];
        
        let contentBuffer: ContentItem[] = [];
        for (const item of section.content) {
            if (item.type === 'subsection_title') {
                if (contentBuffer.length > 0) {
                     // This case handles content that appears before the first subsection_title
                     grouped.push({
                        titleItem: { type: 'subsection_title', id: `${section.id}_intro`, content: "Visão Geral" },
                        contentItems: contentBuffer
                     });
                     contentBuffer = [];
                }
                grouped.push({ titleItem: item, contentItems: [] });
            } else {
                 if (grouped.length === 0) {
                    contentBuffer.push(item);
                 } else {
                    grouped[grouped.length - 1].contentItems.push(item);
                 }
            }
        }
        if (contentBuffer.length > 0) {
             grouped.push({
                titleItem: { type: 'subsection_title', id: `${section.id}_main`, content: section.title },
                contentItems: contentBuffer
             });
        }
        return grouped;
    }, [section]);

    const [openSubsections, setOpenSubsections] = useState<string[]>(() => {
        if (activeSubSectionId) return [activeSubSectionId];
        if (subsections.length > 0 && subsections[0].titleItem.id) {
            return [subsections[0].titleItem.id]; // Open first by default if no subsection is active
        }
        return [];
    });

    useEffect(() => {
        if (activeSubSectionId && !openSubsections.includes(activeSubSectionId)) {
            setOpenSubsections(prev => [...prev, activeSubSectionId]);
        }
    }, [activeSubSectionId, openSubsections]);

    const toggleSubsection = (id: string) => {
        setOpenSubsections(prev =>
            prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
        );
    };

    return (
        <div className="p-4 sm:p-6 md:p-10 animate-page-enter">
            <h1 className="text-4xl md:text-5xl font-bold text-gold mb-2">{section.title}</h1>
            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-12">{section.brief}</p>
            
            <div className="space-y-4">
                {subsections.map((sub, index) => (
                    <AccordionItem
                        key={sub.titleItem.id || index}
                        titleItem={sub.titleItem}
                        contentItems={sub.contentItems}
                        isOpen={openSubsections.includes(sub.titleItem.id!)}
                        onToggle={() => sub.titleItem.id && toggleSubsection(sub.titleItem.id)}
                    />
                ))}
            </div>
            <NavigationControls section={section} allSections={allSections} onNavigate={onNavigate} />
        </div>
    );
});

const ContentDisplay: React.FC<ContentDisplayProps> = memo(({ section, activeSubSectionId, onNavigate, allSections, isGraduated, onGraduationSuccess, onUpdateSection, authenticatedUser }) => {
  useEffect(() => {
    if (activeSubSectionId) {
      setTimeout(() => {
          const element = document.getElementById(activeSubSectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
      }, 500); // Delay to allow accordion to open
    } else if (section) {
      window.scrollTo(0, 0);
    }
  }, [activeSubSectionId, section]);
  
  if (!section) {
    return <div className="p-8 text-light-text-primary dark:text-dark-text-primary animate-page-enter">Selecione um módulo para começar.</div>;
  }

  // --- GATE FOR ADMIN PAGE ---
  if (section.id === 'admin') {
    return <AdminPanel 
              allSections={allSections} 
              onUpdateSection={onUpdateSection}
              authenticatedUser={authenticatedUser}
            />;
  }

  // Special page layouts
  if (section.id === 'intro') {
      return <HomePageLayout section={section} allSections={allSections} onNavigate={onNavigate} />;
  }

  // --- GATE FOR FINAL PAGE ---
  if (section.id === 'horaDaAcao' && !isGraduated) {
    return <GraduationGate onSuccess={onGraduationSuccess} />;
  }

  if (section.id === 'nossosCursos') {
    return <CoursesPageLayout section={section} allSections={allSections} onNavigate={onNavigate} />;
  }
   if (section.id === 'horaDaAcao') {
    return <FinalPageLayout section={section} />;
  }
  if (section.id === 'contato') {
    return (
      <div className="p-4 sm:p-6 md:p-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center animate-page-enter">
        <div className="max-w-2xl w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-gold mb-2 transition-colors duration-300 hover:text-gold/80">{section.title}</h1>
            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-12">{section.brief}</p>
            
            <div className="prose prose-invert max-w-none">
              {section.content.map((item, index) => (
                <ContentItemParser key={`${section.id}-${index}`} item={item} />
              ))}
            </div>
            <div className="w-full max-w-5xl mt-12">
                <NavigationControls section={section} allSections={allSections} onNavigate={onNavigate} />
            </div>
        </div>
      </div>
    );
  }

  // Default layout for standard content pages
  return <AccordionPageLayout section={section} activeSubSectionId={activeSubSectionId} allSections={allSections} onNavigate={onNavigate} />;
});

export default ContentDisplay;