# ZooDoo website

Domain chính: **https://zoodoo.vn**. Frontend giữ trên **Vercel**. Bản sửa audit đi qua **feature → staging → main**.

## Bản sửa và trạng thái triển khai

Xem [đối chiếu 28 phát hiện](docs/REMEDIATION.md). Mã nguồn có API riêng, session/quyền phía server, lưu hồ sơ/CV và hàng đợi email. **Chưa chuyển production sang kiến trúc mới**. Trước khi merge staging → main phải dựng và kiểm chứng API private, MongoDB replica set, volume, secrets, CMS và SMTP staging. Không dùng database production cho preview.

Quy định được giữ theo xác nhận của chủ dự án: đặt trước **18 giờ**, suất bắt đầu mỗi giờ **09:00–16:00**, thời lượng **90 phút**, giờ **Asia/Ho_Chi_Minh**, nhân viên xác nhận yêu cầu. **Không đặt sức chứa cho mỗi suất**. `BookingPolicy` và `SlotClosure` là dữ liệu trong DB; bootstrap không ghi đè chính sách đã tồn tại. Các giới hạn tần suất gửi và kích thước trường bảo vệ dịch vụ, không phải sức chứa suất.

## Cấu trúc

- `src/`: Next.js frontend và các handler chuyển tiếp. Frontend không có Prisma, URI MongoDB hoặc credentials SMTP.
- `services/api/`: Fastify + Prisma/MongoDB. API kiểm tra service identity và session/quyền riêng cho từng tài nguyên. API là thành phần duy nhất kết nối DB; xử lý email chạy cùng API.
- `shared/`: validation và lịch/múi giờ dùng chung.
- `deploy/`: template Docker Swarm với secrets mã hóa, mạng tách biệt, volume external. API/DB không publish port; frontend container tùy chọn có replicas 0 vì mặc định vẫn dùng Vercel.

## Kiểm tra mã nguồn

Dùng Node 22 (tối thiểu 22.14) và pnpm **10.15.1**:

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm audit --prod
```

CI chạy các test trong container API thử nghiệm với MongoDB trên network internal, không publish port database. Chạy local tự tạo MongoDB replica set với dữ liệu giả; lần đầu tải binary MongoDB 7.0.24. Không đọc DB/CMS/SMTP production. Sau test, DB và thư mục thử nghiệm được dọn. Build không cần gọi CMS; dữ liệu CMS được lấy khi phục vụ request. Thiếu CMS hiển thị trạng thái lỗi có nút thử lại, không giả báo danh sách rỗng.

`pnpm audit --prod` kiểm tra dependency runtime của cả workspace. Báo cáo đầy đủ vẫn có advisory ở `braces` thuộc chuỗi công cụ lint/Tailwind; chưa có bản vá phù hợp trong lần xác minh này. Không xử lý đầu vào người dùng bằng các công cụ build đó. ESLint 10 dùng `@eslint/compat` cho plugin React/import/accessibility của Next hiện còn khai báo peer ESLint 9; lint đã kiểm tra thực tế.

## Cấu hình frontend trên Vercel

Xem `.env.example`; chỉ cấu hình:

- `SITE_URL=https://zoodoo.vn` cho canonical/OG/sitemap.
- `PRIVATE_API_URL`: địa chỉ **private**, kết nối qua hạ tầng mạng riêng.
- `API_SERVICE_TOKEN`: secret riêng dùng chung với API, tối thiểu 32 ký tự ngẫu nhiên.
- `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`: credentials CMS phía server, không dùng `NEXT_PUBLIC_`.

Credentials phải dùng **Sensitive Environment Variables**/secret manager có mã hóa khi lưu, tách staging và production. Không commit `.env`, không đưa giá trị secret vào chat/log. Với container có thể dùng các biến `_FILE` trỏ tới `/run/secrets/...`. Không gán URI DB hoặc SMTP cho frontend; bước build từ chối các credentials này. Production Vercel chỉ được build từ nhánh main.

Vercel Preview sử dụng origin của chính deployment cho kiểm tra CSRF; domain canonical không chặn form trên preview. Preview và staging cần token/API/DB/SMTP riêng. Trong Vercel, đặt Production Branch là `main`, branch `staging` là Preview và bật bảo vệ truy cập staging. PR vào staging tạo Preview; URL chỉ được coi là staging đã kiểm chứng khi API private và dữ liệu staging đã kết nối.

**Vercel cần kết nối private tới API.** [Secure Compute](https://vercel.com/docs/networking/secure-compute) là phương án Vercel hỗ trợ private connectivity/VPC peering, thuộc Enterprise. Cần xác nhận hạ tầng/plan hiện có trước khi chọn. Không mở API public để thay thế yêu cầu mạng private; template này không tự mua plan hoặc di chuyển hosting.

## API, DB và volume

Xem `services/api/.env.example` và [hướng dẫn hạ tầng](deploy/README.md). API cần URI MongoDB replica set, volume `/data/uploads`, service secret và SMTP. Credentials cần đọc lại được lưu mã hóa trong secret manager; không lưu file secrets plaintext trên host. Docker Swarm secrets được mã hóa trong Raft và mount trong bộ nhớ của task; khóa/backup secrets quản lý riêng.

User/Booking giữ nguyên collection, ID và tên trường hiện tại. Các collection mới là bổ sung. MongoDB cần replica set để transaction ghi yêu cầu + sự kiện email cùng nhau. Không bật `--accept-data-loss` và không chạy schema tự động khi app khởi động.

Trên API operations container, sau khi có DB staging và backup:

```sh
pnpm --filter @zoodoo/api db:push
pnpm --filter @zoodoo/api setup
pnpm --filter @zoodoo/api setup ten-tai-khoan-da-ton-tai@example.com
```

Lệnh cuối cấp quyền cho **một tài khoản hiện có được chỉ định**. Tài khoản cũ mặc định không được tự nâng quyền. `setup` không tạo tài khoản/mật khẩu, không xóa booking, không đổi chính sách DB đã tồn tại. Mật khẩu người dùng giữ hash bcrypt tương thích; tài khoản bị xóa, thiếu quyền hoặc session bị thu hồi bị từ chối. Phiên cũ trước bản sửa không tương thích và phải đăng nhập lại.

## Hồ sơ, upload và email

CV nhận PDF/.docx, tối đa 5 MiB. Frontend tải từng phần 2 MiB, dưới giới hạn request Vercel; API kiểm tra chủ sở hữu, byte thực tế, kích thước và định dạng. File có ID ngẫu nhiên, nằm trên volume private; metadata trong DB. Chỉ tài khoản có `file:read` tải được, qua frontend → API; không có URL public cho CV.

`/admin/ho-so` đọc contact/hồ sơ có phân trang. `/admin/email` hiển thị các thư đang chờ/thất bại/chưa rõ kết quả. Quyền `contact:read`, `file:read`, `outbox:read` và `outbox:retry` độc lập. Có thể cấp quyền tối thiểu khác nhau qua quản trị DB trong API operations; không chỉnh quyền ở trình duyệt.

Nhận yêu cầu thành công nghĩa là record đã lưu DB, **không đồng nghĩa email đã gửi hoặc vé đã được xác nhận**. Worker đọc outbox từ DB, retry lỗi chắc chắn chưa gửi tối đa 6 lần. Timeout/socket/partial delivery hoặc worker dừng giữa lúc gửi chuyển `UNKNOWN`; đối soát log SMTP trước khi nhân viên chọn gửi lại. Không hứa SMTP gửi đúng một lần. Request key tránh tạo trùng trong cùng phiên khách (2 giờ); sau khi thành công giữ mã tiếp nhận để đối soát.

Upload tạm hết hạn sau 2 giờ và được API dọn cùng metadata. Hồ sơ đã tiếp nhận không tự xóa khi mail lỗi. Chưa đặt lịch xóa CV/hồ sơ vì thời hạn lưu chưa được chủ dự án xác nhận; vận hành cần chốt retention phù hợp rồi thực hiện qua API operations, backup và audit.

## Git và release

CI `Verify` chạy lint/typecheck/test/build/audit runtime. `Merge policy` từ chối PR vào `main` trừ nguồn `staging` trong chính repository. Nhánh main/staging phải bật required checks, yêu cầu PR, không force-push/xóa. Không merge trực tiếp feature → main.

Trước staging → main: kiểm tra form booking → nhân viên xác nhận → email, liên hệ, CV đủ 5 MiB, tài khoản thiếu quyền/đã xóa, CMS thật và sitemap, preview origin, drag/drop bị từ chối có rollback. Xác minh firewall không public API/DB, chỉ API truy cập DB, restart/recreate giữ đủ DB+CV và diễn tập restore.

Backup cần snapshot DB **và** volume CV nhất quán; quiesce ghi trước snapshot. Backup phải lưu bền vững và mã hóa, không đặt cùng container hoặc cùng failure domain duy nhất. Restore thử sang môi trường riêng, đối chiếu số record/file và trạng thái outbox. Với restore về thời điểm cũ, đối soát các email đã gửi sau snapshot trước khi bật worker, tránh phát lại.

Rollback ưu tiên bản frontend/API trước có khả năng đọc schema mới, giữ volume và collections đã tiếp nhận. Không rollback về bản cũ thiếu auth, không xóa schema/volume để khôi phục ứng dụng. Nếu API chưa sẵn sàng, giữ production hiện tại và PR ở draft thay vì đưa luồng booking mới thiếu backend lên main.
