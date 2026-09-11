import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './auth';

export const storage = getStorage(app);

export const uploadFiles = async (files: File[], projectName: string, contact: string): Promise<{name: string, url: string}[]> => {
  const uploadedFiles = [];
  const timestamp = Date.now();
  
  for (const file of files) {
    // 폴더 구조: 상담접수/연락처_프로젝트명_타임스탬프/파일명
    const safeProjectName = projectName.replace(/[^a-zA-Z0-9가-힣]/g, '_');
    const safeContact = contact.replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = `consultations/${safeContact}_${safeProjectName}_${timestamp}/${file.name}`;
    
    const fileRef = ref(storage, filePath);
    
    // 파일 업로드
    await uploadBytes(fileRef, file);
    
    // 다운로드 URL 획득
    const url = await getDownloadURL(fileRef);
    uploadedFiles.push({ name: file.name, url });
  }
  
  return uploadedFiles;
};
