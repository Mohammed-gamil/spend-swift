import React from 'react';

interface RTLTestProps {
  children: React.ReactNode;
}

/**
 * RTLTest is a utility component that renders content twice - once in LTR and once in RTL
 * to make testing RTL layouts easier. This should only be used during development.
 */
export function RTLTest({ children }: RTLTestProps) {
  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="border-2 border-blue-500 rounded-lg overflow-hidden">
        <div className="bg-blue-500 text-white p-2 font-bold">LTR Preview</div>
        <div dir="ltr" className="p-4" data-testid="ltr-container">
          {children}
        </div>
      </div>
      
      <div className="border-2 border-green-500 rounded-lg overflow-hidden">
        <div className="bg-green-500 text-white p-2 font-bold">RTL Preview</div>
        <div dir="rtl" className="p-4" data-testid="rtl-container">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * RTLDevTools provides a floating indicator showing current text direction
 * and a button to quickly toggle between RTL and LTR modes
 */
export function RTLDevTools() {
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>(() => 
    document.documentElement.dir as 'ltr' | 'rtl'
  );
  
  React.useEffect(() => {
    // Update state when document direction changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'dir') {
          setDir(document.documentElement.dir as 'ltr' | 'rtl');
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  const toggleDir = React.useCallback(() => {
    // Use proper language/direction integration
    // This will trigger the LanguageProvider to update all appropriate settings
    const customEvent = new CustomEvent('toggle-language');
    document.dispatchEvent(customEvent);
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleDir}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-full shadow-lg text-white
          ${dir === 'rtl' ? 'bg-green-600' : 'bg-blue-600'}
        `}
      >
        <span className="font-bold">{dir.toUpperCase()}</span>
        <span className="text-xs">({dir === 'rtl' ? 'Arabic' : 'English'})</span>
      </button>
    </div>
  );
}