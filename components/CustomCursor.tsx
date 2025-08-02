import React, { useState, useEffect } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTextHovering, setIsTextHovering] = useState(false);
  const [isEnabled, setIsEnabled] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsEnabled(window.innerWidth >= 768);
    };
    
    // Direct position update on mouse move for real-time response
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('a, button'));
      setIsTextHovering(!!target.closest('input, textarea, [contenteditable="true"]'));
    };
    
    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isEnabled) {
    return null;
  }
  
  const cursorSize = 10;
  const scale = isHovering ? 2.0 : 1;

  // By using `top` and `left` for positioning, and `transform` for scaling/centering,
  // we can separate the instant movement from the animated effects.
  const cursorStyle: React.CSSProperties = {
      position: 'fixed',
      // Position is updated instantly
      top: `${position.y}px`,
      left: `${position.x}px`,
      width: `${cursorSize}px`,
      height: `${cursorSize}px`,
      // Centering and scaling is animated
      transform: `translate(-50%, -50%) scale(${scale})`,
      backgroundColor: isHovering ? 'transparent' : '#d4af37',
      border: isHovering ? '2px solid #d4af37' : 'none',
      // We explicitly define which properties should transition.
      // `top` and `left` are NOT included, so they update instantly.
      transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out, border 0.2s ease-in-out',
      pointerEvents: 'none',
      zIndex: 9999,
      borderRadius: '50%',
  };

  return (
    <div
      // The class only controls opacity now
      className={`${isTextHovering ? 'opacity-0' : 'opacity-100'}`}
      style={cursorStyle}
    />
  );
};

export default CustomCursor;