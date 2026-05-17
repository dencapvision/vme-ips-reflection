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
📋 ข้อมูลโครงการ IPS#11 (ปี 2570) & ข้อมูลอัปเดตล่าสุด
━━━━━━━━━━━━━━━━━━━━━━━━━
- **ชื่อโครงการ**: โครงการทุนบวชเรียนภาษานานาชาติ IPS รุ่นที่ 11 (IPS#11) ประจำปีพุทธศักราช 2570
- **สถานที่จัดอบรมและเรียนหลัก**: ศูนย์พุทธศาสตร์ศึกษา DCI ต.ไทรน้อย อ.บางบาล จ.พระนครศรีอยุธยา
- **หลักสูตรภาษาอังกฤษ**: ร่วมมือกับสถาบันชื่อดังระดับโลก **The New England School of English (NESE), USA** จัดหลักสูตรเข้มข้น 10 ระดับความรู้ (**G1 ถึง G10**) เรียนวันละ 5 ชั่วโมง 4 วันต่อสัปดาห์ เพื่อพัฒนาทักษะสู่เกณฑ์คะแนน **TOEIC 750+**
- **สิทธิประโยชน์หลัก (ฟรี 100%)**:
  - ทุนเรียนฟรีเต็มรูปแบบ ไม่มีข้อผูกมัดหรือค่าปรับหากขอออกก่อนหลักสูตร
  - ฟรีค่าสมัครสอบวัดระดับมาตรฐานสากล TOEIC
  - ฟรีค่าที่พัก อาหาร และการดูแลทางศีลธรรมตลอดระยะเวลาโครงการ
  - รับประกาศนียบัตรรับรองจากศูนย์พุทธศาสตร์ศึกษา DCI
  - อบรมพิเศษทักษะยุคดิจิทัล: เทคโนโลยีปัญญาประดิษฐ์ (Generative AI) และการพัฒนาบุคลิกภาพ (Personality Development)
- **กิจกรรมเด่นและการเรียนรู้ภาคสนาม**:
  - **Monk Chat** ณ วัดมหาธาตุ พระนครศรีอยุธยา: ฝึกทำหน้าที่กัลยาณมิตรสนทนาแลกเปลี่ยนธรรมะและภาษากับชาวต่างชาติในพื้นที่จริง
  - **Temple Stay**: สัมผัสชีวิตความเป็นอยู่อย่างพระสมณะที่เรียบง่ายแต่เป็นระบบพรีเมียมในศูนย์พุทธศาสตร์ DCI
  - **ป่าแป๋ เมดิเทชั่น เซ็นเตอร์ จ.เชียงใหม่**: ปฏิบัติสมาธิควบคู่กับการใช้ชีวิตฝึกภาษาอังกฤษท่ามกลางธรรมชาติร่มรื่น
  - **บาลีควบคู่**: มีทางเลือกเรียนปริยัติธรรมแผนกบาลี (ป.ธ. 1-2 ถึง ป.ธ. 9) ไปด้วยกัน พร้อมระบบติวเข้มและประเมินส่วนตัว
- **เกณฑ์คุณสมบัติผู้สมัคร**: เพศชายแท้ จบชั้น ม.6 หรือมีวุฒิบาลี ป.ธ. 5 ขึ้นไป, อายุไม่เกิน 25 ปี ณ วันสมัคร, เกรดเฉลี่ยสะสม GPA >= 2.50, ประพฤติดี ปลอดภัยจากสารเสพติดและคดีความ
- **กำหนดการที่สำคัญปี 2570**:
  - เปิดรับสมัคร: 1 มิถุนายน 2569 - 31 มีนาคม 2570
  - การสอบสัมภาษณ์: เดือนเมษายน 2570 (และประกาศผลสอบสัมภาษณ์อย่างเป็นทางการภายใน 7 วัน)
  - รายงานตัวและเตรียมความพร้อม: 10 - 11 เมษายน 2570 ณ DCI พระนครศรีอยุธยา
  - พิธีบรรพชาสามเณร: 25 เมษายน 2570 ณ วัดพระธรรมกาย
  - เปิดเรียนสัปดาห์แรก: 10 พฤษภาคม 2570
- **ยอดผู้สมัครสะสมแยกตามภูมิภาค (ล่าสุด)**:
  - ภาคเหนือ: 145 ราย
  - ภาคตะวันออกเฉียงเหนือ (อีสาน): 210 ราย
  - ภาคกลางและภาคตะวันตก: 185 ราย
  - ภาคใต้: 95 ราย
  - ภาคตะวันออก: 88 ราย
  - **ยอดรวมสมัครสะสม**: 723 ราย
- **โครงการ AI ตั้งรับ สนับสนุนโรงเรียนเตรียมพุทธศาสตร์ เขาแก้วเสด็จ จ.ปราจีนบุรี**:
  - วัตถุประสงค์: สนับสนุนการศึกษาและพัฒนาศาสนทายาทด้านนวัตกรรมและปัญญาประดิษฐ์ (AI)
  - แนวทาง: เชิญครู ผู้อำนวยการโรงเรียน และสามเณร/นักเรียน เข้าร่วมอบรมการใช้งาน AI เพื่อแสดงความพร้อมและการเรียนการสอนที่ทันสมัยร่วมกัน หวังดึงดูดนักเรียนระดับ ม.ปลาย เข้าร่วม IPS ในอนาคต
  - การขยายกลุ่มเป้าหมายเชิงรุก: หากโรงเรียนหรือผู้สมัครอายุ 18 ปีขึ้นไปในพื้นที่ยังไม่สนใจ IPS สามารถแนะนำผู้สมัครระดับ ม.ต้น-ม.ปลาย (จบ ป.6) ให้เข้าบวชเรียนเพื่อศึกษาต่อที่โรงเรียนเตรียมพุทธศาสตร์ เขาแก้วเสด็จ จ.ปราจีนบุรี ก่อนได้ เพื่อสร้างรากฐานกำลังพลและบ่มเพาะให้พร้อมก้าวสู่ทุน IPS#12 หรือรุ่นต่อๆ ไปเมื่ออายุถึงเกณฑ์ 18 ปีบริบูรณ์

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

    // Initialize Gemini with fallback model chain (quota-aware)
    const MODEL_CHAIN = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
    let fetchResponse: Response | null = null;
    let selectedModel = '';

    const contents = [...history, { role: 'user', parts: [{ text: lastUserMessage }] }];
    const systemInstruction = { parts: [{ text: KAEWSAI_SYSTEM(context) }] };

    for (const modelName of MODEL_CHAIN) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?key=${process.env.GEMINI_API_KEY}&alt=sse`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction,
            contents
          })
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
        selectedModel = modelName;
        console.log(`[AI] Using model: ${modelName}`);
        break;
      } catch (err: any) {
        if (MODEL_CHAIN.indexOf(modelName) < MODEL_CHAIN.length - 1) {
          console.warn(`[AI] ${modelName} fetch error, trying fallback...`);
          continue;
        }
        console.error("[AI] Gemini API Execution Error:", err);
        const isQuota = err.message?.includes('429') || err.message?.includes('quota');
        const errMsg = isQuota
          ? 'ขออภัยค่ะ ระบบ AI มีการใช้งานเกินโควต้าทุกรุ่นในขณะนี้ กรุณาลองใหม่ในอีกสักครู่ หรือติดต่อผู้ดูแลระบบค่ะ'
          : `AI Execution Error: ${err.message || 'Unknown error'}`;
        return new Response(
          JSON.stringify({ error: errMsg, type: isQuota ? 'QUOTA_ERROR' : 'GEMINI_ERROR' }),
          { status: isQuota ? 429 : 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (!fetchResponse || !fetchResponse.body) {
      return new Response(
        JSON.stringify({ error: 'ขออภัยค่ะ ระบบ AI มีการใช้งานเกินโควต้าทุกรุ่นในขณะนี้ กรุณาลองใหม่ในอีกสักครู่ค่ะ', type: 'QUOTA_ERROR' }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
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
                } catch (e) {
                  // Ignore JSON parse errors for partial chunks
                }
              }
            }
          }
          console.log("[AI] Stream finished successfully");
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
    return new Response(
      JSON.stringify({ error: `Critical Error: ${err.stack || err.message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
