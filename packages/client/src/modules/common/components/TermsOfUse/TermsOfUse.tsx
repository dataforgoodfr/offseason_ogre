import { useTranslation } from "../../../translations/useTranslation";
import { TERMS_OF_USE_URL } from "../../constants";

const TermsOfUse = () => {
  const { t } = useTranslation();

  return (
    <a
      className="text-white self-center hover:text-white hover:underline"
      href={TERMS_OF_USE_URL}
      target="_blank"
      rel="noreferrer"
    >
      {t("cta.read-terms-of-use")}
    </a>
  );
};

export default TermsOfUse;
