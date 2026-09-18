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
  const list = await redis.get('patientList') || [];
  const pending = list.filter(p => p.status === '待勾选');
  const stat = {
    '放疗一科': pending.filter(x => x.dept === '放疗一科').length,
    '放疗二科': pending.filter(x => x.dept === '放疗二科').length,
    '放疗三科': pending.filter(x => x.dept === '放疗三科').length,
    '放疗四科': pending.filter(x => x.dept === '放疗四科').length,
    '放疗五科': pending.filter(x => x.dept === '放疗五科').length,
  };
  return cors(new Response(JSON.stringify({ success: true, stat }), { headers: { 'Content-Type': 'application/json' } }));
}
