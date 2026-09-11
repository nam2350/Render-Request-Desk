import { getAccessToken } from './auth';
import { ConsultationData } from '../types';

// Create a new spreadsheet and return its ID
export const createSpreadsheet = async (): Promise<string> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: 'AI 3D 렌더링 상담 신청 내역',
      },
      sheets: [
        {
          properties: {
            title: '상담 내역',
            gridProperties: {
              frozenRowCount: 1
            }
          }
        }
      ]
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to create spreadsheet');
  }

  const data = await res.json();
  const spreadsheetId = data.spreadsheetId;

  // Append headers
  await appendData(spreadsheetId, [
    ['접수일시', '프로젝트명', '연락처', '공간 종류', '선호 스타일', '첨부파일', '중요 요청사항']
  ]);

  return spreadsheetId;
};

// Append data to the spreadsheet
export const appendData = async (spreadsheetId: string, values: any[][]) => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to append data');
  }
};

export const saveConsultationToSheets = async (spreadsheetId: string, data: ConsultationData) => {
  const formatField = (value: string | string[] | undefined) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return '확인 필요';
    return Array.isArray(value) ? value.join(', ') : value;
  };

  let filesText = '확인 필요';
  if (data.fileNames && data.fileNames.length > 0) {
    if (data.fileUrls && data.fileUrls.length > 0) {
      filesText = data.fileNames.map((name, i) => `${name}\n(${data.fileUrls![i]})`).join('\n\n');
    } else {
      filesText = data.fileNames.join(', ');
    }
  }

  const values = [[
    data.timestamp || new Date().toLocaleString('ko-KR'),
    formatField(data.projectName),
    formatField(data.contact),
    formatField(data.spaceType),
    formatField(data.preferredStyle),
    filesText,
    formatField(data.keyPoints)
  ]];

  await appendData(spreadsheetId, values);
};
