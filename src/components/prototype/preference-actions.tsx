import type {ReactNode} from 'react';
import {Button} from '@/components/primitives';
import {Action} from './shared';

export function PreferenceActions({children,onNext,disabled=false,previousHref,previousLabel='이전 단계'}:{children:ReactNode;onNext:()=>void;disabled?:boolean;previousHref:string;previousLabel?:string}){
 return <div className="preference-actions"><Button disabled={disabled} onClick={onNext}>{children}</Button><Action secondary href={previousHref}>{previousLabel}</Action></div>;
}
