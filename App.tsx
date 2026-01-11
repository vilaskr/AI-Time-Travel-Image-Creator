
import React, { useState, useCallback, useRef } from 'react';
import { Era, EraStyle, TransformationResult } from './types';
import { ERAS } from './constants';
import { transformImage } from './services/geminiService';
import { fileToBase64, downloadImage } from './utils/imageUtils';
import { LoadingOverlay } from './components/LoadingOverlay';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<EraStyle>(ERAS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<TransformationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setSourceImage(base64);
        setTransformedImage(null);
        setError(null);
      } catch (err) {
        setError("Failed to load image. Please try another one.");
      }
    }
  };

  const handleTransform = async () => {
    if (!sourceImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await transformImage(sourceImage, selectedEra);
      setTransformedImage(result);
      setHistory(prev => [
        { era: selectedEra.id, imageUrl: result, timestamp: Date.now() },
        ...prev.slice(0, 9) // Keep last 10
      ]);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during transformation.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSourceImage(null);
    setTransformedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {isProcessing && <LoadingOverlay />}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <i className="fa-solid fa-bolt-lightning text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-retro text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              TIME MACHINE
            </h1>
          </div>
          {sourceImage && (
            <button 
              onClick={reset}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <i className="fa-solid fa-arrow-rotate-left"></i>
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-8">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-shake">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {!sourceImage ? (
          /* Landing / Upload State */
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-slate-800 p-10 rounded-full">
                <i className="fa-solid fa-camera-retro text-6xl text-blue-500"></i>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Ready to travel back?</h2>
              <p className="text-slate-400 max-w-sm">Upload a portrait and see yourself through the lens of iconic decades.</p>
            </div>
            <label className="cursor-pointer group">
              <div className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/30 transition-all flex items-center gap-3 transform active:scale-95">
                <i className="fa-solid fa-upload"></i>
                Choose Photo
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label>
            <div className="flex gap-4 pt-8">
                {ERAS.slice(1).map((era) => (
                    <div key={era.id} className="flex flex-col items-center gap-1 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${era.color} flex items-center justify-center`}>
                            <i className={`${era.icon} text-white`}></i>
                        </div>
                        <span className="text-[10px] font-bold uppercase">{era.id.split(' ')[0]}</span>
                    </div>
                ))}
            </div>
          </div>
        ) : (
          /* Editing State */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Split View */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Original</p>
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-800 ring-1 ring-slate-700">
                  <img src={sourceImage} className="w-full h-full object-cover" alt="Source" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transformed</p>
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-800 ring-4 ring-blue-500/20 group">
                  {transformedImage ? (
                    <>
                      <img src={transformedImage} className="w-full h-full object-cover animate-in zoom-in-95 duration-500" alt="Result" />
                      <div className="absolute top-4 right-4 flex gap-2">
                         <button 
                          onClick={() => downloadImage(transformedImage, `time-machine-${selectedEra.id}.png`)}
                          className="bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all"
                        >
                          <i className="fa-solid fa-download"></i>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-800/50">
                      <i className="fa-solid fa-image text-4xl mb-2 opacity-20"></i>
                      <p className="text-sm">Select an era and travel</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Era Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Pick Your Era</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-gradient-to-r ${selectedEra.color} text-white`}>
                  {selectedEra.year} Selected
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {ERAS.map((era) => (
                  <button
                    key={era.id}
                    onClick={() => setSelectedEra(era)}
                    className={`p-4 rounded-2xl transition-all border-2 text-left space-y-2 ${
                      selectedEra.id === era.id 
                        ? `bg-slate-800 border-blue-500 shadow-lg shadow-blue-500/10 scale-105 z-10` 
                        : 'bg-slate-800/40 border-transparent hover:bg-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${era.color} flex items-center justify-center shadow-lg`}>
                      <i className={`${era.icon} text-white`}></i>
                    </div>
                    <div>
                      <p className="font-bold text-xs leading-tight">{era.id}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="sticky bottom-6 left-0 right-0 z-10 flex justify-center">
              <button 
                onClick={handleTransform}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl shadow-blue-600/40 flex items-center gap-4 group transform transition-all active:scale-95"
              >
                <i className="fa-solid fa-shuttle-space group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                {transformedImage ? "Re-Travel Era" : "Start Time Warp"}
              </button>
            </div>
          </div>
        )}

        {/* History / Gallery */}
        {history.length > 0 && (
          <div className="pt-10 border-t border-slate-800">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Your Time Trips</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {history.map((item, idx) => (
                <div key={item.timestamp + idx} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-800 ring-1 ring-white/10">
                  <img src={item.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="History" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                    <p className="text-[10px] font-bold text-white truncate">{item.era}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 text-center pb-10">
        <p className="text-slate-500 text-sm">Powered by Gemini AI Vision & Real-time Synthesis : made by Vilas K R</p>
        <div className="flex justify-center gap-4 mt-4 text-slate-600">
            <i className="fa-solid fa-camera"></i>
            <i className="fa-solid fa-microchip"></i>
            <i className="fa-solid fa-clock"></i>
        </div>
      </footer>
    </div>
  );
};

export default App;
