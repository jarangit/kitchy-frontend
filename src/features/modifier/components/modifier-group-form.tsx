import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { InsetPanel } from "@/shared/components/ui/inset-panel";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { ModifierGroupFormData } from "@/features/modifier/types/modifier.model";

type Props = {
  defaultValues?: ModifierGroupFormData;
  onSubmit: (data: ModifierGroupFormData) => void;
  isSubmitting?: boolean;
  submitLabel: string;
};

const emptyDefaults: ModifierGroupFormData = {
  name: "",
  selectionType: "SINGLE",
  minSelect: 1,
  maxSelect: 1,
};

/** Group fields without any overlay — embed in full pages, not dialogs. */
const ModifierGroupForm = ({
  defaultValues,
  onSubmit: onSubmitProp,
  isSubmitting,
  submitLabel,
}: Props) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ModifierGroupFormData>({
    defaultValues: { ...emptyDefaults, ...defaultValues },
  });

  const selectionType = watch("selectionType");

  useEffect(() => {
    reset({ ...emptyDefaults, ...defaultValues });
  }, [defaultValues, reset]);

  // SINGLE groups can have at most one selection — keep maxSelect in bounds.
  useEffect(() => {
    if (selectionType !== "SINGLE") return;
    const currentMax = Number(watch("maxSelect") ?? 1);
    if (currentMax > 1) {
      setValue("maxSelect", 1, { shouldValidate: true });
    }
  }, [selectionType, setValue, watch]);

  const onSubmit = (data: ModifierGroupFormData) => {
    onSubmitProp({
      name: data.name.trim(),
      selectionType: data.selectionType,
      minSelect: Math.max(0, Number(data.minSelect) || 0),
      maxSelect: Math.max(0, Number(data.maxSelect) || 0),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Input
          id="modifier-group-name"
          label={t("settings.modifiers.groupName")}
          placeholder={t("settings.modifiers.groupNamePlaceholder")}
          error={errors.name?.message}
          {...register("name", {
            required: t("settings.modifiers.groupNameRequired"),
            minLength: {
              value: 2,
              message: t("settings.modifiers.groupNameMin"),
            },
          })}
        />

        <Controller
          name="selectionType"
          control={control}
          render={({ field }) => (
            <Select
              id="modifier-group-type"
              label={t("settings.modifiers.selectionType")}
              options={[
                {
                  value: "SINGLE",
                  label: t("settings.modifiers.typeSingle"),
                },
                {
                  value: "MULTIPLE",
                  label: t("settings.modifiers.typeMultiple"),
                },
              ]}
              value={field.value}
              onChange={(e) => {
                const next = e.target.value as "SINGLE" | "MULTIPLE";
                field.onChange(next);
                // Apply sensible defaults when switching types.
                if (next === "SINGLE") {
                  setValue("minSelect", 1, { shouldValidate: true });
                  setValue("maxSelect", 1, { shouldValidate: true });
                } else {
                  setValue("minSelect", 0, { shouldValidate: true });
                  setValue("maxSelect", 0, { shouldValidate: true });
                }
              }}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="modifier-group-min"
            type="number"
            min="0"
            step="1"
            label={t("settings.modifiers.minSelect")}
            error={errors.minSelect?.message}
            {...register("minSelect", {
              valueAsNumber: true,
              min: {
                value: 0,
                message: t("settings.modifiers.minSelectMin"),
              },
              validate: (value, formValues) => {
                const min = Number(value) || 0;
                const max = Number(formValues.maxSelect) || 0;
                if (min > max) {
                  return t("settings.modifiers.minExceedsMax");
                }
                return true;
              },
            })}
          />
          <Input
            id="modifier-group-max"
            type="number"
            min="0"
            step="1"
            label={t("settings.modifiers.maxSelect")}
            error={errors.maxSelect?.message}
            {...register("maxSelect", {
              valueAsNumber: true,
              min: {
                value: 0,
                message: t("settings.modifiers.maxSelectMin"),
              },
              validate: (value, formValues) => {
                const max = Number(value) || 0;
                const min = Number(formValues.minSelect) || 0;
                if (min > max) {
                  return t("settings.modifiers.minExceedsMax");
                }
                if (formValues.selectionType === "SINGLE" && max > 1) {
                  return t("settings.modifiers.singleMaxExceeded");
                }
                return true;
              },
            })}
          />
        </div>

        <InsetPanel className="text-label leading-5 text-text-secondary">
          {selectionType === "SINGLE"
            ? t("settings.modifiers.singleHint")
            : t("settings.modifiers.multipleHint")}
        </InsetPanel>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ModifierGroupForm;
