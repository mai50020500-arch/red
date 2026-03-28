import { bulkUpsert, initialState } from './alert.state';
import { Alert } from './alert.types';

describe('Alert Subsystem Logic', () => {
  const mockAlert = (id: string, ts: number): Alert => ({
    id,
    timestamp: ts,
    message: 'Test',
    severity: 'info'
  });

  test('should add new alerts correctly', () => {
    const newAlerts = [mockAlert('1', 100), mockAlert('2', 200)];
    const state = bulkUpsert(initialState, newAlerts);
    
    expect(state.alerts).toHaveLength(2);
    expect(state.alerts[0].id).toBe('2'); // Should be sorted descending
  });

  test('should deduplicate alerts (update existing)', () => {
    const initial = bulkUpsert(initialState, [mockAlert('1', 100)]);
    
    // Update alert '1' with newer timestamp
    const update = [mockAlert('1', 300), mockAlert('2', 200)];
    const finalState = bulkUpsert(initial, update);

    expect(finalState.alerts).toHaveLength(2); // Still 2 items, not 3
    expect(finalState.alerts[0].timestamp).toBe(300); // Updated value
    expect(finalState.alerts[0].id).toBe('1'); // Newest first
  });
});
