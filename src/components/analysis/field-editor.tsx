"use client";
import {useState} from 'react';
import {BottomSheet} from '@/components/bottom-sheet';
import {Button} from '@/components/primitives';
import {fields,type FieldKey} from '@/lib/analysis/profile';
import {optionsForField,type ProfileOption} from '@/lib/analysis/profile-options';
import {asset} from './shared';

const positions=[[-37.21,-11.7],[-160.15,-12.03],[-287.26,-12.03],[-37.21,-115.84],[-159.42,-115.58],[-285.79,-116.17]];
function OptionContent({option}:{option:ProfileOption}){
 const position=option.faceIndex===undefined?null:positions[option.faceIndex];
 return <>
  {position&&<span className="face-crop"><img src={asset('e2454.png')} alt="" style={{left:`${position[0]}%`,top:`${position[1]}%`}}/></span>}
  {option.swatch&&<span className="profile-swatch" aria-hidden="true" style={{backgroundColor:option.swatch}}/>}
  <span>{option.label}</span>
  {option.detail&&<small>{option.detail}</small>}
 </>;
}
export function FieldEditor({fieldKey,value,onClose,onSave,closeLabel}:{fieldKey:FieldKey;value:string|null;onClose:()=>void;onSave:(value:string|null)=>void;closeLabel?:string}){
 const field=fields.find(f=>f.key===fieldKey)!;
 const [draft,setDraft]=useState<string|null>(value);
 const visual=field.kind==='face'||field.kind==='swatches';
 const description=field.kind==='history'
  ?`가장 최근 ${field.label.replace(' 이력','')} 시기를 선택해 주세요.`
  :field.kind==='swatches'?'이름과 대표색을 참고해 가장 가까운 항목을 선택해 주세요.'
  :`실제 ${field.label}과 가장 가까운 형태를 선택해 주세요.`;
 return <BottomSheet open onClose={onClose} title={field.kind==='history'?field.label:`${field.label} 수정`} variant="editor" headingAction={closeLabel?<button type="button" className="sheet-close" onClick={onClose} aria-label="수정 취소하고 닫기">{closeLabel}</button>:undefined}>
  <p className="editor-description">{description}</p>
  <div className={`profile-options ${visual?'visual-options':`chip-options ${field.kind==='length'?'length-options':''} ${field.kind==='history'?'history-options':''}`}`} role="group" aria-label={field.label}>
   {optionsForField(fieldKey,value).map(option=><button key={option.value} type="button" aria-pressed={draft===option.value} onClick={()=>setDraft(option.value)} className={option.detail==='기존 입력값'?'legacy-option':undefined}>
    <OptionContent option={option}/>
   </button>)}
  </div>
  <Button onClick={()=>onSave(draft)}>저장하기</Button>
  <button className="text-action clear-field" type="button" onClick={()=>setDraft(null)}>미입력으로 두기</button>
  <span className="sr-only" role="status">{draft===null?'미입력으로 선택했어요. 저장하기를 눌러 적용해 주세요.':`${draft} 선택됨`}</span>
 </BottomSheet>;
}
