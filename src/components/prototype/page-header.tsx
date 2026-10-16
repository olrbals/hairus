'use client';

import {useRouter} from 'next/navigation';
import {HeaderBackIcon} from '@/components/primitives';
import type {Editorial} from '@/lib/prototype/editorials';
import {EditorialHeartSaveButton} from './editorial-bookmark';

type SaveOptions =
  | {showSaveButton: true; saveTarget: Editorial}
  | {showSaveButton?: false; saveTarget?: never};

type PageHeaderProps = SaveOptions & {
  title?: string;
  showBackButton?: boolean;
  backFallbackHref?: string;
};

export function PageHeader({title, showBackButton=true, backFallbackHref='/home', ...saveOptions}: PageHeaderProps) {
  const router = useRouter();

  return <header className="hairus-configurable-header hairus-page-header">
    {showBackButton
      ? <button type="button" className="hairus-configurable-header__back hairus-header-back" aria-label="이전 화면으로" onClick={() => window.history.length > 1 ? router.back() : router.push(backFallbackHref)}><HeaderBackIcon/></button>
      : <span className="hairus-configurable-header__slot" aria-hidden="true"/>}
    {title ? <span className="hairus-configurable-header__title">{title}</span> : <span aria-hidden="true"/>}
    {saveOptions.showSaveButton
      ? <div className="hairus-configurable-header__slot hairus-configurable-header__save"><EditorialHeartSaveButton item={saveOptions.saveTarget}/></div>
      : <span className="hairus-configurable-header__slot" aria-hidden="true"/>}
  </header>;
}
