import { View, Text } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";

const Triangle = ({ size, color, filled }) => {
  const height = (Math.sqrt(3) / 2) * size;

  const offset = 3 / 2;

  const pathData = `
    M ${size / 2},${offset}
    L ${offset},${height - offset}
    L ${size - offset},${height - offset}
    Z
  `;

  return (
    <View>
      <Svg height={height} width={size}>
        <Path
          d={pathData}
          fill={filled ? color : "none"}
          stroke={filled ? color : "#000"}
          strokeWidth={3}
        />
      </Svg>
    </View>
  );
};

export default Triangle;
