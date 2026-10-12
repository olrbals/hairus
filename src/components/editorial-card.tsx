"use client";
import {useState} from "react";
import {Icon} from "./primitives";
export function EditorialCard(){const [saved,setSaved]=useState(false);return <article className="editorial-card"><img className="editorial-photo" src="/assets/figma/in-focus-soft-bob.png" alt="짧은 단발에 부드러운 웨이브를 더한 헤어스타일" width="382" height="466"/><div className="caption-row"><div><p className="style-caption">짧은 기장, 부드러운 웨이브</p><p className="style-subtitle">Soft bob · Shape</p></div><button className="save-button" aria-label={saved?"샘플 스타일 저장 해제":"샘플 스타일 저장"} aria-pressed={saved} onClick={()=>setSaved(!saved)}><Icon name="bookmark"/></button></div><span className="sr-only" role="status">{saved?"샘플 스타일을 저장했습니다.":""}</span></article>;}
