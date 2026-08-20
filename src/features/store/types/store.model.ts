export interface StoreSalesSettings {
  useTable: boolean;
  useQueue: boolean;
  useNote: boolean;
  useOptions: boolean;
  defaultType: "dineIn" | "togo";
}

export interface StorePaymentSettings {
  cash: boolean;
  qr: boolean;
  bank: boolean;
  truemoney: boolean;
}

export interface StoreSafetySettings {
  confirmDelete: boolean;
  confirmRefund: boolean;
}

export interface StoreDeliverySettings {
  supportedPlatforms: string[];
  enabledPlatforms: string[];
}

export interface StoreSettings {
  hours: string;
  promptpay: string;
  dailyRevenueTarget: string;
  paused: boolean;
  sales: StoreSalesSettings;
  payments: StorePaymentSettings;
  safety: StoreSafetySettings;
  delivery: StoreDeliverySettings;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  hours: "",
  promptpay: "",
  dailyRevenueTarget: "",
  paused: false,
  sales: {
    useTable: true,
    useQueue: true,
    useNote: true,
    useOptions: false,
    defaultType: "dineIn",
  },
  payments: {
    cash: true,
    qr: true,
    bank: false,
    truemoney: false,
  },
  safety: {
    confirmDelete: true,
    confirmRefund: true,
  },
  delivery: {
    supportedPlatforms: [],
    enabledPlatforms: [],
  },
};

export interface IStore {
  id: string;
  name: string;
  orderLimit?: number;
  settings?: StoreSettings | null;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StoreFormData {
  name: string;
}
