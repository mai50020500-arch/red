import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Alert, AlertState } from './alert.types';
import { bulkUpsert, initialState } from './alert.state';

interface AlertContextType extends AlertState {
  addAlerts: (incoming: Alert[]) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

type Action = { type: 'BULK_UPSERT'; alerts: Alert[] };

function alertReducer(state: AlertState, action: Action): AlertState {
  switch (action.type) {
    case 'BULK_UPSERT':
      return bulkUpsert(state, action.alerts);
    default:
      return state;
  }
}

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);

  const addAlerts = (incoming: Alert[]) => {
    dispatch({ type: 'BULK_UPSERT', alerts: incoming });
  };

  return (
    <AlertContext.Provider value={{ ...state, addAlerts }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
