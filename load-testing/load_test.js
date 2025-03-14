import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50,        // 50 virtual users
  duration:'30s', // Test duration (30 seconds)
};

export default function () {
  const res = http.get('https://socialmedia.zapto.org/api/posts');  
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);  // Wait for 1 second before the next request
}
