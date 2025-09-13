import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'grep.chat',
    short_name: 'grep.chat',
    description: 'Choose your AI. Ask anything. Get answers that matter.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [],
  }
}