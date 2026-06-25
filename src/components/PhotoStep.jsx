import React, { useState, useRef } from 'react';

function PhotoStep({ onNext, onBack, data }) {
  const [foto, setFoto] = useState(data.foto || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const compressedDataUrl = await compressImage(file, 800, 0.7);
      setFoto(compressedDataUrl);
    } catch (error) {
      alert('Erro ao processar imagem: ' + error.message);
    }
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (foto) onNext({ foto });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Foto profissional</h2>
      <p className="text-gray-500 text-sm -mt-2">Adicione uma foto para seu perfil</p>
      
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-300">
          {foto ? (
            <img src={foto} alt="Foto" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl text-gray-400">📷</span>
          )}
        </div>
        
        <div className="mt-4 w-full max-w-xs space-y-2">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="w-full bg-gray-200 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          >
            {uploading ? 'Processando...' : 'Escolher foto do computador'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">ou</span>
            <input
              type="text"
              value={foto}
              onChange={(e) => setFoto(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="URL da imagem"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition"
          disabled={!foto || uploading}
        >
          Continuar
        </button>
      </div>
    </form>
  );
}

export default PhotoStep;