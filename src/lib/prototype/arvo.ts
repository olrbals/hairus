import {asset, services} from './catalog.ts';

// Figma salonDetails / designersArvo. Weekdays use Date.getDay(): Sunday = 0.
// This is the single source for both NOTICE and booking availability.
export const arvoTeam = [
  {id:'soyul',name:'소율',title:'원장',image:asset('c451a.png'),specialty:'리프컷 · 테슬컷 · 매트브라운 전문',offDays:[2,6]},
  {id:'sohee',name:'소희',title:'실장',image:asset('a91f5.png'),specialty:'보브컷 · 히피펌 전문',offDays:[1,4]},
  {id:'hana',name:'하나',title:'디자이너',image:asset('63467.png'),specialty:'C컬펌 · 컬러리스트',offDays:[3,4]},
  {id:'gyunghyun',name:'경현',title:'디자이너',image:asset('3a62b.png'),specialty:'허쉬컷 · 리프펌 전문',offDays:[2,0]},
  {id:'yoona',name:'윤아',title:'디자이너',image:asset('31628.png'),specialty:'레이어드컷·샌드펌 전문',offDays:[2,5]},
  {id:'jonghun',name:'종훈',title:'디자이너',image:asset('92e32.png'),specialty:'댄디컷 · 쉐도우펌 전문',offDays:[1,3]},
];
export type ArvoDesigner = (typeof arvoTeam)[number];
export const findArvoDesigner = (id:string) => arvoTeam.find(person=>person.id===id);
const weekdayNames = ['일','월','화','수','목','금','토'];
export const offDaysLabel = (person:ArvoDesigner) => person.offDays.map(day=>weekdayNames[day]).join(' · ')+' OFF';

export function isDesignerDayOff(designerId:string,date:string){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return false;
  const [year,month,day]=date.split('-').map(Number);
  // Parse the calendar day without UTC or browser timezone conversion.
  const weekday=new Date(Date.UTC(year,month-1,day)).getUTCDay();
  return findArvoDesigner(designerId)?.offDays.includes(weekday)??false;
}

const priceFor=(id:string)=>services.find(service=>service.id===id)!.price;
// Display-only Figma menu. Existing bookable services and their IDs stay intact.
export const arvoPriceGroups = [
  {category:'컷',rows:[{name:'디자이너 (직급별 차등 요금)',price:priceFor('cut'),from:true}]},
  {category:'일반펌',rows:[
    {name:'숏펌 (직급별 차등 요금)',price:priceFor('perm'),from:true},
    {name:'단발펌 (직급별 차등 요금)',price:220000,from:true},
    {name:'미디움펌 (직급별 차등 요금)',price:250000,from:true},
    {name:'롱펌 (직급별 차등 요금)',price:280000,from:true},
  ]},
  {category:'염색',rows:[
    {name:'숏 헤어 (직급별 차등 요금)',price:priceFor('color'),from:true},
    {name:'단발 헤어 (직급별 차등 요금)',price:140000,from:true},
    {name:'미디움펌 (직급별 차등 요금)',price:170000,from:true},
    {name:'롱펌 (직급별 차등 요금)',price:200000,from:true},
  ]},
  {category:'클리닉',rows:[{name:'모발 & 두피',price:100000,from:true}]},
  {category:'기타',rows:[{name:'이미지 헤어 컨설팅',price:30000,from:false}]},
];
export const arvoInterior = [
  {src:asset('4e00b.png'),alt:'아르보 성수 내부 — 햇빛이 들어오는 거울과 시술 공간'},
  {src:'/assets/figma/salon-arvo/0ff44.png',alt:'아르보 성수 내부 — 편안한 샴푸 공간'},
  {src:'/assets/figma/salon-arvo/147b8.png',alt:'아르보 성수 내부 — 식물과 라운지 공간'},
  {src:'/assets/figma/salon-arvo/1b825.png',alt:'아르보 성수 내부 — 창가 시술 공간'},
];
