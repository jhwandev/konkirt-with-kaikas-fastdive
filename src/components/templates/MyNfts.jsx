import SectionLayout from "@components/molecules/SectionLayout";
import SectionTop from "@components/molecules/SectionTop";
import MyItems from "@components/organisms/MyItems";

function MyNfts({ user }) {
  return (
    <SectionLayout>
      <SectionTop title="내가 보유한 NFT" showAll="아이템 전체보기" />
      <MyItems metadata={user.result} />
    </SectionLayout>
  );
}

export default MyNfts;
