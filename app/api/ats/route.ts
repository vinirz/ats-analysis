import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function GET(request: NextRequest) {
  await redis.set("foo", "bar");
  const result = await redis.get("foo");
  return NextResponse.json(result);
}