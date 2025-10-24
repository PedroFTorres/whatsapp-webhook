import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// guarda mensagens recentes
let mensagens = [];

// endpoint que a UltraMsg chama
app.post("/webhook", (req, res) => {
  const data = req.body;
  // cada webhook da UltraMsg traz: data.data.body, data.data.from, data.data.timestamp, etc.
  if (data?.data?.body) {
    const msg = {
      from: data.data.from,
      body: data.data.body,
      timestamp: data.data.timestamp || Date.now()
    };
    mensagens.push(msg);
    if (mensagens.length > 100) mensagens = mensagens.slice(-100); // mantém últimas 100
    fs.writeFileSync("mensagens.json", JSON.stringify(mensagens, null, 2));
    console.log("📩 Nova mensagem:", msg);
  }
  res.sendStatus(200);
});

// endpoint que seu painel usa para ler as mensagens
app.get("/mensagens", (req, res) => {
  res.json(mensagens);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor Webhook ativo na porta " + PORT));
