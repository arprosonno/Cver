document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("instructionsPage").style.display = "none";
  document.getElementById("formPage").style.display = "block";
});

document.getElementById("cvForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const photo = await toDataURL(form.get("photo"));
  const signature = await toDataURL(form.get("signature"));

  const list = s => s?.split(',').map(i => `<li>${i.trim()}</li>`).join('') || "";

  const section = (title, content) => {
    if (!content) return "";
    const hr = (title !== "Awards" && title !== "References") ? "<hr />" : "";
    return `<h2>${title}</h2><ul>${list(content)}</ul>${hr}`;
  };

  const html = `
    <div class="cv-page" id="cvContent">
      <div class="left">
        <h1>${form.get("name")}</h1>
        <p><strong>${form.get("designation")}</strong></p>
        <p>${form.get("phone")} | ${form.get("email")}</p>
        <p>${form.get("address")}</p>
        <hr />
        ${section("Education", form.get("education"))}
        ${section("Skills", form.get("skills"))}
        ${section("Experience", form.get("experience"))}
        ${section("Projects", form.get("projects"))}
        ${section("Languages", form.get("language"))}
        ${section("Affiliations", form.get("affiliations"))}
        ${section("References", form.get("references"))}
      </div>
      <div class="right">
        <img class="photo" src="${photo}" />
        ${section("Personal Info", form.get("personal"))}
        ${section("Hobbies", form.get("hobby"))}
        ${section("Awards", form.get("awards"))}
      </div>
      <div class="signature-block">
        <img class="signature" src="${signature}" /><br />
        <p>${form.get("name")}</p>
        <p>Date: ${form.get("date")}</p>
      </div>
    </div>
  `;

  const output = document.getElementById("output");
  output.innerHTML = html;
  output.style.display = "block";

  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.style.display = "block";
  downloadBtn.style.margin = "20px auto";
  downloadBtn.style.textAlign = "center";
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const element = document.getElementById("cvContent");
  html2pdf().set({
    margin: 0,
    filename: "cv.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0
    },
    jsPDF: {
      unit: "px",
      format: [794, 1122],
      orientation: "portrait"
    }
  }).from(element).save();
});

function toDataURL(file) {
  return new Promise(res => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.readAsDataURL(file);
  });
}
