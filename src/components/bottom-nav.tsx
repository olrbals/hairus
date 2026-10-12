import Link from "next/link";
import {mainTabs} from "@/lib/routes";
import {Icon} from "./primitives";
export function BottomNav({active}: {active?:string}) {return <nav className="bottom-nav" aria-label="메인 메뉴">{mainTabs.map(tab=><Link href={tab.href} key={tab.href} aria-current={active===tab.href?"page":undefined}><Icon name={tab.icon}/><span>{tab.label}</span></Link>)}</nav>;}
