export interface LabItem {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  features?: string[];
  createdAt: string;
  path: string; // 라우트 경로
}

export const labItems: LabItem[] = [
  {
    id: 'space-today',
    title: 'Space Today',
    description: 'NASA API를 활용한\n매일 바뀌는 우주 사진 갤러리',
    thumbnail: '/assets/images/lab/space-today.png',
    features: ['animated indicator', 'open API', 'NASA'],
    createdAt: '2023-12-15',
    path: '/lab/space-today',
  },
  {
    id: 'scramble-text',
    title: 'scramble Text',
    description: '슬롯머신처럼 랜덤한 글자를 거쳐 텍스트를 보여주는 애니메이션',
    thumbnail: '/assets/images/lab/unicode-scramble.png',
    features: ['bare animation', 'text animation'],
    createdAt: '2026-01-20',
    path: '/lab/scramble-text',
  },
  // 추가 lab 프로젝트들을 여기에 등록
];

export const getLabItems = () => labItems;

export const getLabItemById = (id: string) => {
  return labItems.find(item => item.id === id);
};
