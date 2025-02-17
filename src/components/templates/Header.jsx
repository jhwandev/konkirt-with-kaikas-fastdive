import { useState, useEffect } from "react";
import styled from "styled-components";
import * as colors from "@styles/colors";
import useAuth from "@hooks/useAuth";
import axios from "axios";
// atoms
import Logo from "@components/atoms/Logo";
import SearchIcon from "@components/atoms/SearchIcon";
import HamburgerIcon from "@components/atoms/HamburgerIcon";
// molecules
import WalletModal from "@components/molecules/WalletModal";
import WalletBox from "@components/molecules/WalletBox";
import ProfileModal from "@components/molecules/ProfileModal";
// imageUrls
import metamaskImageUrl from "@assets/image/metamask.png";
import kaikasImageUrl from "@assets/image/kaikas.png";
import klipImageUrl from "@assets/image/klip.png";
// toast
import { toast } from "react-toastify";
// web3
import Caver from "caver-js";
import { v4 } from "uuid";

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
  margin-left: 7px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${colors.bgSecondary};
`;

const SearchIconWrapper = styled.div`
  margin-left: 16px;
`;

function Header() {
  const { user, setUser } = useAuth();
  // const { test, setTest } = useTest();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenLoadingModal, setIsOpenLoadingModal] = useState(false);
  const [isOpenProfileModal, setIsOpenProfileModal] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState("");
  const [isFirst, setIsFirst] = useState(true);
  const { klaytn, ethereum } = window;

  /**
   * 프로필 모달 조회시 스크롤 고정 해제
   */
  useEffect(() => {
    if (isOpenProfileModal) {
      document.querySelector("body").style.overflow = "auto";
      document.querySelector("body").style.paddingRight = "";
    }
  }, [isOpenProfileModal]);

  /**
   * 프로필 사진 변경 감지 (myItem.jsx)
   */
  useEffect(() => {
    if (user.imageUrl) {
      if (isFirst) {
        setIsFirst(false);
      } else {
        toast.success("프로필사진이 변경되었습니다.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
      setIsOpenProfileModal(true);
    }
  }, [user.imageUrl]);

  /**
   * 0. 카이카스 로그인 버튼
   */
  async function loginWithKaikas() {
    var isConnected = await connectWithKaikas();
    //connect완료 될 경우 sign진행
    if (isConnected) {
      await signWithKaikas();
    }
  }

  /**
   * 1. 카이카스 <-> 웹사이트 connect 확인
   * @returns bool
   */
  async function connectWithKaikas() {
    if (!klaytn) {
      toast.error("kaikas 설치 해주세요!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }

    setLoadingTitle("연결중...");
    setIsOpenModal(false);
    setIsOpenLoadingModal(true);

    try {
      await toast.promise(
        klaytn.enable(),
        {
          pending: "Kaikas 지갑 연동 중",
        },
        { position: toast.POSITION.TOP_CENTER },
        { closeButton: true }
      );

      setIsOpenLoadingModal(false);
      setIsOpenModal(true);

      return true;
    } catch (e) {
      toast.error("로그인 실패..! 다시 시도해주세요~^^", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
  }

  /**
   * 2. 카이카스 서명
   */
  async function signWithKaikas() {
    setLoadingTitle("NFT 확인중...");
    setIsOpenModal(false);
    setIsOpenLoadingModal(true);

    const caver = new Caver(window.klaytn);
    const contractAddress = "0x8fd2387871ACA7fA628643296Fd4f5Aae4c5c313"; //testnet puu
    const chainId = "1001"; //klaytn Mainnet
    const message =
      "[ NFT HOLDER VERIFY ]  \n contract address : " +
      contractAddress +
      "\n\n Powered by fast-dive";

    // 지갑 네트워크와 조회하려는 NFT의 네트워크가 같은지 체크
    if (String(window.klaytn.networkVersion) !== chainId) {
      toast.warn(
        `네트워크를 바오밥 테스트넷 (1001) 으로 변경해주세요. 현재 network : ${window.klaytn.networkVersion}`,
        { position: toast.POSITION.BOTTOM_CENTER }
      );
      setIsOpenLoadingModal(false);
      return;
    }

    let signObj;

    try {
      signObj = await toast.promise(
        caver.klay.sign(message, window.klaytn.selectedAddress),
        {
          pending: "NFT 확인중...",
        },
        { closeButton: true, position: toast.POSITION.TOP_CENTER }
      );

      // fastdive API =======================================================
      const apiKey = "12ad0db3-89e7-4589-9c79-3582b3042b88";
      const result2 = await verifyHolder2(
        apiKey, // API키
        signObj, // 서명값
        message, // 서명메세지
        contractAddress, // NFT 컨트랙트주소
        chainId, //체인아이디
        "kaikas", //지갑종류
        false // 보유개수만 조회할지 여부 (true일경우 개수만)
      );

      //조회결과
      const data = result2.data.data;
      console.log("조회결과 확인: " + data);
      console.log("개수조회: " + data.balance);
      // =====================================================================

      //조회 후처리
      setDataAfterVerifyHolder(
        result2,
        window.klaytn.selectedAddress,
        "kaikas"
      );

      setIsOpenLoadingModal(false);
    } catch (e) {
      toast.error("로그인 실패..! 다시 시도해주세요~^^", {
        position: toast.POSITION.BOTTOM_CENTER,
      });

      setIsOpenModal(true);
      setIsOpenLoadingModal(false);
      return;
    }
  }

  /**
   * 0. 메타마스크 로그인 버튼
   * @returns
   */
  async function loginWithMetamask() {
    var isConnected = await connectWithMetamask();
    //connect완료 될 경우 sign진행
    if (isConnected) {
      await signWithMetamask();
    } else {
      return false;
    }
  }

  /**
   * 1. 메타마스크 <-> 웹사이트 connect 확인
   * @returns bool
   */
  async function connectWithMetamask() {
    if (typeof window.ethereum !== "undefined") {
    } else {
      toast.error("Metamask 설치 해주세요!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return false;
    }

    setIsOpenModal(false);
    setLoadingTitle("연결중...");
    setIsOpenLoadingModal(true);

    try {
      await ethereum.request({
        method: "eth_requestAccounts",
      });

      setIsOpenLoadingModal(false);
      setIsOpenModal(true);
      return true;
    } catch (e) {
      toast.error("로그인 실패..! 다시 시도해주세요~^^", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return false;
    }
  }

  /**
   * 2. 메타마스크 서명
   */
  async function signWithMetamask() {
    setLoadingTitle("NFT 확인중...");
    setIsOpenModal(false);
    setIsOpenLoadingModal(true);

    const contractAddress = "0x8fd2387871ACA7fA628643296Fd4f5Aae4c5c313"; // 테스트용 NFT 1001
    // const contractAddress = "0xd643bb39f81ff9079436f726d2ed27abc547cb38"; // 푸빌라 8217

    const chainId = "1001"; //klaytn testnet
    const message =
      "[ NFT HOLDER VERIFY ]  \n contract address : " +
      contractAddress +
      "\n\n Powered by fast-dive";

    // 지갑 네트워크와 조회하려는 NFT의 네트워크가 같은지 체크
    if (String(window.ethereum.networkVersion) !== chainId) {
      toast.warn(
        `네트워크를 바오밥 테스트넷 (1001) 으로 변경해주세요. 현재 network : ${window.ethereum.networkVersion}`,
        { position: toast.POSITION.BOTTOM_CENTER }
      );
      setIsOpenLoadingModal(false);
      return;
    }

    let signObj;

    try {
      signObj = await toast.promise(
        window.ethereum.request({
          method: "personal_sign",
          params: [message, window.ethereum.selectedAddress, v4()],
        }),
        {
          pending: "보유한 NFT 확인중...",
        },
        { closeButton: true }
      );

      // 홀더인증 API (fastdive)

      // fastdive API =======================================================
      const apiKey = "12ad0db3-89e7-4589-9c79-3582b3042b88";
      const result2 = await verifyHolder2(
        apiKey, // API키
        signObj, // 서명값
        message, // 서명메세지
        contractAddress, // NFT 컨트랙트주소
        chainId, //체인아이디
        "metamask", //지갑종류
        false // 보유개수만 조회할지 여부 (true일경우 개수만)
      );

      //조회결과
      const data = result2.data.data;
      console.log("조회결과 확인: " + data);
      console.log("개수조회: " + data.balance);
      // =====================================================================

      //조회 후처리
      setDataAfterVerifyHolder(
        result2,
        window.ethereum.selectedAddress,
        "metamask"
      );

      setIsOpenLoadingModal(false);
    } catch (e) {
      toast.error("로그인 실패..! 다시 시도해주세요~^^", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      setIsOpenModal(true);
      setIsOpenLoadingModal(false);
      return;
    }
  }

  /**
   * 로그인 Modal Open
   */
  function handleLogin() {
    setIsOpenModal(true);
  }

  /**
   * 로그인 완료되었을경우 활성화되는 버튼
   * 클릭 시 로그아웃
   * @returns
   */
  async function handleDone() {
    // profile 모달 오픈
    setIsOpenProfileModal(true);
  }

  /**
   * logout
   */
  async function logout() {
    setUser("");
    // localStorage.removeItem("_user");
    // localStorage.removeItem("_wallet");
    setIsOpenProfileModal(false);
    setIsFirst(true);
    toast.success("로그아웃 되었습니다", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }

  /**
   * TODO : klip Login
   */
  async function loginWithKlip() {
    toast.warn("Klip로그인 개발중", { position: toast.POSITION.BOTTOM_CENTER });
  }

  /**
   * fastdive API 호출 - verifyHolder
   *
   * @param {*} _signObj
   * @param {*} _message
   * @param {*} _ownerAddress
   * @param {*} _contractAddress
   * @param {*} _chainId
   * @param {*} _walletType
   */
  async function verifyHolder(
    _signObj,
    _message,
    _ownerAddress,
    _contractAddress,
    _chainId,
    _walletType
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
      // onlyBalance: true,
    };

    await axios
      .post(url, params, header)
      .then(function (response) {
        const data = response.data.data;
        setIsOpenLoadingModal(false);

        //로그인 요청지갑과 복호화 한 지갑 확인
        if (_ownerAddress.toUpperCase() !== data.ownerAddress.toUpperCase()) {
          toast.error("지갑주소가 일치하지 않습니다.", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          return;
        }
        // 조건만족시 로그인 처리
        if (data.balance > 0) {
          toast.success(`로그인 완료 (balance : ${data.balance})`, {
            position: toast.POSITION.BOTTOM_CENTER,
          });

          setUser({ account: _ownerAddress, wallet: _walletType });
          // localStorage.setItem("_user", _ownerAddress);
          // localStorage.setItem("_wallet", _walletType);

          // 메타데이터 조회시 첫번째 NFT 이미지Url 저장
          if (data.onlyBalance === false && data.result[0].metadata.image) {
            setUser({
              account: _ownerAddress,
              wallet: _walletType,
              imageUrl: data.result[0].metadata.image,
              result: data.result,
            });
            // localStorage.setItem("_imageUrl", data.result[0].metadata.image);
          }
        } else {
          toast.error(
            "해당지갑에 NFT를 보유하고 있지 않습니다. 지갑주소를 확인해주세요.",
            {
              position: toast.POSITION.BOTTOM_CENTER,
            }
          );
        }
      })
      .catch(function (e) {
        toast.error(`로그인 실패`, { position: toast.POSITION.BOTTOM_CENTER });
        setIsOpenModal(true);
      });
  }

  /**
   * verifyHolder 2
   * @param {*} apiKey
   * @param {*} signObj
   * @param {*} message
   * @param {*} contractAddress
   * @param {*} chainId
   * @param {*} walletType
   * @param {*} onlyBalance
   * @returns
   */
  async function verifyHolder2(
    apiKey,
    signObj,
    message,
    contractAddress,
    chainId,
    walletType,
    onlyBalance
  ) {
    const header = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    };

    const url = "https://api.fast-dive.com/api/v1/nft/verifyHolder";

    const params = {
      sign: signObj,
      signMessage: message,
      contractAddress: contractAddress,
      chainId: chainId,
      walletType: walletType,
      onlyBalance: onlyBalance,
    };

    return await axios.post(url, params, header);
  }

  /**
   * nft verify Holder 후처리
   * @param {*} result
   * @param {*} ownerAddress
   * @param {*} walletType
   * @returns
   */
  function setDataAfterVerifyHolder(result, ownerAddress, walletType) {
    const data = result.data.data;
    //로그인 요청지갑과 복호화 한 지갑 확인
    if (ownerAddress.toUpperCase() !== data.ownerAddress.toUpperCase()) {
      debugger;
      toast.error("지갑주소가 일치하지 않습니다.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    // 조건만족시 로그인 처리
    if (data.balance > 0) {
      toast.success(`로그인 완료 (balance : ${data.balance})`, {
        position: toast.POSITION.BOTTOM_CENTER,
      });

      setUser({ account: ownerAddress, wallet: walletType });

      // 메타데이터 조회시 첫번째 NFT 이미지Url 저장
      if (data.onlyBalance === false && data.result[0].metadata.image) {
        setUser({
          account: ownerAddress,
          wallet: walletType,
          imageUrl: data.result[0].metadata.image,
          result: data.result,
        });
      }
    } else {
      toast.error(
        "해당지갑에 NFT를 보유하고 있지 않습니다. 지갑주소를 확인해주세요.",
        {
          position: toast.POSITION.BOTTOM_CENTER,
        }
      );
    }
  }

  /**
   * 지갑로그인 모달창에 들어갈 버튼들
   */
  const walletButtons = [
    {
      id: 1,
      name: "Kaikas",
      func: loginWithKaikas,
      img: kaikasImageUrl,
      imgHeight: 22,
      alt: "kaikas",
    },
    {
      id: 2,
      name: "Metamask",
      func: loginWithMetamask,
      img: metamaskImageUrl,
      imgHeight: 24,
      alt: "metamask",
    },
    {
      id: 3,
      name: "Klip",
      func: loginWithKlip,
      img: klipImageUrl,
      imgHeight: 20,
      alt: "klip",
    },
  ];

  return (
    <Container>
      <WalletModal
        title="NFT 로그인"
        walletButtons={walletButtons}
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
      <ProfileModal
        user={user}
        logout={logout}
        isOpenModal={isOpenProfileModal}
        setIsOpenModal={setIsOpenProfileModal}
      />
      {/* 로딩시 보여줄 모달, 필요시 사용*/}
      <WalletModal
        title={loadingTitle}
        isLoading={true}
        isOpenModal={isOpenLoadingModal}
        setIsOpenModal={setIsOpenLoadingModal}
      />
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      <SearchBarWrapper>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
      </SearchBarWrapper>
      {user ? (
        <div style={{ color: "yellow" }}>
          NFT 홀더인증 완료&nbsp;&nbsp;&nbsp;
        </div>
      ) : (
        ""
      )}
      <WalletBox
        user={user}
        handleDone={handleDone}
        handleLogin={handleLogin}
      />
      <GrayRoundBox>
        <HamburgerIcon />
      </GrayRoundBox>
    </Container>
  );
}

export default Header;
