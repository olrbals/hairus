import type {ReactNode} from 'react';
import {Button} from '@/components/primitives';
import {Action} from './shared';

export function PreferenceActions({children,onNext,disabled=false,previousHref,previousLabel='이전'}:{children:ReactNode;onNext:()=>void;disabled?:boolean;previousHref:string;previousLabel?:string}){
 return <div className="preference-actions"><Action secondary href={previousHref}>{previousLabel}</Action><Button disabled={disabled} onClick={onNext}>{children}</Button></div>;
}
