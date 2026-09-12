import React, { useState, useRef } from 'react';
import { Upload, FileText, X, ArrowRight, Building2, User, FileUp, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { ConsultationData } from '../types';

interface Props {
  onSubmit: (data: ConsultationData) => void;
  isSubmitting?: boolean;
}

const SPACE_TYPES = ['주거공간 (아파트, 빌라, 단독주택)', '상업공간 (카페, 식당, 매장)', '오피스/업무공간', '숙박/병원/기타'];
const STYLES = ['모던 (Modern)', '미니멀 (Minimalist)', '클래식 (Classic)', '내추럴 (Natural)', '인더스트리얼 (Industrial)', '기타/미정'];

const Section = ({ title, icon: Icon, children, description }: { title: string, icon: any, children: React.ReactNode, description?: string }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    </div>
    {description && <p className="text-sm text-gray-500 mb-6 ml-11">{description}</p>}
    <div className="ml-11">
      {children}
    </div>
  </div>
);

export function ConsultationForm({ onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState<Partial<ConsultationData>>({
    fileNames: [],
    files: [],
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newFileNames = files.map(f => f.name);
    setFormData(prev => ({
      ...prev,
      fileNames: [...(prev.fileNames || []), ...newFileNames],
      files: [...(prev.files || []), ...files]
    }));
  };

  const removeFile = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      fileNames: prev.fileNames?.filter((_, index) => index !== indexToRemove),
      files: prev.files?.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectName: formData.projectName || '',
      contact: formData.contact || '',
      spaceType: formData.spaceType || '',
      preferredStyle: formData.preferredStyle || '',
      keyPoints: formData.keyPoints || '',
      fileNames: formData.fileNames || [],
      files: formData.files || [],
      timestamp: new Date().toLocaleString('ko-KR'),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[24px] shadow-sm border border-gray-200/60 p-6 md:p-12 relative overflow-hidden">
      
      <Section title="프로젝트 기본 정보" icon={Building2} description="어떤 공간을 준비하고 계신가요?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">프로젝트명</label>
            <input 
              type="text" 
              placeholder="예) 성수동 복합문화공간 인테리어"
              className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm font-medium placeholder:text-gray-400 placeholder:font-normal"
              value={formData.projectName || ''}
              onChange={e => setFormData({...formData, projectName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">연락처 <span className="text-gray-400 font-normal">(이메일/연락처)</span></label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="결과를 안내받으실 연락처"
                className="w-full pl-12 pr-5 py-4 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm font-medium placeholder:text-gray-400 placeholder:font-normal"
                value={formData.contact || ''}
                onChange={e => setFormData({...formData, contact: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">공간 종류</label>
            <select 
              className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm font-medium appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
              value={formData.spaceType || ''}
              onChange={e => setFormData({...formData, spaceType: e.target.value})}
            >
              <option value="" disabled className="text-gray-400">공간을 선택해주세요</option>
              {SPACE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">선호 스타일</label>
            <select 
              className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm font-medium appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
              value={formData.preferredStyle || ''}
              onChange={e => setFormData({...formData, preferredStyle: e.target.value})}
            >
              <option value="" disabled className="text-gray-400">스타일을 선택해주세요</option>
              {STYLES.map(style => <option key={style} value={style}>{style}</option>)}
            </select>
          </div>
        </div>
      </Section>

      <Section title="도면 첨부" icon={FileUp} description="설계 도면(DWG) 또는 2D 도면(PDF)을 업로드해주세요.">
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4
            ${isDragging ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-900 hover:bg-gray-50/50'}
          `}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
            <Upload size={24} />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900 mb-1">클릭하거나 파일을 이곳에 드롭하세요</p>
            <p className="text-sm text-gray-500 font-medium">지원 형식: DWG, PDF, JPG (최대 50MB)</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            multiple 
            accept=".dwg,.pdf,application/pdf,application/acad,.jpg,.jpeg,.png" 
            className="hidden" 
          />
        </div>

        {/* File List */}
        {(formData.fileNames?.length ?? 0) > 0 && (
          <div className="space-y-2 mt-4">
            {formData.fileNames?.map((name, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm group">
                <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <FileText size={18} className="text-gray-500" />
                  </div>
                  <span className="truncate max-w-[200px] sm:max-w-sm">{name}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeFile(idx)}
                  className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="상세 요청사항" icon={Sparkles} description="시각화가 필요한 주요 디테일, 마감재, 조명 계획 등을 자세히 적어주세요.">
        <textarea 
          rows={5}
          placeholder="예)&#13;&#10;- 메인 라운지 아트월은 거친 질감의 콘크리트 마감으로 표현&#13;&#10;- 천장 라인조명과 팬던트 조명의 따뜻한 색온도 강조&#13;&#10;- 클라이언트 미팅을 위해 뷰 방향은 입구에서 바라보는 컷 필수"
          className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200/50 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm font-medium resize-none placeholder:text-gray-400 placeholder:font-normal leading-relaxed"
          value={formData.keyPoints || ''}
          onChange={e => setFormData({...formData, keyPoints: e.target.value})}
        />
        <div className="flex items-center gap-2 mt-3 text-sm font-medium text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <AlertCircle size={16} className="text-gray-400" />
          <span>없는 정보는 상담 시 <strong className="text-amber-500 font-bold">확인 필요</strong> 항목으로 표시되어 빠짐없이 체크할 수 있습니다.</span>
        </div>
      </Section>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`group w-full md:w-auto text-white font-bold py-4 px-10 rounded-xl transition-all text-base flex items-center justify-center gap-2 shadow-lg shadow-gray-200 ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              처리 중...
            </>
          ) : (
            <>
              상담 결과 생성하기
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
