import styled from "styled-components";
import * as colors from "@styles/colors";

const CardWrapper = styled.div`
  border-radius: 16px;
  flex-shrink: 0;
  overflow: hidden;
`;

const CardImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
  vertical-align: middle;
`;

const InfoBox = styled.div`
  width: 150px;
  height: 73px;
  padding: 16px;
  background-color: ${colors.bgSecondary};
`;

const CollectionTitle = styled.div`
  font-size: 15px;
  color: ${colors.textYellow};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Title = styled.div`
  font-family: MarkPro-Heavy;
  font-size: 14px;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export default function MyItem({ item }) {
  return (
    <CardWrapper>
      <CardImage src={item.image}></CardImage>
      <InfoBox>
        <CollectionTitle>{item.attributes[0].value}</CollectionTitle>
        <Title>{item.name}</Title>
      </InfoBox>
    </CardWrapper>
  );
}
