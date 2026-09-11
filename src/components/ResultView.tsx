import React, { useState } from 'react';
import { Copy, Table, Check, ArrowLeft, AlertCircle, FileCheck2, Calendar, Wand2 } from 'lucide-react';
import { ConsultationData } from '../types';
import { generateTextFormat, generateTSVFormat } from '../utils/formatters';
import { motion } from 'motion/react';

interface Props {
  data: ConsultationData;
  onReset: () => void;
  onGoToStudio: () => void;
}

const DisplayField = ({ label, value, isFullWidth = false }: { label: string; value?: string | string[], isFullWidth?: boolean }) => {
  const isEmpty = !value || (Array.isArray(value) && value.length === 0);
  
  return (
    <div className={`flex flex-col gap-1.5 ${isFullWidth ? 'col-span-full' : ''}`}>
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className={`text-base font-medium leading-relaxed ${isEmpty ? 'text-amber-600 flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md w-fit' : 'text-gray-900 whitespace-pre-wrap'}`}>
        {isEmpty && <AlertCircle size={16} strokeWidth={2.5} />}
        {isEmpty ? '확인 필요' : (Array.isArray(value) ? value.join(', ') : value)}
      </span>
    </div>
  );
};

export function ResultView({ data, onReset, onGoToStudio }: Props) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedSheet, setCopiedSheet] = useState(false);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateTextFormat(data));
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      alert('복사에 실패했습니다.');
    }
  };

  const handleCopySheet = async () => {
    try {
      await navigator.clipboard.writeText(generateTSVFormat(data));
      setCopiedSheet(true);
      setTimeout(() => setCopiedSheet(false), 2000);
    } catch (err) {
      alert('복사에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button 
        onClick={onReset}
        className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
          <ArrowLeft size={16} />
        </div>
        이전으로 돌아가기
      </button>

      <div className="bg-white rounded-[24px] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        
        {/* Ticket Header */}
        <div className="bg-gray-900 px-8 py-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <FileCheck2 size={120} />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-4">
              <Check size={14} className="text-green-400" />
              <span>작성 완료</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">상담 접수서</h2>
            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
              <Calendar size={14} />
              {data.timestamp}
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <DisplayField label="Project Name" value={data.projectName} />
            <DisplayField label="Contact" value={data.contact} />
            <DisplayField label="Space Type" value={data.spaceType} />
            <DisplayField label="Style" value={data.preferredStyle} />
            <div className="col-span-full h-px bg-gray-100 my-2"></div>
            <DisplayField label="Attached Files" value={data.fileNames} isFullWidth />
            <DisplayField label="Key Requirements" value={data.keyPoints} isFullWidth />
          </div>
        </div>
        
        {/* Ticket Footer (Actions) */}
        <div className="bg-gray-50 border-t border-gray-100 p-6 md:px-10 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-3 max-w-sm">
              <div className="mt-1 shrink-0 text-blue-500">
                <AlertCircle size={20} />
              </div>
              <p className="text-sm font-medium text-gray-600 leading-relaxed">
                <strong className="text-gray-900 block mb-1">구글 시트 연동 안내</strong>
                '구글 시트용 복사' 버튼을 누른 후, 시트의 첫 번째 셀을 선택하고 붙여넣기(Ctrl+V) 하시면 자동으로 열이 맞춰집니다.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGoToStudio}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-colors bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/20 border border-purple-500/50"
              >
                <Wand2 size={18} />
                AI 3D 렌더링 스튜디오 이동
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyText}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-colors border ${
                  copiedText ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 shadow-sm'
                }`}
              >
                {copiedText ? <Check size={18} /> : <Copy size={18} className="text-gray-400" />}
                {copiedText ? '복사 완료' : '텍스트 복사'}
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopySheet}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-colors border ${
                  copiedSheet ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 shadow-sm'
                }`}
              >
                {copiedSheet ? <Check size={18} /> : <Table size={18} className="text-blue-500" />}
                {copiedSheet ? '복사 완료' : '구글 시트용 복사'}
              </motion.button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
