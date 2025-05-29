import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decodeBase64 as b64decode, encodeBase64 as b64encode } from "https://deno.land/std@0.224.0/encoding/base64.ts";
function toBase64Url(b64) {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
// Helper: sign a JWT with SRV_ACCOUNT_KEY → get OAuth token
async function getAccessToken() {
  console.log("getAccessToken: start");
  const saJson = Deno.env.get("SRV_ACCOUNT_KEY");
  if (!saJson) throw new Error("Missing SRV_ACCOUNT_KEY");
  const sa = JSON.parse(saJson);
  const headerJson = JSON.stringify({
    alg: "RS256",
    typ: "JWT"
  });
  const headerB64 = b64encode(new TextEncoder().encode(headerJson));
  const headerUrl = toBase64Url(headerB64);
  const iat = Math.floor(Date.now() / 1000);
  const claimJson = JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    iat,
    exp: iat + 3600
  });
  const claimB64 = b64encode(new TextEncoder().encode(claimJson));
  const claimUrl = toBase64Url(claimB64);
  const pemBody = sa.private_key.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const pkcs8 = b64decode(pemBody);
  const key = await crypto.subtle.importKey("pkcs8", pkcs8, {
    name: "RSASSA-PKCS1-v1_5",
    hash: "SHA-256"
  }, false, [
    "sign"
  ]);
  const toSign = new TextEncoder().encode(`${headerUrl}.${claimUrl}`);
  const sigBuf = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, toSign);
  const sigB64 = b64encode(new Uint8Array(sigBuf));
  const sigUrl = toBase64Url(sigB64);
  const jwt = `${headerUrl}.${claimUrl}.${sigUrl}`;
  console.log("getAccessToken: JWT assembled");
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  }).then((r)=>r.json());
  if (!resp.access_token) {
    console.error("getAccessToken: error response", resp);
    throw new Error(`OAuth error: ${JSON.stringify(resp)}`);
  }
  console.log("getAccessToken: obtained access_token");
  return resp.access_token;
}
// Main Edge Function
const ENGINE_ID = Deno.env.get("ENGINE_ID");
const SESSION_ID = Deno.env.get("SESSION_ID");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const db = createClient(supabaseUrl, supabaseKey);
serve(async (req)=>{
  try {
    console.log("serve: received request method =", req.method);
    if (req.method !== "POST") {
      return new Response(null, {
        status: 405
      });
    }
    const { path, user_id } = await req.json();
    console.log("serve: parsed body", {
      path,
      user_id
    });
    // Build full engine resource path
    const project = Deno.env.get("GOOGLE_CLOUD_PROJECT");
    const location = Deno.env.get("GOOGLE_CLOUD_LOCATION");
    const engineResource = `projects/${project}/locations/${location}/reasoningEngines/${ENGINE_ID}`;
    console.log("serve: engine resource =", engineResource);
    // 1) Generate signed URL
    const { data, error } = await db.storage.from("resumes").createSignedUrl(path, 300);
    if (error) {
      console.error("serve: storage error", error);
      return new Response(JSON.stringify(error), {
        status: 500
      });
    }
    const url = data.signedUrl;
    console.log("serve: signed URL =", url);
    // 2) Fetch access token
    const token = await getAccessToken();
    console.log("serve: token length =", token.length);
    // 3) Append user event
    const msg = `@tool extract_to_markdown(path="${url}")`;
    const appendUrl = `https://us-central1-aiplatform.googleapis.com/v1beta1/${engineResource}/sessions/${SESSION_ID}:appendEvent`;
    console.log("serve: appendEvent URL =", appendUrl);
    await fetch(appendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        author: "user",
        invocationId: crypto.randomUUID(),
        content: {
          text: msg
        },
        timestamp: new Date().toISOString()
      })
    });
    // 4) Stream the response
    const streamUrl = `https://us-central1-aiplatform.googleapis.com/v1beta1/${engineResource}/sessions/${SESSION_ID}:streamQuery`;
    console.log("serve: streamQuery URL =", streamUrl);
    const streamRes = await fetch(streamUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: {
          question: msg
        }
      })
    });
    // Debug raw response
    console.log("serve: status code =", streamRes.status);
    console.log("serve: headers =", [
      ...streamRes.headers.entries()
    ]);
    const raw = await streamRes.text();
    console.log("serve: raw response =", raw);
    // Return raw dump for inspection
    return new Response(raw, {
      status: 200
    });
  } catch (err) {
    console.error("serve: unhandled error", err);
    return new Response(`Internal error: ${err.message}`, {
      status: 500
    });
  }
});
