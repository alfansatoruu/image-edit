const usedFunctions = new Set();

export const prosesGambar = (fungsi, kanvasRef) => {
    
    if (usedFunctions.has(fungsi)) {
        alert(`Warning: ${fungsi} Filter sudah pernah digunakan sekali!`);
        return;
    }

    
    usedFunctions.add(fungsi);

    const kanvas = kanvasRef.current;
    const ctx = kanvas.getContext('2d', { willReadFrequently: true });
    const imgData = ctx.getImageData(0, 0, kanvas.width, kanvas.height);
    const data = imgData.data;

    switch (fungsi) {
        case 'negatif':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            break;

        case 'threshold':
            const nilai = 128;
            for (let i = 0; i < data.length; i += 4) {
                const rata = (data[i] + data[i + 1] + data[i + 2]) / 3;
                const nilai_baru = rata > nilai ? 255 : 0;
                data[i] = data[i + 1] = data[i + 2] = nilai_baru;
            }
            break;

        case 'kecerahan':
            const faktor = 30;
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] + faktor);
                data[i + 1] = Math.min(255, data[i + 1] + faktor);
                data[i + 2] = Math.min(255, data[i + 2] + faktor);
            }
            break;

        case 'logarithmik':
            const c = 255 / Math.log(256);
            for (let i = 0; i < data.length; i += 4) {
                data[i] = c * Math.log(1 + data[i]);
                data[i + 1] = c * Math.log(1 + data[i + 1]);
                data[i + 2] = c * Math.log(1 + data[i + 2]);
            }
            break;

        case 'meanFilter':
            const tempData = new Uint8ClampedArray(data);
            const width = kanvas.width;
            for (let y = 1; y < kanvas.height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        let sum = 0;
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const idx = ((y + dy) * width + (x + dx)) * 4 + c;
                                sum += tempData[idx];
                            }
                        }
                        data[(y * width + x) * 4 + c] = sum / 9;
                    }
                }
            }
            break;

        case 'medianFilter':
            const tempDataMedian = new Uint8ClampedArray(data);
            const widthMedian = kanvas.width;
            const heightMedian = kanvas.height;

            for (let y = 1; y < heightMedian - 1; y++) {
                for (let x = 1; x < widthMedian - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        const values = [];

                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const idx = ((y + dy) * widthMedian + (x + dx)) * 4 + c;
                                values.push(tempDataMedian[idx]);
                            }
                        }

                        values.sort((a, b) => a - b);
                        const medianValue = values[Math.floor(values.length / 2)];

                        const currentIdx = (y * widthMedian + x) * 4 + c;
                        data[currentIdx] = medianValue;
                    }
                }
            }
            break;

        case 'gaussianFilter':
            const kernelGaussian = [
                1 / 16, 2 / 16, 1 / 16,
                2 / 16, 4 / 16, 2 / 16,
                1 / 16, 2 / 16, 1 / 16
            ];
            const tempDataGaussian = new Uint8ClampedArray(data);
            const widthGaussian = kanvas.width;

            for (let y = 1; y < kanvas.height - 1; y++) {
                for (let x = 1; x < widthGaussian - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        let sum = 0;

                        for (let ky = 0; ky < 3; ky++) {
                            for (let kx = 0; kx < 3; kx++) {
                                const idx = ((y + ky - 1) * widthGaussian + (x + kx - 1)) * 4 + c;
                                sum += tempDataGaussian[idx] * kernelGaussian[ky * 3 + kx];
                            }
                        }
                        data[(y * widthGaussian + x) * 4 + c] = sum;
                    }
                }
            }
            break;

        case 'erosi':
            const tempDataErosi = new Uint8ClampedArray(data);
            const widthErosi = kanvas.width;

            for (let y = 1; y < kanvas.height - 1; y++) {
                for (let x = 1; x < widthErosi - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        let min = 255;

                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const idx = ((y + dy) * widthErosi + (x + dx)) * 4 + c;
                                min = Math.min(min, tempDataErosi[idx]);
                            }
                        }
                        data[(y * widthErosi + x) * 4 + c] = min;
                    }
                }
            }
            break;

        case 'dilasi':
            const tempDataDilasi = new Uint8ClampedArray(data);
            const widthDilasi = kanvas.width;

            for (let y = 1; y < kanvas.height - 1; y++) {
                for (let x = 1; x < widthDilasi - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        let max = 0;

                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const idx = ((y + dy) * widthDilasi + (x + dx)) * 4 + c;
                                max = Math.max(max, tempDataDilasi[idx]);
                            }
                        }
                        data[(y * widthDilasi + x) * 4 + c] = max;
                    }
                }
            }
            break;

        case 'opening':
            const tempDataOpening = new Uint8ClampedArray(data);
            const widthOpening = kanvas.width;
            const tempResult = new Uint8ClampedArray(data.length);

            for (let y = 1; y < kanvas.height - 1; y++) {
                for (let x = 1; x < widthOpening - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        let min = 255;
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const idx = ((y + dy) * widthOpening + (x + dx)) * 4 + c;
                                min = Math.min(min, tempDataOpening[idx]);
                            }
                        }
                        tempResult[(y * widthOpening + x) * 4 + c] = min;
                    }
                }
            }

            const tempDataOpeningStep2 = new Uint8ClampedArray(tempResult);
            for (let y = 1; y < kanvas.height - 1; y++) {
                for (let x = 1; x < widthOpening - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        let max = 0;
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const idx = ((y + dy) * widthOpening + (x + dx)) * 4 + c;
                                max = Math.max(max, tempDataOpeningStep2[idx]);
                            }
                        }
                        data[(y * widthOpening + x) * 4 + c] = max;
                    }
                }
            }
            break;

        case 'closing':
            const tempDataClosing = new Uint8ClampedArray(data);
            const widthClosing = kanvas.width;
            const tempResultClosing = new Uint8ClampedArray(data.length);

            for (let y = 1; y < kanvas.height - 1; y++) {
                for (let x = 1; x < widthClosing - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        let max = 0;
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const idx = ((y + dy) * widthClosing + (x + dx)) * 4 + c;
                                max = Math.max(max, tempDataClosing[idx]);
                            }
                        }
                        tempResultClosing[(y * widthClosing + x) * 4 + c] = max;
                    }
                }
            }

            const tempDataClosingStep2 = new Uint8ClampedArray(tempResultClosing);
            for (let y = 1; y < kanvas.height - 1; y++) {
                for (let x = 1; x < widthClosing - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        let min = 255;
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const idx = ((y + dy) * widthClosing + (x + dx)) * 4 + c;
                                min = Math.min(min, tempDataClosingStep2[idx]);
                            }
                        }
                        data[(y * widthClosing + x) * 4 + c] = min;
                    }
                }
            }
            break;

        case 'sharpening':
            const kernel = [
                0, -1, 0,
                -1, 5, -1,
                0, -1, 0
            ];
            const tempData2 = new Uint8ClampedArray(data);
            const width2 = kanvas.width;
            for (let y = 1; y < kanvas.height - 1; y++) {
                for (let x = 1; x < width2 - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        let sum = 0;
                        for (let ky = 0; ky < 3; ky++) {
                            for (let kx = 0; kx < 3; kx++) {
                                const idx = ((y + ky - 1) * width2 + (x + kx - 1)) * 4 + c;
                                sum += tempData2[idx] * kernel[ky * 3 + kx];
                            }
                        }
                        data[(y * width2 + x) * 4 + c] = Math.min(255, Math.max(0, sum));
                    }
                }
            }
            break;

        case 'grayscale':
            for (let i = 0; i < data.length; i += 4) {
                const rata = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = rata;
            }
            break;

        case 'hsv':
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i] / 255;
                const g = data[i + 1] / 255;
                const b = data[i + 2] / 255;
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const delta = max - min;

                let h, s, v;
                v = max;
                s = max === 0 ? 0 : delta / max;

                if (delta === 0) {
                    h = 0;
                } else if (max === r) {
                    h = ((g - b) / delta) % 6;
                } else if (max === g) {
                    h = (b - r) / delta + 2;
                } else {
                    h = (r - g) / delta + 4;
                }

                h = Math.round(h * 60);
                if (h < 0) h += 360;

                data[i] = h;
                data[i + 1] = s * 255;
                data[i + 2] = v * 255;
            }
            break;

        case 'sobel':
        case 'laplacian':
            const tempDataLaplacian = new Uint8ClampedArray(data);
            const widthLaplacian = kanvas.width;

            const kernelLaplacian = [
                0, 1, 0,
                1, -4, 1,
                0, 1, 0
            ];

            for (let y = 1; y < kanvas.height - 1; y++) {
                for (let x = 1; x < widthLaplacian - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        let sum = 0;
                        for (let ky = 0; ky < 3; ky++) {
                            for (let kx = 0; kx < 3; kx++) {
                                const idx = ((y + ky - 1) * widthLaplacian + (x + kx - 1)) * 4 + c;
                                sum += tempDataLaplacian[idx] * kernelLaplacian[ky * 3 + kx];
                            }
                        }
                        sum = Math.abs(sum);
                        sum = Math.min(255, Math.max(0, sum));
                        data[(y * widthLaplacian + x) * 4 + c] = sum;
                    }
                    data[(y * widthLaplacian + x) * 4 + 3] = tempDataLaplacian[(y * widthLaplacian + x) * 4 + 3];
                }
            }
            break;
    }

    ctx.putImageData(imgData, 0, 0);
};