import "dotenv/config"; // ⭐️ 新增：一啟動程式就去讀取 .env 保險箱
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const markdownpdf = require("markdown-pdf");

const targetPdf = process.argv[2]; 
const customPrompt = process.argv[3];
const format = process.argv[4] ? process.argv[4].toLowerCase() : "text";

if (!targetPdf) {
    console.error("❌ 錯誤：請指定 PDF 檔案名稱！");
    process.exit(1);
}
const API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(API_KEY);
const fileManager = new GoogleAIFileManager(API_KEY);

let finalPrompt = customPrompt || "請分析這份 PDF 的核心重點。";

// 針對格式優化 Prompt
if (format === "excel" || format === "csv") {
    finalPrompt += "\n\n⚠️ 重要：請將分析結果以『純 CSV 格式』輸出（使用逗號分隔），包含標題列。不要包含任何多餘文字。";
} else if (format === "pdf") {
    finalPrompt += "\n\n請使用 Markdown 格式詳細撰寫分析報告，包含標題與列表，以便轉換為 PDF。";
}

async function analyzePDF() {
    try {
        console.log(`🚀 正在處理：[ ${targetPdf} ]`);
        const uploadResult = await fileManager.uploadFile(targetPdf, {
            mimeType: "application/pdf",
            displayName: "RF Data Sheet Analysis",
        });
        
        console.log(`🧠 Gemini 正在以 [${format.toUpperCase()}] 模式進行專家分析...`);
        const model = ai.getGenerativeModel({ model: "gemini-flash-latest" });

        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResult.file.mimeType,
                    fileUri: uploadResult.file.uri
                }
            },
            { text: finalPrompt }
        ]);

        let responseText = result.response.text();

        if (format === "excel" || format === "csv") {
            const fileName = "RF_Analysis_Report.csv";
            responseText = responseText.replace(/```csv/g, "").replace(/```/g, "").trim();
            fs.writeFileSync(fileName, "\ufeff" + responseText);
            console.log(`\n✅ CSV 報告已生成：${fileName}`);
        } else if (format === "pdf") {
            const fileName = "RF_Analysis_Report.pdf";
            markdownpdf().from.string(responseText).to(fileName, function () {
                console.log(`\n✅ PDF 報告已生成：${fileName}`);
            });
        } else {
            console.log("\n=== 🎯 分析結果 ===\n");
            console.log(responseText);
        }

    } catch (error) {
        console.error("\n❌ 執行失敗：", error.message);
    }
}

analyzePDF();