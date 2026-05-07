import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const API_KEY = process.env.BEEHIIV_API_KEY;
    const PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

    if (!API_KEY || !PUBLICATION_ID) {
      return NextResponse.json({ error: 'Beehiiv keys missing' }, { status: 500 });
    }

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/posts?status=confirmed&limit=3`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } else {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || 'Error from Beehiiv' }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
