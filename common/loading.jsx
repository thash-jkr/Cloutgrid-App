import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from "react-native";

const Loader = ({ visible }) => {
  const squares = Array.from({ length: 9 });

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.wrapper}>
          {squares.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.square,
                {
                  transform: [
                    { translateX: getTranslateX(index) },
                    { translateY: getTranslateY(index) },
                  ],
                  opacity: getOpacityAnimation(index),
                },
              ]}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
};

const getTranslateX = (index) => {
  const positions = [-15, 0, 15];
  return positions[index % 3];
};

const getTranslateY = (index) => {
  const positions = [-15, 0, 15];
  return positions[Math.floor(index / 3)];
};

const getOpacityAnimation = (index) => {
  const animation = new Animated.Value(0);
  Animated.loop(
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 675,
        delay: index * 75,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 675,
        delay: index * 75,
        useNativeDriver: true,
      }),
    ])
  ).start();

  return animation;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Darkened background
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
  },
  square: {
    width: 10,
    height: 10,
    backgroundColor: "#ddd",
    position: "absolute",
  },
});

export default Loader;
