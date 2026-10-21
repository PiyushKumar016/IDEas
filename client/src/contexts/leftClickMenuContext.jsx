import React, { createContext, useState } from 'react';

export const LeftClickMenuContext = createContext();

export function LeftClickMenuProvider({ children }) {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    nodeId: undefined
  });

  return (
    <LeftClickMenuContext.Provider value={{ contextMenu, setContextMenu }}>
      {children}
    </LeftClickMenuContext.Provider>
  );
}