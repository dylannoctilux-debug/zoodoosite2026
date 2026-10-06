# Chuẩn bị staging private cho ZooDoo

`stack.yaml` là cấu hình tham khảo để vận hành review; **chưa chạy Docker hoặc deploy trên máy chủ thật**. Máy làm việc hiện không có Docker. Frontend mặc định giữ trên Vercel; dịch vụ frontend trong stack có replicas 0, chỉ dùng khi diễn tập container.

## Điều kiện hạ tầng

Chuẩn bị một node lưu dữ liệu với volume bền vững riêng cho staging, filesystem/volume được mã hóa khi lưu, backup ngoài node và nhãn `zoodoo_data=true`. External volumes `zoodoo_uploads`, `zoodoo_database`, `zoodoo_database_config` phải được tạo/kiểm chứng tồn tại khi service redeploy. Named volume của Docker tồn tại qua container nhưng không tự chống mất máy chủ; placement cố định và backup/restore là bắt buộc. API chạy user `node`; người vận hành cần cấp quyền volume uploads cho UID/GID 1000 trước khi chạy. DB chạy user `mongodb` theo image.

Dùng Docker Swarm secrets external từ secret manager/encrypted input. Không lưu file chứa secret trong repo hoặc lệnh có giá trị password/token. Bật autolock và quản lý unlock key riêng khỏi bản backup Raft. Tạo `api_service_token`, `mongodb_uri`, SMTP/CMS secrets theo tên trong stack. Mongo root user/password và key replica set cũng là encrypted secrets. Keyfile replica có bản materialized duy nhất trong `/dev/shm`; không chép secret vào volume dữ liệu.

`api_private` và `db_private` là overlay có mã hóa truyền giữa node; DB network là internal, chỉ API/DB tham gia. API cần egress SMTP. Không thêm port API/DB. Vercel kết nối qua **private ingress/load balancer** của hạ tầng đã chọn; ingress này không có địa chỉ/cổng Internet public, chuyển vào network API và không được nối vào DB network. Phải có private connectivity từ Vercel và TLS phía ingress; cấu hình cloud/firewall cụ thể phụ thuộc host chưa được cung cấp.

## Image và khởi tạo

Build từ root repo, push vào registry được quản lý; không truyền secret qua build arguments:

```sh
docker build -t zoodoo-frontend:staging .
docker build -f services/api/Dockerfile --target runtime -t zoodoo-api:staging .
docker build -f services/api/Dockerfile --target operations -t zoodoo-api-operations:staging .
```

Cấu hình hai biến không bí mật `ZOODOO_API_IMAGE`, `ZOODOO_FRONTEND_IMAGE` trỏ tới image đã push (ưu tiên digest). Chạy `docker stack deploy` từ thư mục `deploy` để đường dẫn config script đúng. Frontend container có cổng 3000 nhưng replicas 0; không bật trên Internet trước khi có TLS ingress.

Với **DB mới, chưa có dữ liệu**, khởi động MongoDB trước. Chạy `pnpm --filter @zoodoo/api bootstrap` trong API operations container trên DB network với ba secret tạm: `MONGODB_BOOTSTRAP_URI` (root, authSource=admin, directConnection=true), `MONGODB_APP_USER`, `MONGODB_APP_PASSWORD`. Bootstrap khởi tạo `rs0` với host `mongodb:27017`, tạo account `readWrite` chỉ cho DB `zoodoo`, từ chối ghi đè account đã tồn tại. Đây là thao tác riêng của API operations; không phải HTTP endpoint. Sau bước này gỡ quyền root/bootstrap secrets khỏi operations.

Tạo `mongodb_uri` secret từ thông tin account API, DB `zoodoo`, authSource=zoodoo, replicaSet=rs0. Chỉ API runtime/operations được cấp URI này. Dùng API operations với quyền tối thiểu để chạy `db:push`, `setup` và chỉ định tài khoản nhân viên cần cấp quyền theo README root. Mongo root credentials chỉ nằm trong MongoDB initialization/operations cần thiết, không đưa cho API runtime hoặc frontend.

Với **DB hiện có**, không chạy bootstrap/reset replica hay tạo volume mới thay dữ liệu. Snapshot/restore sang staging, kiểm tra replica set, user API và dữ liệu cũ trước; áp dụng bổ sung schema/index trên bản sao. Thiếu nhân viên có hash mật khẩu hợp lệ phải tạo account qua quy trình vận hành riêng với bcrypt có salt, không đặt mật khẩu mẫu mặc định.

## Xác minh trước release

- API/DB không public; trình duyệt chỉ tới Vercel/frontend. Frontend không có DB network/URI; account API không có quyền DB khác.
- Health API cần service token; các thao tác còn lại cần session và quyền. Kiểm tra từ máy ngoài private network không kết nối được API/DB.
- Gửi dữ liệu giả vào staging, restart rồi recreate API; contact/booking và byte CV vẫn tồn tại. Lặp lại với DB service; chỉ thực hiện khi có backup và maintenance window staging.
- Tắt SMTP sandbox, kiểm tra record giữ nguyên/outbox chuyển trạng thái; thử retry và UNKNOWN đối soát. Không gửi thư khách thật.
- Diễn tập restore DB+uploads sang môi trường mới, xác minh metadata/file và tạm dừng worker để đối soát email trước khi bật lại.

Chưa có quyền/host/private connectivity trong phiên làm việc này nên các kiểm tra firewall, Docker restart/recreate, backup/restore và deploy Vercel vẫn là điều kiện release còn phải thực hiện.
