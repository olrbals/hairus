import {Survey} from '@/components/prototype/surveys';
import {notFound} from 'next/navigation';
export default async function Page({params}:{params:Promise<{step:string}>}){const {step}=await params;if(!["intro","1","2","3"].includes(step))notFound();return <Survey key={step} kind="matching" step={step}/>;}
