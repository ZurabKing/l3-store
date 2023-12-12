import { AnalyticsParams } from 'types';

class AnalyticsService {
  sendAnalytic({ timestamp = new Date(), ...params }: AnalyticsParams) {
    return fetch('/api/sendEvent', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        ...params,
        timestamp
      })
    });
  }
}

export const analyticsApi = new AnalyticsService();
