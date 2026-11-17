import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {

    http_req_duration: ['p(95)<500'],

    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:5000/api';

export default function () {

  const foodsRes = http.get(`${BASE_URL}/foods`);
  check(foodsRes, {
    'GET /foods status is 200': (r) => r.status === 200,
    'GET /foods duration < 300ms': (r) => r.timings.duration < 300,
  });

  const catRes = http.get(`${BASE_URL}/categories`);
  check(catRes, {
    'GET /categories status is 200': (r) => r.status === 200,
  });

  sleep(1);
}

