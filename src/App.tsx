import { useState } from 'react';
import { ConsultationForm } from './components/ConsultationForm';
import { ResultView } from './components/ResultView';
import { RenderingStudio } from './components/RenderingStudio';
import { ConsultationData } from './types';
import { Box, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveConsultation } from './lib/firebase';

export default function App() {
  const [step, setStep] = useState<'form' | 'result' | 'studio'>('form');
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ConsultationData) => {
    setIsSubmitting(true);
    let finalData = { ...data };

    try {
      await saveConsultation(finalData);
    } catch (e) {
      console.error('Failed to process submission:', e);
      alert('데이터 저장 중 오류가 발생했습니다.');
      setIsSubmitting(false);
      return; // prevent proceeding if saving failed
    } finally {
      setIsSubmitting(false);
    }
    
    setConsultationData(finalData);
    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setStep('form');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-gray-200">
      {/* Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white">
              <Box size={18} strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-bold tracking-tight">Render Request Desk</h1>
          </div>
        </div>
      </header>

      <main className={`mx-auto px-6 py-12 md:py-20 transition-all duration-500 ${step === 'studio' ? 'max-w-7xl' : 'max-w-5xl'}`}>
        {/* Premium Hero Section */}
        {step !== 'studio' && (
          <div className="mb-12 md:mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-600 mb-6 tracking-wide">
                <span>투시도 의뢰</span>
                <ChevronRight size={12} className="text-gray-400" />
                <span>간편 상담 신청</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 leading-[1.2]">
                도면을 가장 완벽한<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">3D 공간으로 시각화합니다.</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed max-w-2xl font-medium">
                DWG 또는 PDF 도면을 업로드하고 프로젝트의 핵심 디테일을 알려주세요.<br className="hidden md:block" />
                정확한 정보를 바탕으로 빠르고 완성도 높은 렌더링 작업 상담을 진행해 드립니다.
              </p>
            </motion.div>
          </div>
        )}

        <div className="relative">
          <AnimatePresence mode="wait">
            {step === 'form' && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ConsultationForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting} 
                />
              </motion.div>
            )}
            {step === 'result' && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {consultationData && (
                  <ResultView 
                    data={consultationData} 
                    onReset={handleReset} 
                    onGoToStudio={() => {
                      setStep('studio');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}
              </motion.div>
            )}
            {step === 'studio' && (
              <motion.div 
                key="studio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {consultationData && (
                  <RenderingStudio 
                    data={consultationData} 
                    onBack={() => {
                      setStep('result');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Box size={20} className="text-gray-300" />
            <span className="text-sm font-bold text-gray-300 tracking-wider">STUDIO 3D</span>
          </div>
          <p className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} STUDIO 3D. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
