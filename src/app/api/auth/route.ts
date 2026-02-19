export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // Get password from environment variable
    const correctPassword = process.env.SITE_PASSWORD || "preview2024";

    if (password === correctPassword) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: false }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
