import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/shared/hooks/hooks";
import { categoryServiceApi } from "@/features/category/services/category";
import type {
  CreateCategoryRequestDto,
  ICategoryDto,
  UpdateCategoryRequestDto,
} from "@/features/category/types/category.dto";
import type { CategoryModel } from "@/features/category/types/category.model";

const normalizeCategory = (dto: ICategoryDto): CategoryModel => ({
  id: String(dto.id ?? ""),
  name: String(dto.name ?? ""),
  isActive: dto.isActive ?? true,
  sortOrder: dto.sortOrder ?? 0,
  createdAt: String(dto.createdAt ?? ""),
  updatedAt: String(dto.updatedAt ?? ""),
});

const extractCategoryList = (payload: unknown): ICategoryDto[] => {
  return Array.isArray(payload) ? (payload as ICategoryDto[]) : [];
};

export const useCategoryService = () => {
  const queryClient = useQueryClient();
  const storeId = useAppSelector((state) => state.currentStore.storeId) ?? undefined;

  const categoriesQuery = useQuery({
    queryKey: ["categories", storeId],
    queryFn: () => categoryServiceApi.getByStoreId(storeId as string),
    enabled: !!storeId,
    select: (response): CategoryModel[] => {
      const list = extractCategoryList(response.data.data);
      return list
        .map(normalizeCategory)
        .filter((category) => category.id.length > 0 && category.name.length > 0)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: Omit<CreateCategoryRequestDto, "storeId">) =>
      categoryServiceApi.create({
        ...data,
        storeId: storeId as string,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", storeId] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateCategoryRequestDto;
    }) => categoryServiceApi.update(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", storeId] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: string) => categoryServiceApi.delete(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", storeId] });
    },
  });

  return {
    categoriesQuery: categoriesQuery.data ?? [],
    categoriesQueryLoading: categoriesQuery.isLoading,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  };
};
