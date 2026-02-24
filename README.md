# Danh sách API dành cho Frontend
## 1. Authentication và Authorization

| Method | Endpoint                    | Mô tả                                   | Body/Query Parameters                   | Dữ liệu trả về (Response) |
| ------ | --------------------------- | --------------------------------------- | --------------------------------------- | ------------------------- |
| POST   | `/api/auth/register`        | Đăng ký tài khoản mới                   | `{ name, email, password, birth_date }` | Thông tin user & Token    |
| POST   | `/api/auth/login`           | Đăng nhập hệ thống                      | `{ email, password }`                   | Token (JWT), `user_id`    |
| POST   | `/api/auth/forgot-password` | Quên mật khẩu. Gửi `ResetPasswordToken` | `{ email }`                             | Success Message           |
| POST   | `/api/auth/reset-password`  | Đặt lại mật khẩu với Token              | `{ token, new_password }`               | Success Message           |

---

## 2. User Profile 

| Method | Endpoint        | Mô tả                                         | Body/Query Parameters  | Dữ liệu trả về (Response)         |
| ------ | --------------- | --------------------------------------------- | ---------------------- | --------------------------------- |
| GET    | `/api/users/me` | Lấy thông tin cá nhân của user đang đăng nhập | Header: JWT Token      | `{ id, name, email, birth_date }` |
| PUT    | `/api/users/me` | Cập nhật thông tin cá nhân                    | `{ name, birth_date }` | Thông tin User đã cập nhật        |

---

## 3. Song và Genre 

| Method | Endpoint          | Mô tả                                               | Body/Query Parameters                            | Dữ liệu trả về (Response)                                  |
| ------ | ----------------- | --------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------- |
| GET    | `/api/songs`      | Lấy danh sách bài hát (hỗ trợ phân trang, tìm kiếm) | Query: `?page=1&limit=20&search=keyword&genre=X` | Danh sách đối tượng Song                                   |
| GET    | `/api/songs/{id}` | Lấy chi tiết thông tin một bài hát                  | Path variable: `id`                              | `{ id, name, audio_link, duration, author, release_date }` |
| GET    | `/api/genres`     | Lấy danh sách các thể loại âm nhạc                  | Không có                                         | Danh sách đối tượng Genre                                  |

---

## 4. Interaction 

Đây là các API rất quan trọng để lưu dữ liệu vào bảng `UserSongInteraction`, làm đầu vào huấn luyện cho mô hình **LightFM**.

| Method | Endpoint                 | Mô tả                                                                                                            | Body/Query Parameters          | Dữ liệu trả về (Response) |
| ------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------- |
| POST   | `/api/interactions/play` | Gọi khi User ấn nút Play/nghe xong bài hát để cộng `listen_count` và update `last_listen_at`, `listen_duration`. | `{ song_id, listen_duration }` | Trạng thái Interaction    |
| POST   | `/api/interactions/rate` | Đánh giá sao bài hát                                                                                             | `{ song_id, rate }`            | Trạng thái cập nhật rate  |

---

## 5. Recommendation 

| Method | Endpoint                      | Mô tả                                                                                                 | Body/Query Parameters                 | Dữ liệu trả về (Response)                              |
| ------ | ----------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------ |
| GET    | `/api/recommendations/hybrid` | Gọi trực tiếp vào Module 2 (FastAPI: `/recommend/{user_id}`) để lấy các bài hát gợi ý                 | Query: `?limit=10`                    | `{ "recommendations": [danh sách id or tên bài hát] }` |
| POST   | `/api/recommendations/mood`   | Gọi gửi TextBox (status của user) để Module 1 (PhoBERT) xử lý -> Trả về danh sách bài hát theo `Mood` | `{ text: "Hôm nay tôi rất buồn..." }` | `{ "detected_mood": "Buồn", "songs": [...] }`          |

_(Lưu ý: `/api/recommendations/mood` ở tầng Backend sẽ gọi nội bộ vào model PhoBERT để lấy nhãn cảm xúc, sau đó query DB để trả ra nhạc phù hợp)._

---

## 6. Playlists 

| Method | Endpoint                              | Mô tả                                                | Body/Query Parameters        | Dữ liệu trả về (Response)                 |
| ------ | ------------------------------------- | ---------------------------------------------------- | ---------------------------- | ----------------------------------------- |
| GET    | `/api/playlists`                      | Lấy danh sách các Playlist của User hiện tại         | Không có                     | List Playlists                            |
| POST   | `/api/playlists`                      | Tạo Playlist mới                                     | `{ name, is_public: false }` | Thông tin Playlist mới                    |
| GET    | `/api/playlists/{id}`                 | Lấy chi tiết Playlist và danh sách bài hát bên trong | Path variable: `id`          | Bảng `Playlist` + Bảng gộp `PlaylistSong` |
| POST   | `/api/playlists/{id}/songs`           | Thêm một bài hát vào Playlist (`PlaylistSong`)       | `{ song_id }`                | Thành công                                |
| DELETE | `/api/playlists/{id}/songs/{song_id}` | Xóa một bài hát khỏi Playlist                        | Path Variable: `id, song_id` | Thành công                                |
| DELETE | `/api/playlists/{id}`                 | Xóa hoàn toàn Playlist                               | Path variable: `id`          | Thành công                                |

---

## Mẫu Response (JSON format tham khảo)

Khi có lỗi (Error handling):

```json
{
  "success": false,
  "message": "User not found or Invalid Token",
  "status_code": 401
}
```

Khi lấy thành công Data Gợi ý:

```json
{
  "success": true,
  "data": {
    "user_id": 123,
    "recommend_type": "hybrid",
    "songs": [
      {
        "id": 45,
        "name": "Nơi này có anh",
        "audio_link": "https://server.com/audio/45.mp3",
        "author": "Sơn Tùng M-TP"
      }
    ]
  }
}
```
