import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "./components";
import * as React from "react";

interface BookingConfirmEmailProps {
  preview: string;
  time: string;
  adults: number | string;
  kids: number | string;
  validationCode?: string;
}

export const BookingConfirmEmail = ({
  preview,
  time,
  adults,
  kids,
  validationCode,
}: BookingConfirmEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>{preview}</Preview>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://app.cal.com/emails/checkCircle@2x.png"
            width="70"
            height="70"
            alt="ZooDoo"
          />
        </Section>
        <Heading style={h1}>Lịch hẹn</Heading>

        <Text style={heroText}>Lịch hẹn của bạn đã được xác nhận</Text>

        <Section style={codeBox}>
          <Text style={confirmationCodeText}>{validationCode}</Text>
        </Section>

        <Text style={text}>
          <strong>Thời gian:</strong> {time}
        </Text>

        <Text style={text}>
          <strong>Địa điểm: </strong> ZooDoo, tiểu khu 94A, xã Đạ Nhim, huyện
          Lạc Dương, tỉnh Lâm Đồng
        </Text>

        <Text style={text}>
          <strong>Số điện thoại (Phone): </strong> 0979 11 00 07
        </Text>

        <Text style={text}>
          <strong>Người lớn (Number of adults): </strong> {adults}
        </Text>

        <Text style={text}>
          <strong>Bạn nhỏ (Number of kids): </strong> {kids}
        </Text>

        <Text style={text}>
          <strong>Chú ý:</strong>
        </Text>
        <Text>
          Quý khách vui lòng kiểm tra phần số điện thoại để ZooDoo có thể liên
          lạc với mình một cách nhanh nhất.
          <br /> *Hình thức tham quan:
          <br /> Tham quan vườn thú sẽ được thực hiện bằng cách đi bộ và có sự
          hướng dẫn từ zookeeper. Thời gian trung bình mỗi chuyến tham quan là
          từ 90 đến 105 phút. Quý khách theo dõi hướng dẫn của zookeeper và tuân
          thủ nội quy và các quy tắc an toàn được thông báo.
          <br /> *Đặt vé trước:
          <br />
          Để đảm bảo chỗ tham quan, quý khách nên đặt vé trước khi đến vườn thú.
          Việc này giúp đảm bảo rằng số lượng khách tham quan trong mỗi chuyến
          được kiểm soát và giới hạn.
          <br /> *Không mang thú cưng:
          <br /> Vì lý do an toàn và y tế, vui lòng không mang thú cưng vào khu
          vực ZooDoo. Điều này nhằm đảm bảo an toàn cho cả động vật trong vườn
          thú và các thú cưng của khách hàng.
        </Text>

        <Section style={{ padding: "15px 0px" }}>
          <Img
            src="https://zoodoo.vn/assets/images/logos/logo-zoodoo-green.png"
            width="91"
            height="70"
            alt="Slack"
          />
        </Section>

        <Section>
          <Link
            style={footerLink}
            href="https://zoodoo.vn/tin-tuc-va-hoat-dong"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tin tức hoạt động
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link
            style={footerLink}
            href="https://zoodoo.vn/ve-zoodoo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Về chúng tôi
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link
            style={footerLink}
            href="https://zoodoo.vn/ghe-tham-zoodoo"
            target="_blank"
            rel="noopener noreferrer"
            data-auth="NotApplicable"
            data-linkindex="6"
          >
            Ghé Thăm ZooDoo
          </Link>
          <Text style={footerText}>
            ©2024 ZooDoo Dalat. <br />
            Quốc lộ 27C, tiểu khu 94A, Đạ Nhim, Lạc Dương, Lâm Đồng <br />
            <br />
            All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

BookingConfirmEmail.PreviewProps = {
  time: "2024-03-29 14:00",
  adults: 1,
  kids: 0,
  validationCode: "DJZ-TLX",
} as BookingConfirmEmailProps;

export default BookingConfirmEmail;

const footerText = {
  fontSize: "12px",
  color: "#b7b7b7",
  lineHeight: "15px",
  textAlign: "left" as const,
  marginBottom: "50px",
};

const footerLink = {
  color: "#b7b7b7",
  textDecoration: "underline",
};

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "0px 20px",
};

const logoContainer = {
  marginTop: "32px",
  display: "flex",
  justifyContent: "center",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "36px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const heroText = {
  fontSize: "20px",
  lineHeight: "28px",
  marginBottom: "30px",
};

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginBottom: "30px",
  padding: "20px 10px",
};

const confirmationCodeText = {
  fontSize: "24px",
  textAlign: "center" as const,
  verticalAlign: "middle",
};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px",
};
