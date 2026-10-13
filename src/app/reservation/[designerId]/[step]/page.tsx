import {BookingFlow} from '@/components/prototype/booking';
export default async function Page({params,searchParams}:{params:Promise<{designerId:string;step:string}>;searchParams:Promise<{service?:string}>}){const {designerId,step}=await params;const {service}=await searchParams;return <BookingFlow designerId={designerId} step={step} initialService={service}/>;}
