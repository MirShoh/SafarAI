import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const PORT = process.env.PORT || 8787;
const hasKey = Boolean(process.env.OPENAI_API_KEY);
const openai = hasKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const app = express();
app.use(cors());
app.use(express.json({ limit: "16mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, aiConfigured: hasKey });
});

function requireOpenAI(res) {
  if (!openai) {
    res.status(503).json({
      error: "AI backend sozlanmagan",
      detail: "server/.env faylida OPENAI_API_KEY yo'q. server/.env.example'ni nusxalab, o'z kalitingizni qo'ying.",
    });
    return false;
  }
  return true;
}

function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : text);
}

// Text review authenticity check — replaces the exclamation-mark/word-count
// heuristic with an actual model judgment.
app.post("/api/analyze-review", async (req, res) => {
  if (!requireOpenAI(res)) return;
  const { text } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Sharh matni bo'sh" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Sen SafarAI turizm platformasining sharh haqiqiyligini tekshiruvchi AI detektorisan. " +
            "Foydalanuvchi yozgan turizm sharhini tahlil qil: haddan tashqari reklama uslubi, aniq tajriba " +
            "tafsilotlarining yo'qligi, takroriy/generic iboralar, haddan tashqari ijobiylik kabi shubhali " +
            "belgilarni izla. Faqat quyidagi JSON formatida javob ber, boshqa matn yozma: " +
            '{"suspicious": boolean, "score": number (0-100, ishonchlilik foizi, suspicious=true bo\'lsa bu soxta ehtimoli), ' +
            '"reasons": string[] (o\'zbek tilida, 1-3 ta qisqa sabab, suspicious=false bo\'lsa bo\'sh array)}',
        },
        { role: "user", content: text },
      ],
      temperature: 0.2,
      max_tokens: 300,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const result = extractJson(raw);
    res.json(result);
  } catch (err) {
    console.error("analyze-review failed:", err);
    res.status(502).json({ error: "AI tahlili amalga oshmadi", detail: err.message });
  }
});

// Ad photo vs real tourist photo comparison via vision.
app.post("/api/analyze-photos", async (req, res) => {
  if (!requireOpenAI(res)) return;
  const { adImage, realImage } = req.body || {};
  if (!adImage || !realImage) {
    return res.status(400).json({ error: "Ikkala rasm ham kerak (reklama va real surat)" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Sen SafarAI turizm platformasining 'Reklama vs Haqiqat' AI moduli - siz reklama surati bilan " +
            "turistning tasdiqlangan real suratini solishtirasiz. Bino/joy bir xilligini, jihozlar, tozalik, " +
            "obodonlashtirish darajasi, yorug'lik/burchak farqidan kelib chiqadigan noaniqliklarni hisobga olgan " +
            "holda ikkala rasmni tahlil qiling. Faqat quyidagi JSON formatida javob bering, boshqa matn yozmang: " +
            '{"realityMatchPercent": number (0-100), ' +
            '"matches": string[] (o\'zbek tilida, rasmlar mos keladigan jihatlar), ' +
            '"discrepancies": string[] (o\'zbek tilida, farq qiladigan jihatlar), ' +
            '"verdict": string (o\'zbek tilida, 1 gapli xulosa)}',
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Reklama rasmi:" },
            { type: "image_url", image_url: { url: adImage } },
            { type: "text", text: "Turistning real rasmi:" },
            { type: "image_url", image_url: { url: realImage } },
          ],
        },
      ],
      temperature: 0.2,
      max_tokens: 500,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const result = extractJson(raw);
    res.json(result);
  } catch (err) {
    console.error("analyze-photos failed:", err);
    res.status(502).json({ error: "AI tahlili amalga oshmadi", detail: err.message });
  }
});

// Natural-language place recommendation — grounded only in the catalog the
// frontend sends (its own PLACES list), so the model can't invent places
// that don't exist in the app. Powers both the onboarding questionnaire and
// the floating chat widget.
app.post("/api/recommend", async (req, res) => {
  if (!requireOpenAI(res)) return;
  const { query, catalog, history } = req.body || {};
  if (!query || !query.trim()) {
    return res.status(400).json({ error: "So'rov bo'sh" });
  }
  if (!Array.isArray(catalog) || catalog.length === 0) {
    return res.status(400).json({ error: "Joylar katalogi yuborilmadi" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Sen SafarAI - Qashqadaryo turizm platformasining sayohat tavsiyachi AI yordamchisisan. " +
            "Foydalanuvchi xohish-istagini tavsiflaydi (hudud, joy turi, kim bilan, byudjet va h.k.). " +
            "Faqat quyida JSON ko'rinishida berilgan KATALOGDAGI joylardan mos kelganlarini tanla - " +
            "katalogda yo'q joyni hech qachon o'ylab topma. Eng mos 3 tadan 5 tagacha joyni tanla, " +
            "Trust Score yuqori bo'lganlarga ustunlik ber. O'zbek tilida qisqa (2-3 gap), do'stona javob yoz. " +
            "Faqat quyidagi JSON formatda javob ber, boshqa matn yozma: " +
            '{"reply": string, "placeIds": string[] (faqat katalogdagi mavjud id qiymatlari)}. ' +
            `KATALOG: ${JSON.stringify(catalog)}`,
        },
        ...(Array.isArray(history) ? history.slice(-6) : []),
        { role: "user", content: query },
      ],
      temperature: 0.4,
      max_tokens: 400,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const result = extractJson(raw);
    const validIds = new Set(catalog.map((c) => c.id));
    result.placeIds = (result.placeIds || []).filter((id) => validIds.has(id));
    res.json(result);
  } catch (err) {
    console.error("recommend failed:", err);
    res.status(502).json({ error: "AI tavsiyasi amalga oshmadi", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`SafarAI backend http://localhost:${PORT} (AI configured: ${hasKey})`);
});
