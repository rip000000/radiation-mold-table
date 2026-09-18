export const config = { runtime: "edge" };
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
  if (req.method !== 'GET') return cors(new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } }));
  const patientList = await redis.get('patientList') || [];
  const stat = { '放疗一科': 0, '放疗二科': 0, '放疗三科': 0, '放疗四科': 0, '放疗五科': 0 };
  patientList.forEach(p => { if (stat.hasOwnProperty(p.dept)) stat[p.dept] += 1; });
  return cors(new Response(JSON.stringify({ stat, total: patientList.length }), { headers: { 'Content-Type': 'application/json' } }));
}
