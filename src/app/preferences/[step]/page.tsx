import {Survey} from '@/components/prototype/surveys';
import {redirect} from 'next/navigation';
export default async function Page({params}:{params:Promise<{step:string}>}){const {step}=await params;if(step==='intro')redirect('/preferences/1');if(step==='4')redirect('/preferences/3');return <Survey key={step} kind="preferences" step={step}/>;}
