export interface Message {
  text: string;
  sender: 'agent' | 'user';
  delayFrames: number;
  image?: string;
  caption?: string;
}

export interface ChatConfig {
  contactName: string;
  contactAvatar: string;
  messages: Message[];
  durationInFrames: number;
}
