import { ConsultationData } from '../types';

export const generateTextFormat = (data: ConsultationData): string => {
  const formatField = (value: string | string[] | undefined) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return '확인 필요';
    return Array.isArray(value) ? value.join(', ') : value;
  };

  return `[인테리어 3D 렌더링 상담 신청]
접수일시: ${data.timestamp}

1. 프로젝트명: ${formatField(data.projectName)}
2. 연락처: ${formatField(data.contact)}
3. 공간 종류: ${formatField(data.spaceType)}
4. 선호 스타일: ${formatField(data.preferredStyle)}
5. 첨부파일(도면): ${formatField(data.fileNames)}
6. 중요 요청사항 및 상세설명:
${formatField(data.keyPoints)}
`;
};

export const generateTSVFormat = (data: ConsultationData): string => {
  const headers = ['접수일시', '프로젝트명', '연락처', '공간 종류', '선호 스타일', '첨부파일', '중요 요청사항'];
  
  const formatField = (value: string | string[] | undefined) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return '확인 필요';
    // TSV requires escaping tabs and newlines within cells if we want strict compatibility,
    // but for simple copy-pasting to Google Sheets, replacing newlines with spaces is safest.
    const strVal = Array.isArray(value) ? value.join(', ') : value;
    return strVal.replace(/\t/g, ' ').replace(/\n/g, ' ↵ ');
  };

  const values = [
    data.timestamp || '',
    formatField(data.projectName),
    formatField(data.contact),
    formatField(data.spaceType),
    formatField(data.preferredStyle),
    formatField(data.fileNames),
    formatField(data.keyPoints)
  ];

  return `${headers.join('\t')}\n${values.join('\t')}`;
};
