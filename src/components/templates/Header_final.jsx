import styled from "styled-components";
import SearchIcon from "@components/atoms/SearchIcon";
import Logo from "@components/atoms/Logo";
import HamburgerIcon from "@components/atoms/HamburgerIcon";
import * as colors from "@styles/colors";
import Wallet from "@components/atoms/Wallet";
import kaikasImageUrl from "@assets/image/kaikas.png";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import Caver from "caver-js";
import axios from "axios";

const Container = styled.header`
  width: 100%;
  height: 64px;
  background-color: ${colors.bgBlack};
  position: fixed;
  top: 0px;
  display: flex;
  padding: 0px 16px;
  align-items: center;
  z-index: 999;
`;

const LogoWrapper = styled.div`
  margin-right: 16px;
  display: flex;
  align-items: center;
`;

const SearchBarWrapper = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  align-items: center;
  border-left-width: 1px;
  border-color: hsla(0, 0%, 100%, 0.12);
  border-style: solid;
`;

const GrayRoundBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${colors.bgSecondary};
`;

const WalletBox = styled(GrayRoundBox)`
  background-color: ${colors.textYellow};
  margin-right: 8px;
  cursor: pointer;
`;

const SearchIconWrapper = styled.div`
  margin-left: 16px;
`;

const KaikasImage = styled.img`
  width: 20px;
  height: 20px;
`;

const klaytn = window.klaytn;

async function isKaikasAvailable() {
  const klaytn = window?.klaytn;
  if (!klaytn) {
    return false;
  }

  const results = await Promise.all([
    klaytn._kaikas.isApproved(),
    klaytn._kaikas.isEnabled(),
    klaytn._kaikas.isUnlocked(),
  ]);

  return results.every((res) => res);
}

function Header() {
  const { user, setUser } = useAuth();

  // 1. 카이카스 로그인
  async function loginWithKaikas() {
    if (!klaytn) {
      toast.error("kaikas 설치 해주세요!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    // 1. connect
    // 2. sign
    // 3. NFT login

    try {
      const accounts = await toast.promise(
        klaytn.enable(),
        {
          pending: "Kaikas 지갑 연동 중",
        },
        { closeButton: true }
      );

      // 서명
      signWithKaikas();
    } catch {
      toast.error("로그인 실패..! 다시 시도해주세요~^^");
    }
  }

  // 2. 서명기능
  async function signWithKaikas() {
    // caver필요
    const caver = new Caver(window.klaytn);
    const contractAddress = "0x8fd2387871ACA7fA628643296Fd4f5Aae4c5c313";
    const message = "sign";

    let signObj;
    try {
      signObj = await caver.klay.sign(message, window.klaytn.selectedAddress);

      toast.success(signObj);

      verifyHolder(
        signObj,
        message,
        window.klaytn.selectedAddress, // 현재 지갑주소
        contractAddress,
        window.klaytn.networkVersion, // 현재 네트워크
        "kaikas"
      );
    } catch (error) {
      toast.error(error);
    }
  }

  // 3. NFT 홀더인증 ( fast-dive API )
  async function verifyHolder(
    _signObj, // 서명값
    _message, // 서명메세지
    _ownerAddress, // 지갑주소 (msg.sender)
    _contractAddress, // 조회할 NFT컨트랙트 주소
    _chainId, // 체인아이디 ( klaytn : 8217, ethereum : 1 )
    _walletType // 지갑종류 ( "kaikas" or "metamask")
  ) {
    const header = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "12ad0db3-89e7-4589-9c79-3582b3042b88",
      },
    };

    const url = "https://api.fast-dive.com/api/v1/nft/verifyHolder";

    const params = {
      sign: _signObj,
      signMessage: _message,
      contractAddress: _contractAddress,
      chainId: _chainId,
      walletType: _walletType,
    };

    await axios
      .post(url, params, header)
      .then(function (response) {
        toast.success(response.data.data.balance);
        //response
      })
      .catch(function (e) {
        toast.error(`로그인 실패`);
      });
  }

  // 0. 로그인 버튼 클릭
  function handleLogin() {
    loginWithKaikas();
  }

  async function handleDone() {
    const isAvailable = await isKaikasAvailable();
    if (isAvailable) {
      toast.success("엇 ..또 로그인 하실려구요?!");
      return;
    }

    toast.warn("다시 로그인 해주세요 ^^!");
    setUser("");
    localStorage.removeItem("_user");
  }

  return (
    <Container>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      <SearchBarWrapper>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
      </SearchBarWrapper>
      <WalletBox onClick={user ? handleDone : handleLogin}>
        {user ? <KaikasImage src={kaikasImageUrl} /> : <Wallet />}
      </WalletBox>
      <GrayRoundBox>
        <HamburgerIcon />
      </GrayRoundBox>
    </Container>
  );
}

export default Header;
