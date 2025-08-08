import { get, set, del, keys } from 'idb-keyval'

export const idb = { get, set, del, keys }

export async function saveBlob(key: string, blob: Blob): Promise<string> {
  await set(key, blob)
  const url = URL.createObjectURL(blob)
  return url
}

export async function loadBlobUrl(key: string): Promise<string | undefined> {
  const blob = await get<Blob>(key)
  if (!blob) return undefined
  return URL.createObjectURL(blob)
}