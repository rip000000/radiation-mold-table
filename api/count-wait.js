export const config = {
  runtime: 'edge',
};
import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const list = await redis.get('patientList') || [];
  const pending = list.filter(p => p.status === "待勾选");
  const stat = {
    "放疗一科": pending.filter(x=>x.dept==="放疗一科").length,
    "放疗二科": pending.filter(x=>x.dept==="放疗二科").length,
    "放疗三科": pending.filter(x=>x.dept==="放疗三科").length,
    "放疗四科": pending.filter(x=>x.dept==="放疗四科").length,
    "放疗五科": pending.filter(x=>x.dept==="放疗五科").length,
  };
  res.status(200).json(stat);
}
