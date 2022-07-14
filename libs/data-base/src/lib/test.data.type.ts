export interface RawData {
  id: {
    bioguide: string;
    govtrack: number;
    icpsr_prez: number;
  };
  name: {
    first: string;
    last: string;
  };
  bio: {
    birthday: string;
    gender: string;
  };
  terms: [
    {
      type: string;
      start: string;
      end: string;
      party: string;
      how: string;
    },
    {
      type: string;
      start: string;
      end: string;
      party: string;
      how: string;
    }
  ];
}
