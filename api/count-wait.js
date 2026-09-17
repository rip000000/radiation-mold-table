export const config = {
  runtime: 'edge',
};
import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv();

// CORS跨域处理
function setCorsHeaders(res) {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req) {
  if(req.method === 'OPTIONS'){
    const response = new Response(null, {status:204})
    setCorsHeaders(response)
    return response
  }
  // 下面放原有业务代码
}
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
