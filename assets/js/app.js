/* ============================================================
   QR Code Studio — Dr. Solution Tech
   app.js — all client-side, nothing leaves the browser
============================================================ */
(() => {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Brand icon presets (Simple Icons CDN — free, license-built
     for representing brand logos: https://simpleicons.org)
  --------------------------------------------------------- */
  const BRAND_ICON_URL = (slug, hex) => `https://cdn.simpleicons.org/${slug}/${hex}`;

  document.querySelectorAll(".logo-chip[data-color]").forEach((chip) => {
    const slug = chip.dataset.logo;
    const hex = chip.dataset.color;
    const img = chip.querySelector("img.logo-chip-icon");
    if (img) {
      img.src = BRAND_ICON_URL(slug, hex);
      img.alt = slug;
    }
  });

  /* ---------------------------------------------------------
     QR state + rendering (qr-code-styling)
  --------------------------------------------------------- */
  const state = {
    type: "link",
    data: "https://github.com/SoLuTiOnExE",
    logo: null, // image URL or data URL, or null
    dotsType: "classy",
    cornersType: "extra-rounded",
    fg: "#080B12",
    bg: "#ffffff",
  };

  function buildOptions(size) {
    return {
      width: size,
      height: size,
      type: "svg",
      data: state.data || " ",
      image: state.logo || undefined,
      margin: 8,
      qrOptions: { errorCorrectionLevel: state.logo ? "H" : "Q" },
      imageOptions: { crossOrigin: "anonymous", margin: 8, imageSize: 0.42, hideBackgroundDots: true },
      dotsOptions: { color: state.fg, type: state.dotsType },
      backgroundOptions: { color: state.bg },
      cornersSquareOptions: { type: state.cornersType, color: state.fg },
      cornersDotOptions: { type: state.cornersType === "square" ? "square" : "dot", color: state.fg },
    };
  }

  const qrCode = new QRCodeStyling(buildOptions(280));
  qrCode.append(document.getElementById("qrPreview"));

  // small decorative hero QR (static, not tied to user input)
  const heroQr = new QRCodeStyling({
    width: 220,
    height: 220,
    type: "svg",
    data: "https://github.com/SoLuTiOnExE",
    margin: 6,
    dotsOptions: { color: "#080B12", type: "classy-rounded" },
    backgroundOptions: { color: "#ffffff" },
    cornersSquareOptions: { type: "extra-rounded", color: "#FF6B2C" },
    cornersDotOptions: { type: "dot", color: "#FF6B2C" },
  });
  heroQr.append(document.getElementById("heroQr"));

  let updateTimer = null;
  function scheduleUpdate() {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(() => qrCode.update(buildOptions(280)), 120);
  }

  /* ----- data input ----- */
  const dataInput = document.getElementById("dataInput");
  const dataHint = document.getElementById("dataHint");
  const dataTypeToggle = document.getElementById("dataTypeToggle");

  function resolveData(raw) {
    const val = raw.trim();
    if (!val) return "";
    if (state.type === "link" && !/^[a-z][a-z0-9+.-]*:\/\//i.test(val) && !val.startsWith("mailto:") && !val.startsWith("tel:")) {
      return "https://" + val;
    }
    return val;
  }

  dataInput.addEventListener("input", () => {
    state.data = resolveData(dataInput.value);
    scheduleUpdate();
  });

  dataTypeToggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".pill");
    if (!btn) return;
    dataTypeToggle.querySelectorAll(".pill").forEach((p) => p.classList.remove("is-active"));
    btn.classList.add("is-active");
    state.type = btn.dataset.type;
    if (state.type === "link") {
      dataInput.placeholder = "https://yourwebsite.com or wa.me/2348120729938";
      dataHint.textContent = 'We\'ll add "https://" automatically if you leave it out.';
    } else {
      dataInput.placeholder = "Any text — a message, a Wi-Fi password, anything";
      dataHint.textContent = "Stored as plain text — no link formatting added.";
    }
    state.data = resolveData(dataInput.value);
    scheduleUpdate();
  });

  /* ----- logo presets + upload ----- */
  const logoGrid = document.getElementById("logoGrid");
  const logoUpload = document.getElementById("logoUpload");
  const uploadChip = document.getElementById("uploadChip");

  logoGrid.addEventListener("click", (e) => {
    const chip = e.target.closest(".logo-chip");
    if (!chip) return;

    if (chip.dataset.logo === "custom") {
      logoUpload.click();
      return; // activation happens once a file is actually chosen
    }

    logoGrid.querySelectorAll(".logo-chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");

    if (chip.dataset.logo === "none") {
      state.logo = null;
    } else {
      state.logo = BRAND_ICON_URL(chip.dataset.logo, chip.dataset.color);
    }
    scheduleUpdate();
  });

  logoUpload.addEventListener("change", () => {
    const file = logoUpload.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.logo = reader.result;
      logoGrid.querySelectorAll(".logo-chip").forEach((c) => c.classList.remove("is-active"));
      uploadChip.classList.add("is-active");
      // show a thumbnail on the upload chip itself
      let img = uploadChip.querySelector("img.logo-chip-icon");
      if (!img) {
        img = document.createElement("img");
        img.className = "logo-chip-icon";
        uploadChip.querySelector(".upload-icon")?.replaceWith(img);
      }
      img.src = state.logo;
      scheduleUpdate();
    };
    reader.readAsDataURL(file);
  });

  /* ----- style controls ----- */
  const dotStyle = document.getElementById("dotStyle");
  const cornerStyle = document.getElementById("cornerStyle");
  const fgColor = document.getElementById("fgColor");
  const bgColor = document.getElementById("bgColor");
  const orangeAccent = document.getElementById("orangeAccent");

  dotStyle.value = state.dotsType;
  cornerStyle.value = state.cornersType;
  fgColor.value = state.fg;
  bgColor.value = state.bg;

  dotStyle.addEventListener("change", () => { state.dotsType = dotStyle.value; scheduleUpdate(); });
  cornerStyle.addEventListener("change", () => { state.cornersType = cornerStyle.value; scheduleUpdate(); });
  fgColor.addEventListener("input", () => { state.fg = fgColor.value; scheduleUpdate(); });
  bgColor.addEventListener("input", () => { state.bg = bgColor.value; scheduleUpdate(); });
  orangeAccent.addEventListener("click", () => {
    state.fg = "#FF6B2C";
    fgColor.value = state.fg;
    scheduleUpdate();
  });

  /* ----- downloads ----- */
  document.getElementById("downloadPng").addEventListener("click", () => {
    qrCode.download({ name: "qr-code-dr-solution-tech", extension: "png" });
  });
  document.getElementById("downloadSvg").addEventListener("click", () => {
    qrCode.download({ name: "qr-code-dr-solution-tech", extension: "svg" });
  });

  /* ---------------------------------------------------------
     Mode switching (Generate / Scan)
  --------------------------------------------------------- */
  const tabGenerate = document.getElementById("tabGenerate");
  const tabScan = document.getElementById("tabScan");
  const panelGenerate = document.getElementById("panelGenerate");
  const panelScan = document.getElementById("panelScan");

  function setMode(mode) {
    const toGenerate = mode === "generate";
    tabGenerate.classList.toggle("is-active", toGenerate);
    tabScan.classList.toggle("is-active", !toGenerate);
    tabGenerate.setAttribute("aria-selected", String(toGenerate));
    tabScan.setAttribute("aria-selected", String(!toGenerate));
    panelGenerate.classList.toggle("is-active", toGenerate);
    panelScan.classList.toggle("is-active", !toGenerate);
    if (toGenerate) stopCamera(); // leaving scan mode stops the camera
  }
  tabGenerate.addEventListener("click", () => setMode("generate"));
  tabScan.addEventListener("click", () => setMode("scan"));

  /* ---------------------------------------------------------
     Scan & Read
  --------------------------------------------------------- */
  const dropzone = document.getElementById("dropzone");
  const scanFileInput = document.getElementById("scanFileInput");
  const resultEmpty = document.getElementById("resultEmpty");
  const resultBody = document.getElementById("resultBody");
  const resultText = document.getElementById("resultText");
  const resultOpen = document.getElementById("resultOpen");
  const resultCopy = document.getElementById("resultCopy");
  const resultClear = document.getElementById("resultClear");
  const cameraToggle = document.getElementById("cameraToggle");
  const cameraReader = document.getElementById("cameraReader");

  function showResult(text) {
    resultEmpty.hidden = true;
    resultBody.hidden = false;
    resultText.textContent = text;
    const isUrl = /^https?:\/\//i.test(text.trim());
    resultOpen.hidden = !isUrl;
    if (isUrl) resultOpen.href = text.trim();
  }

  function showError(msg) {
    resultEmpty.hidden = false;
    resultBody.hidden = true;
    resultEmpty.textContent = msg;
  }

  resultClear.addEventListener("click", () => {
    resultBody.hidden = true;
    resultEmpty.hidden = false;
    resultEmpty.textContent = "Nothing scanned yet — upload an image or use your camera.";
    scanFileInput.value = "";
  });

  resultCopy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(resultText.textContent);
      const original = resultCopy.textContent;
      resultCopy.textContent = "Copied!";
      setTimeout(() => (resultCopy.textContent = original), 1400);
    } catch {
      /* clipboard may be unavailable (e.g. http, not https) — fail silently */
    }
  });

  dropzone.addEventListener("click", () => scanFileInput.click());
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("is-drag"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("is-drag"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("is-drag");
    if (e.dataTransfer.files[0]) decodeFile(e.dataTransfer.files[0]);
  });
  scanFileInput.addEventListener("change", () => {
    if (scanFileInput.files[0]) decodeFile(scanFileInput.files[0]);
  });

  function decodeFile(file) {
    if (cameraRunning) stopCamera();
    getFileScanner()
      .scanFile(file, false)
      .then((decodedText) => showResult(decodedText))
      .catch(() => showError("Couldn't find a QR code in that image — try a clearer photo or crop closer to the code."));
  }

  let fileScanQr = null;
  function getFileScanner() {
    if (!fileScanQr) fileScanQr = new Html5Qrcode("fileScanReader");
    return fileScanQr;
  }

  /* ----- live camera scan ----- */
  let html5QrCode = null;
  let cameraRunning = false;

  async function startCamera() {
    cameraReader.id = "cameraReader"; // keep id stable
    html5QrCode = new Html5Qrcode("cameraReader");
    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          showResult(decodedText);
          stopCamera();
        },
        () => {} // ignore per-frame "not found" noise
      );
      cameraRunning = true;
      cameraToggle.textContent = "Stop camera";
    } catch (err) {
      showError("Couldn't access the camera. Check your browser's camera permission and try again.");
      cameraRunning = false;
    }
  }

  function stopCamera() {
    if (html5QrCode && cameraRunning) {
      html5QrCode.stop().then(() => html5QrCode.clear()).catch(() => {});
    }
    cameraRunning = false;
    cameraToggle.innerHTML =
      '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9 3 7.17 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9Zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg> Scan with camera';
  }

  cameraToggle.addEventListener("click", () => {
    if (cameraRunning) stopCamera();
    else startCamera();
  });
})();
