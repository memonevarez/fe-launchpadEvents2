// components/SafeImage.js
import React from "react";
import { Image } from "react-native";

/**
 * Renders an <Image> only if `source.uri` is a non-empty string.
 * Otherwise renders null.
 */
export default function SafeImage({ source, style, resizeMode }) {
  const uri = source?.uri;
  if (typeof uri !== "string" || uri.trim() === "") return null;
  return <Image source={{ uri }} style={style} resizeMode={resizeMode} />;
}
