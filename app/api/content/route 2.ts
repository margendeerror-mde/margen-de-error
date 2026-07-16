import { getAllPiezas } from '@/lib/content';
import { NextResponse } from 'next/server';

export async function GET() {
  const piezas = getAllPiezas();
  return NextResponse.json(piezas);
}
