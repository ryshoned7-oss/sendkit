import { Command } from "commander";
import { sendTelegramMessage } from "sendkit-core";

type TelegramResponse = {
  ok: boolean;
  result?: {
    message_id?: number;
  };
  description?: string;
};

const program = new Command();

program
.name("sendkit")
.description("SendKit tutorial CLI")
.command("telegram")
.description("Send a Telegram message")
.argument("<chatId>", "Telegram chat ID")
.argument("<message>", "Message text to send")
.action(async (chatId: string, message: string) =>{

 const token = process.env.TELEGRAM_BOT_TOKEN;

 if(!token) {
  console.error("TELEGRAM_BOT_TOKEN is not set");
  process.exitCode = 1;
 }

 if(!chatId) {
  console.error("Missing Telegram chat ID");
  process.exitCode = 1;
 }

 if(!message) {
  console.error("Missing Telegram message text");
  process.exitCode = 1;
 }

 const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: "POST",
  headers: {
   "Content-Type": "application/json"
  },
  body: JSON.stringify({
   chat_id: chatId,
   text: message
  })
 }
);

const data = (await response.json()) as TelegramResponse;

if(!response.ok || !data.ok) {
  const detail = data.description ?? response.statusText;
  console.error(`Telegram API error: ${detail}`);
  process.exitCode = 1;
}

const messageID = data.result?.message_id;

console.log(` Sent Telegram successfully with chat: ${chatId}`);

if(messageID !== undefined) {
  console.log(`Telegram Message ID: ${messageID}`);
}
});

program.parseAsync(process.argv);

// https://api.telegram.org/bot9101551349:AAGcH0Nn8p6pR4R-zGwPuIJTxoFvgENLjWg/getUpdates