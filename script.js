document.getElementById('pdfUpload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const url = URL.createObjectURL(file);
  document.getElementById('pdfViewer').src = url;
});

function addQA() {
  const now = new Date().toLocaleString();
  const container = document.getElementById('qaContainer');

  const block = document.createElement('div');
  block.className = 'qa-block';
  block.innerHTML = `
    <label>Người hỏi: <input type="text" class="asker" /></label><br><br>
    <strong>Thời gian:</strong> <span class="time">${now}</span><br><br>
    <label>Câu hỏi:<br>
      <textarea class="question" rows="1" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"></textarea>
    </label><br><br>
    <label>Trả lời:<br>
      <textarea class="answer" rows="1" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"></textarea>
    </label><br><br>
    <label>Chèn ảnh: <input type="file" accept="image/*" class="imgInput" /></label><br>
    <img class="preview" />
  `;
  container.appendChild(block);

  const imgInput = block.querySelector('.imgInput');
  const preview = block.querySelector('.preview');
  imgInput.addEventListener('change', function () {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function exportToWord() {
  const blocks = document.querySelectorAll('.qa-block');
  let html = "<h2>Danh sách câu hỏi & trả lời</h2>";

  blocks.forEach((block) => {
    const asker = block.querySelector('.asker')?.value || '';
    const time = block.querySelector('.time')?.innerText || '';
    const question = block.querySelector('.question')?.value || '';
    const answer = block.querySelector('.answer')?.value || '';
    const img = block.querySelector('.preview');

    html += `
      <div>
        <p><strong>Người hỏi:</strong> ${asker}</p>
        <p><strong>Thời gian:</strong> ${time}</p>
        <p><strong>Câu hỏi:</strong><br>${question.replace(/\n/g, "<br>")}</p>
        <p><strong>Trả lời:</strong><br>${answer.replace(/\n/g, "<br>")}</p>
    `;

    if (img && img.src && img.src.startsWith('data:image')) {
      html += `<p><img src="${img.src}" style="max-width:200px;" /></p>`;
    }

    html += `</div><hr>`;
  });

  const content = `<!DOCTYPE html><html><head><meta charset='utf-8'></head><body>${html}</body></html>`;
  const blob = window.htmlDocx.asBlob(content);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'QA.docx';
  link.click();
}

async function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont("Helvetica", "");
  doc.setFontSize(12);

  let y = 10;
  const blocks = document.querySelectorAll('.qa-block');
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const asker = block.querySelector('.asker')?.value || '';
    const time = block.querySelector('.time')?.innerText || '';
    const question = block.querySelector('.question')?.value || '';
    const answer = block.querySelector('.answer')?.value || '';
    const img = block.querySelector('.preview');

    y = writeMultilineText(doc, `Người hỏi: ${asker}`, 10, y);
    y = writeMultilineText(doc, `Thời gian: ${time}`, 10, y);
    y = writeMultilineText(doc, `Câu hỏi: ${question}`, 10, y);
    y = writeMultilineText(doc, `Trả lời: ${answer}`, 10, y);

    if (img && img.src && img.src.startsWith('data:image')) {
      const imgProps = doc.getImageProperties(img);
      const ratio = imgProps.width / imgProps.height;
      const imgWidth = 60;
      const imgHeight = imgWidth / ratio;

      if (y + imgHeight > 280) {
        doc.addPage();
        y = 10;
      }

      doc.addImage(img.src, 'JPEG', 10, y, imgWidth, imgHeight);
      y += imgHeight + 10;
    } else {
      y += 10;
    }

    if (y > 270 && i < blocks.length - 1) {
      doc.addPage();
      y = 10;
    }
  }

  doc.save('QA.pdf');
}

function writeMultilineText(doc, text, x, y, maxWidth = 180, lineHeight = 7) {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach(line => {
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

function saveToJSON() {
  const data = [];
  const blocks = document.querySelectorAll('.qa-block');
  blocks.forEach(block => {
    data.push({
      asker: block.querySelector('.asker')?.value || '',
      time: block.querySelector('.time')?.innerText || '',
      question: block.querySelector('.question')?.value || '',
      answer: block.querySelector('.answer')?.value || ''
    });
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "QA.json";
  link.click();
}
