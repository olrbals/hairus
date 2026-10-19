"use client";
import {useEffect,useRef,useState} from 'react';
import {fields,type FieldKey} from '@/lib/analysis/profile';
import {optionsForField} from '@/lib/analysis/profile-options';

/** Anchored dropdown editor; color fields additionally expose the native picker. */
export function FieldEditor({fieldKey,value,onClose,onSave}:{fieldKey:FieldKey;value:string|null;onClose:()=>void;onSave:(value:string|null)=>void}){
 const field=fields.find(item=>item.key===fieldKey)!;
 const options=optionsForField(fieldKey,value);
 const isColor=fieldKey==='color'||fieldKey==='skin';
 const initialColor=value?.startsWith('#')&&/^#[0-9a-fA-F]{6}$/.test(value)?value:options.find(item=>item.value===value)?.swatch||(fieldKey==='skin'?'#d8b5a0':'#33251f');
 const [customColor,setCustomColor]=useState(initialColor);
 const popup=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  popup.current?.querySelector<HTMLButtonElement>('button')?.focus();
  const outside=(event:PointerEvent)=>{if(event.target instanceof Node&&!popup.current?.parentElement?.contains(event.target))onClose();};
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();onClose();}};
  document.addEventListener('pointerdown',outside);
  document.addEventListener('keydown',escape);
  return ()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};
 },[onClose]);
 return <div className="profile-dropdown" ref={popup} role="group" aria-label={field.label+' 수정'}>
  <div className="profile-dropdown__options">
   {options.map(option=><button key={option.value} type="button" className="profile-dropdown__option" aria-pressed={option.value===value} onClick={()=>onSave(option.value)}>
    {option.swatch&&<span className="profile-dropdown__swatch" style={{backgroundColor:option.swatch}} aria-hidden="true"/>}<span>{option.label}</span>
   </button>)}
  </div>
  {isColor&&<div className="profile-dropdown__custom">
   <label htmlFor={'picker-'+fieldKey}>직접 색상 선택</label>
   <div className="profile-dropdown__picker">
    <input id={'picker-'+fieldKey} type="color" value={customColor} onChange={event=>setCustomColor(event.target.value)} aria-label={field.label+' 직접 색상 선택'}/>
    <span>{customColor.toUpperCase()}</span>
    <button type="button" onClick={()=>onSave(customColor)}>적용</button>
   </div>
  </div>}
  <button className="profile-dropdown__clear" type="button" onClick={()=>onSave(null)}>미입력으로 두기</button>
 </div>;
}
