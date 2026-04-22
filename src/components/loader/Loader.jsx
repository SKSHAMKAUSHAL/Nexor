import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function Loader({ fullScreen = true, isVisible = true }) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 500); 
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  const containerClass = fullScreen 
    ? "fixed inset-0 w-[100vw] h-[100vh] flex items-center justify-center z-[9999] bg-[#ffffff]"
    : "flex items-center justify-center w-full h-full bg-[#ffffff] py-10";

  return (
    <div
      className={`${containerClass} transition-all duration-500 ease-in-out`}
      style={{
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? "visible" : "hidden"
      }}
      role="status"
      aria-busy={isVisible ? "true" : "false"}
      aria-live="polite"
    >
      <div className="flex flex-col items-center justify-center">
        <img 
          src="/logo.png" 
          alt="Loading..." 
          className="w-[100px] md:w-[120px] object-contain"
          style={{ animation: "adidasPulse 1.5s ease-in-out infinite" }}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes adidasPulse {
              0% { opacity: 0.3; transform: scale(0.98); }
              50% { opacity: 1; transform: scale(1.02); }
              100% { opacity: 0.3; transform: scale(0.98); }
            }
          `
        }} />
      </div>
    </div>
  );
}

Loader.propTypes = {
  fullScreen: PropTypes.bool,
  isVisible: PropTypes.bool
};

export default Loader;

