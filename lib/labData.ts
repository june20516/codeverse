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
  // 추가 lab 프로젝트들을 여기에 등록
];

export const getLabItems = () => labItems;

export const getLabItemById = (id: string) => {
  return labItems.find(item => item.id === id);
};
