export const topComponentProps = (hasOverlap: boolean) => ({
  clipPath: `polygon(${hasOverlap ? "0" : "-100%"} 0, 100% 0, 100% 500%)`,
  textAlign: hasOverlap ? "right" : "center",
});

export const bottomComponentProps = (hasOverlap: boolean) => ({
  clipPath: `polygon(0 0, ${
    hasOverlap ? "80%" : "100%"
  } 0, 100% 100%, 0% 100%)`,
  textAlign: hasOverlap ? "left" : "center",
});
