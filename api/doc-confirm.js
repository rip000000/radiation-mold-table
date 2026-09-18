export const config = { runtime: 'edge' };
import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv();

function cors(res) {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return cors(new Response(null, { status: 204 }));
  if (req.method !== 'POST') return cors(new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } }));
  const { pid } = await req.json();
  let patientList = await redis.get('patientList') || [];
  const target = patientList.find(item => item.id === pid);
  if (target) target.status = '医生已确认拆除';
  await redis.set('patientList', patientList);
  return cors(new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } }));
}
