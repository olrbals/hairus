from pathlib import Path
import json
files={
'.gitignore': 'node_modules/\n.next/\n*.tsbuildinfo\n.env*\n',
'postcss.config.mjs': 'export default { plugins: { "@tailwindcss/postcss": {} } };\n',
 'tsconfig.json': json.dumps({'compilerOptions':{'target':'ES2017','lib':['dom','dom.iterable','esnext'],'allowJs':True,'skipLibCheck':True,'strict':True,'noEmit':True,'esModuleInterop':True,'module':'esnext','moduleResolution':'bundler','resolveJsonModule':True,'isolatedModules':True,'jsx':'react-jsx','incremental':True,'plugins':[{'name':'next'}],'paths':{'@/*':['./src/*']}},'include':['next-env.d.ts','**/*.ts','**/*.tsx','.next/types/**/*.ts'],'exclude':['node_modules']},indent=2),
'src/app/layout.tsx': '''import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant";
import "./globals.css";
export const metadata: Metadata = { title: "HAIRUS · UI Foundation", description: "HAIRUS PHASE 02 공통 UI 검토" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="ko"><body><a className="skip-link" href="#main">본문으로 이동</a><div className="mobile-shell">{children}</div></body></html>; }
''',
'src/app/page.tsx': 'import {redirect} from "next/navigation";\nexport default function Page(){redirect("/ui");}\n',
'src/lib/routes.ts': '''export const mainTabs = [
 {href:"/home",label:"HOME",icon:"home"}, {href:"/explore",label:"EXPLORE",icon:"explore"},
 {href:"/saved",label:"SAVED",icon:"saved"}, {href:"/my",label:"MY",icon:"my"}
] as const;
// 아래 경로는 후속 단계 계약이며 PHASE 02에서 페이지 구현하지 않는다.
export const plannedRoutes = { splash:"/splash", onboarding:"/onboarding", login:"/login", welcome:"/welcome", guide:"/analysis/guide", camera:"/analysis/camera", captured:"/analysis/captured", loading:"/analysis/loading", result:"/analysis/result", edit:"/analysis/edit", style:(id:string)=>`/styles/${encodeURIComponent(id)}`, designer:(id:string)=>`/designers/${encodeURIComponent(id)}`, salon:(id:string)=>`/salons/${encodeURIComponent(id)}`, article:(id:string)=>`/articles/${encodeURIComponent(id)}`, reservation:"/reservation", hairNote:"/hair-note" } as const;
''',
'src/types/domain.ts': '''export type SavedKind = "style" | "designer" | "salon";
export interface SavedItem { id:string; kind:SavedKind; savedAt:string }
export interface SavedRepository { list():Promise<SavedItem[]>; put(item:SavedItem):Promise<void>; remove(kind:SavedKind,id:string):Promise<void> }
export type HairAttributes = Record<string, string | string[] | null>;
export interface HairProfile { source:"mock"|"api"; original:HairAttributes; edits:Partial<HairAttributes>; analyzedAt:string }
export type AnalysisState = {status:"not-started"|"skipped"} | {status:"complete";profile:HairProfile};
export interface AnalysisService { analyze(photo:Blob, signal?:AbortSignal):Promise<HairProfile> }
export interface ReservationDraft { serviceId?:string; referenceIds:string[]; hairNote?:string; date?:string; time?:string; designerId?:string }
export interface ReservationService { submit(draft:ReservationDraft):Promise<{id:string;mode:"mock"|"live"}> }
// 실제 사진은 브라우저 영속 저장소에 보관하지 않는다.
''',
'src/components/primitives.tsx': '''import type {ButtonHTMLAttributes, ReactNode} from "react";
export function Button({variant="primary",className="",...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:"primary"|"glass"|"plain"}) {return <button type="button" className={`button button--${variant} ${className}`} {...props}/>;}
export function SectionHeading({title,description,action}: {title:string;description:string;action?:ReactNode}) {return <header className="section-heading"><h2>{title}</h2><p>{description}</p>{action}</header>;}
export function Icon({name}:{name:"home"|"explore"|"saved"|"my"|"bookmark"}) {return <img src={`/assets/figma/${name}.svg`} alt="" aria-hidden="true"/>;}
''',
'src/components/bottom-nav.tsx': '''import Link from "next/link";
import {mainTabs} from "@/lib/routes";
import {Icon} from "./primitives";
export function BottomNav({active}: {active?:string}) {return <nav className="bottom-nav" aria-label="메인 메뉴">{mainTabs.map(tab=><Link href={tab.href} key={tab.href} aria-current={active===tab.href?"page":undefined}><Icon name={tab.icon}/><span>{tab.label}</span></Link>)}</nav>;}
''',
'src/components/bottom-sheet.tsx': '''"use client";
import {useEffect,useRef, type ReactNode} from "react";
export function BottomSheet({open,onClose,title,children}: {open:boolean;onClose:()=>void;title:string;children:ReactNode}) {
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const dialog=ref.current; if(!dialog)return; if(open){dialog.showModal();const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{dialog.close();document.body.style.overflow=previous;};} dialog.close();},[open]);
 return <dialog ref={ref} className="bottom-sheet" aria-labelledby="sheet-title" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="sheet-content"><div className="sheet-handle"/><h2 id="sheet-title">{title}</h2>{children}</div></dialog>;
}
''',
'src/components/editorial-card.tsx': '''"use client";
import {useState} from "react";
import {Icon} from "./primitives";
export function EditorialCard(){const [saved,setSaved]=useState(false);return <article className="editorial-card"><img className="editorial-photo" src="/assets/figma/in-focus-soft-bob.png" alt="짧은 단발에 부드러운 웨이브를 더한 헤어스타일" width="382" height="466"/><div className="caption-row"><div><p className="style-caption">짧은 기장, 부드러운 웨이브</p><p className="style-subtitle">Soft bob · Shape</p></div><button className="save-button" aria-label={saved?"샘플 스타일 저장 해제":"샘플 스타일 저장"} aria-pressed={saved} onClick={()=>setSaved(!saved)}><Icon name="bookmark"/></button></div><span className="sr-only" role="status">{saved?"샘플 스타일을 저장했습니다.":""}</span></article>;}
''',
'src/app/ui/page.tsx': '''"use client";
import {useState} from "react";
import {Button,SectionHeading} from "@/components/primitives";
import {EditorialCard} from "@/components/editorial-card";
import {BottomNav} from "@/components/bottom-nav";
import {BottomSheet} from "@/components/bottom-sheet";
export default function UiPage(){const [open,setOpen]=useState(false);return <><main id="main"><div className="sample-label">HAIRUS · PHASE 02 · UI SAMPLE</div><section className="in-focus" aria-label="시연용 In Focus 샘플"><SectionHeading title="In Focus" description="지금 주목해야 할 헤어스타일" action={<a className="view-link" href="/explore">View ↗</a>}/><EditorialCard/></section><section className="foundation-samples"><p className="wordmark">HAIRUS</p><p className="cormorant-sample">A personal hair story.</p><h2>공통 UI 샘플</h2><p>원본의 사진·타이포그래피와 공통 요소를 검토하는 화면입니다. 저장은 이 샘플 안에서만 유지됩니다.</p><Button onClick={()=>setOpen(true)}>바텀시트 열기</Button><Button variant="glass">Next · 버튼 스타일 샘플</Button><Button disabled>비활성 상태</Button></section></main><BottomNav/><BottomSheet open={open} onClose={()=>setOpen(false)} title="당신의 헤어를 이해하는 시작"><p>바텀시트 동작 확인용 샘플입니다. 카메라 권한이나 분석을 실행하지 않습니다.</p><Button onClick={()=>setOpen(false)}>확인</Button><Button variant="plain" onClick={()=>setOpen(false)}>닫기</Button></BottomSheet></>;}
'''
}
for name,text in files.items():
 p=Path(name);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text)
for tab in ['home','explore','saved','my']:
 p=Path(f'src/app/(main)/{tab}/page.tsx');p.parent.mkdir(parents=True,exist_ok=True);p.write_text(f'''import Link from "next/link";
import {{BottomNav}} from "@/components/bottom-nav";
export default function Page(){{return <><main id="main" className="route-placeholder"><p className="wordmark">HAIRUS</p><h1>{tab.upper()}</h1><p>라우팅 기반이 준비되었습니다. 전체 화면은 후속 단계에서 구현합니다.</p><Link href="/ui">UI 샘플로 돌아가기 ↗</Link></main><BottomNav active="/{tab}"/></>;}}
''')
