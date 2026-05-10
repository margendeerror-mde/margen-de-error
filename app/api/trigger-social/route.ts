import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const API_KEY = process.env.BEEHIIV_API_KEY;
    const PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;
    const MAKE_WEBHOOK = 'https://hook.us2.make.com/89p6qmx8ck7ktbe983o5yh38h8bfeuq8';

    if (!API_KEY || !PUBLICATION_ID) {
      return NextResponse.json({ error: 'Faltan credenciales de Beehiiv' }, { status: 500 });
    }

    // 1. Obtener el último post de Beehiiv
    const postsRes = await fetch(`https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/posts?status=confirmed&limit=1`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    
    if (!postsRes.ok) return NextResponse.json({ error: 'Error leyendo Beehiiv API' }, { status: 500 });
    const postsData = await postsRes.json();
    
    if (!postsData.data || postsData.data.length === 0) {
      return NextResponse.json({ error: 'No se encontraron posts confirmados' }, { status: 404 });
    }

    const latestPost = postsData.data[0];
    const { title, web_url, preview_text } = latestPost;

    // 2. Extraer el texto del web_url
    const articleRes = await fetch(web_url);
    if (!articleRes.ok) return NextResponse.json({ error: 'Error leyendo el artículo web' }, { status: 500 });
    
    const html = await articleRes.text();
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let rawText = bodyMatch ? bodyMatch[1] : html;
    
    // Limpieza básica de HTML para que Gemini lo entienda
    rawText = rawText.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                     .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                     .replace(/<[^>]+>/g, ' ') // Quitar tags
                     .replace(/\s+/g, ' ')     // Colapsar espacios
                     .trim();

    // 3. Mandar a Make.com simulando el formato original de Beehiiv
    const makePayload = {
      title: title,
      content: {
        free: rawText.substring(0, 5000) // Límite razonable
      },
      preview_text: preview_text,
      url: web_url
    };

    const makeRes = await fetch(MAKE_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(makePayload)
    });

    if (!makeRes.ok) {
      return NextResponse.json({ error: 'Error enviando a Make.com' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Enviado correctamente a Make', post: title });

  } catch (error) {
    console.error('Error en trigger-social:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
