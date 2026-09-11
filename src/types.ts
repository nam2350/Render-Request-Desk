export interface ConsultationData {
  projectName: string;
  contact: string;
  spaceType: string;
  preferredStyle: string;
  keyPoints: string;
  fileNames: string[];
  timestamp?: string;
}

export interface RenderingSettings {
  mode: 'sketch' | 'floorplan' | 'empty_room';
  lighting: string;
  creativity: number;
  prompt: string;
  negativePrompt: string;
}
