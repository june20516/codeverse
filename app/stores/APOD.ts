import { getDateStringYyyymmdd } from '@/utils';
import { create } from 'zustand';
import { APODProps } from '../components/SpaceToday/SpaceToday';

interface APODStoreProps {
  APOD: APODProps;
  fetchedDate: Date;
  fetched: boolean;
  setAPOD: (apodData: APODProps) => void;
}
export const useAPODStore = create<APODStoreProps>()(set => ({
  APOD: {
    copyright: '',
    date: getDateStringYyyymmdd(new Date()),
    explanation: 'image of "Astronomic Picture Of the Day"',
    media_type: 'image',
    title: 'loading..',
    url: 'assets/images/placeholder-768x576.png',
    service_version: '',
  },
  fetchedDate: new Date(),
  fetched: false,
  setAPOD: (apodData: APODProps) =>
    set(() => ({ APOD: apodData, fetchedDate: new Date(), fetched: true })),
}));
