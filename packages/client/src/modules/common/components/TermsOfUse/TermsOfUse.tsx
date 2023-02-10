import { useTranslation } from "../../../translations/useTranslation";
import { TERMS_OF_USE_URL } from "../../constants";
import { Typography } from "../Typography";

const TermsOfUse = ({ text }: { text?: string }) => {
  const { t } = useTranslation();

  return (
    <a
      className="self-center underline"
      href={TERMS_OF_USE_URL}
      target="_blank"
      rel="noreferrer"
    >
      <Typography as="span">{text || t("cta.read-terms-of-use")}</Typography>
    </a>
  );
};

export default TermsOfUse;
