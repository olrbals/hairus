import {Survey} from '@/components/prototype/surveys';
export default async function Page({params}:{params:Promise<{step:string}>}){const {step}=await params;return <Survey key={step} kind="preferences" step={step}/>;}
