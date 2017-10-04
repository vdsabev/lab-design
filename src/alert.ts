import { store } from './store';

// Entity
export interface Alert {
  type: AlertType;
  message: string;
}

type AlertType = 'success' | 'error';

// Store
export enum AlertActions {
  ALERT_ADDED = 'ALERT_ADDED'
}

const addAlert = (type: AlertType, message: string) => store.dispatch({ type: AlertActions.ALERT_ADDED, alert: { type, message } });

export const notify = {
  success: (message: string) => addAlert('success', message),
  error: (message: string | { message: string }) => addAlert('error', typeof message === 'string' ? message : message.message)
};

type AlertAction = Action<AlertActions> & { alert?: Alert };

export function alerts(state: Alert[] = [], action: AlertAction = {}): Alert[] {
  switch (action.type) {
  case AlertActions.ALERT_ADDED:
    switch (action.alert.type) {
    case 'success':
      console['log'](action.alert.message);
      break;
    case 'error':
      console['error'](action.alert.message);
      break;
    }
    return [...state, action.alert];
  }
  return state;
}
