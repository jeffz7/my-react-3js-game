import { ReactNode } from "react";
import { Group } from "three";

export interface VehicleModelProps {
  color?: string;
  wheelRefs?: React.MutableRefObject<Group[]>;
  children?: ReactNode;
}

export default function VehicleModel({
  color = "red",
  wheelRefs,
  children,
}: VehicleModelProps) {
  return <group>{children}</group>;
}
