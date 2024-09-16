export function english2korean(word: string): string {
  const dictionary = {
    'frontend': '프론트엔드',
    'backend': '백엔드',
    'data-structures': '자료구조',
    'algorithms': '알고리즘',
    'operating-systems': '운영체제',
    'architecture': '아키텍처',
    'machine-learning': '머신러닝',
    'statistics': '수리통계',
    'review': '회고',
    'career': '커리어',
    'fitness': '헬스',
  };

  return dictionary[word] || word;
}
