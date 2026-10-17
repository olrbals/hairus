import {provinces} from './regions.ts';
export const asset=(file:string)=>`/assets/figma/v1/${file}`;
export type Kind='style'|'designer'|'salon';
export type Item={id:string;kind:Kind;name:string;english:string;image:string;tags:string[];description:string;designerId?:string;salonId?:string;location?:string;gender?:string;strengths?:string[];discoveryOnly?:boolean};
export const styles:Item[]=[
 ['airy','에어리 레이어드','Airy Layered','5582e.png','LONG','내추럴','yoona'],
 ['tassel','테슬컷','Tassel Cut','05be4.png','SHORT','모던 · 시크','sohee'],
 ['sand','샌드펌','Sand Perm','03042.png','LONG','러블리','yoona'],
 ['hush','허쉬컷','Hush Cut','deb8c.png','MEDIUM','내추럴','sohee'],
 ['pixie','텍스처드 픽시','Textured Pixie','b0afe.png','SHORT','모던 · 시크','sohee'],
 ['straight','스트레이트 레이어드','Straight Layered','cf399.png','LONG','청순','yoona'],
 ['face','페이스라인 레이어드','Face Framing','623f2.png','MEDIUM','러블리','yoona'],
 ['fringe','소프트 프린지','Soft Fringe','191a4.png','SHORT','귀여운','sohee'],
].map(([id,name,english,image,length,mood,designerId])=>({id,kind:'style',name,english,image:asset(image),tags:[length,mood],designerId,description:'얼굴 주변의 흐름과 자연스러운 질감을 살리는 스타일. 원하는 기장과 평소 손질 방법을 디자이너와 함께 상담해 보세요.'}));

export const inFocusStyle: Item = {
  id: 'soft-bob',
  kind: 'style',
  name: '소프트 보브',
  english: 'Soft Bob',
  image: asset('83c13.png'),
  tags: ['SHORT', '부드러운 웨이브'],
  description: '짧은 기장과 부드러운 웨이브가 특징인 스타일.',
};

export const designers:Item[]=[
 {id:'yoona',kind:'designer',name:'윤아',english:'YOONA',image:asset('31628.png'),tags:['내추럴','러블리','레이어드','청순'],description:'취향을 세심하게 듣고, 일상에서 자연스러운 스타일을 제안해요.',salonId:'arvo',location:'성수',gender:'여자',strengths:['충분한 상담','손질하기 쉬운 결과','친절한','취향 존중','충분한 대화']},
 {id:'sohee',kind:'designer',name:'소희',english:'SOHEE',image:asset('ad0de.png'),tags:['모던 · 시크','귀여운','단발','y2k'],description:'선명한 커트 라인과 가벼운 질감으로 나다운 변화를 함께 만들어요.',salonId:'arvo',location:'성수',gender:'여자',strengths:['원하는 스타일 경험','솔직한','꼼꼼한','핵심만 빠르게']},
 {id:'jisu',kind:'designer',name:'지수',english:'JISU',image:asset('d9387.png'),tags:['테슬컷','컬러'],description:'Figma 탐색 목록에 표시된 데모 디자이너입니다. 시술과 예약 정보는 별도로 준비되지 않았어요.',location:'논현동',strengths:[],discoveryOnly:true},
 {id:'gyunghyun',kind:'designer',name:'경현',english:'GYUNGHYUN',image:asset('3a62b.png'),tags:['허쉬컷','매트브라운'],description:'Figma 탐색 목록에 표시된 데모 디자이너입니다. 시술과 예약 정보는 별도로 준비되지 않았어요.',salonId:'arvo',location:'성수동',strengths:[],discoveryOnly:true},
 {id:'seeun',kind:'designer',name:'세은',english:'SEEUN',image:asset('2dae9.png'),tags:['테슬컷','히피펌'],description:'Figma 탐색 목록에 표시된 데모 디자이너입니다. 시술과 예약 정보는 별도로 준비되지 않았어요.',location:'이의동',strengths:[],discoveryOnly:true},
 {id:'soyul',kind:'designer',name:'소율',english:'SOYUL',image:asset('c451a.png'),tags:['볼륨펌','자연스러운 컬'],description:'Figma 탐색 목록에 표시된 데모 디자이너입니다. 시술과 예약 정보는 별도로 준비되지 않았어요.',salonId:'arvo',location:'성수동',strengths:[],discoveryOnly:true},
 {id:'jonghun',kind:'designer',name:'종훈',english:'JONGHUN',image:asset('92e32.png'),tags:['픽시컷','애쉬 브라운'],description:'Figma 탐색 목록에 표시된 데모 디자이너입니다. 시술과 예약 정보는 별도로 준비되지 않았어요.',salonId:'arvo',location:'성수동',strengths:[],discoveryOnly:true},
 {id:'hana',kind:'designer',name:'하나',english:'HANA',image:asset('63467.png'),tags:['내츄럴컷','모발관리'],description:'Figma 탐색 목록에 표시된 데모 디자이너입니다. 시술과 예약 정보는 별도로 준비되지 않았어요.',location:'신사동',strengths:[],discoveryOnly:true},
];
export const salons:Item[]=[
 {id:'arvo',kind:'salon',name:'아르보 성수',english:'ARVO SEONGSU',image:asset('4e00b.png'),tags:['성수','상담','내추럴'],description:'빛과 여백이 머무는 공간에서 나를 위한 시간을 만나보세요.',location:'서울 성동구 성수동'},
 {id:'moodon',kind:'salon',name:'무드온',english:'MOOD ON',image:asset('8d087.png'),tags:['논현동'],description:'Figma 탐색 목록에 표시된 데모 헤어샵입니다.',location:'서울 서초구 논현동 · 신논현역 도보 5분'},
 {id:'ongyeol',kind:'salon',name:'온결',english:'ONGYEOL',image:asset('d64e8.png'),tags:['성동구'],description:'Figma 탐색 목록에 표시된 데모 헤어샵입니다.',location:'서울 성동구 성동구 · 성수역 도보 5분'},
 {id:'ob-hair',kind:'salon',name:'오브헤어',english:'OB HAIR',image:asset('5111e.png'),tags:['성동구'],description:'Figma 탐색 목록에 표시된 데모 헤어샵입니다.',location:'서울 성동구 성동구 · 성수역 도보 5분'},
 {id:'noir',kind:'salon',name:'누아르',english:'NOIR',image:asset('766e3.png'),tags:['성동구'],description:'Figma 탐색 목록에 표시된 데모 헤어샵입니다.',location:'서울 성동구 성동구 · 성수역 도보 5분'},
];
export const catalog = [
  ...styles,
  inFocusStyle,
  ...designers,
  ...salons,
];


export const findItem = (kind: Kind, id: string) =>
  [...catalog, ...homeDiscoverStyles].find(
    item => item.kind === kind && item.id === id
  );
export const itemHref=(item:Item)=>`/${item.kind==='style'?'styles':item.kind==='designer'?'designers':'salons'}/${item.id}`;

/* HOME — More to Discover 전용 스타일 */

export const homeDiscoverStyles: Item[] = [
  // 01. 에어리 레이어드
  styles[0],

  // 02. 테슬컷
  styles[1],

  // 03. 샌드펌
  styles[2],

  // 04. 허쉬컷 — 새 이미지
  {
    ...styles[3],
    id: 'discover-hush',
    image: asset('discover-hushcut.png'),
  },

  // 05. 소프트 프린지
  styles[7],

  // 06. 스트레이트 레이어드
  styles[5],

  // 07. 텍스처드 픽시
  styles[4],

  // 08. 미디엄 레이어드컷
  {
    ...styles[6],
    id: 'medium-layered',
    name: '미디엄 레이어드컷',
    english: 'Medium Layered Cut',
    image: asset('discover-last.png'),
    tags: ['MEDIUM', '내추럴'],
  },
];

// Verified Figma reservation MENU, node 1119:3149:
// https://www.figma.com/design/Ja8Ep1JwxOOFgMArfYr16T?node-id=1119-3149
// Keep cut/perm/color IDs for existing links, drafts and saved appointments.
export const serviceCategories=['컷','열펌','염색','탈색','클리닉','기타'] as const;
export type ServiceCategory=(typeof serviceCategories)[number];
export type BookingService={id:string;name:string;category:ServiceCategory;price:number;minutes:number|null;lastBooking:string|null;description:string};
export const services:BookingService[]=[
 {id:'cut-men',name:'남성 일반컷',category:'컷',price:28000,minutes:60,lastBooking:'20:00',description:'기존 디자인을 다듬는 커트'},
 {id:'cut-men-design',name:'남성 디자인 컷',category:'컷',price:35000,minutes:60,lastBooking:'20:00',description:'디자인 변화가 있는 커트'},
 {id:'cut-women',name:'여성 일반컷',category:'컷',price:35000,minutes:60,lastBooking:'20:00',description:'기존 디자인을 다듬는 커트'},
 {id:'cut',name:'여성 디자인 컷',category:'컷',price:40000,minutes:60,lastBooking:'20:00',description:'디자인 변화가 있는 커트'},
 {id:'cut-bangs',name:'여성 앞머리 컷',category:'컷',price:10000,minutes:30,lastBooking:'20:00',description:'앞머리의 길이와 흐름을 정돈하는 커트 · 샴푸 추가 시 +10,000원'},
 ...[['perm-short','숏펌',160000],['perm','단발펌',180000],['perm-medium','미디움펌',220000],['perm-long','롱펌',250000],['perm-super-long','슈퍼롱펌',280000]].map(([id,name,price])=>({id:String(id),name:String(name),category:'열펌' as const,price:Number(price),minutes:150,lastBooking:'18:00',description:'기장과 모발 상태에 맞춰 자연스러운 컬과 볼륨을 디자인해요.'})),
 ...[['color','숏 헤어',120000],['color-bob','단발 헤어',140000],['color-medium','미디움 헤어',170000],['color-long','롱 헤어',200000],['color-super-long','슈퍼롱 헤어',230000]].map(([id,name,price])=>({id:String(id),name:String(name),category:'염색' as const,price:Number(price),minutes:120,lastBooking:'18:00',description:'현재 컬러와 원하는 분위기에 맞춰 색상을 상담해요.'})),
 // User-confirmed cutoff: 18:00. Bleach duration remains unspecified.
 ...[['bleach-short','숏 헤어',140000],['bleach-bob','단발 헤어',160000],['bleach-medium','미디움 헤어',200000],['bleach-long','롱 헤어',250000],['bleach-super-long','슈퍼롱 헤어',280000]].map(([id,name,price])=>({id:String(id),name:String(name),category:'탈색' as const,price:Number(price),minutes:null,lastBooking:'18:00',description:'모발 상태와 원하는 밝기를 상담하여 탈색 범위를 정해요.'})),
 {id:'clinic',name:'모발 & 두피',category:'클리닉',price:70000,minutes:60,lastBooking:'20:00',description:'모발과 두피 상태에 맞춘 집중 케어'},
 {id:'consulting',name:'이미지 헤어 컨설팅',category:'기타',price:30000,minutes:60,lastBooking:'20:00',description:'얼굴형과 취향, 일상에 어울리는 헤어 디자인 상담'},
];
export function bookingServiceName(service:BookingService){return ['염색','탈색','클리닉'].includes(service.category)?`${service.name} ${service.category}`:service.name;}

export const articles=[{id:'care',title:'THE ART OF HAIR CARE',subtitle:'머릿결을 돌보는 작은 습관',image:asset('0dc76.png'),body:'좋은 헤어는 매일의 작은 습관에서 시작됩니다. 머리를 감은 뒤 수건으로 가볍게 물기를 누르고, 두피부터 부드럽게 말려보세요. 나의 모발과 생활에 맞는 손질 방법은 디자이너와의 상담으로 찾아갈 수 있습니다.'},{id:'story',title:'BEYOND THE CHAIR',subtitle:'스타일을 만드는 사람들의 이야기',image:asset('48a15.png'),body:'한 사람의 헤어에는 취향과 일상이 담깁니다. 디자이너는 원하는 이미지뿐 아니라 아침에 머리를 손질하는 시간과 습관에도 귀를 기울입니다. 상담에서 평소 어려웠던 점을 함께 이야기해 보세요.'},{id:'color',title:'THE COLOR RITUAL',subtitle:'나를 표현하는 색',image:asset('6b945.png'),body:'컬러를 고르는 일은 새로운 분위기를 상상하는 일입니다. 지금의 모발 이력, 유지하고 싶은 톤과 관리 주기를 상담 노트에 기록해 보세요.'},{id:'fringe',title:'THE FRINGE THEORY',subtitle:'작은 변화, 새로운 표정',image:asset('5f044.png'),body:'얼굴 주변의 짧은 선이 전체 인상을 바꿉니다. 앞머리와 옆머리의 길이를 결정하기 전, 가르마와 평소 손질 습관을 함께 살펴보세요.'}];
export type Question={key:string;title:string;max:number;options:string[];images?:string[]};
export const preferenceQuestions:Question[]=[
 {key:'care',title:'평소 머리를 어떻게 손질하나요?',max:1,options:['자연스럽게 말리기','드라이로 스타일링','고데기 · 아이롱 사용','제품으로 스타일링'],images:['716fb.png','12425.png','2190e.png','d9677.png']},
 {key:'concerns',title:'평소 어떤 헤어 고민이 있나요?',max:3,options:['볼륨 부족','정돈하기 어려운 머릿결','머리가 쉽게 처짐','모발 손상','두피','헤어라인','모발 숱','스타일링','부스스한','곱슬기','쉽게 기름짐','특별한 고민 없음']},
 {key:'mood',title:'어떤 분위기의 스타일을 좋아하나요?',max:2,options:['내추럴','러블리','모던 · 시크','귀여운','y2k','청순'],images:['7b335.png','44769.png','1c182.png','18490.png','b05fc.png','530f6.png']},
 {key:'change',title:'지금 가장 바꾸고 싶은 부분은 무엇인가요?',max:3,options:['기장','앞머리','헤어 컬러','사이드 뱅','손질 편의성','웨이브','뿌리 볼륨','모발 숱','전체적인 분위기','곱슬기','아직 잘 모르겠어요']},
];
export const matchQuestions:Question[]=[
 {key:'gender',title:'선호하는 디자이너의 성별을 알려주세요',max:1,options:['여자','남자','상관없어요']},
 {key:'location',title:'주로 활동하는 지역을 알려주세요',max:1,options:provinces},
 {key:'strength',title:'어떤 강점을 가진 디자이너를 만나고 싶나요?',max:1,options:['원하는 스타일 경험','충분한 상담','손질하기 쉬운 결과']},
 {key:'consult',title:'어떤 방식의 상담을 선호하시나요?',max:3,options:['친절한','다양한 스타일 추천','솔직한','단호한','꼼꼼한','추가 시술 권유 없는','핵심만 빠르게','긍정적인','취향 존중','공감 위주의','대신 결정','충분한 대화','상담 필요 없음']},
 {key:'avoid',title:'불편했던 경험을 선택해주세요',max:3,options:['과한 시술 권유','긴 대기 시간','예상 밖 추가금','불편한 응대','부족한 설명','아쉬운 결과','특별한 경험 없음']},
];

export const events=[{id:'popup',title:'HAIRUS × CHAHONG ROOM',subtitle:'취향이 만나는 공간',image:asset('20198.png'),body:'Figma에 제안된 팝업 행사 콘셉트를 체험하는 페이지입니다. 실제 행사 일정이나 참가 예약은 제공하지 않아요. 공간을 둘러보고, 마음에 드는 디자이너와 스타일을 찾아보세요.'},{id:'issue',title:'A NEW ISSUE',subtitle:'새로운 헤어 이야기를 만나다',image:asset('88ad2.png'),body:'HAIRUS가 제안하는 새로운 헤어 이야기. 프로토타입에 담긴 에디토리얼과 스타일을 둘러보고, 나의 취향에 맞는 디자이너를 찾아보세요.'}];

export const featuredServices=['cut','perm','color'].map(id=>services.find(service=>service.id===id)!);
