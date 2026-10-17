import {designers} from './catalog.ts';
import type {Answers} from './logic.ts';

/** Figma yourMatch / WHY WE MATCH: 1107:3035. Display only supported Yoona traits. */
export function getYoonaMatchReasons(matching: Answers, preferences: Answers) {
  const yoona = designers.find(item => item.id === 'yoona');
  if (!yoona) throw new Error('YOONA designer information is missing');

  const matchedMood = (preferences.mood ?? []).find(mood => yoona.tags.includes(mood));
  const prefersEase = (matching.strength ?? []).includes('손질하기 쉬운 결과')
    && yoona.strengths?.includes('손질하기 쉬운 결과');
  const matchedConsult = (matching.consult ?? []).find(option => yoona.strengths?.includes(option));
  const prefersConsultation = (matching.strength ?? []).includes('충분한 상담')
    && yoona.strengths?.includes('충분한 상담');

  let style = '윤아는 자연스러운 스타일을 제안해요.';
  if (prefersEase) style = '손질이 쉬운 스타일을 제안해요.';
  else if (matchedMood) style = '선호한 ' + matchedMood + ' 무드와 잘 맞아요.';

  let consultation = '윤아는 충분한 대화를 중요하게 생각해요.';
  if (matchedConsult === '취향 존중') consultation = '취향을 존중하며 함께 방향을 정해요.';
  else if (matchedConsult === '충분한 대화') consultation = '충분히 대화하며 취향을 찾아가요.';
  else if (matchedConsult === '친절한') consultation = '친절하게 취향을 듣고 상담해요.';
  else if (prefersConsultation) consultation = '충분한 상담으로 취향을 함께 찾아요.';

  return {style, consultation};
}
