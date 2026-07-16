import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const API_KEY = process.env.BEEHIIV_API_KEY;
    const PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

    // While keys are missing, we provide a fallback for testing the UI
    if (!API_KEY || !PUBLICATION_ID) {
      console.warn('Beehiiv API keys are missing. Subscription simulated.');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      return NextResponse.json({ message: 'Simulated success (missing keys)' }, { status: 200 });
    }

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: 'mde.uy',
          utm_medium: 'website',
        }),
      }
    );

    if (response.ok) {
      return NextResponse.json({ message: 'Success' }, { status: 200 });
    } else {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || 'Error from Beehiiv' }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
