// 사진은 메모리에만 보관. 라우트 이동에는 유지하되 새로고침/홈 이동 시 폐기한다.
export interface LocalPhoto {url:string;sample:boolean}
let photo:LocalPhoto|null=null;
export function getPhoto(){return photo;}
export function clearPhoto(){if(photo?.url.startsWith('blob:'))URL.revokeObjectURL(photo.url);photo=null;}
export function setPhoto(blob:Blob){clearPhoto();photo={url:URL.createObjectURL(blob),sample:false};}
export function setSamplePhoto(){clearPhoto();photo={url:'/assets/figma/analysis/b32c1.png',sample:true};}
export async function validatePhoto(file:File){if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('JPG, PNG, WebP 사진을 선택해 주세요.');if(file.size>10*1024*1024)throw Error('10MB 이하의 사진을 선택해 주세요.');const bitmap=await createImageBitmap(file).catch(()=>{throw Error('사진을 읽을 수 없어요. 다른 파일을 선택해 주세요.');});bitmap.close();}
export function cameraError(error:unknown){const name=error instanceof Error?error.name:'';if(name==='NotAllowedError'||name==='SecurityError')return '카메라 접근이 허용되지 않았어요. 브라우저 설정에서 권한을 바꾸거나 사진을 선택해 주세요.';if(name==='NotFoundError')return '사용 가능한 카메라가 없어요. 사진 선택이나 샘플 사진으로 계속할 수 있어요.';if(name==='NotReadableError')return '다른 앱에서 카메라를 사용 중일 수 있어요. 종료 후 다시 시도해 주세요.';return '카메라를 열지 못했어요. 다시 시도하거나 사진을 선택해 주세요.';}
/** 권한 응답이 늦게 도착해도 화면을 떠난 뒤 카메라가 켜진 채 남지 않는다. */
export async function acquireCamera(devices:Pick<MediaDevices,'getUserMedia'>,facing:'user'|'environment',signal:AbortSignal):Promise<MediaStream>{
 const stream=await devices.getUserMedia({video:{facingMode:{ideal:facing},width:{ideal:1280},height:{ideal:1920}},audio:false});
 const stop=()=>stream.getTracks().forEach(track=>track.stop());
 if(signal.aborted){stop();throw new DOMException('취소됨','AbortError');}
 signal.addEventListener('abort',stop,{once:true});return stream;
}
