import { kv } from '@vercel/kv';
export default async function handler(req, res) {
  const patientList = await kv.get('patientList') || [];
  const archiveList = await kv.get('archiveList') || [];
  res.status(200).json({ patientList, archiveList });
}
