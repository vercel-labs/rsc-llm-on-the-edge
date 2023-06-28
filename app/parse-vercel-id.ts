export function parseVercelId(id: string | null) {
  const parts = id?.split(':').filter(Boolean);
  if (!parts) {
    console.log('"x-vercel-id" header not present. Running on localhost?');
    return { proxyRegion: 'localhost', computeRegion: 'localhost' };
  }
  const proxyRegion = parts[0];
  const computeRegion = parts[parts.length - 2];
  return { proxyRegion, computeRegion };
}
