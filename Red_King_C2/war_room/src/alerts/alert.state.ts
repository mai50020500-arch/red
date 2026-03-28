import { Alert, AlertState } from './alert.types';

const alertComparator = (a: Alert, b: Alert) => b.timestamp - a.timestamp;

export const initialState: AlertState = {
  alerts: [],
  lastUpdated: Date.now(),
};

export const bulkUpsert = (state: AlertState, incoming: Alert[]): AlertState => {
  // 1. Deduplication using Map (O(n))
  const map = new Map(state.alerts.map(a => [a.id, a]));
  
  // 2. Insert/Update new items
  incoming.forEach(a => map.set(a.id, a));

  // 3. Sort (O(n log n))
  const sortedAlerts = Array.from(map.values()).sort(alertComparator);

  return {
    ...state,
    alerts: sortedAlerts,
    lastUpdated: Date.now(),
  };
};
