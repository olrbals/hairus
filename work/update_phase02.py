from pathlib import Path
import json
policy='> 2026-10-12 사용자 최종 확정: **시연용 `814:1264`의 모든 화면이 최종 디자인 기준**이다. `95% 이상 완성`은 구현 기준에서 제외한다. In Focus 캡션은 **16px**을 유지하며 Home 배너·텍스트·이미지 배치를 혼합하지 않는다. 우선순위는 시연용→시연용 공통 디자인 시스템→초안의 기능/UX→동일 시스템의 신규 화면이다. 폰트는 Cormorant Garamond, Cormorant, Pretendard만 사용하며 Noto Sans KR/Inter는 Pretendard로 대체한다. PHASE 02는 사용자 승인에 따라 진행하며 PHASE 03은 검토 후 시작한다.'
for p in Path('outputs').glob('*.md'):
 s=p.read_text()
 lines=s.splitlines()
 lines=[line for line in lines if not line.startswith('> 2026-10-12 사용자 검토 반영:')]
 s='\n'.join(lines)
 s=s.replace('최종 선택은 아직 하지 않았다.','최종 선택은 사용자 결정으로 시연용 전체 채택으로 해결됐다. 비교 결과는 이력이며 구현에 혼합하지 않는다.')
 s=s.replace('시연용은 최종 기준이며 95% 영역의 최종 권위 여부를 다시 묻지 않는다.','시연용은 최종 기준이며 95% 영역은 구현 기준에서 제외한다.')
 s=s.replace('채택 전 기능·목적지·인터랙션·자산은 대응 시연용 행과 대조해야 한다.','95% 영역은 채택하지 않으며 대응 시연용 행만 구현 근거로 사용한다.')
 s=s.replace('95% 영역은 자동 채택하지 않는다.','95% 영역은 구현 기준으로 사용하지 않는다.')
 s=s.replace('전체 계획 검토는 완료했지만, PHASE 02는 아직 시작하지 말라는 지시를 유지한다.','PHASE 02 시작이 승인되었다. 전체 페이지 구현은 후속 단계이며 PHASE 03은 사용자 검토 후 시작한다.')
 s=s.replace('전체 계획은 사용자 동의를 받았다. 남은 질문은 미확정 세부사항만 대상으로 하며, 별도의 PHASE 02 시작 지시 전까지 구현하지 않는다.','전체 계획 및 PHASE 02 시작은 사용자 동의를 받았다. 남은 질문은 미확정 기능·콘텐츠만 대상으로 한다.')
 s=s.replace('PHASE 01 설계 제안. 코드·프로젝트·패키지 설치는 진행하지 않았다.','PHASE 01 설계를 PHASE 02 기반 코드로 구체화했다.')
 if p.name=='OPEN_QUESTIONS.md':
  s=s.replace('2026-10-12 · 사용자 검토 반영본. 전체 구현 계획은 동의받았지만 **PHASE 02 시작은 허용되지 않았다.** 이번 변경은 문서와 읽기 전용 Figma 비교뿐이다. 기존 Q 번호를 유지하고 해결된 질문을 다시 묻지 않는다.','2026-10-12 · 최종 결정 반영. PHASE 02 시작 승인. 기존 Q 번호를 유지하고 해결된 디자인 선택·폰트 질문은 다시 묻지 않는다.')
  s=s.replace('95% 영역은 실제 차이만 비교하며 자동 채택 금지.','95% 영역은 구현 기준에서 제외. 모든 영역 간 선택 질문 해결.')
  s=s.replace('다음 단계는 남은 필수 질문을 검토하고 별도로 PHASE 02 시작 지시를 받는 것이다. 이번에는 구현·패키지 설치·Figma 변경·Vercel 배포를 하지 않았다.','PHASE 02 기반 구현을 진행한다. Figma 원본 변경과 배포는 수행하지 않는다. PHASE 03은 사용자 검토 후 시작한다.')
  s=s.replace('| Q02 / PHASE 03 | ‘수정해야할메인페이지’의 온보딩 `699:5722 / 5732 / 5743`와 Welcome `699:5789`를 사용할 수 있는가? 온보딩3 중복 `728:752`와 어느 쪽을 기준으로 할까? | 시연용 바깥 후보이므로 시연용 확정만으로 채택하지 않음. Splash와 Intro의 역할 분리는 확정이며 다시 질문하지 않음 |','| Q02 / PHASE 03 | 필수 질문에서 제외: 시연용에 없는 온보딩/Welcome은 기존 디자인 시스템으로 신규 설계할 권한 확보 | 외부 후보는 자동 채택하지 않는다. Intro는 첫 여정에 임의 삽입하지 않으며 필요성은 후속 검토 |')
 if p.name=='FIGMA_DESIGN_COMPARISON.md':
  start=s.find('## 5.')
  s=s.replace('제 의견은 이 항목에 한해 20px이 더 유리하다.','이전 의견은 사용자 최종 결정으로 철회한다. 구현은 16px이다.')
  s=s.replace('‘시연용 기본 Home + 20px 캡션 + 확정된 배너 동작’도 검토 가능한 조합이지만, 이는 제안일 뿐 적용하거나 최종안으로 선택하지 않았다.','혼합 시안 제안은 폐기한다. 시연용 Home과 16px 캡션을 그대로 사용한다.')
  s=s.replace('최종안 선택 대기. PHASE 02 구현·Figma 변경·배포 없음.','최종안 선택 완료: 시연용 전체. 비교 이미지는 과거 검토 기록이며 승인 요청 대상이 아니다. PHASE 02 시작 승인, Figma 수정·배포 없음.')
 s=s.replace('\n','\n',1)
 first,rest=s.split('\n',1)
 p.write_text(first+'\n\n'+policy+'\n'+rest+'\n')
# Every observed image placement, including untouched crop/filter metadata.
records=[]
for p in sorted(Path('work').glob('metrics-*.json')):
 try:data=json.loads(p.read_text())
 except:continue
 if not isinstance(data,list):continue
 for frame in data:
  for item in frame.get('images',[]):records.append({'frameId':frame.get('id'),**item})
Path('public/assets/figma/observed-image-placements.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
manifest={'fileKey':'Ja8Ep1JwxOOFgMArfYr16T','finalSection':'814:1264','assets':[{'path':'/assets/figma/in-focus-soft-bob.png','nodeId':'I876:2663;692:1621','hash':'03feaaf18972541fee1f4e19e105fce31aeb57d4','ratio':'382:466','status':'local-figma-export'},*({'path':f'/assets/figma/{name}.svg','sourceNode':'876:2762' if name!='bookmark' else 'I876:2663;692:1626;628:827','status':'local-figma-export'} for name in ['home','explore','saved','my','bookmark'])],'note':'화면 전체 캡처가 아닌 실제 사진·아이콘만 UI에 사용. 전체 원본 다운로드 완료 아님. 미수출 자산은 후속 화면 구현 시 확보.'}
Path('public/assets/figma/manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('placement records',len(records))
