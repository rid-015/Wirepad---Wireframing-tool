import type { Project } from "./component-registry";

// A share link carries the whole project in the URL hash: `#v=<code>`.
// The code is a one-letter prefix ("z" deflate-raw, "r" raw) + base64url.

async function pipe(data: Uint8Array, stream: TransformStream<Uint8Array, Uint8Array>) {
  const out = new Blob([data as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

export async function encodeShare(project: Project): Promise<string> {
  let out = new TextEncoder().encode(JSON.stringify(project));
  let pre = "r";
  if (typeof CompressionStream !== "undefined") {
    out = await pipe(out, new CompressionStream("deflate-raw"));
    pre = "z";
  }
  let bin = "";
  for (let i = 0; i < out.length; i++) bin += String.fromCharCode(out[i]);
  return pre + btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function decodeShare(code: string): Promise<Project> {
  let b = code.slice(1).replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  let data = Uint8Array.from(atob(b), (c) => c.charCodeAt(0));
  if (code[0] === "z") data = await pipe(data, new DecompressionStream("deflate-raw"));
  return JSON.parse(new TextDecoder().decode(data));
}
