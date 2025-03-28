export function getLoaderUrl(slug: string) {
  return `/build/${slug}/Build/${slug}.loader.js`;
}

export function getDataUrl(slug: string) {
  return `/build/${slug}/Build/${slug}.data`;
}

export function getFrameworkUrl(slug: string) {
  return `/build/${slug}/Build/${slug}.framework.js`;
}

export function getCodeUrl(slug: string) {
  return `/build/${slug}/Build/${slug}.wasm`;
}
