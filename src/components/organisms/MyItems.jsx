import React from "react";
import HideScrollX from "@components/molecules/HideScrollX";
import MyItem from "@components/molecules/MyItem";

export default function MyItems({ metadata }) {
  return (
    <HideScrollX>
      {metadata.map((item) => (
        <MyItem item={item.metadata} key={item.metadata.name} />
      ))}
    </HideScrollX>
  );
}
