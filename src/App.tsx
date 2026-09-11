import { useState, useEffect } from 'react';
import { ConsultationForm } from './components/ConsultationForm';
import { ResultView } from './components/ResultView';
import { RenderingStudio } from './components/RenderingStudio';
import { ConsultationData } from './types';
import { Box, ChevronRight, LogOut, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initAuth, googleSignIn, logout } from './lib/auth';
import { User } from 'firebase/auth';

export default function App() {
  const [step, setStep] = useState<'form' | 'result' | 'studio'>('form');
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null);
  
  // Auth state
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setUser(user);
        setNeedsAuth(false);
        setIsAuthChecking(false);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
        setIsAuthChecking(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleSubmit = async (data: ConsultationData) => {
    setIsSubmitting(true);
    let finalData = { ...data };

    try {
      if (user) {
        // 1. Upload files to Firebase Storage if any exist
        if (data.files && data.files.length > 0) {
          const { uploadFiles } = await import('./lib/storage');
          const uploadedFiles = await uploadFiles(data.files, data.projectName, data.contact);
          
          finalData.fileUrls = uploadedFiles.map(f => f.url);
        }

        // 2. Save to Google Sheets
        let spreadsheetId = localStorage.getItem('consultation_spreadsheet_id');
        if (!spreadsheetId) {
          const { createSpreadsheet } = await import('./lib/sheets');
          spreadsheetId = await createSpreadsheet();
          localStorage.setItem('consultation_spreadsheet_id', spreadsheetId);
        }
        const { saveConsultationToSheets } = await import('./lib/sheets');
        await saveConsultationToSheets(spreadsheetId, finalData);
        console.log('Saved to Google Sheets:', spreadsheetId);
      }
    } catch (e) {
      console.error('Failed to process submission:', e);
      alert('데이터 저장 중 오류가 발생했습니다.\n만약 파일 업로드 중 문제가 발생했다면 Firebase Storage의 Security Rules 설정을 확인해주세요.');
    } finally {
      setIsSubmitting(false);
      setConsultationData(finalData);
      setStep('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
            <h1 className="text-lg font-bold tracking-tight">STUDIO 3D</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthChecking ? (
              <div className="w-24 h-8 bg-gray-100 animate-pulse rounded-md"></div>
            ) : needsAuth ? (
              <button 
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="gsi-material-button h-10 px-4 flex items-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 shadow-sm transition-colors"
              >
                {isLoggingIn ? (
                  <Loader2 size={18} className="animate-spin text-gray-400" />
                ) : (
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img src={user?.photoURL || ''} alt="" className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200" />
                  <span className="text-sm font-bold text-gray-700 hidden sm:block">{user?.displayName}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                  title="로그아웃"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
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
                <ConsultationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
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
