import {Survey} from '@/components/prototype/surveys';
import {PreferenceBta} from '@/components/prototype/preference-transition';
export default async function Page({params}:{params:Promise<{step:string}>}){const {step}=await params;return step==='intro'?<PreferenceBta/>:<Survey key={step} kind="preferences" step={step}/>;}
