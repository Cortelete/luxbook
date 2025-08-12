import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ContentDisplay from './components/ContentDisplay';
import { MenuIcon, SunIcon, MoonIcon } from './components/icons';
import { courseData as initialCourseData } from './data/courseContent';
import { adminSection } from './data/adminContent';
import GeminiChat from './components/GeminiChat';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import Login from './components/Login';
import AiChatGate from './components/AiChatGate';
import { UserData, CourseType } from './lib/types';
import UserProfile from './components/UserProfile';

const App: React.FC = () => {
  // --- AUTHENTICATION STATE ---
  const [authenticatedUser, setAuthenticatedUser] = useState<UserData | null>(() => {
    const storedUser = sessionStorage.getItem('authenticatedUser');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Failed to parse stored user:", e);
      return null;
    }
  });


  // --- FEATURE GATING STATE ---
  const [isGraduated, setGraduated] = useState<boolean>(() => sessionStorage.getItem('isGraduated') === 'true');
  const [showAiGate, setShowAiGate] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  
  // --- COURSE CONTENT STATE ---
  const [courseData, setCourseData] = useState(initialCourseData);

  // --- UI & NAVIGATION STATE ---
  const [activeSectionId, setActiveSectionId] = useState<string>('intro');
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  const filteredSections = useMemo(() => {
    if (!authenticatedUser) return [];

    const userRoles = authenticatedUser.roles;
    if (userRoles.includes('admin') || userRoles.includes('boss') || userRoles.includes('mentor')) {
        return courseData; // Admins/mentors see all modules
    }
    
    // Student access logic
    const userCourse = authenticatedUser.courseType;
    if (userCourse === 'Lash Empresária VIP') {
        return courseData;
    }
    if (userCourse === 'Lash Empreendedora') {
        return courseData.filter(s => s.id !== '16_vip'); // Filter out VIP
    }
    // Default to Lash Profissional
    return courseData.filter(s => s.id !== '16_vip' && s.id !== '15_empreendedora');

  }, [authenticatedUser, courseData]);

  const sectionsForSidebar = useMemo(() => {
    let allSections = [...filteredSections];
    if (authenticatedUser?.roles.includes('admin') || authenticatedUser?.roles.includes('boss')) {
        const introIndex = allSections.findIndex(s => s.id === 'intro');
        if (introIndex !== -1 && !allSections.find(s => s.id === 'admin')) {
            allSections.splice(introIndex + 1, 0, adminSection);
        }
    } else {
        allSections = allSections.filter(s => s.id !== 'admin');
    }
    return allSections;
  }, [authenticatedUser, filteredSections]);
  
  // Conditionally unlock chat based on user type or sessionStorage flag
  const isChatUnlocked = useMemo(() => {
    if (authenticatedUser?.courseType === 'Lash Empresária VIP' || authenticatedUser?.roles.includes('mentor')) {
        return true;
    }
    return sessionStorage.getItem('isChatUnlocked') === 'true';
  }, [authenticatedUser]);


  // --- MOUSE TRACKING FOR AURORA EFFECT ---
  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
          document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
          document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      
      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
      };
  }, []);


  // --- THEME MANAGEMENT ---
  useEffect(() => {
    document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark'), []);
  
  const [mainSectionId, subSectionId] = activeSectionId.split('#');
  const activeSection = sectionsForSidebar.find(section => section.id === mainSectionId);
  
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const closeAiGate = useCallback(() => setShowAiGate(false), []);
  const requestChatUnlock = useCallback(() => setShowAiGate(true), []);
  const closeProfile = useCallback(() => setShowUserProfile(false), []);
  
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSidebar();
        closeAiGate();
        closeProfile();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeSidebar, closeAiGate, closeProfile]);

  // --- HANDLERS ---
  const handleGraduationSuccess = useCallback(() => {
    sessionStorage.setItem('isGraduated', 'true');
    setGraduated(true);
  }, []);

  const handleAiChatUnlockSuccess = useCallback(() => {
    sessionStorage.setItem('isChatUnlocked', 'true');
    setShowAiGate(false);
  }, []);

  const handleLoginSuccess = useCallback((user: UserData) => {
    sessionStorage.setItem('authenticatedUser', JSON.stringify(user));
    setAuthenticatedUser(user);
    
    // Reset progress for new login
    sessionStorage.removeItem('isGraduated');
    sessionStorage.removeItem('isChatUnlocked');
    setGraduated(false);
    setActiveSectionId('intro');
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.clear();
    setAuthenticatedUser(null);
    setGraduated(false);
    setActiveSectionId('intro');
  }, []);

  const handleUpdateSection = useCallback((id: string, newTitle: string, newBrief: string) => {
    setCourseData(prevData => prevData.map(section => 
        section.id === id ? { ...section, title: newTitle, brief: newBrief } : section
    ));
  }, []);
  
  const handleOpenProfile = useCallback(() => setShowUserProfile(true), []);


  return (
    <div className="min-h-screen text-light-text-primary dark:text-dark-text-primary font-sans">
      <CustomCursor />
      
      {!authenticatedUser ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {showAiGate && <AiChatGate onSuccess={handleAiChatUnlockSuccess} onClose={closeAiGate} />}
          {showUserProfile && authenticatedUser && (
              <UserProfile user={authenticatedUser} onClose={closeProfile} />
          )}

          <Sidebar 
            sections={sectionsForSidebar}
            activeSectionId={activeSectionId}
            onSelectSection={setActiveSectionId}
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
            isCollapsed={false}
            onLogout={handleLogout}
            authenticatedUser={authenticatedUser}
            isGraduated={isGraduated}
            onOpenProfile={handleOpenProfile}
          />
          
          <main 
            className={`transition-all duration-300 md:ml-80 flex flex-col min-h-screen relative z-10`}
          >
            <div className="flex-grow">
              <header className="sticky top-0 bg-light-card/70 dark:bg-dark-card/70 backdrop-blur-lg z-20 flex items-center justify-between p-4 md:hidden border-b border-light-border/50 dark:border-dark-border/50">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setSidebarOpen(true)}
                    className="text-light-text-primary dark:text-dark-text-primary hover:text-gold"
                    aria-label="Abrir menu"
                  >
                    <MenuIcon className="w-6 h-6" />
                  </button>
                  <img src="/logo.png" alt="Luxury Academy Logo" className="h-10" />
                </div>
                <button 
                  onClick={toggleTheme}
                  className="text-light-text-primary dark:text-dark-text-primary hover:text-gold"
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                </button>
              </header>

              <div className="absolute top-6 right-6 z-20 hidden md:block">
                  <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-light-card dark:bg-dark-card text-light-text-primary dark:text-dark-text-primary hover:text-gold hover:bg-light-hover dark:hover:bg-dark-hover transition-all"
                    aria-label="Alternar tema"
                  >
                    {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                  </button>
              </div>

              <ContentDisplay 
                key={mainSectionId}
                section={activeSection} 
                activeSubSectionId={subSectionId}
                onNavigate={setActiveSectionId}
                allSections={sectionsForSidebar}
                isGraduated={isGraduated}
                onGraduationSuccess={handleGraduationSuccess}
                onUpdateSection={handleUpdateSection}
                authenticatedUser={authenticatedUser}
              />
            </div>
            <Footer />
          </main>

          <GeminiChat 
            activeSection={activeSection}
            isUnlocked={isChatUnlocked}
            onRequestUnlock={requestChatUnlock}
          />
        </>
      )}
    </div>
  );
};

export default App;