import {newProfile,type Profile} from './profile.ts';
export interface HairAnalysisService {analyze(signal:AbortSignal,onStage:(stage:number)=>void):Promise<Profile>}
function pause(ms:number,signal:AbortSignal){return new Promise<void>((resolve,reject)=>{if(signal.aborted){reject(new DOMException('취소됨','AbortError'));return;}const abort=()=>{clearTimeout(timer);reject(new DOMException('취소됨','AbortError'));};const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},ms);signal.addEventListener('abort',abort,{once:true});});}
/** 사진을 읽거나 전송하지 않는 고정 예시 서비스. 실제 API 연결 시 이 경계만 교체한다. */
export const mockAnalysisService:HairAnalysisService={async analyze(signal,onStage){for(let stage=0;stage<3;stage++){onStage(stage);await pause(1000,signal);}return newProfile();}};
