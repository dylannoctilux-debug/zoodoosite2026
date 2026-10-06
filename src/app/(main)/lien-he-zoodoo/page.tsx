import SubmissionForm from "@/components/Form/SubmissionForm";
import SectionTitle from "@/components/common/SectionTitle";
import MainContainer from "@/components/Containers/MainContainer";
import BG from "@/../public/assets/backgrounds/lien-he-zoodoo/bg.png";
import Icon8 from "@/../public/assets/images/section-icons/icon8.png";
export default function ContactUs() {
  return (
    <div className="flex flex-col pt-28 md:pt-0">
      <MainContainer background={BG.src} className="2xl:py-44 py-26">
        <SectionTitle title="LIÊN HỆ HỢP TÁC" icon={Icon8.src} level="h1" />
        <div className="bg-white p-6 rounded-lg w-full max-w-[700px]">
          <SubmissionForm />
        </div>
      </MainContainer>
    </div>
  );
}
