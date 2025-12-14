import React, { CSSProperties } from "react";

interface OptionItemProps {
  optionKey: string;
  text: string;
  style: CSSProperties;
  onClick: () => void;
}

const OptionItem: React.FC<OptionItemProps> = ({
  optionKey,
  text,
  style,
  onClick,
}) => {
  return (
    <div onClick={onClick} style={style}>
      <strong>{optionKey}.</strong> {text}
    </div>
  );
};

export default OptionItem;
