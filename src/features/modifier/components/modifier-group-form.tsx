import { LuCircleHelp } from "react-icons/lu";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { InsetPanel } from "@/shared/components/ui/inset-panel";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { ModifierGroupFormData } from "@/features/modifier/types/modifier.model";
import { ModifierStepSection } from "@/features/modifier/components/modifier-step-section";
import { ModifierSelectionCards } from "@/features/modifier/components/modifier-selection-cards";
import {
  presetFromValues,
  presetToValues,
  type SelectionPreset,
} from "@/features/modifier/utils/modifier-group-preset";

interface Props {
  form: UseFormReturn<ModifierGroupFormData>;
}

/** Steps 1–2 of the detail flow: group name + selection preset. */
const ModifierGroupForm = ({ form }: Props) => {
  const { t } = useTranslation();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const selectionType = watch("selectionType");
  const minSelect = watch("minSelect");
  const maxSelect = watch("maxSelect");
  const preset = presetFromValues(selectionType, minSelect, maxSelect);

  const handlePresetChange = (next: SelectionPreset) => {
    const current: ModifierGroupFormData = {
      name: watch("name"),
      selectionType: watch("selectionType"),
      minSelect: Number(watch("minSelect")) || 0,
      maxSelect: Number(watch("maxSelect")) || 0,
    };
    const values = presetToValues(next, current);
    setValue("selectionType", values.selectionType, {
      shouldValidate: true,
    });
    setValue("minSelect", values.minSelect, { shouldValidate: true });
    setValue("maxSelect", values.maxSelect, { shouldValidate: true });
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <ModifierStepSection
        step={1}
        title={t("settings.modifiers.stepGroupInfo")}
      >
        <Input
          id="modifier-group-name"
          label={t("settings.modifiers.groupName")}
          hint={t("settings.modifiers.groupNameHint")}
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
      </ModifierStepSection>

      <ModifierStepSection
        step={2}
        title={
          <span className="inline-flex items-center gap-2">
            {t("settings.modifiers.stepSelectionType")}
            <span title={t("settings.modifiers.selectionTypeHelp")}>
              <LuCircleHelp
                className="h-4 w-4 text-text-tertiary"
                aria-hidden="true"
              />
            </span>
          </span>
        }
      >
        <ModifierSelectionCards value={preset} onChange={handlePresetChange} />
        {preset === "multiple" && (
          <div className="mt-4 space-y-3">
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
              {t("settings.modifiers.multipleHint")}
            </InsetPanel>
          </div>
        )}
        {preset !== "multiple" && (
          <InsetPanel className="mt-4 text-label leading-5 text-text-secondary">
            {t("settings.modifiers.singleHint")}
          </InsetPanel>
        )}
      </ModifierStepSection>
    </div>
  );
};

export default ModifierGroupForm;
