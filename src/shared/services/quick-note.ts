import axiosClient from "@/shared/services/axios-client";
import {
  IS_DEMO_MODE,
  getAdapter,
} from "@/shared/services/adapters/data-adapter";
import type {
  ApiResponseDto,
  CreateQuickNoteRequest,
  QuickNote,
  UpdateQuickNoteRequest,
} from "@/shared/types/quick-note";

export const quickNoteServiceApi = {
  getByStoreId: async (storeId: string) => {
    if (IS_DEMO_MODE) {
      const data = await (await getAdapter()).getQuickNotesByStoreId(storeId);
      return {
        data: { success: true, message: "ok", data },
      } as { data: ApiResponseDto<QuickNote[]> };
    }
    return await axiosClient.get<ApiResponseDto<QuickNote[]>>(
      `/quick-note/store/${storeId}`,
    );
  },
  create: async (data: CreateQuickNoteRequest) => {
    if (IS_DEMO_MODE) {
      const note = await (await getAdapter()).createQuickNote(data);
      return {
        data: { success: true, message: "ok", data: note },
      } as { data: ApiResponseDto<QuickNote> };
    }
    return await axiosClient.post<ApiResponseDto<QuickNote>>(
      "/quick-note",
      data,
    );
  },
  update: async (id: string, data: UpdateQuickNoteRequest) => {
    if (IS_DEMO_MODE) {
      const note = await (await getAdapter()).updateQuickNote(id, data);
      return {
        data: { success: true, message: "ok", data: note },
      } as { data: ApiResponseDto<QuickNote> };
    }
    return await axiosClient.patch<ApiResponseDto<QuickNote>>(
      `/quick-note/${id}`,
      data,
    );
  },
  delete: async (id: string) => {
    if (IS_DEMO_MODE) {
      await (await getAdapter()).deleteQuickNote(id);
      return {
        data: { success: true, message: "ok", data: null },
      } as { data: ApiResponseDto<null> };
    }
    return await axiosClient.delete<ApiResponseDto<null>>(`/quick-note/${id}`);
  },
  replace: async (storeId: string, notes: string[]) => {
    if (IS_DEMO_MODE) {
      const data = await (await getAdapter()).replaceQuickNotes(storeId, notes);
      return {
        data: { success: true, message: "ok", data },
      } as { data: ApiResponseDto<QuickNote[]> };
    }
    return await axiosClient.put<ApiResponseDto<QuickNote[]>>(
      `/quick-note/store/${storeId}`,
      { notes },
    );
  },
};
