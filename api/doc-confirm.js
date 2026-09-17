export const config = {
  runtime: 'edge',
};
import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv();

export default async function handler(req) {
  if(req.method !== 'POST'){
    return new Response(JSON.stringify({error:"Method not allowed"}), {
      status:405,
      headers:{'Content-Type':'application/json'}
    })
  }
  const {pid} = await req.json();
  let patientList = await redis.get('patientList') || [];
  const target = patientList.find(item => item.id === pid);
  if(target){
    target.status = "医生已确认拆除";
  }
  await redis.set('patientList', patientList);
  return new Response(JSON.stringify({success:true}), {
    headers:{'Content-Type':'application/json'}
  })
}
