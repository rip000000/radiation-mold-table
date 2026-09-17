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
  // 按科室分组统计
  const stat = {
    "放疗一科":0,
    "放疗二科":0,
    "放疗三科":0,
    "放疗四科":0,
    "放疗五科":0
  };
  patientList.forEach(p=>{
    if(stat.hasOwnProperty(p.dept)) stat[p.dept] +=1;
  })
  return new Response(JSON.stringify({stat, total:patientList.length}), {
    headers:{'Content-Type':'application/json'}
  })
}
