import React from 'react';
import IDE from './pages/IDE';

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-[#181818] overflow-hidden text-gray-200 selection:bg-green-500/30">
      <IDE />
    </div>
  );
};

export default App;
