import Link from "next/link";
import {BottomNav} from "@/components/bottom-nav";
export default function Page(){return <><main id="main" className="route-placeholder"><p className="wordmark">HAIRUS</p><h1>MY</h1><p>라우팅 기반이 준비되었습니다. 전체 화면은 후속 단계에서 구현합니다.</p><Link href="/ui">UI 샘플로 돌아가기 ↗</Link></main><BottomNav active="/my"/></>;}
