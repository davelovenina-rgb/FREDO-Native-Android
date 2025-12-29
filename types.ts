export enum Role {
  USER = 'user',
  FREDO = 'model'
}

export type AiMode = 'legacy' | 'image' | 'video' | 'research' | 'shopping' | 'search' | 'maps' | 'thinking' | 'agent' | 'default' | 'study' | 'lite' | 'drive' | 'spiritual' | 'media';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

export interface Conversation {
  id: string;
  title: string;
  lastUpdate: number;
  messages: Message[];
  mode: AiMode;
  agentId: string;
}

export type ThreadAccess = 'open' | 'sealed' | 'inherit';

export interface ProjectFile {
  id: string;
  name: string;
  data: string;
  mimeType: string;
  timestamp: number;
  threadAccess?: ThreadAccess; // 'inherit' uses folder setting, 'open' or 'sealed' overrides
}

export interface Folder {
  id: string;
  name: string;
  conversationIds: string[];
  files?: ProjectFile[];
  isCollapsed?: boolean;
  threadAccess?: ThreadAccess; // Default: 'open' - files can access external threads, 'sealed' - isolated
}

export interface Memory {
  id: string;
  content: string;
  timestamp: number;
}

export interface NeuralMemory {
  id: string;
  title: string;
  instructions: string;
  timestamp: number;
}

export interface KnowledgeSource {
  id: string;
  type: 'url' | 'file';
  value: string;
  timestamp: number;
}

export interface Agent {
  id: string;
  name: string;
  instructions: string;
  voicePreset: string;
  voiceSpeed: number;
  pitch: number;
  knowledgeSources: KnowledgeSource[];
  isDefault?: boolean;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  lastTaken?: number;
  reminderEnabled: boolean;
}

export interface HealthReading {
  id: string;
  type: 'glucose' | 'weight' | 'systolic' | 'diastolic';
  value: number;
  timestamp: number;
}

export interface Trip {
  id: string;
  startTime: number;
  endTime?: number;
  isActive: boolean;
}

export interface SpiritualEntry {
  id: string;
  type: 'reflection' | 'prayer' | 'gratitude';
  content: string;
  timestamp: number;
  scriptureReference?: string;
}

export interface MediaEntry {
  id: string;
  title: string;
  creator: string;
  type: 'book' | 'film' | 'music' | 'podcast';
  rating: number;
  reflection: string;
  timestamp: number;
}

export interface Reminder {
  id: string;
  title: string;
  timestamp: number;
  repeat: 'once' | 'daily' | 'weekly';
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'med' | 'high';
  timestamp: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

export type ToneStyle = 'default' | 'professional' | 'friendly' | 'candid' | 'quirky' | 'efficient' | 'nerdy' | 'clinical';

export interface AppSettings {
  fontSize: number;
  voiceReplies: boolean;
  autoPlayAudio: boolean;
  nickname: string;
  occupation: string;
  toneStyle: ToneStyle;
}

export interface AppState {
  conversations: Conversation[];
  folders: Folder[];
  memories: Memory[];
  neuralMemories: NeuralMemory[];
  agents: Agent[];
  activeConversationId: string | null;
  healthReadings: HealthReading[];
  medications: Medication[];
  trips: Trip[];
  spiritualArchive: SpiritualEntry[];
  mediaRegistry: MediaEntry[];
  tasks: Task[];
  notes: Note[];
  reminders: Reminder[];
  settings: AppSettings;
  currentMode: AiMode;
}
