import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('QM77078.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('QM77078_text.txt', data.text);
    console.log('✅ PDF 文字提取成功！已存至 QM77078_text.txt');
}).catch(err => {
    console.error('❌ 提取失敗：', err);
});
