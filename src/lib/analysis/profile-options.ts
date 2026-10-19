import {faces,lengths,type FieldKey} from './profile.ts';

export interface ProfileOption {value:string;label:string;detail?:string;swatch?:string;faceIndex?:number}
const labels=(values:readonly string[]):ProfileOption[]=>values.map(value=>({value,label:value}));
export const historyPeriods=['1개월 이내','3개월 이내','6개월 이내','1년 이내','1년 이상','시술 이력 없음'] as const;
const historyOptions=labels(historyPeriods);
/** 기장·얼굴형·이력은 Figma 기준, 나머지 선택지·대표색 견본은 TASK 02 사용자 승인. */
export const profileOptions:Record<FieldKey,readonly ProfileOption[]>={
 length:lengths.map(value=>({value,label:value.split(' (')[0],detail:value.split(' (')[1]?.replace(')','')})),
 face:faces.map((value,faceIndex)=>({value,label:value,faceIndex})),
 bangs:labels(['없음','시스루뱅','풀뱅','사이드뱅','커튼뱅']),
 texture:labels(['직모','반곱슬','곱슬']),
 cut:labels(['일자','레이어드','보브','허쉬','픽시']),
 neck:labels(['짧은 편','보통','긴 편']),
 layer:labels(['없음','적음','보통','많음']),
 color:[
  {value:'블랙',label:'블랙',swatch:'#191919'},
  {value:'흑갈색',label:'흑갈색',swatch:'#33251f'},
  {value:'브라운',label:'브라운',swatch:'#79543b'},
  {value:'애쉬 브라운',label:'애쉬 브라운',swatch:'#80736b'},
  {value:'블론드',label:'블론드',swatch:'#cbb17b'},
  {value:'레드 브라운',label:'레드 브라운',swatch:'#844d42'},
 ],
 skin:[
  {value:'웜톤',label:'웜톤',swatch:'#dfb38b'},
  {value:'쿨톤',label:'쿨톤',swatch:'#d7a6a4'},
  {value:'뉴트럴',label:'뉴트럴',swatch:'#d8b5a0'},
 ],
 cutHistory:historyOptions,permHistory:historyOptions,dyeHistory:historyOptions,bleachHistory:historyOptions,
};
/** Named profile colors use the approved palette; a custom #RRGGBB uses its exact shade. */
export function swatchForField(key:FieldKey,value:string|null):string|null{
 if((key!=='color'&&key!=='skin')||!value)return null;
 if(/^#[0-9a-fA-F]{6}$/.test(value))return value;
 return profileOptions[key].find(option=>option.value===value)?.swatch??null;
}
export function optionsForField(key:FieldKey,current:string|null):readonly ProfileOption[]{
 const options=profileOptions[key];
 // Preserve older free text without forcing it into a newly introduced category.
 return current&&!options.some(option=>option.value===current)
  ?[...options,{value:current,label:current,detail:'기존 입력값'}]:options;
}
