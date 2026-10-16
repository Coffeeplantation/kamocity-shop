// 使用写真の一覧。すべて Unsplash License（無料・商用可・クレジット任意）の写真。
// 人物の顔・実在の店舗名やロゴが写っていないものを選んでいる。クレジットは店舗ページ下部に掲載。

export type PhotoInfo = {
  id: string; // images.unsplash.com/photo-<id>
  slug: string; // unsplash.com/photos/<slug>
  by: string;
  alt: string;
  position?: string; // object-position
};

export const PHOTOS = {
  lighthouseDusk: { id: '1766406974571-f26528880083', slug: '4a8janMtWEs', by: 'kai muro', alt: '夕暮れの防波堤と灯台', position: '50% 40%' },
  lighthouseDawn: { id: '1767023604437-01e9ad9f1071', slug: '4uNzQBhC32s', by: 'kai muro', alt: '夜明けの海と灯台' },
  harbor: { id: '1638080967715-a163858782f5', slug: 'JAoNl37EZm4', by: 'Chengbo Zheng', alt: '夕方の漁港に並ぶ漁船' },
  kaisendon: { id: '1785735364431-2147763061cd', slug: 'w4NDRg2bCRY', by: 'Zion C', alt: 'イクラとカニの海鮮丼' },
  uniIkura: { id: '1771992457502-3b8400743b7e', slug: 'gKgiCFr46JE', by: 'Iris Yan', alt: '升に盛ったウニとイクラ' },
  salmonDon: { id: '1775889184856-7b2d5caf9a47', slug: 'cwqI5PcUsqQ', by: 'Jay', alt: 'サーモン丼' },
  tempuraSet: { id: '1776145674807-7b1558e760ed', slug: 'fZ5qgJXTWAM', by: 'Liang Chuang', alt: '天ぷらとそばの定食' },
  vegetableStand: { id: '1563897189520-001001c39f3d', slug: 'y6Q20FSLq2Y', by: 'Daniel Schludi', alt: '木の台に並ぶ野菜' },
  mikanStand: { id: '1783346053979-d195b20eb24b', slug: 'IAHbYiHzcnw', by: 'Red Shuheart', alt: '直売所に並ぶ袋詰めのみかん' },
  freshFish: { id: '1609559376851-9a995930702a', slug: 'LalQ-K9gx94', by: 'Beth Macdonald', alt: '水揚げされた銀色の魚' },
  fishCounter: { id: '1587279733259-26c7d2c0dba5', slug: '9Ep9bbc5zVY', by: 'e', alt: '鮮魚売場に並ぶ魚介' },
  ayu: { id: '1627221122441-9b31f3fe708c', slug: 'iEp4X_Na4ew', by: 'Jinomono Media', alt: '炭火で焼く鮎の塩焼き' },
  saltedSalmon: { id: '1737690526913-6ad06bc04340', slug: 'zFnUTzbRSec', by: 'Alan Jiang', alt: '吊るして干した塩鮭' },
  coffee: { id: '1704992922364-0fcfb96772b7', slug: 'tLXeoLyYR88', by: 'Andy Bodemer', alt: 'ラテアートのコーヒー' },
  cafeWindow: { id: '1765118422113-e757c5082b03', slug: 'RiDKtjVxIQs', by: 'tommao wang', alt: '窓辺のラテとソーダ' },
  softServe: { id: '1686922172452-65f39c99ea6a', slug: 'QF03mdb14QI', by: 'Yuika Takamura', alt: '青空とソフトクリーム' },
  matchaSoftServe: { id: '1554630981-a73ffb5ed6f8', slug: 'bO6CH7IQLJo', by: 'Hanmer Zh', alt: '抹茶とバニラのミックスソフト' },
  footBath: { id: '1785057707873-68aada1c09dd', slug: 'T_jCSMqj4ZA', by: 'Loris Boulinguez', alt: '木のベンチがある足湯' },
  pottery: { id: '1783192485589-74ea71b42d4f', slug: '-lJWWBOscnI', by: 'Stephen Pontes', alt: '器と急須' },
  potteryColorful: { id: '1776218643294-9f0f1475b654', slug: 'NLdTCZmQwnc', by: 'jason hu', alt: '色とりどりの湯のみ' },
  riceField: { id: '1787377491474-4ca4bf4b9eab', slug: 'AgMvT3p2EME', by: 'Freezer', alt: '実りの秋の田んぼと一本の木' },
  hoshigaki: { id: '1762980623026-c22d28494369', slug: 'zyIVA-DSiC4', by: 'Madeline Liu', alt: '軒先に吊るした干し柿' },
  persimmon: { id: '1576714047433-c5f32378a30b', slug: 'xeuU_50FbYU', by: 'Eden', alt: '器に盛った柿' },
  flowers: { id: '1773093219331-1e53711e1189', slug: 'mNDlfVe3RPE', by: 'masha.uu', alt: 'バケツに並ぶ切り花' },
  grilledOysters: { id: '1688224178074-77567a36d669', slug: 'WN9aOuixdZU', by: 'LI WEIBIN', alt: '網で焼く牡蠣' },
  sweetPotato: { id: '1744659749700-c4213f840355', slug: 'eB2X4DnIk4c', by: 'Yen Vu', alt: 'かごに盛ったさつまいも' },
  bicycle: { id: '1774215915872-ec0fb0b2e021', slug: '0iCvoubJAug', by: 'Jimmy Phillips', alt: '灯台へ続く堤防と自転車' },
  bread: { id: '1705680827676-ea4a49bc6ecb', slug: 'q-_KXOY9JG8', by: 'Franck Tourneret', alt: '焼きたてのパン' },
} satisfies Record<string, PhotoInfo>;

export type PhotoKey = keyof typeof PHOTOS;
