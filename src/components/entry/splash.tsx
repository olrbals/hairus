"use client";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {readEntry} from "@/lib/entry-state";
export function Splash(){const router=useRouter();useEffect(()=>{const state=readEntry();const target=state.loginMode==="demo"?"/welcome":state.onboardingDone?"/login":`/onboarding/${state.onboardingStep}`;const timer=setTimeout(()=>router.replace(target),900);return()=>clearTimeout(timer);},[router]);return <main id="main" className="entry-screen splash"><h1>HAIRUS</h1><p>HAIR IS WHO WE ARE</p><Link href="/onboarding/1">시작하기</Link></main>;}
