// Obrazy: img1/img2 wejściowe, img3/img4 pomocnicze/wynikowe
let img1;
let img2;
let img3;
let img4;
let which;

// Input pliku 
const fileInput = document.getElementById("fileInput");
fileInput.onchange = loadImgFromFile;

const getEl = (id) => document.getElementById(id);

// Uruchamia operację na kopii img1 i zapisuje wynik do img3
function withImg1ToImg3(fn, value) {
  if (!img1) return;
  const temp = img1.get();
  if (value !== undefined) fn(value, temp);
  else fn(temp);
  img3 = temp;
}

// Uruchamia operację na img1 i img2 (funkcja zwraca nowy obraz) -> img3
function withImg1Img2ToImg3(fn) {
  if (!img1 || !img2) return;
  img3 = fn(img1, img2);
}

// Dla filtrów nieliniowych: fn zapisuje wynik do przekazanego obrazu wyjściowego
function withCopyResultToImg3(fn) {
  if (!img1) return;
  const copy = img1.get();
  const result = img1.get();
  fn(result, copy);
  img3 = result;
}

// Ustawia slot docelowy (1/2) i otwiera wybór pliku
function setWhichAndPick(n) {
  which = n;
  fileInput.click();
}

// Wczytywanie obrazów do img1 / img2
getEl("loadImg1Btn").onclick = () => setWhichAndPick(1);
getEl("loadImg2Btn").onclick = () => setWhichAndPick(2);

// Zamiany slotów obrazów
getEl("swapImg12Btn").onclick = () => ([img1, img2] = [img2, img1]);
getEl("swapImg13Btn").onclick = () => ([img1, img3] = [img3, img1]);
getEl("swapImg14Btn").onclick = () => ([img1, img4] = [img4, img1]);
getEl("swapImg34Btn").onclick = () => ([img3, img4] = [img4, img3]);

// Konwersja img1 do skali szarości
getEl("grayBtn").onclick = () => {
  if (!img1) return;
  img1.filter(GRAY);
};

// Operacje punktowe na img1 -> wynik w img3
getEl("clampingBtn").onclick = () => {
  const val = Number(getEl("clampingInput").value);
  withImg1ToImg3(clamping, val);
};

getEl("brightnessBtn").onclick = () => {
  const val = Number(getEl("brightnessInput").value);
  withImg1ToImg3(changeBrightness, val);
};

getEl("contrastBtn").onclick = () => {
  const val = Number(getEl("contrastInput").value);
  withImg1ToImg3(changeContrast, val);
};

getEl("gammaBtn").onclick = () => {
  const val = Number(getEl("gammaInput").value);
  withImg1ToImg3(gammaCorrection, val);
};

getEl("invertBtn").onclick = () => withImg1ToImg3(invertingImage);
getEl("thresholdBtn").onclick = () => withImg1ToImg3(thresholding);

// Konwersja img1 i img2 do szarości
getEl("gray2Btn").onclick = () => {
  if (img1) img1.filter(GRAY);
  if (img2) img2.filter(GRAY);
};

// Operacje na img1 i img2 -> wynik w img3
getEl("addBtn").onclick = () => withImg1Img2ToImg3(addImages);
getEl("subBtn").onclick = () => withImg1Img2ToImg3(substractImages);
getEl("diffModBtn").onclick = () => withImg1Img2ToImg3(differenceImages);
getEl("multBtn").onclick = () => withImg1Img2ToImg3(multiplyImages);
getEl("divBtn").onclick = () => withImg1Img2ToImg3(divideImages);
getEl("avgBtn").onclick = () => withImg1Img2ToImg3(averageImages);
getEl("minBtn").onclick = () => withImg1Img2ToImg3(minImages);
getEl("maxBtn").onclick = () => withImg1Img2ToImg3(maxImages);

// Odczyt maski filtra z textarea: tylko 3x3, 5x5, 7x7
function readFilter() {
  const text = getEl("filterArea").value.trim();
  if (!text) return null;

  const rows = text.split("\n");
  const filter = [];

  for (const row of rows) {
    const values = row.trim().split(/[\s,]+/).map(Number);
    if (values.some(isNaN)) {
      alert("Nieprawidłowe wartości w filtrze!");
      return null;
    }
    filter.push(values);
  }

  const size = filter.length;

  // Dozwolone tylko 3x3, 5x5, 7x7
  if (![3, 5, 7].includes(size)) {
    alert("Dozwolone rozmiary filtra: 3x3, 5x5, 7x7!");
    return null;
  }

  // Wymagany kwadrat NxN
  if (!filter.every((r) => r.length === size)) {
    alert("Filtr musi być kwadratowy!");
    return null;
  }

  return filter;
}


// Filtr liniowy -> img3
getEl("linFilterBtn").onclick = () => {
  if (!img1) return;
  const f = readFilter();
  if (!f) return;
  img3 = linear(img1, f);
};

// Filtry nieliniowe 3x3 -> img3 (piszą wynik do obrazu wyjściowego)
getEl("maxNonlinFilterBtn").onclick = () => withCopyResultToImg3(maxNonlinearFilter);
getEl("minNonlinFilterBtn").onclick = () => withCopyResultToImg3(minNonlinearFilter);
getEl("medianNonlinFilterBtn").onclick = () => withCopyResultToImg3(medianNonlinearFilter);

// Ważona mediana z maską z textarea -> img3
getEl("weightedNonlinMedianFilterBtn").onclick = () => {
  if (!img1) return;
  const f = readFilter();
  if (!f) return;

  const copy = img1.get();
  const result = img1.get();
  weightedNonlinearMedianFilter(result, copy, f);
  img3 = result;
};

// p5.js setup: dopasowany canvas 
function setup() {
  const container = getEl("canvas-container");
  const cnv = createCanvas(container.clientWidth, container.clientHeight);
  cnv.parent("canvas-container");
  background(69);
}

// Dopasowanie canvasa po zmianie rozmiaru okna
function windowResized() {
  const container = getEl("canvas-container");
  resizeCanvas(container.clientWidth, container.clientHeight);
}

// Ramka dzieląca widok na 4 ćwiartki
function drawFrames() {
  stroke(80);
  strokeWeight(2);
  noFill();

  const w = width / 2;
  const h = height / 2;

  line(w, 0, w, height);
  line(0, h, width, h);
  rect(0, 0, width, height);
}

// Render 4 obrazów: 1/2 u góry, 3/4 na dole
function draw() {
  background(240);

  const w = width / 2;
  const h = height / 2;

  if (img1) image(img1, 0, 0, w, h);
  if (img2) image(img2, w, 0, w, h);
  if (img3) image(img3, 0, h, w, h);
  if (img4) image(img4, w, h, w, h);

  drawFrames();
}

// Histogram (Chart.js)
let histChart = null;
let showHistogram = false;

window.addEventListener("resize", resizeHistogramCanvas);

// Przełączanie widoku: obrazy <-> histogram
getEl("toggleHistogramBtn").onclick = () => {
  const histCanvas = getEl("histCanvas");
  const btn = getEl("toggleHistogramBtn");

  showHistogram = !showHistogram;

  if (showHistogram) {
    histCanvas.style.display = "block";
    btn.innerText = "Pokaż obrazy";
    resizeHistogramCanvas();
    drawMultiHistogram(getSelectedImages());
  } else {
    histCanvas.style.display = "none";
    btn.innerText = "Pokaż histogram";
  }
};

// Dopasowanie canvasa histogramu
function resizeHistogramCanvas() {
  const histCanvas = getEl("histCanvas");
  const container = getEl("canvas-container");

  histCanvas.width = container.clientWidth;
  histCanvas.height = container.clientHeight;
}

// Liczy histogram dla obrazu
function computeHistogram(p5img) {
  if (!p5img) return null;

  const h = p5img.height;
  const w = p5img.width;
  const imageSize = w * h;

  const temp = p5img.get();
  temp.filter(GRAY);

  const histogram = new Array(256);
  for (let i = 0; i < 256; i++) histogram[i] = 0;

  temp.loadPixels();

  for (let i = 0; i < imageSize; i++) {
    const index = temp.pixels[4 * i];
    histogram[index]++;
  }

  return histogram;
}

resizeHistogramCanvas();

// Pojedynczy histogram 
function drawHistogramChart(hist) {
  if (!hist) return;

  const canvas = getEl("histCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const labels = Array.from({ length: 256 }, (_, i) => i);

  if (histChart) histChart.destroy();

  histChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Histogram (0–255)",
          data: hist,
        },
      ],
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        x: { ticks: { maxTicksLimit: 16 } },
        y: { beginAtZero: true },
      },
    },
  });
}

// Zbiera obrazy zaznaczone checkboxami do porównania histogramów
function getSelectedImages() {
  const images = [];

  if (getEl("histImg1").checked && img1) images.push({ img: img1, label: "Obraz 1" });
  if (getEl("histImg2").checked && img2) images.push({ img: img2, label: "Obraz 2" });
  if (getEl("histImg3").checked && img3) images.push({ img: img3, label: "Obraz 3" });
  if (getEl("histImg4").checked && img4) images.push({ img: img4, label: "Obraz 4" });

  return images;
}

// Wiele histogramów na jednym wykresie
function drawMultiHistogram(selected) {
  if (selected.length === 0) return;

  const canvas = getEl("histCanvas");
  const ctx = canvas.getContext("2d");
  const labels = Array.from({ length: 256 }, (_, i) => i);

  if (histChart) histChart.destroy();

  const colors = [
    "rgba(255,0,0,0.6)",
    "rgba(0,0,255,0.6)",
    "rgba(0,200,0,0.6)",
    "rgba(255,165,0,0.6)",
  ];

  const datasets = selected.map((item, idx) => ({
    label: item.label,
    data: computeHistogram(item.img),
    backgroundColor: colors[idx],
  }));

  histChart = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      animation: false,
      scales: {
        x: { stacked: false, ticks: { maxTicksLimit: 16 } },
        y: { beginAtZero: true },
      },
    },
  });
}

// Odświeżanie wykresu po zmianie zaznaczeń checkboxów
document.querySelectorAll("#histControls input").forEach((cb) => {
  cb.onchange = () => {
    if (!showHistogram) return;
    drawMultiHistogram(getSelectedImages());
  };
});

// Wczytuje obraz z pliku do img1 albo img2
function loadImgFromFile() {
  const file = fileInput.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);

  loadImage(url, (imgLoaded) => {
    if (which === 1) img1 = imgLoaded;
    else img2 = imgLoaded;
  });
}
