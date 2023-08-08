import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import { Controller } from "react-hook-form";
import { useTranslation } from "../../../translations";
import { TERMS_OF_USE_URL } from "../../../common/constants";

const CheckboxWithText = ({ control }: { control: any }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center">
      <Controller
        control={control}
        name="policies"
        render={({ field }) => (
          <CustomCheckbox {...field} {...label} required />
        )}
      />
      <p
        className="w-60 mb-4 mt-4"
        dangerouslySetInnerHTML={{
          __html: t("page.signup.accept-terms-of-use", {
            termsOfUseUrl: TERMS_OF_USE_URL,
          }),
        }}
      ></p>
    </div>
  );
};

const CustomCheckbox = styled(Checkbox)(() => ({
  path: {
    color: "#C4C4C4",
    fill: "#C4C4C4",
  },
}));

const label = { inputProps: { "aria-label": "Checkbox policies" } };

export default CheckboxWithText;
