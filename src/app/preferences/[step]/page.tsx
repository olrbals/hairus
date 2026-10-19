import {Survey} from '@/components/prototype/surveys';
import {redirect} from 'next/navigation';
import {PreferenceBta} from '@/components/prototype/preference-transition';
export default async function Page({params}:{params:Promise<{step:string}>}){const {step}=await params;if(step==='4')redirect('/preferences/3');return step==='intro'?<PreferenceBta/>:<Survey key={step} kind="preferences" step={step}/>;}
