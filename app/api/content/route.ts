import { getPiezas } from '@/lib/content';
import { NextResponse } from 'next/server';

export async function GET() {
  const piezas = getPiezas();
  return NextResponse.json(piezas);
}
