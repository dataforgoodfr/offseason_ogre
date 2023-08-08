import { useTranslation } from "../../../translations";
import { Button } from "../../../common/components/Button";

export const BackArrow = ({ path }: { path: string }) => {
  const { t } = useTranslation();

  return (
    <Button iconName="arrow-back" to={path}>
      {t("cta.back")}
    </Button>
  );
};

export const BackArrowWithValidation = ({
  handleClickOpen,
}: {
  handleClickOpen: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <Button iconName="arrow-back" onClick={() => handleClickOpen()}>
      {t("cta.back")}
    </Button>
  );
};
