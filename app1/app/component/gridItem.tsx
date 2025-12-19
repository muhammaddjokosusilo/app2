import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

type Props = {
  image: any;
  title: string;
};

const { width } = Dimensions.get('window');

export default function GridItem({ image, title }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => router.push('/content/level')}
    >
      <View style={[styles.iconBox, { backgroundColor: "#fff" }]}>
        <View
          style={{
            width: 73,
            height: "70%",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image source={image} />
        </View>
        <Text style={styles.iconLabel}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const CARD_WIDTH = Math.min(311, width - 40);

const styles = StyleSheet.create({
  gridItem: {
    width: (CARD_WIDTH - 24) / 4, // 4 columns with small gap
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 3,
  },
  iconBox: {
    width: 73,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconLabel: {
    color: '#7D7D7D',
    fontSize: 11,
    textAlign: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
})