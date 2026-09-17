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

export default async function handler(req) {
  if(req.method !== 'POST'){
    return new Response(JSON.stringify({error:"Method not allowed"}), {
      status:405,
      headers:{'Content-Type':'application/json'}
    })
  }
  const {dept,name,pos,mold,therapy} = await req.json();
  const pid = Date.now().toString();
  const newPatient = {
    id:pid, dept,name,pos,mold,therapy,
    status:"待勾选", checked:false
  };
  let list = await redis.get('patientList') || [];
  list.push(newPatient);
  await redis.set('patientList', list);
  return new Response(JSON.stringify({success:true, data:newPatient}), {
    headers:{'Content-Type':'application/json'}
  })
}
