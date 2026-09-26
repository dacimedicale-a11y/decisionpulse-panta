export type Market = {
  marketId: string;
  category: string;
  title: string;
  description?: string;
  phase: string;
  status?: string;
  volumeUsdc?: string | number;
  totalVolumeUsdc?: string | number;
  yesPrice?: string | number | null;
  noPrice?: string | number | null;
  primaryYesPrice?: string | number | null;
  primaryNoPrice?: string | number | null;
  endTime?: number | null;
  region?: string | null;
  images?: string[];
};

export type MarketList = {
  items: Market[];
  nextCursor?: string | null;
};

export type Trade = {
  id?: string | number;
  marketId?: string;
  side?: string;
  kind?: string;
  amountUsdc?: string | number;
  yesAmount?: string | number;
  noAmount?: string | number;
  blockTime?: number | null;
  signature?: string;
};

export type TradesResponse = {
  marketId: string;
  items: Trade[];
};
