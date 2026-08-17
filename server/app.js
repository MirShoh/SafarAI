import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

const hasKey = Boolean(process.env.OPENAI_API_KEY);

const openai = hasKey
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

app.use(
  cors({
    origin: true,
  })
);

app.use(express.json({ limit: "16mb" }));

function requireOpenAI(res) {
  if (!openai) {
    res.status(503).json({
      error: "AI backend sozlanmagan",
      detail: "OPENAI_API_KEY Netlify Environment Variables'da mavjud emas.",
    });

    return false;
  }

  return true;
}

function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : text);
}

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    aiConfigured: hasKey,
    platform: "Netlify Functions",
  });
});

/* =========================
   REVIEW ANALYSIS
========================= */

app.post("/api/analyze-review", async (req, res) => {
  if (!requireOpenAI(res)) return;

  const { text } = req.body || {};

  if (!text || !text.trim()) {
    return res.status(400).json({
      error: "Sharh matni bo'sh",
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content:
            "Sen SafarAI turizm platformasining sharh haqiqiyligini tekshiruvchi AI detektorisan. " +
            "Foydalanuvchi yozgan turizm sharhini tahlil qil: haddan tashqari reklama uslubi, aniq tajriba " +
            "tafsilotlarining yo'qligi, takroriy/generic iboralar, haddan tashqari ijobiylik kabi shubhali " +
            "belgilarni izla. Faqat quyidagi JSON formatida javob ber: " +
            '{"suspicious": boolean, "score": number, "reasons": string[]}',
        },

        {
          role: "user",
          content: text,
        },
      ],

      temperature: 0.2,
      max_tokens: 300,
    });

    const raw =
      completion.choices[0]?.message?.content || "{}";

    const result = extractJson(raw);

    res.json(result);
  } catch (err) {
    console.error("analyze-review failed:", err);

    res.status(502).json({
      error: "AI tahlili amalga oshmadi",
      detail: err.message,
    });
  }
});

/* =========================
   PHOTO ANALYSIS
========================= */

app.post("/api/analyze-photos", async (req, res) => {
  if (!requireOpenAI(res)) return;

  const { adImage, realImage } = req.body || {};

  if (!adImage || !realImage) {
    return res.status(400).json({
      error: "Ikkala rasm ham kerak",
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content:
            "Sen SafarAI turizm platformasining 'Reklama vs Haqiqat' AI modulisan. " +
            "Reklama surati bilan turistning real suratini solishtir. " +
            "Joy bir xilligini, jihozlar, tozalik, obodonlashtirish, yorug'lik va kamera burchagini hisobga ol. " +
            "Faqat JSON formatida javob ber: " +
            '{"realityMatchPercent": number, "matches": string[], "discrepancies": string[], "verdict": string}',
        },

        {
          role: "user",

          content: [
            {
              type: "text",
              text: "Reklama rasmi:",
            },

            {
              type: "image_url",
              image_url: {
                url: adImage,
              },
            },

            {
              type: "text",
              text: "Turistning real rasmi:",
            },

            {
              type: "image_url",
              image_url: {
                url: realImage,
              },
            },
          ],
        },
      ],

      temperature: 0.2,
      max_tokens: 500,
    });

    const raw =
      completion.choices[0]?.message?.content || "{}";

    const result = extractJson(raw);

    res.json(result);
  } catch (err) {
    console.error("analyze-photos failed:", err);

    res.status(502).json({
      error: "AI tahlili amalga oshmadi",
      detail: err.message,
    });
  }
});

/* =========================
   AI RECOMMENDATIONS
========================= */

app.post("/api/recommend", async (req, res) => {
  if (!requireOpenAI(res)) return;

  const { query, catalog, history } = req.body || {};

  if (!query || !query.trim()) {
    return res.status(400).json({
      error: "So'rov bo'sh",
    });
  }

  if (!Array.isArray(catalog) || catalog.length === 0) {
    return res.status(400).json({
      error: "Joylar katalogi yuborilmadi",
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",

          content:
            "Sen SafarAI - Qashqadaryo turizm platformasining sayohat tavsiyachi AI yordamchisisan. " +
            "Foydalanuvchi xohish-istagini tavsiflaydi. " +
            "Faqat KATALOGDA mavjud joylardan tanla. " +
            "Katalogda mavjud bo'lmagan joyni hech qachon o'ylab topma. " +
            "Eng mos 3-5 ta joyni tanla. " +
            "Trust Score yuqori bo'lgan joylarga ustunlik ber. " +
            "O'zbek tilida qisqa va do'stona javob ber. " +
            'JSON format: {"reply": string, "placeIds": string[]}. ' +
            `KATALOG: ${JSON.stringify(catalog)}`,
        },

        ...(Array.isArray(history)
          ? history.slice(-6)
          : []),

        {
          role: "user",
          content: query,
        },
      ],

      temperature: 0.4,
      max_tokens: 400,
    });

    const raw =
      completion.choices[0]?.message?.content || "{}";

    const result = extractJson(raw);

    const validIds = new Set(
      catalog.map((item) => item.id)
    );

    result.placeIds = (result.placeIds || []).filter(
      (id) => validIds.has(id)
    );

    res.json(result);
  } catch (err) {
    console.error("recommend failed:", err);

    res.status(502).json({
      error: "AI tavsiyasi amalga oshmadi",
      detail: err.message,
    });
  }
});

export default app;