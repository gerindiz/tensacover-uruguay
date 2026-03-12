import React from 'react';

const TensaCoverLogo = ({ light = false, className = "" }: { light?: boolean, className?: string }) => (
  <div className={`flex items-center gap-3 group ${className}`}>
    <img 
      src="https://storage.googleapis.com/content-studio-static/user_uploads/ais-dev-n6ibeay4llmvoksan3e3x7-165380226435.us-east1.run.app/logo_tensacover.jpg" 
      alt="TensaCover Logo" 
      className="h-16 w-auto object-contain"
      referrerPolicy="no-referrer"
    />
  </div>
);

export default TensaCoverLogo;
