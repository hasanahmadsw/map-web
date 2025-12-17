"use client";

interface CanProps {
  canDo?: boolean;
  children: React.ReactNode;
}

const Can = ({ canDo, children }: CanProps) => {
  if (!canDo) return null;
  return <>{children}</>;
};

export default Can;
