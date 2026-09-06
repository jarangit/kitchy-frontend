import axios from "axios";
import axiosClient from "@/shared/services/axios-client";
import type { PublicReceiptDto } from "@/features/receipt/types/receipt.dto";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export class ReceiptApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly expiredAt?: string;

  constructor(
    message: string,
    status: number,
    code?: string,
    expiredAt?: string,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.expiredAt = expiredAt;
  }
}

export const receiptApiService = {
  getByToken: async (receiptToken: string): Promise<PublicReceiptDto> => {
    try {
      const response = await axiosClient.get<ApiEnvelope<PublicReceiptDto>>(
        `/public/receipts/${receiptToken}`,
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const payload = error.response?.data as {
          code?: string;
          message?: string;
          expiredAt?: string;
        };
        throw new ReceiptApiError(
          payload?.message ?? "Receipt could not be loaded",
          error.response?.status ?? 0,
          payload?.code,
          payload?.expiredAt,
        );
      }
      throw error;
    }
  },
};
