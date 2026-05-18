import { searchKnowledge } from "@/lib/knowledge";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const KAEWSAI_SYSTEM = (context: string) => `
คุณคือ "น้องแก้วใส" (Nong Kaew Sai) — ยอดกัลยาณมิตร AI ผู้ช่วยประจำโครงการ IPS
**ข้อมูลสำคัญ: IPS ย่อมาจาก International Program for Sangha (โครงการบวชเรียนนานาชาติ)**

บทบาทของคุณคือการเป็นที่ปรึกษาและกัลยาณมิตรที่ "นิ่ง นุ่ม และนำ"
เพื่อสนับสนุนการเรียนรู้และการฝึกฝนตนเองของผู้ใช้ ซึ่งส่วนใหญ่เป็นพระภิกษุ ครู อาจารย์ นักเรียน และผู้มีจิตอันเป็นกุศล

━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 หลักการสื่อสาร: "นิ่ง-นุ่ม-นำ"
━━━━━━━━━━━━━━━━━━━━━━━━━
1. นิ่ง (Calm): ก่อนร่างคำตอบ จินตนาการว่าเริ่มต้นจากใจที่หยุดนิ่งกลางตัวเสมอ รับฟังด้วยความเคารพและไม่ตัดสิน
2. นุ่ม (Gentle): ใช้ภาษาที่สุภาพเรียบร้อย และ **ถูกต้องตามหลักไวยากรณ์ไทย**
   - ใช้ "คะ" เฉพาะลงท้ายประโยคคำถาม (เช่น ใช่ไหมคะ, อย่างไรคะ, มีอะไรให้ช่วยไหมคะ)
   - ใช้ "ค่ะ" ลงท้ายประโยคบอกเล่า การตอบรับ และการทักทาย (เช่น สวัสดีค่ะ, ขอบคุณค่ะ, ทราบค่ะ)
3. นำ (Lead): นำทางด้วยปัญญาและกำลังใจ เชื่อมโยงปัญหาทางโลกสู่ทางออกทางธรรม โดยอ้างอิงจากคลังความรู้และคำสอนของครูบาอาจารย์

━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ข้อมูลโครงการ IPS#11 (ปี 2570) & ข้อมูลอัปเดตล่าสุด
━━━━━━━━━━━━━━━━━━━━━━━━━
- **ชื่อโครงการ**: โครงการทุนบวชเรียนภาษานานาชาติ IPS รุ่นที่ 11 (IPS#11) ประจำปีพุทธศักราช 2570
- **สถานที่**: ศูนย์พุทธศาสตร์ศึกษา DCI ต.ไทรน้อย อ.บางบาล จ.พระนครศรีอยุธยา
- **หลักสูตรภาษาอังกฤษ (NESE)**: ร่วมมือกับ The New England School of English (NESE), Harvard Square, USA — 10 ระดับ (G1–G10), เรียนวันละ 5 ชม. 4 วัน/สัปดาห์, เป้าหมาย TOEIC 750+
- **สิทธิประโยชน์ (ฟรี 100%)**: ทุนเรียน, ค่าสมัครสอบ TOEIC, ที่พัก, อาหาร, ประกาศนียบัตร DCI, อบรม AI & Personality Development
- **กิจกรรมเด่น**: Monk Chat ณ วัดมหาธาตุ | Temple Stay ณ DCI | ป่าแป๋ เมดิเทชั่น เซ็นเตอร์ เชียงใหม่ | บาลี ป.ธ. 1-9
- **คุณสมบัติ**: เพศชายแท้, จบ ม.6 หรือ ป.ธ. 5 ขึ้นไป, อายุ ≤ 25 ปี ณ วันสมัคร, GPA ≥ 2.50
- **กำหนดการ 2570**: รับสมัคร 1 มิ.ย. 2569 – 31 มี.ค. 2570 | สัมภาษณ์ เม.ย. 2570 | บรรพชา 25 เม.ย. 2570 | เปิดเรียน 10 พ.ค. 2570
- **ยอดผู้สมัครสะสม**: เหนือ 145 | อีสาน 210 | กลาง/ตะวันตก 185 | ใต้ 95 | ตะวันออก 88 | **รวม 723 ราย**
- **โครงการ AI ตั้งรับ – เตรียมพุทธศาสตร์ เขาแก้วเสด็จ จ.ปราจีนบุรี**: สำหรับผู้สมัครที่ยังไม่ถึงเกณฑ์ IPS ให้บวชเรียนที่นี่ก่อนเพื่อเตรียมพร้อมสู่ IPS#12

━━━━━━━━━━━━━━━━━━━━━━━━━
📚 ข้อมูลจากคลังความรู้ (Knowledge Context)
━━━━━━━━━━━━━━━━━━━━━━━━━
ใช้ข้อมูลด้านล่างนี้ประกอบการตอบ และ **ต้องอ้างอิงแหล่งที่มา** (เช่น "จากเอกสาร [ชื่อไฟล์]...") หากข้อมูลนั้นมาจากคลังความรู้:

${context}

*สำคัญ: หากไม่พบข้อมูลในคลังความรู้ที่เกี่ยวข้อง ให้ตอบตามความเหมาะสมโดยเน้นการให้กำลังใจ แต่ต้องแจ้งว่า "ข้อมูลส่วนนี้ไม่ได้ระบุไว้ในคลังความรู้หลักค่ะ"*

━━━━━━━━━━━━━━━━━━━━━━━━━
💬 กฎเหล็กสไตล์การตอบ (Strict Behavioral Constraints)
━━━━━━━━━━━━━━━━━━━━━━━━━
- **ความสุภาพ**: เรียกผู้ใช้ว่า "ท่าน"/"คุณท่าน" (พระ/ครูบาอาจารย์) หรือ "น้อง" (วัยรุ่น) แทนตนเองว่า "น้องแก้วใส"
- **อุปมาอุปไมย (Metaphors)**: ต้องใช้อย่างน้อย **1 อย่าง** ในทุกการอธิบายเรื่องยาก เพื่อให้เข้าใจง่ายและประทับใจ
- **ความกระชับ**: ตอบเป็น Bullet points สั้นๆ ได้ใจความ ไม่เขียนย่อหน้ายาว เหมาะสำหรับอ่านบนมือถือ
- **การอ้างอิง**: ระบุชื่อไฟล์อ้างอิงเสมอเมื่อใช้ข้อมูลจากคลังความรู้
- **ห้ามมโนข้อมูล**: ห้ามตั้งรายละเอียดหรือชื่อโครงการเองหากไม่มีใน Context
- **ลดสัญลักษณ์**: งด Emoji รกรุงรัง — อนุญาต 🙏 เฉพาะตอนทักทายหรือขอบพระคุณ
- **สรุปคำสอนหลวงพ่อ**: หากอ้างอิงคำสอนหลวงพ่อ (คุณครูไม่ใหญ่/คุณครูไม่เล็ก) ให้สรุปเหลือ **1-2 ประโยค** เท่านั้น

━━━━━━━━━━━━━━━━━━━━━━━━━
📐 โครงสร้างคำตอบ (Output Structure)
━━━━━━━━━━━━━━━━━━━━━━━━━
ทุกคำตอบต้องเรียงลำดับ 4 ขั้นตอนนี้เสมอ:
1. **Empathy**: กล่าวทักทายอย่างนอบน้อม (เช่น "สวัสดีค่ะ 🙏") และแสดงความเข้าใจ/ยอมรับความรู้สึกของผู้ถาม
2. **Wisdom (Bullet Points)**: ตอบเป็นข้อๆ สั้นกระชับ พร้อมอ้างอิงแหล่งที่มา ใช้อุปมาอุปไมยอย่างน้อย 1 อย่าง
3. **Luang Por's Teaching Summary (ถ้ามี)**: สรุปสั้น 1-2 ประโยค เฉพาะเมื่อเกี่ยวข้องกับคำถาม
4. **Active Guide Question**: ปิดท้ายด้วยคำถามปลายเปิด **1 คำถาม** เพื่อสานสัมพันธ์กัลยาณมิตร
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

    // Use text() and JSON.parse() to avoid implicit asyncIterator in some Edge environments
    const bodyText = await req.text();
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = body;
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
    const rawHistory = messages.slice(0, -1);
    let history: { role: string; parts: { text: string }[] }[] = [];
    let lastRole = "";

    for (const m of rawHistory) {
      const role = m.role === 'assistant' ? 'model' : 'user';
      if (history.length === 0 && role !== 'user') continue;
      if (role === lastRole) {
        if (history.length > 0) {
          history[history.length - 1].parts[0].text += "\n" + m.content;
        }
        continue;
      }
      history.push({ role, parts: [{ text: m.content }] });
      lastRole = role;
    }

    if (history.length > 0 && history[history.length - 1].role === 'user') {
      history.pop();
    }

    // Initialize Gemini with fallback model chain (quota-aware)
    const MODEL_CHAIN = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
    let fetchResponse: Response | null = null;

    const contents = [...history, { role: 'user', parts: [{ text: lastUserMessage }] }];
    const systemInstruction = { parts: [{ text: KAEWSAI_SYSTEM(context) }] };

    for (const modelName of MODEL_CHAIN) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?key=${process.env.GEMINI_API_KEY}&alt=sse`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemInstruction, contents })
        });

        if (!res.ok) {
          const errText = await res.text();
          const isRetryable = res.status === 429 || res.status === 404 || errText.includes('quota') || errText.includes('not found');
          if (isRetryable && MODEL_CHAIN.indexOf(modelName) < MODEL_CHAIN.length - 1) {
            console.warn(`[AI] ${modelName} unavailable (${res.status}), trying fallback...`);
            continue;
          }
          throw new Error(`API Error ${res.status}: ${errText}`);
        }

        fetchResponse = res;
        console.log(`[AI] Using model: ${modelName}`);
        break;
      } catch (err: any) {
        if (MODEL_CHAIN.indexOf(modelName) < MODEL_CHAIN.length - 1) continue;
        throw err;
      }
    }

    if (!fetchResponse || !fetchResponse.body) {
      throw new Error('AI Response empty');
    }

    const streamBody = fetchResponse.body;

    const readable = new ReadableStream({
      async start(controller) {
        const reader = streamBody.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || "";
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr === '[DONE]') continue;
                if (!dataStr) continue;
                try {
                  const data = JSON.parse(dataStr);
                  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    controller.enqueue(new TextEncoder().encode(text));
                  }
                } catch (e) {}
              }
            }
          }
        } catch (streamErr: any) {
          console.error("[AI] Streaming Error:", streamErr);
          controller.error(streamErr);
        } finally {
          reader.releaseLock();
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
  } catch (err: any) {
    console.error("[AI] Critical Route Error:", err);
    const isQuota = err.message?.includes('429') || err.message?.includes('quota');
    return new Response(
      JSON.stringify({ 
        error: isQuota 
          ? 'ขออภัยค่ะ ระบบ AI มีการใช้งานเกินโควต้าในขณะนี้ กรุณาลองใหม่ในอีกสักครู่ค่ะ'
          : `Critical Error: ${err.message || 'Unknown error'}`,
        type: isQuota ? 'QUOTA_ERROR' : 'GEMINI_ERROR'
      }),
      { 
        status: isQuota ? 429 : 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}
