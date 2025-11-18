import { TextStyle } from "react-native";

interface Typography {
  title: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  small: TextStyle;
}

const typography: Typography = {
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222"
  },
  subtitle: {
    fontSize: 18,
    color: "#444"
  },
  body: {
    fontSize: 16,
    color: "#333"
  },
  small: {
    fontSize: 13,
    color: "#666"
  }
};

export default typography;
