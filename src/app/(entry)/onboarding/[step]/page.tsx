import {notFound} from "next/navigation";
import {Onboarding} from "@/components/entry/onboarding";
export function generateStaticParams(){return [{step:"1"},{step:"2"},{step:"3"}];}
export default async function Page({params}:{params:Promise<{step:string}>}){const {step}=await params;if(step!=="1"&&step!=="2"&&step!=="3")notFound();return <Onboarding step={Number(step) as 1|2|3}/>;}
