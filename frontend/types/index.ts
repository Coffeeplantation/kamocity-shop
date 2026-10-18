export type User = {
  id: number;
  email: string;
  nickname: string;
};

export type FurimaListItem = {
  id: number;
  item: string;
  price: number;
  fee_name: string;
  sold_out: boolean;
  image_url: string | null;
};

export type FurimaDetail = {
  id: number;
  item: string;
  item_text: string;
  price: number;
  category: { id: number; name: string };
  condition: { id: number; name: string };
  fee: { id: number; name: string };
  prefecture: { id: number; name: string };
  scheduled_delivery: { id: number; name: string };
  sold_out: boolean;
  user: { id: number; nickname: string };
  image_url: string | null;
};

export type SelectOption = { id: number; name: string };

export type MasterData = {
  categories: SelectOption[];
  conditions: SelectOption[];
  fees: SelectOption[];
  prefectures: SelectOption[];
  scheduled_deliveries: SelectOption[];
};
