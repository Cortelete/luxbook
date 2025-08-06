import React, { useState, useEffect, useCallback, memo } from 'react';
import { CourseSection, UserData } from '../lib/types';
import { CloseIcon, HomeIcon, MailIcon, BookOpenIcon, RocketIcon, AcademicCapIcon, SparklesIcon, ChevronDoubleLeftIcon, LogoutIcon, UserIcon, LockClosedIcon, ShieldCheckIcon } from './icons';

interface SidebarProps {
  sections: CourseSection[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onLogout: () => void;
  authenticatedUser: UserData | null;
  isGraduated: boolean;
  onOpenProfile: () => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ sections, activeSectionId, onSelectSection, isOpen, onClose, isCollapsed, onLogout, authenticatedUser, isGraduated, onOpenProfile }) => {
  const [isModulesOpen, setIsModulesOpen] = useState(true);

  const [mainSectionId] = activeSectionId.split('#');

  useEffect(() => {
    const isModuleActive = !['intro', 'nossosCursos', 'horaDaAcao', 'contato', 'admin'].includes(mainSectionId);
    if (isModuleActive && !isCollapsed) { // Only auto-open if sidebar is expanded
      setIsModulesOpen(true);
    }
  }, [mainSectionId, isCollapsed]);
  
  const handleSectionClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const id = event.currentTarget.dataset.id;
    if (!id) return;
    
    onSelectSection(id);
    
    if(window.innerWidth < 768) {
      onClose();
    }
  }, [onSelectSection, onClose]);

  const navOrder = ['intro', 'admin', 'horaDaAcao', 'nossosCursos', 'contato'];
  const introLink = sections.find(s => s.id === 'intro');
  const adminLink = authenticatedUser?.roles.some(r => ['admin', 'boss'].includes(r)) ? sections.find(s => s.id === 'admin') : null;
  
  const otherMainLinks = sections
      .filter(s => ['nossosCursos', 'horaDaAcao', 'contato'].includes(s.id))
      .sort((a, b) => navOrder.indexOf(a.id) - navOrder.indexOf(b.id));
  const courseModules = sections.filter(s => !navOrder.includes(s.id) && s.id !== 'admin');

  const getIcon = (id: string, className: string) => {
    switch (id) {
        case 'intro': return <HomeIcon className={className} />;
        case 'admin': return <ShieldCheckIcon className={className} />;
        case 'nossosCursos': return <AcademicCapIcon className={className} />;
        case 'horaDaAcao': return isGraduated ? <RocketIcon className={className} /> : <LockClosedIcon className={className} />;
        case 'contato': return <MailIcon className={className} />;
        default: return null;
    }
  };

  const getTitle = (id: string, title: string) => {
    if (id === 'intro') return 'Início';
    if (id === 'nossosCursos') return 'Nossos Cursos';
    if (id === 'horaDaAcao') return 'Hora da Ação';
    return title;
  }
  
  const formatRoles = (roles: UserData['roles']): string => {
    const roleHierarchy = ['boss', 'admin', 'mentor', 'student'];
    return roles
      .sort((a, b) => roleHierarchy.indexOf(a) - roleHierarchy.indexOf(b))
      .map(role => role.charAt(0).toUpperCase() + role.slice(1))
      .join(', ');
  }

  const renderLink = (section: CourseSection) => (
    <li key={section.id}>
      <a
        href={`#${section.id}`}
        data-id={section.id}
        onClick={handleSectionClick}
        className={`flex items-center p-3 rounded-lg transition-all duration-200 group relative ${mainSectionId === section.id ? 'bg-gold text-dark-bg' : 'text-light-text-primary dark:text-dark-text-primary hover:bg-light-hover dark:hover:bg-dark-hover'} ${isCollapsed ? 'justify-center' : ''}`}
        title={isCollapsed ? getTitle(section.id, section.title) : undefined}
      >
        {getIcon(section.id, 'w-5 h-5 flex-shrink-0')}
        {!isCollapsed && <span className={`ml-3 font-semibold`}>{getTitle(section.id, section.title)}</span>}
        {isCollapsed && <span className="absolute left-full ml-4 px-2 py-1 bg-dark-bg text-dark-text-primary rounded-md text-sm whitespace-nowrap invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity delay-300 z-50 pointer-events-none">{getTitle(section.id, section.title)}</span>}
      </a>
    </li>
  );

  return (
    <>
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen bg-light-card/80 dark:bg-dark-card/70 backdrop-blur-lg transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 border-r border-light-border/50 dark:border-dark-border/50 ${isCollapsed ? 'w-full md:w-20' : 'w-full md:w-80'}`}
      >
        <div className="h-full px-3 py-4 flex flex-col">
          {/* Header */}
          <div className={`flex items-center mb-6 px-2 transition-all duration-300 flex-shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && <h2 className="text-xl font-semibold text-gold">Luxury Academy</h2>}
             {isCollapsed && <h2 className="text-xl font-semibold text-gold">LA</h2>}
            <button onClick={onClose} className="md:hidden text-light-text-primary dark:text-dark-text-primary hover:text-gold">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          
          {/* Top Fixed Links */}
          <div className="flex-shrink-0">
            <ul className="space-y-2 font-medium">
              {introLink && renderLink(introLink)}
              {adminLink && renderLink(adminLink)}
            </ul>
          </div>
          
          {/* Modules Header */}
          <div className="flex-shrink-0 my-2">
              <div className="relative group">
                  <button
                      onClick={() => setIsModulesOpen(!isModulesOpen)}
                      className={`w-full flex items-center p-3 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                      title={"Alternar visibilidade dos módulos"}
                  >
                      <div className="flex items-center">
                          <BookOpenIcon className="w-5 h-5 flex-shrink-0 text-light-text-secondary dark:text-dark-text-secondary group-hover:text-gold" />
                          {!isCollapsed && <h3 className="ml-3 text-base font-semibold text-light-text-primary dark:text-dark-text-primary group-hover:text-gold">Módulos</h3>}
                      </div>
                      {!isCollapsed && <svg className={`w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary transition-transform duration-300 ${isModulesOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>}
                  </button>
                  {isCollapsed && (
                      <span className="absolute left-full ml-4 px-2 py-1 bg-dark-bg text-dark-text-primary rounded-md text-sm whitespace-nowrap invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity delay-300 z-50 pointer-events-none">
                          Ver módulos
                      </span>
                  )}
              </div>
          </div>
          
          {/* Scrollable Modules List */}
          <div className="flex-grow overflow-y-auto overflow-x-hidden pr-1">
            {isModulesOpen && !isCollapsed && (
              <ul className="space-y-1 font-medium mt-2 pl-4 border-l-2 border-light-border dark:border-dark-border ml-3">
                {courseModules.map((section) => {
                  const isModuleActive = mainSectionId === section.id;
                  return (
                    <li key={section.id}>
                      <a
                         href={`#${section.id}`}
                         data-id={section.id}
                         onClick={handleSectionClick}
                        className={`block w-full text-left p-2 pl-4 rounded-r-lg transition-colors text-sm ${isModuleActive ? 'bg-gold/20 text-gold font-semibold border-l-2 border-gold -ml-px' : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'}`}
                      >
                        <span className="font-semibold">{section.title}</span>
                        <span className="block text-xs opacity-70 mt-1">{section.brief}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          
          {/* Bottom Fixed Links & User Info */}
          <div className="flex-shrink-0">
            <div className="pt-2 border-t border-light-border dark:border-dark-border">
                <ul className="space-y-2 font-medium">
                  {otherMainLinks.map(section => renderLink(section))}
                </ul>
            </div>
           
             <div className="py-2 mt-2 border-t border-light-border dark:border-dark-border px-2 pt-4">
               {authenticatedUser && (
                  <button 
                      onClick={onOpenProfile}
                      className={`p-3 rounded-lg mb-2 w-full text-left hover:bg-light-hover dark:hover:bg-dark-hover transition-colors ${isCollapsed ? 'flex justify-center' : 'flex items-center'}`}
                      title={isCollapsed ? "Ver Perfil" : "Ver seu perfil"}
                  >
                      <UserIcon className="w-8 h-8 text-gold flex-shrink-0"/>
                      {!isCollapsed && (
                          <div className="ml-3 overflow-hidden">
                              <p className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary truncate">{authenticatedUser.name.split(' ')[0]}</p>
                              <p className={`text-xs ${authenticatedUser.roles.includes('admin') || authenticatedUser.roles.includes('boss') ? 'text-gold font-bold' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                                 {formatRoles(authenticatedUser.roles)}
                              </p>
                          </div>
                      )}
                  </button>
              )}

              <button 
                  onClick={onLogout}
                  className={`flex w-full items-center p-3 rounded-lg hover:bg-red-500/20 group text-red-500 ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? 'Sair' : undefined}
              >
                  <LogoutIcon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="ml-3 text-sm font-semibold">Sair</span>}
                   {isCollapsed && <span className="absolute left-full ml-4 px-2 py-1 bg-dark-bg text-dark-text-primary rounded-md text-sm whitespace-nowrap invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity delay-300 z-50 pointer-events-none">Sair</span>}
              </button>
            </div>
          </div>
        </div>
      </aside>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"></div>}
    </>
  );
});

export default Sidebar;