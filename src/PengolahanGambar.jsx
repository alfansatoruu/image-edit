import './App.css'
import React, { useState, useRef } from 'react';
import { prosesGambar } from './ImageProcessingFunctions';

const PengolahanGambar = () => {
  const [setGambarUrl] = useState(null);
  const [gambarAsli, setGambarAsli] = useState(null);
  const kanvasRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const kanvas = kanvasRef.current;
          kanvas.width = img.width;
          kanvas.height = img.height;
          const ctx = kanvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0);
          setGambarAsli(img);
        };
        img.src = e.target.result;
        setGambarUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const canvas = kanvasRef.current;
    const timestamp = new Date().getTime();
    const link = document.createElement('a');
    link.download = `edited_image_${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="kontainer-utama">
      <div className="area-gambar">
        <canvas ref={kanvasRef} className="kanvas-gambar"></canvas>
        <input type="file" onChange={handleFileUpload} accept="image/*" className="file-input" />
      </div>

      <div className="panel-kontrol">
        <div className="bagian">
          <h3>List of Processing</h3>
          <div className="grid-buttons">
            <button onClick={() => prosesGambar('negatif', kanvasRef)}>Image Negative</button>
            <button onClick={() => prosesGambar('threshold', kanvasRef)}>Image Threshold</button>
            <button onClick={() => prosesGambar('kecerahan', kanvasRef)}>Image Brightness</button>
            <button onClick={() => prosesGambar('logarithmik', kanvasRef)}>Image Logarithmic</button>
            <button onClick={() => prosesGambar('meanFilter', kanvasRef)}>Mean Filter</button>
            <button onClick={() => prosesGambar('medianFilter', kanvasRef)}>Median Filter</button>
            <button onClick={() => prosesGambar('gaussianFilter', kanvasRef)}>Gaussian Filter</button>
            <button onClick={() => prosesGambar('erosi', kanvasRef)}>Erosi</button>
            <button onClick={() => prosesGambar('dilasi', kanvasRef)}>Dilasi</button>
            <button onClick={() => prosesGambar('opening', kanvasRef)}>Opening</button>
            <button onClick={() => prosesGambar('closing', kanvasRef)}>Closing</button>
            <button onClick={() => prosesGambar('sharpening', kanvasRef)}>Sharpening</button>
            <button onClick={() => prosesGambar('grayscale', kanvasRef)}>RGB to Grayscale</button>
            <button onClick={() => prosesGambar('hsv', kanvasRef)}>RGB to HSV</button>
          </div>
        </div>

        <div className="bagian">
          <h3>Edge Detection</h3>
          <div className="grid-buttons">
            <button onClick={() => prosesGambar('sobel', kanvasRef)}>Sobel</button>
            <button onClick={() => prosesGambar('laplacian', kanvasRef)}>Laplacian</button>
          </div>
        </div>

        <div className='kumpulan-tombol'>
          <button
            className="tombol-batal"
            onClick={() => {
              if (gambarAsli) {
                const ctx = kanvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, kanvasRef.current.width, kanvasRef.current.height);
                ctx.drawImage(gambarAsli, 0, 0);
              }
            }}
          >
            CANCEL
          </button>
          <button
            onClick={handleDownload}
            className="tombol-download"
          >
            Save and Download Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengolahanGambar;