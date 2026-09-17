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
  if(req.method !== 'POST'){
    return new Response(JSON.stringify({error:"Method not allowed"}), {
      status:405,
      headers:{'Content-Type':'application/json'}
    })
  }
  const {pid, checked} = await req.json();
  let patientList = await redis.get('patientList') || [];
  const target = patientList.find(item => item.id === pid);
  if(target){
    target.checked = checked;
    target.status = checked ? "医生确认可拆除" : "待勾选";
  }
  await redis.set('patientList', patientList);
  return new Response(JSON.stringify({success:true}), {
    headers:{'Content-Type':'application/json'}
  })
}
