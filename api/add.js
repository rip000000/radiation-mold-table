export const config = {
  runtime: 'edge',
};
import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv();

export default async function handler(req) {
  if(req.method !== 'GET'){
    return new Response(JSON.stringify({error:"Method not allowed"}), {
      status:405,
      headers:{'Content-Type':'application/json'}
    })
  }
  const patientList = await redis.get('patientList') || [];
  const archiveList = await redis.get('archiveList') || [];
  return new Response(JSON.stringify({ patientList, archiveList }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
