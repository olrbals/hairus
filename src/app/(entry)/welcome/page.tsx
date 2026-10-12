"use client";
import Link from "next/link";
import {useState,useEffect} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/primitives";

import {readEntry,writeEntry} from "@/lib/entry-state";
export default function Welcome(){const [name,setName]=useState('');const router=useRouter();useEffect(()=>setName(readEntry().name),[]);const display=name.trim()||'당신';function save(){writeEntry({name:name.trim()});}return <main id="main" className="entry-screen welcome-screen" data-figma-node="920:5612"><header className="welcome-header"><Link href="/login" aria-label="로그인으로 돌아가기"><img src="/assets/figma/entry/back.svg" alt=""/></Link></header><div className="welcome-intro"><p className="eyebrow">Welcome !</p><h1>{name.trim()?`반가워요, ${display}님!`:'반가워요!'}<br/>당신에게 가장 잘 어울리는<br/>헤어 스타일을 찾아드릴게요.</h1><p>먼저, 간단한 헤어 분석을 통해<br/>{name.trim()?`${display}님의 특징을 알아볼게요.`:'당신의 특징을 알아볼게요.'}</p></div><div className="name-field"><label htmlFor="display-name">어떻게 불러드릴까요?</label><input id="display-name" value={name} onChange={e=>setName(e.target.value)} onBlur={save} maxLength={20} placeholder="이름 또는 닉네임" autoComplete="nickname"/><span className="sr-only">20자까지 입력할 수 있습니다. 입력하지 않아도 계속할 수 있습니다.</span></div><div className="welcome-actions"><Button variant="glass" onClick={()=>{save();writeEntry({analysis:'skipped'});router.push('/home');}}>건너뛰기</Button><Button onClick={()=>{save();router.push('/analysis/guide');}}>분석하기</Button></div></main>;}
