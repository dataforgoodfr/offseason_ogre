import { useState } from "react";
import { Icon } from "../Icon";
import { copyToClipboard } from "./utils";
import { useTranslation } from "../../../translations/useTranslation";
import { SuccessAlert } from "../../../alert";
import { Host } from "./CopyToClipboard.styles";

export { CopyToClipboard };

function CopyToClipboard({
  value = "",
  className,
}: {
  value?: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const [showCopied, setShowCopied] = useState(false);

  const onCopy = async (e: any) => {
    e.stopPropagation();
    await copyToClipboard(value);
    setShowCopied(true);
  };

  return (
    <Host
      className={`${className} flex items-center justify-between`}
      onClick={onCopy}
    >
      {value}
      <Icon
        className="copy-to-clipboard__icon"
        name="copy"
        fontSize="small"
        onClick={onCopy}
      />
      {showCopied && (
        <SuccessAlert
          message={t("message.success.copied")}
          onClose={() => {
            setShowCopied(false);
          }}
        />
      )}
    </Host>
  );
}
