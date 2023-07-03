import { useMemo } from "react";
import { Icon } from "../Icon";
import { Tag } from "../Tag";

export { TagNumber };

function TagNumber({
  value,
  successDirection = "increase",
  formatter,
}: {
  value: number;
  successDirection?: "increase" | "decrease";
  formatter: (nb: number) => string;
}) {
  const tagType = useMemo(() => {
    const directionFactor = successDirection === "increase" ? 1 : -1;
    if (value * directionFactor > 0) {
      return "success";
    }
    if (value * directionFactor < 0) {
      return "error";
    }
    return "secondary";
  }, [successDirection, value]);

  const icon = useMemo(() => {
    if (value > 0) {
      return (
        <Icon name="number-increase" sx={{ width: "1rem", height: "1rem" }} />
      );
    }
    if (value < 0) {
      return (
        <Icon name="number-decrease" sx={{ width: "1rem", height: "1rem" }} />
      );
    }
    return "•";
  }, [value]);

  const sign = useMemo(() => {
    if (value > 0) {
      return "+";
    }
    if (value < 0) {
      return "-";
    }
    return "";
  }, [value]);

  return (
    <Tag type={tagType} icon={icon}>
      {sign}
      {formatter(Math.abs(value))}
    </Tag>
  );
}
