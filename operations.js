// ============================================================================
// Operacje punktowe na pojedynczym obrazie w skali szarości.
// Funkcje modyfikują obraz "img" w miejscu (bez tworzenia nowego obrazu).
// ============================================================================


// Mnoży jasność piksela przez współczynnik i przycina wynik do zakresu 0..255
function clamping(value, img) {
  img.loadPixels();

  imgSize = img.width * img.height;

  for (let i = 0; i < imgSize; i++) {
    let a = Math.round(img.pixels[4 * i] * value);

    if (a < 0) a = 0;
    else if (a > 255) a = 255;

    img.pixels[4 * i] = a;
    img.pixels[4 * i + 1] = a;
    img.pixels[4 * i + 2] = a;
  }

  img.updatePixels();
}


// Dodaje stałą wartość do piksela (rozjaśnienie/ściemnienie) i przycina do 0..255
function changeBrightness(value, img) {
  img.loadPixels();

  imgSize = img.width * img.height;

  for (let i = 0; i < imgSize; i++) {
    let a = Math.round(img.pixels[4 * i] + value);

    if (a < 0) a = 0;
    else if (a > 255) a = 255;

    img.pixels[4 * i] = a;
    img.pixels[4 * i + 1] = a;
    img.pixels[4 * i + 2] = a;
  }

  img.updatePixels();
}


// Zmienia kontrast wg wzoru: value*(x-128)+128 i przycina do 0..255
function changeContrast(value, img) {
  img.loadPixels();

  imgSize = img.width * img.height;

  for (let i = 0; i < imgSize; i++) {
    let a = Math.round(value * (img.pixels[4 * i] - 128) + 128);

    if (a < 0) a = 0;
    else if (a > 255) a = 255;

    img.pixels[4 * i] = a;
    img.pixels[4 * i + 1] = a;
    img.pixels[4 * i + 2] = a;
  }

  img.updatePixels();
}


// Odwraca jasność piksela (negatyw): 255 - x
function invertingImage(img) {
  img.loadPixels();

  imgSize = img.width * img.height;

  for (let i = 0; i < imgSize; i++) {
    let a = 255 - img.pixels[4 * i];

    img.pixels[4 * i] = a;
    img.pixels[4 * i + 1] = a;
    img.pixels[4 * i + 2] = a;
  }

  img.updatePixels();
}


// Progowanie (threshold): >=128 -> 255, <128 -> 0
function thresholding(img) {
  img.loadPixels();

  imgSize = img.width * img.height;

  for (let i = 0; i < imgSize; i++) {
    let a = img.pixels[4 * i];

    if (a >= 128) a = 255;
    else if (a < 128) a = 0;

    img.pixels[4 * i] = a;
    img.pixels[4 * i + 1] = a;
    img.pixels[4 * i + 2] = a;
  }

  img.updatePixels();
}


// Korekcja gamma: (x/255)^value * 255 i przycięcie do 0..255
function gammaCorrection(value, img) {
  img.loadPixels();

  imgSize = img.width * img.height;

  for (let i = 0; i < imgSize; i++) {
    let a = Math.pow(img.pixels[4 * i] / 255, value) * 255;

    if (a < 0) a = 0;
    else if (a > 255) a = 255;

    img.pixels[4 * i] = a;
    img.pixels[4 * i + 1] = a;
    img.pixels[4 * i + 2] = a;
  }

  img.updatePixels();
}



// ============================================================================
// Operacje punktowe na dwóch obrazach.
// Funkcje tworzą NOWY obraz (createImage) i zwracają wynik.
// ============================================================================


// Dodaje dwa obrazy z maksymalną wartością do 255
function addImages(img, img2) {
  img.loadPixels();
  img2.loadPixels();

  let addedImages = createImage(img.width, img.height);
  addedImages.loadPixels();

  let imgSize = img.width * img.height;

  for (let i = 0; i < imgSize; i++) {
    let a = img.pixels[4 * i];
    let b = img2.pixels[4 * i];

    let sum = a + b;

    if (sum > 255) sum = 255;
    else if (sum < 0) sum = 0;

    addedImages.pixels[4 * i] = sum;
    addedImages.pixels[4 * i + 1] = sum;
    addedImages.pixels[4 * i + 2] = sum;

    addedImages.pixels[4 * i + 3] = 255;
  }

  addedImages.updatePixels();

  return addedImages;
}


// Uśrednia dwa obrazy: (a+b)/2
function averageImages(img, img2) {
  img.loadPixels();
  img2.loadPixels();

  let averagedImages = createImage(img.width, img.height);
  averagedImages.loadPixels();

  let imgSize = img.width * img.height;

  for (let i = 0; i < imgSize; i++) {
    let a = img.pixels[4 * i];
    let b = img2.pixels[4 * i];

    let avg = Math.round((a + b) / 2);

    averagedImages.pixels[4 * i] = avg;
    averagedImages.pixels[4 * i + 1] = avg;
    averagedImages.pixels[4 * i + 2] = avg;
    averagedImages.pixels[4 * i + 3] = 255;
  }

  averagedImages.updatePixels();

  return averagedImages;
}


// Liczy różnicę bezwzględną dwóch obrazów: |a-b|
function differenceImages(img, img2) {
  img.loadPixels();
  img2.loadPixels();

  let diffedImages = createImage(img.width, img.height);
  diffedImages.loadPixels();

  let imgSize = img.width * img.height;

  for (let i = 0; i < imgSize; i++) {
    let a = img.pixels[4 * i];
    let b = img2.pixels[4 * i];

    let diff = Math.abs(a - b);

    diffedImages.pixels[4 * i] = diff;
    diffedImages.pixels[4 * i + 1] = diff;
    diffedImages.pixels[4 * i + 2] = diff;
    diffedImages.pixels[4 * i + 3] = 255;
  }

  diffedImages.updatePixels();

  return diffedImages;
}


// Dzieli dwa obrazy: a/b z zabezpieczeniem przed b==0
function divideImages(img, img2) {
  img.loadPixels();
  img2.loadPixels();

  let divedImages = createImage(img.width, img.height);
  divedImages.loadPixels();

  let imgSize = img.width * img.height;

  for (let i = 0; i < imgSize; i++) {
    let a = img.pixels[4 * i];
    let b = img2.pixels[4 * i];

    let div;
    if (b == 0) div = Math.round(a / (b + 1));
    else div = Math.round(a / b);

    if (div < 0) div = 0;
    else if (div > 255) div = 255;

    divedImages.pixels[4 * i] = div;
    divedImages.pixels[4 * i + 1] = div;
    divedImages.pixels[4 * i + 2] = div;
    divedImages.pixels[4 * i + 3] = 255;
  }

  divedImages.updatePixels();

  return divedImages;
}


// Wybiera maksimum z dwóch obrazów: max(a,b)
function maxImages(img, img2) {
  img.loadPixels();
  img2.loadPixels();

  let maxedImages = createImage(img.width, img.height);
  maxedImages.loadPixels();

  let imgSize = img.width * img.height;

  for (let i = 0; i < imgSize; i++) {
    let a = img.pixels[4 * i];
    let b = img2.pixels[4 * i];

    let max = Math.max(a, b);

    maxedImages.pixels[4 * i] = max;
    maxedImages.pixels[4 * i + 1] = max;
    maxedImages.pixels[4 * i + 2] = max;
    maxedImages.pixels[4 * i + 3] = 255;
  }

  maxedImages.updatePixels();

  return maxedImages;
}


// Wybiera minimum z dwóch obrazów: min(a,b)
function minImages(img, img2) {
  img.loadPixels();
  img2.loadPixels();

  let minedImages = createImage(img.width, img.height);
  minedImages.loadPixels();

  let imgSize = img.width * img.height;

  for (let i = 0; i < imgSize; i++) {
    let a = img.pixels[4 * i];
    let b = img2.pixels[4 * i];

    let min = Math.min(a, b);

    minedImages.pixels[4 * i] = min;
    minedImages.pixels[4 * i + 1] = min;
    minedImages.pixels[4 * i + 2] = min;
    minedImages.pixels[4 * i + 3] = 255;
  }

  minedImages.updatePixels();

  return minedImages;
}


// Mnoży dwa obrazy: a*b z maksymalną wartością do 255
function multiplyImages(img, img2) {
  img.loadPixels();
  img2.loadPixels();

  let multiedImages = createImage(img.width, img.height);
  multiedImages.loadPixels();

  let imgSize = img.width * img.height;

  for (let i = 0; i < imgSize; i++) {
    let a = img.pixels[4 * i];
    let b = img2.pixels[4 * i];

    let mul = a * b;

    if (mul > 255) mul = 255;
    else if (mul < 0) mul = 0;

    multiedImages.pixels[4 * i] = mul;
    multiedImages.pixels[4 * i + 1] = mul;
    multiedImages.pixels[4 * i + 2] = mul;
    multiedImages.pixels[4 * i + 3] = 255;
  }

  multiedImages.updatePixels();

  return multiedImages;
}


// Odejmuje dwa obrazy: a-b z przycięciem do 0..255
function substractImages(img, img2) {
  img.loadPixels();
  img2.loadPixels();

  let subedImages = createImage(img.width, img.height);
  subedImages.loadPixels();

  let imgSize = img.width * img.height;

  for (let i = 0; i < imgSize; i++) {
    let a = img.pixels[4 * i];
    let b = img2.pixels[4 * i];

    let sub = a - b;

    if (sub < 0) sub = 0;
    else if (sub > 255) sub = 255;

    subedImages.pixels[4 * i] = sub;
    subedImages.pixels[4 * i + 1] = sub;
    subedImages.pixels[4 * i + 2] = sub;
    subedImages.pixels[4 * i + 3] = 255;
  }

  subedImages.updatePixels();

  return subedImages;
}



// ============================================================================
// Filtr liniowy
// Filtry nieliniowe
// ============================================================================


// Filtr liniowy 3x3 lub 5x5 lub 7x7 z maską 
function linear(img, filter) {
  let w = img.width;
  let h = img.height;

  // Rozmiar maski i przesunięcie od środka (np. 3->1, 5->2, 7->3)
  let size = filter.length;
  let offset = Math.floor(size / 2);

  // Robimy kopię i wymuszamy GRAY, żeby operować na jednym kanale (R)
  let copyImg = img.get();
  copyImg.filter(GRAY);
  copyImg.loadPixels();

  // Obraz wyjściowy na wynik splotu
  let copyImg2 = createImage(w, h);
  copyImg2.loadPixels();

  // Pomijamy brzegi o szerokości "offset" (żeby okno NxN mieściło się w obrazie)
  for (let v = offset; v <= h - 1 - offset; v++) {
    for (let u = offset; u <= w - 1 - offset; u++) {
      let a = 0;

      // Okno NxN: (i,j) to przesunięcie względem środka (u,v)
      for (let j = -offset; j <= offset; j++) {
        for (let i = -offset; i <= offset; i++) {
          // Indeks w tablicy pixels (RGBA), stąd mnożenie przez 4
          let index = 4 * ((u + i) + (v + j) * w);

          // b = wartość sąsiada (kanał R w GRAY), c = waga z maski
          let b = copyImg.pixels[index];
          let c = filter[j + offset][i + offset];

          a += c * b;
        }
      }

      // Zaokrąglenie + przycięcie (0..255)
      let d = Math.round(a);
      if (d < 0) d = 0;
      else if (d > 255) d = 255;

      // Zapis wyniku jako grayscale do obrazu wyjściowego
      let index2 = 4 * (u + v * w);
      copyImg2.pixels[index2] = d;
      copyImg2.pixels[index2 + 1] = d;
      copyImg2.pixels[index2 + 2] = d;
      copyImg2.pixels[index2 + 3] = 255;
    }
  }

  copyImg2.updatePixels();

  return copyImg2;
}



// Filtr maksimum 3x3 (nieliniowy)
// - w oknie 3x3 wybiera największą wartość
function maxNonlinearFilter(maxImg, copyImg) {
  let w = maxImg.width;
  let h = maxImg.height;

  // maxImg: obraz wyjściowy (nadpisywany), copyImg: obraz źródłowy (np. kopia GRAY)
  maxImg.loadPixels();
  copyImg.loadPixels();

  // Pomijamy brzegi: brak pełnego okna 3x3 na krawędziach
  for (let v = 1; v <= h - 2; v++) {
    for (let u = 1; u <= w - 2; u++) {
      // Start od 0, bo szukamy maksimum
      let a = 0;

      // Przeglądamy okno 3x3 i aktualizujemy maksimum
      for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
          let index = 4 * ((u + i) + (v + j) * w);
          let b = copyImg.pixels[index];

          if (b > a) a = b;
        }
      }

      // Zapis maksimum do piksela (u,v) w obrazie wyjściowym
      let index2 = 4 * (u + v * w);
      maxImg.pixels[index2] = a;
      maxImg.pixels[index2 + 1] = a;
      maxImg.pixels[index2 + 2] = a;
      maxImg.pixels[index2 + 3] = 255;
    }
  }

  maxImg.updatePixels();
}


// Filtr minimum 3x3 (nieliniowy)
// - w oknie 3x3 wybiera najmniejszą wartość
function minNonlinearFilter(minImg, copyImg) {
  let w = minImg.width;
  let h = minImg.height;

  minImg.loadPixels();
  copyImg.loadPixels();

  for (let v = 1; v <= h - 2; v++) {
    for (let u = 1; u <= w - 2; u++) {
      // Start od 255, bo szukamy minimum
      let a = 255;

      for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
          let index = 4 * ((u + i) + (v + j) * w);
          let b = copyImg.pixels[index];

          if (b < a) a = b;
        }
      }

      let index2 = 4 * (u + v * w);
      minImg.pixels[index2] = a;
      minImg.pixels[index2 + 1] = a;
      minImg.pixels[index2 + 2] = a;
      minImg.pixels[index2 + 3] = 255;
    }
  }

  minImg.updatePixels();
}


// Filtr medianowy 3x3 (nieliniowy)
// - zbiera 9 wartości z okna 3x3, sortuje i wybiera środkową (medianę)
function medianNonlinearFilter(medianImg, copyImg) {
  let w = medianImg.width;
  let h = medianImg.height;

  medianImg.loadPixels();
  copyImg.loadPixels();

  for (let v = 1; v <= h - 2; v++) {
    for (let u = 1; u <= w - 2; u++) {
      // 9 próbek z sąsiedztwa 3x3
      let medianArray = new Array(9);
      let k = 0;

      for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
          let index = 4 * ((u + i) + (v + j) * w);
          let a = copyImg.pixels[index];

          medianArray[k] = a;
          k++;
        }
      }

      // Mediana = element środkowy po sortowaniu
      medianArray.sort((a, b) => a - b);
      let c = medianArray[4];

      let index2 = 4 * (u + v * w);
      medianImg.pixels[index2] = c;
      medianImg.pixels[index2 + 1] = c;
      medianImg.pixels[index2 + 2] = c;
      medianImg.pixels[index2 + 3] = 255;
    }
  }

  medianImg.updatePixels();
}


// Filtr ważonej mediany
// - maska mówi, ile razy powielić daną próbkę w zbiorze mediany (większa waga = większy wpływ)
function weightedNonlinearMedianFilter(weightedMedianImg, copyImg, mask) {
  let w = weightedMedianImg.width;
  let h = weightedMedianImg.height;

  // Domyślna maska
  if (!mask)
    mask = [
      [1, 2, 1],
      [2, 3, 2],
      [1, 2, 1],
    ];

  // Rozmiar maski i przesunięcie (dla 3x3 offset=1)
  const size = mask.length;
  const offset = Math.floor(size / 2);

  weightedMedianImg.loadPixels();
  copyImg.loadPixels();

  // Suma wag = liczba elementów w tablicy próbek
  let total = mask.flat().reduce((a, b) => a + b, 0);

  // Zakres pętli zależy od offsetu (żeby nie wyjść poza obraz)
  for (let v = offset; v <= h - 1 - offset; v++) {
    for (let u = offset; u <= w - 1 - offset; u++) {
      // Tablica próbek, w której wartości są powielone wg wag z maski
      let arr = new Array(total);
      let k = 0;

      for (let j = 0; j < size; j++) {
        for (let i = 0; i < size; i++) {
          // Przesuwamy okno o offset, żeby (u,v) było środkiem
          let index = 4 * ((u + i - offset) + (v + j - offset) * w);

          let a = copyImg.pixels[index];
          let b = mask[j][i];

          // Powielenie próbki "a" b razy
          for (let t = 0; t < b; t++) {
            arr[k] = a;
            k++;
          }
        }
      }

      // Mediana z próbek ważonych
      arr.sort((a, b) => a - b);
      let c = arr[Math.floor(arr.length / 2)];

      let index2 = 4 * (u + v * w);
      weightedMedianImg.pixels[index2] = c;
      weightedMedianImg.pixels[index2 + 1] = c;
      weightedMedianImg.pixels[index2 + 2] = c;
      weightedMedianImg.pixels[index2 + 3] = 255;
    }
  }

  weightedMedianImg.updatePixels();
}