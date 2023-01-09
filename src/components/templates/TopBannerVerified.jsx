import styled from "styled-components";
import * as colors from "@styles/colors";
import { useState } from "react";

const Container = styled.div`
  width: 100%;
  margin-top: 64px;
  height: 400px;
  padding: 20px;
`;

const BannerWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${colors.textYellow};
  position: relative;
`;

const TopLeftTriangle = styled.div`
  width: 0px;
  height: 0px;
  border-top: 61px solid ${colors.bgPrimary};
  border-right: 61px solid transparent;
  position: absolute;
  top: -1px;
  left: -1px;
`;

const BottomRightTriangle = styled.div`
  width: 0px;
  height: 0px;
  border-bottom: 60px solid ${colors.bgPrimary};
  border-left: 60px solid transparent;
  bottom: -1px;
  right: -1px;
  position: absolute;
  line-height: 0px;
`;

const BannerOrderBox = styled.div`
  width: 200px;
  height: 45px;
  background-color: ${colors.bgBannerButton};
  border-radius: 6px;
  position: absolute;
  left: 16px;
  bottom: 16px;
  font-size: 24px;
  color: ${colors.textSecondary};
  color: white;
  font-weight: 600;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentDiv = styled.div`
  padding-top: 70px;
  padding-left: 100px;
  color: black;
  font-size: 50px;
`;

const CheckButton = styled.button`
  display: flex;
  background-color: white;
  color: black;
  font-weight: 700;
  font-size: 70px;
  border: 0ch;
  border-radius: 15px;
  margin: 15px;
  padding: 8px;
  box-shadow: 0px 0px 10px 5px;
  cursor: pointer;
`;

const DateArea = styled.div`
  display: block;
  margin-bottom: 10px;
  color: black;
  font-weight: 800;
  font-size: 40px;
`;
const CheckArea = styled.div`
  background-color: transparent;
  color: black;
  font-weight: 800;
  font-size: 30px;
`;

const CenterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleSpan = styled.span`
  font-weight: 700;
`;

function TopBannerVerified(user) {
  const [isCheck, setIsCheck] = useState(false);
  const [count, setCount] = useState(9);
  const [date, setDate] = useState("");

  return (
    <Container>
      <BannerWrapper>
        <TopLeftTriangle />
        <BottomRightTriangle />

        <ContentDiv></ContentDiv>
        <CenterWrapper>
          {" "}
          <DateArea>[NFT 홀더전용 이벤트]</DateArea>
        </CenterWrapper>
        {isCheck ? (
          <>
            <CenterWrapper>
              <CheckButton
                style={{ background: "black", color: "white" }}
                onClick={() => {
                  // setIsCheck(false);
                  // setCount(count - 1);
                }}
                disabled
              >
                출석완료
              </CheckButton>
              {/* <DateArea> 완료 - {date}</DateArea> */}
            </CenterWrapper>
            <CenterWrapper>
              {" "}
              <CheckArea style={{ marginTop: "10px" }}>
                <TitleSpan style={{ color: "Blue" }}>{count}</TitleSpan>일째
                출석중
              </CheckArea>
            </CenterWrapper>
          </>
        ) : (
          <>
            <CenterWrapper>
              <CheckButton
                onClick={() => {
                  if (!window.confirm("출석체크 하시겠습니까?")) {
                  } else {
                    setIsCheck(true);
                    setCount(count + 1);
                    setDate(new Date().toLocaleString());
                    alert(
                      new Date().toLocaleString() +
                        "\n출석체크가 완료되었습니다."
                    );
                  }
                }}
              >
                출석체크
              </CheckButton>
            </CenterWrapper>
            <CenterWrapper>
              <CheckArea style={{ marginTop: "10px" }}>
                <TitleSpan style={{ color: "red" }}>{count}</TitleSpan>일째
                출석중
              </CheckArea>
            </CenterWrapper>
          </>
        )}

        <BannerOrderBox>NFT 홀더 이벤트</BannerOrderBox>
      </BannerWrapper>
    </Container>
  );
}

export default TopBannerVerified;
