import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv();
export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();
  const {dept,name,pos,mold,therapy} = req.body;
  const pid = Date.now().toString();
  const newPatient = {
    id:pid, dept,name,pos,mold,therapy,
    status:"待勾选", checked:false
  };
  let list = await kv.get('patientList') || [];
  list.push(newPatient);
  await kv.set('patientList', list);
  res.status(200).json({ok:true});
}
