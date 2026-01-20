const Separator = ({
  orientation = "horizontal",
  className = "",
  thickness = "1px",
  color = "bg-base-300", // DaisyUI의 기본 경계선 색상 활용
}) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      role="separator"
      className={`${color} ${className} opacity-40`}
      style={{
        width: isHorizontal ? "100%" : thickness,
        height: isHorizontal ? thickness : "100%",
        display: isHorizontal ? "block" : "inline-block",
      }}
    />
  );
};

export default Separator;
