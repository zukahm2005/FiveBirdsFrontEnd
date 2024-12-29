import React, { createContext, useState, useContext } from 'react';

const SelectedRowsContext = createContext();

export const SelectedRowsProvider = ({ children }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const value = { selectedRows, setSelectedRows };

  return (
    <SelectedRowsContext.Provider value={value}>
      {children}
    </SelectedRowsContext.Provider>
  );
};

export const useSelectedRows = () => {
  const context = useContext(SelectedRowsContext);
  if (!context) {
    throw new Error("useSelectedRows must be used within a SelectedRowsProvider");
  }
  return context;
};
