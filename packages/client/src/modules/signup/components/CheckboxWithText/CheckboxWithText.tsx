import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import { Controller } from "react-hook-form";
import TermsOfUse from "../../../common/components/TermsOfUse";

const CheckboxWithText = ({ control }: { control: any }) => {
  return (
    <div className="flex items-center">
      <Controller
        control={control}
        name="policies"
        render={({ field }) => (
          <CustomCheckbox {...field} {...label} required />
        )}
      />
      <p className="w-60 mb-4 mt-4">
        En cochant cette case, je certifie avoir lu et accepté sans réserve les{" "}
        <TermsOfUse text="conditions générales d'utilisation" />
      </p>
    </div>
  );
};

const CustomCheckbox = styled(Checkbox)(() => ({
  path: {
    color: "#C4C4C4",
  },
}));

const label = { inputProps: { "aria-label": "Checkbox policies" } };

export default CheckboxWithText;
