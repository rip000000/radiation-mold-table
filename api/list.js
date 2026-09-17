import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv();
export default async function handler(req, res) {
  const patientList = await kv.get('patientList') || [];
  const archiveList = await kv.get('archiveList') || [];
  res.status(200).json({ patientList, archiveList });
}
