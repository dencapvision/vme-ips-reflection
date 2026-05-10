/**
 * Welcome to Cloudflare Workers!
 * This proxy handles LINE Messaging API requests.
 */

export interface Env {
  LINE_CHANNEL_ACCESS_TOKEN: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const body: any = await request.json();
      
      // Simple broadcast message example
      const response = await fetch("https://api.line.me/v2/bot/message/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": \`Bearer \${env.LINE_CHANNEL_ACCESS_TOKEN}\`
        },
        body: JSON.stringify({
          messages: [
            {
              type: "text",
              text: body.message || "Hello from CAP-Vision Proxy"
            }
          ]
        })
      });

      const result = await response.json();
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e: any) {
      return new Response(e.message, { status: 500 });
    }
  },
};
