import styled from "styled-components";
import * as colors from "@styles/colors";
import { toast } from "react-toastify";
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
  margin-top: 20px;
  font-weight: 700;
  font-size: 60px;
  border: 0ch;
  border-radius: 10px;
  padding: 15px;
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

const CenterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function TopBanner() {
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

        <CenterWrapper>
          <CheckButton
            // style={{ background: "black", color: "white" }}
            onClick={() => {
              toast.warn("NFT 로그인 후 참여 가능합니다.", {
                position: toast.POSITION.TOP_CENTER,
              });
            }}
            // disabled={isCheck}
          >
            NFT 로그인 후 참여 가능합니다
          </CheckButton>
          {/* <DateArea> 완료 - {date}</DateArea> */}
        </CenterWrapper>
        <CenterWrapper> </CenterWrapper>

        <BannerOrderBox>NFT 홀더 이벤트</BannerOrderBox>
      </BannerWrapper>
    </Container>
  );
}

export default TopBanner;
