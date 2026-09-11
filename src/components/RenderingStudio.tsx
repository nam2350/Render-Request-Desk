import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sliders, Image as ImageIcon, Wand2, Download, Maximize2, Share2, Loader2, Sparkles } from 'lucide-react';
import { ConsultationData, RenderingSettings } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  data: ConsultationData;
  onBack: () => void;
}

const STYLES = ['Photorealistic', 'Watercolor', 'Unreal Engine 5', 'Cinematic', 'Minimalist', 'Cozy Warm'];
const LIGHTING = ['Natural Daylight', 'Warm Evening', 'Studio Lighting', 'Moody Cinematic', 'Bright & Airy'];
const MODES = [
  { id: 'floorplan', label: '2D Floorplan to 3D' },
  { id: 'sketch', label: 'Sketch to 3D' },
  { id: 'empty_room', label: 'Empty Room Staging' }
];

export function RenderingStudio({ data, onBack }: Props) {
  const [settings, setSettings] = useState<RenderingSettings>({
    mode: 'floorplan',
    lighting: 'Natural Daylight',
    creativity: 50,
    prompt: data.keyPoints || '',
    negativePrompt: 'low resolution, ugly, messy, distorted',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);
    setResultImage(null);

    // Simulate AI generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            // Show a high quality placeholder as the result
            setResultImage('https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200&h=800');
          }, 500);
          return 100;
        }
        return prev + (Math.random() * 15);
      });
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
            <ArrowLeft size={16} />
          </div>
          접수서로 돌아가기
        </button>
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold border border-purple-200">
          <Sparkles size={16} />
          AI Rendering Studio
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Settings Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-200/60 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white">
                <Sliders size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">제어 패널</h3>
                <p className="text-sm text-gray-500 font-medium mt-0.5">렌더링 설정을 세밀하게 조정하세요</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Mode */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">작업 모드</label>
                <div className="grid grid-cols-1 gap-2">
                  {MODES.map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setSettings({...settings, mode: mode.id as any})}
                      className={`px-4 py-3 rounded-xl text-sm font-bold transition-all text-left border ${
                        settings.mode === mode.id 
                          ? 'bg-black text-white border-black' 
                          : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Styles */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">렌더링 스타일</label>
                <select 
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium"
                  value={settings.lighting}
                  onChange={e => setSettings({...settings, lighting: e.target.value})}
                >
                  {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Lighting */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">조명 환경</label>
                <select 
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium"
                  value={settings.lighting}
                  onChange={e => setSettings({...settings, lighting: e.target.value})}
                >
                  {LIGHTING.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              {/* Creativity / CFG Scale */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-gray-700">AI 창의성 (상상력)</label>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{settings.creativity}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={settings.creativity}
                  onChange={e => setSettings({...settings, creativity: Number(e.target.value)})}
                  className="w-full accent-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 font-medium">
                  <span>도면 엄격준수</span>
                  <span>자유로운 재해석</span>
                </div>
              </div>

              {/* Prompts */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">프롬프트 (강조사항)</label>
                <textarea 
                  rows={3}
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium resize-none"
                  value={settings.prompt}
                  onChange={e => setSettings({...settings, prompt: e.target.value})}
                />
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full mt-8 py-4 px-6 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                isGenerating 
                  ? 'bg-gray-800 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  AI 렌더링 중... {Math.min(100, Math.round(progress))}%
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  3D 렌더링 시작하기
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-8 flex flex-col h-[600px] lg:h-auto min-h-[600px]">
          <div className="bg-gray-100 rounded-[24px] border border-gray-200 flex-1 relative overflow-hidden group shadow-inner">
            <AnimatePresence mode="wait">
              {!isGenerating && !resultImage && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center"
                >
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-gray-300">
                    <ImageIcon size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-600 mb-2">프리뷰 영역</h3>
                  <p className="text-sm font-medium">좌측 패널에서 설정을 마치고<br/>'3D 렌더링 시작하기' 버튼을 눌러주세요.</p>
                  
                  {data.fileNames?.length > 0 && (
                    <div className="mt-8 bg-white/60 px-4 py-2 rounded-xl backdrop-blur-sm border border-white">
                      <p className="text-xs font-bold text-gray-500 mb-1">인식된 도면 소스</p>
                      <p className="text-sm text-gray-900 font-medium truncate max-w-xs">{data.fileNames[0]}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {isGenerating && (
                <motion.div 
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white z-10"
                >
                  <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-8">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur-xl opacity-30 animate-pulse rounded-full" />
                    <Wand2 size={48} className="text-purple-300 relative z-10 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold mt-8 mb-2">AI가 공간을 분석하고 있습니다</h3>
                  <p className="text-gray-400 font-medium text-sm">벽체 인식 및 재질 매핑 중... ({Math.min(100, Math.round(progress))}%)</p>
                </motion.div>
              )}

              {resultImage && !isGenerating && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img 
                    src={resultImage} 
                    alt="AI Generated 3D Render" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                    <div className="flex justify-end gap-2">
                      <button className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors">
                        <Share2 size={18} />
                      </button>
                      <button className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors">
                        <Maximize2 size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="inline-block px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-lg mb-2">
                          {settings.mode === 'floorplan' ? '2D Floorplan to 3D' : settings.mode}
                        </span>
                        <h4 className="text-white font-bold text-xl">{data.projectName || '무제 프로젝트'} - {settings.lighting}</h4>
                      </div>
                      <button className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                        <Download size={18} />
                        이미지 저장
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
