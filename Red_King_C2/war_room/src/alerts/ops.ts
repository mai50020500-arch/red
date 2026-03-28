import { bulkUpsert } from './alert.state';
import { Alert } from './alert.types';

export const createAlertManager = (dispatch: Function) => {
  let buffer: Alert[] = [];
  let timeoutId: any = null;

  return {
    push: (alert: Alert) => {
      buffer.push(alert);

      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        dispatch((prevState: any) => bulkUpsert(prevState, buffer));
        buffer = [];
        timeoutId = null;
      }, 200);
    }
  };
};

export const fetchIntel = async (): Promise<Alert[]> => {
  try {
    const res = await fetch('http://localhost:9001/api/intel');
    const data = await res.json();
    
    // Map backend intel types to UI alert severities
    return data.map((item: any) => ({
      id: item.id,
      timestamp: new Date().getTime(), // Backend uses "H:M:S" string, we might need to parse or just use current if it's live
      message: item.msg,
      severity: item.type === 'ALERT' || item.type === 'WARFARE' ? 'critical' : 
                item.type === 'AI' || item.type === 'STRATEGY' ? 'warning' : 'info'
    }));
  } catch (err) {
    console.error('Failed to fetch intel:', err);
    return [];
  }
};
