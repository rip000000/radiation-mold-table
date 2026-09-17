import { kv } from '@vercel/kv';
export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();
  const {pid} = req.body;
  let list = await kv.get('patientList') || [];
  const item = list.find(p=>p.id===pid);
  if(item) item.checked = !item.checked;
  await kv.set('patientList', list);
  res.status(200).json({ok:true});
}
