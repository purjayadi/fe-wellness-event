export interface IMeta {
  page?: number;
  limit?: number;
  totalPage?: number;
  isFeatured?: boolean;
  isSlider?: boolean;
  posBalance?: string;
  posReport?: string;
  account?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IEvent{
  id?: string;
  eventName: string
}

export interface IBooking{
  id?: string;
  eventId: string | undefined;
  proposedDate: any | undefined;
  location: {
    postalCode: number | string;
    address: string;
  },
  confirmDate?: Date;
  status?: string;
  remark?: string;
}