export const config = {
  runtime: 'edge',
};
import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const patientList = await redis.get('patientList') || [];
  const archiveList = await redis.get('archiveList') || [];
  res.status(200).json({ patientList, archiveList });
}
