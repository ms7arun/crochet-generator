import React from 'react';

export const YarnWaveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Yarn waves */}
      <div className="yarn-wave top-10 left-10 animate-yarn-wave" style={{ animationDelay: '0s' }}></div>
      <div className="yarn-wave top-20 right-20 animate-yarn-wave" style={{ animationDelay: '1s' }}></div>
      <div className="yarn-wave bottom-20 left-1/4 animate-yarn-wave" style={{ animationDelay: '2s' }}></div>
      <div className="yarn-wave bottom-10 right-1/3 animate-yarn-wave" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Stitch pattern background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f8b87d' fill-opacity='0.3'%3E%3Cpath d='M20 0c11.046 0 20 8.954 20 20s-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0zm0 2c-9.941 0-18 8.059-18 18s8.059 18 18 18 18-8.059 18-18S29.941 2 20 2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
};