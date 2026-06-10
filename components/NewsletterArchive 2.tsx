'use client';

import { useState, useEffect } from 'react';

interface BeehiivPost {
  id: string;
  title: string;
  subtitle: string;
  web_url: string;
  publish_date: string;
}

export default function NewsletterArchive() {
  const [posts, setPosts] = useState<BeehiivPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/newsletter-posts');
        if (res.ok) {
          const data = await res.json();
          const allPosts = data.data || [];
          const sorted = allPosts.sort((a: BeehiivPost, b: BeehiivPost) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
          setPosts(sorted.slice(0, 1));
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return (
    <div className="mt-12 opacity-30 text-xs tracking-widest uppercase">Cargando archivo...</div>
  );

  if (posts.length === 0) return null;

  return (
    <div className="mt-12 text-left border-t border-white/10 pt-12">
      <h3 className="tag-text !text-[11px] mb-8 opacity-40">ÚLTIMO ENVÍO</h3>
      <div className="grid gap-8">
        {posts.map((post) => (
          <a 
            key={post.id} 
            href={post.web_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block"
          >
            <h4 className="font-serif text-xl group-hover:text-accent transition-colors mb-2">
              {post.title}
            </h4>
            <p className="text-sm text-[#777] font-serif italic mb-1">
              {post.subtitle}
            </p>
            <span className="text-[10px] tracking-widest opacity-30 uppercase font-sans">
              {new Date(post.publish_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </a>
        ))}
      </div>
      <div className="mt-12 text-center">
        <a 
          href="https://archivo.mde.uy" 
          target="_blank" 
          rel="noopener noreferrer"
          className="tag-text !text-[10px] hover:text-accent transition-colors"
        >
          VER TODO EL ARCHIVO →
        </a>
      </div>
    </div>
  );
}
