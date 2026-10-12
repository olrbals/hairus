export type SavedKind = "style" | "designer" | "salon";
export interface SavedItem { id:string; kind:SavedKind; savedAt:string }
export interface SavedRepository { list():Promise<SavedItem[]>; put(item:SavedItem):Promise<void>; remove(kind:SavedKind,id:string):Promise<void> }
export type HairAttributes = Record<string, string | string[] | null>;
export interface HairProfile { source:"mock"|"api"; original:HairAttributes; edits:Partial<HairAttributes>; analyzedAt:string }
export type AnalysisState = {status:"not-started"|"skipped"} | {status:"complete";profile:HairProfile};
export interface AnalysisService { analyze(photo:Blob, signal?:AbortSignal):Promise<HairProfile> }
export interface ReservationDraft { serviceId?:string; referenceIds:string[]; hairNote?:string; date?:string; time?:string; designerId?:string }
export interface ReservationService { submit(draft:ReservationDraft):Promise<{id:string;mode:"mock"|"live"}> }
// 실제 사진은 브라우저 영속 저장소에 보관하지 않는다.
