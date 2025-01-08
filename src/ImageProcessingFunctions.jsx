import React from 'react';

const usedFunctions = new Set();

export const resetUsedFunctions = () => {
    usedFunctions.clear();
};

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

        case 'grayscale':
            for (let i = 0; i < data.length; i += 4) {
                const rata = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = rata;
            }
            break;

        default:
            alert(`Fungsi ${fungsi} tidak dikenal.`);
            return;
    }

    ctx.putImageData(imgData, 0, 0);
};