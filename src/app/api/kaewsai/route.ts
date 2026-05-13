import { getGeminiModel } from "@/lib/clients";
import { searchKnowledge } from "@/lib/knowledge";

const KAEWSAI_SYSTEM = (context: string) => `
คุณคือ "น้องแก้วใส" (Nong Kaew Sai) — ยอดกัลยาณมิตร AI ผู้ช่วยประจำโครงการ IPS
**ข้อมูลสำคัญ: IPS ย่อมาจาก International Program for Sangha (โครงการบวชเรียนนานาชาติ)**

บทบาทของคุณคือการเป็นที่ปรึกษาและกัลยาณมิตรที่ "นิ่ง นุ่ม และเปี่ยมด้วยปัญญา" 
เพื่อสนับสนุนการเรียนรู้และการฝึกฝนตนเองของผู้ใช้ ซึ่งส่วนใหญ่เป็นพระภิกษุ ครู อาจารย์ และผู้มีจิตอันเป็นกุศล (อายุ 50-80 ปี)

━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 หลักการสื่อสาร: "นิ่ง-นุ่ม-เป็นระบบ"
━━━━━━━━━━━━━━━━━━━━━━━━━
1. นิ่ง (Calm): รับฟังด้วยความเคารพและไม่ตัดสิน หากผู้ใช้มีความกังวล ให้ประคองใจด้วยความสงบ
2. นุ่ม (Gentle): ใช้ภาษาที่สุภาพเรียบร้อย และ **ถูกต้องตามหลักไวยากรณ์ไทย**
   - ใช้ "คะ" เฉพาะลงท้ายประโยคคำถาม (เช่น ใช่ไหมคะ, อย่างไรคะ, มีอะไรให้ช่วยไหมคะ)
   - ใช้ "ค่ะ" ลงท้ายประโยคบอกเล่า การตอบรับ และการทักทาย (เช่น สวัสดีค่ะ, ขอบคุณค่ะ, ทราบค่ะ, ยินดีค่ะ, น้องแก้วใสมาแล้วค่ะ)
3. เป็นระบบ (Structured): ตอบอย่างชัดเจน เป็นลำดับขั้นตอน (1, 2, 3) เพื่อให้ง่ายต่อการอ่านและทำความเข้าใจ
4. มีปัญญา (Wise): ให้คำแนะนำโดยอ้างอิงจากคลังความรู้และคำสอนของครูบาอาจารย์เป็นหลัก (โดยเฉพาะคำสอนของหลวงพ่อคุณครูไม่ใหญ่ และหลวงพ่อคุณครูไม่เล็ก)

━━━━━━━━━━━━━━━━━━━━━━━━━
📚 ข้อมูลจากคลังความรู้ (Knowledge Context)
━━━━━━━━━━━━━━━━━━━━━━━━━
ใช้ข้อมูลด้านล่างนี้ประกอบการตอบ และ **ต้องอ้างอิงแหล่งที่มา** (เช่น "จากเอกสาร [ชื่อไฟล์]...") หากข้อมูลนั้นมาจากคลังความรู้:

${context}

*สำคัญ: หากไม่พบข้อมูลในคลังความรู้ที่เกี่ยวข้อง ให้ตอบตามความเหมาะสมโดยเน้นการให้กำลังใจ แต่ต้องแจ้งว่า "ข้อมูลส่วนนี้ไม่ได้ระบุไว้ในคลังความรู้หลักค่ะ"

━━━━━━━━━━━━━━━━━━━━━━━━━
💬 กฎเหล็กสไตล์การตอบ (Strict Guidelines)
━━━━━━━━━━━━━━━━━━━━━━━━━
- **ความสุภาพ**: เรียกผู้ใช้ว่า "ท่าน" หรือ "คุณท่าน" และแทนตนเองว่า "น้องแก้วใส"
- **การอ้างอิง**: เมื่อนำข้อมูลมาจากคลังความรู้ ให้ระบุชื่อไฟล์อ้างอิงเสมอ เพื่อความน่าเชื่อถือ
- **ความกระชับ**: ไม่ออกนอกเรื่อง เน้นเนื้อหาที่เป็นสาระและเป็นประโยชน์
- **ห้ามมโนข้อมูล**: ห้ามตั้งชื่อภาษาอังกฤษหรือรายละเอียดโครงการเอง หากไม่มีใน Context
- **ลดสัญลักษณ์**: งดการใช้ Emoji รกรุงรัง (อนุญาตให้ใช้ 🙏 เฉพาะตอนทักทายหรือขอบพระคุณเท่านั้น)
- **โครงสร้างคำตอบ**:
  1. การกล่าวรับหรือทักทายอย่างนอบน้อม (สวัสดีค่ะ... 🙏)
  2. เนื้อหาหลัก: ตอบเป็นข้อๆ หรือแบ่งย่อหน้าให้ชัดเจน พร้อมอ้างอิงแหล่งที่มา
  3. สรุปหรือข้อคิดสั้นๆ เพื่อการนำไปใช้
  4. ประโยคปิดท้ายที่แสดงความพร้อมที่จะช่วยเหลือเสมอ
`;

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("[AI] Missing GEMINI_API_KEY");
      return new Response(
        JSON.stringify({ error: "กรุณาตั้งค่า GEMINI_API_KEY ใน Cloudflare Dashboard" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request: No messages provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const lastMessage = messages[messages.length - 1];
    const lastUserMessage = lastMessage?.content || "";

    console.log(`[AI] Incoming request: "${lastUserMessage.slice(0, 50)}..."`);

    // ── RAG: Search Knowledge Base (Training Data) ──────────────
    let context = "ขณะนี้ยังไม่มีข้อมูลเฉพาะเจาะจงในคลังความรู้สำหรับเรื่องนี้ค่ะ";
    try {
      if (typeof lastUserMessage === 'string' && lastUserMessage.length > 2) {
        console.log(`[AI] Searching knowledge base for context...`);
        const searchResults = await searchKnowledge(lastUserMessage, 5);
        if (searchResults && searchResults.length > 0) {
          context = searchResults.map((r: any) => {
            const filename = r.metadata?.filename || r.source_file || "เอกสารอ้างอิง";
            return `[แหล่งอ้างอิง: ${filename}]\n${r.content}`;
          }).join('\n\n---\n\n');
          console.log(`[AI] Found context from ${searchResults.length} chunks.`);
        } else {
          console.log(`[AI] No matching context found in knowledge base.`);
        }
      }
    } catch (searchErr) {
      console.error("[AI] RAG Search Error:", searchErr);
    }

    // ── Prepare History for Gemini ──────────────────────────────
    // CRITICAL: Gemini history must:
    // 1. Start with 'user' role.
    // 2. Alternate between 'user' and 'model'.
    // 3. End with 'model' (since sendMessage adds the final 'user' message).
    const rawHistory = messages.slice(0, -1);
    
    let history: { role: string; parts: { text: string }[] }[] = [];
    let lastRole = "";

    for (const m of rawHistory) {
      const role = m.role === 'assistant' ? 'model' : 'user';
      
      // Skip if this is the first message and it's not a user
      if (history.length === 0 && role !== 'user') continue;
      
      // Skip if it's the same role as the previous message (merge or skip)
      if (role === lastRole) {
        // Option: Append text to previous message parts
        if (history.length > 0) {
          history[history.length - 1].parts[0].text += "\n" + m.content;
        }
        continue;
      }

      history.push({
        role: role,
        parts: [{ text: m.content }]
      });
      lastRole = role;
    }

    // Ensure history ends with 'model' so the next sendMessage (which is 'user') is valid
    if (history.length > 0 && history[history.length - 1].role === 'user') {
      history.pop();
    }

    console.log(`[AI] Cleaned history with ${history.length} messages.`);

    // Initialize Gemini with System Instruction (incorporating RAG context)
    const geminiModel = getGeminiModel('gemini-2.0-flash', KAEWSAI_SYSTEM(context));
    
    try {
      const chat = geminiModel.startChat({ history });
      const result = await chat.sendMessageStream(lastUserMessage);

      console.log("[AI] Gemini Stream initiated");

      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              controller.enqueue(new TextEncoder().encode(text));
            }
            console.log("[AI] Stream finished successfully");
          } catch (streamErr: any) {
            console.error("[AI] Streaming Error:", streamErr);
            // If we can't send a JSON error through a partially open stream, 
            // the client will just see the stream end abruptly.
            controller.error(streamErr);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: { 
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          "X-Content-Type-Options": "nosniff"
        },
      });
    } catch (geminiErr: any) {
      console.error("[AI] Gemini API Execution Error:", geminiErr);
      return new Response(
        JSON.stringify({ 
          error: `AI Execution Error: ${geminiErr.message || 'Unknown error'}`,
          type: 'GEMINI_ERROR'
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err: any) {
    console.error("[AI] Critical Route Error:", err);
    return new Response(
      JSON.stringify({ error: `Critical Error: ${err.message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
