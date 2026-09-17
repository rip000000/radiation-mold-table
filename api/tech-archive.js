import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();
  const {pid} = req.body;
  let patientList = await redis.get('patientList') || [];
  let archiveList = await redis.get('archiveList') || [];
  const idx = patientList.findIndex(p=>p.id===pid);
  if(idx >=0){
    const p = patientList[idx];
    p.archiveTime = new Date().toLocaleString();
    archiveList.push(p);
    patientList.splice(idx,1);
  }
  await redis.set('patientList', patientList);
  await redis.set('archiveList', archiveList);
  res.status(200).json({ok:true});
}
