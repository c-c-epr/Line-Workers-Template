export type TextMessage = { type: "text"; text: string };
export type ImageMessage = { type: "image"; originalContentUrl: string; previewImageUrl: string };
export type Message = TextMessage | ImageMessage | { type: string; [key: string]: unknown };
