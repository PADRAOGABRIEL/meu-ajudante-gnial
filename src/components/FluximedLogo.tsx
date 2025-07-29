import React from 'react';

const FluximedLogo = ({ size = 32 }: { size?: number }) => {
  return (
    <div className="flex items-center gap-3">
      <div 
        className="relative flex items-center justify-center bg-gradient-primary rounded-xl shadow-glow animate-glow-pulse"
        style={{ width: size, height: size }}
      >
        <img 
          src="/lovable-uploads/32789a0e-4e82-4b60-aa2c-b76260b394bb.png" 
          alt="FluxiMed AI Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl font-bold gradient-text">FluxiMed AI</h1>
        <p className="text-xs text-muted-foreground">Medical Intelligence Platform</p>
      </div>
    </div>
  );
};

export default FluximedLogo;