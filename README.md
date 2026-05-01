# 🎵 Aura — Music Streaming Platform

A full-stack music streaming platform with a Spring Boot REST API backend and a React frontend. Aura supports user authentication, artist content management, playlist curation, social following, music search, media serving, and audio streaming — with the backend organized across seven independent modules.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3 |
| Security | Spring Security + JWT (HS512) |
| Persistence | Spring Data JPA + Hibernate |
| Database | MySQL |
| Build Tool | Maven |
| Frontend | React (Vite) |
| File Storage | Local disk (UUID-based) |
| Email | Spring Mail (JavaMailSender) |

---

## 🏗 Architecture

The backend is organized into **7 loosely coupled modules**. Dependencies are strictly unidirectional — lower modules are imported by higher ones, never the reverse.

```
User Module
  └── Artist Module
        ├── Playlist Module
        ├── Follow Module
        ├── Search Module
        ├── Streaming Module
        └── Media Module (standalone)
```

### Module Overview

| Module | Responsibility |
|---|---|
| **User** | Registration, email OTP verification, JWT login, password reset, role management |
| **Artist** | Artist profiles, album management, song upload and file handling |
| **Playlist** | Create/manage playlists, add/remove songs, public/private visibility |
| **Follow** | Follow/unfollow users and artists, follower counts, follow stats |
| **Search** | Search songs/albums/artists by keyword, genre filter, trending and recent feeds |
| **Media** | Serve images from disk — album covers, song covers, profile images |
| **Streaming** | Stream and download audio files |

---

## 💻 Frontend

Built with **React + Vite**. Consumes the REST API for all data and operations.

- User registration, login, and profile management
- Artist and album browsing
- Music playback via the streaming endpoints
- Playlist creation and management
- Follow system

---

## 🔐 Security

- **Stateless JWT authentication** — no server-side sessions, horizontally scalable
- **JWT filter** runs on every request — validates signature, expiry, and loads user into `SecurityContextHolder`
- **Two-layer ownership checks** — URL-level access via `SecurityConfig` + resource-level ownership verification in every service
- **BCrypt password hashing** — strength 10, one-way, never stored in plain text
- **UUID filenames** for all uploaded files — prevents path traversal attacks and filename collisions
- **Path traversal protection** in the Streaming Module — resolves and validates file paths before serving

---

## 📁 Project Structure

```
Aura/
├── aura-frontend/                  ← React + Vite
│
└── aura-backend/                   ← Spring Boot REST API
    └── src/main/java/com/aura/
        ├── user/
        │   ├── config/         SecurityConfig, PasswordEncoderConfig
        │   ├── controller/     UserController
        │   ├── dto/            UserRequestDTO, UserResponseDTO, LoginRequestDTO, LoginResponseDTO...
        │   ├── entity/         User, Role, RoleType, Gender
        │   ├── repository/     UserRepository
        │   ├── service/        UserService, EmailService, CustomUserDetailsService
        │   ├── exception/      ResourceNotFoundException, DuplicateResourceException...
        │   └── util/           JwtUtil, JwtTokenProvider, JwtAuthenticationFilter
        ├── artist/
        │   ├── controller/     ArtistController, AlbumController, SongController
        │   ├── dto/            ArtistProfileDTO, AlbumCreateDTO, AlbumDTO, SongUploadDTO, SongUpdateDTO
        │   ├── entity/         Artist, Album, Song
        │   ├── repository/     ArtistRepository, AlbumRepository, SongRepository
        │   └── service/        ArtistService, AlbumService, SongService
        ├── playlist/
        │   ├── controller/     PlaylistController
        │   ├── dto/            PlaylistCreateDTO, PlaylistDTO
        │   ├── entity/         Playlist
        │   ├── repository/     PlaylistRepository
        │   └── service/        PlaylistService
        ├── follow/
        │   ├── controller/     FollowController
        │   ├── dto/            FollowDTO, UserFollowStatsDTO
        │   ├── entity/         Follow
        │   ├── repository/     FollowRepository
        │   └── service/        FollowService
        ├── search/
        │   ├── controller/     SearchController
        │   └── service/        SearchService
        ├── media/
        │   └── controller/     ImageController
        └── streaming/
            └── controller/     StreamingController
```

---

## 🚀 Key Features

### User Management
- Register with email + OTP verification flow
- JWT-based stateless login
- Forgot password / reset password via email link
- Role-based access control (USER, ARTIST, ADMIN)
- Promote user to ARTIST — automatically creates Artist profile

### Artist & Content
- Artist profile management (stage name, bio, images)
- Album creation with cover image upload
- Song upload with audio file + cover image
- UUID-based file naming for all uploads
- Auto-increment `totalTracks` on album when songs are added/removed

### Playlists
- Create public or private playlists
- Add and remove songs
- Owner sees all playlists — strangers see only public ones
- `@EntityGraph` optimized queries — playlists and songs fetched in a single JOIN

### Follow System
- Follow/unfollow users and artists
- Smart two-path logic — registered artists followed via user-follow path, catalog artists via dedicated path
- Follower/following counts and stats
- Batch-fetched follower lists — eliminates N+1 query problem

### Search
- Search songs by title or genre
- Search albums by title
- Search artists by stage name
- Genre filter
- Recent songs feed (latest 20)

### Media & Streaming
- Serve images with correct Content-Type and 1-hour cache headers
- Stream audio inline or download with song title as filename
- Path traversal protection on all file serving

---

## ⚙️ Performance Optimizations

### N+1 Query Elimination
A compound N+1 problem was identified and resolved in the Playlist Module:

**Before:** Fetching 10 playlists with 50 songs each = **511 database queries**
```
1 query  → load playlists
10 queries → load songs per playlist (N)
500 queries → load artist per song (N×M)
```

**After:** **2 database queries** regardless of playlist or song count
```
1 query → playlists + songs via @EntityGraph (LEFT OUTER JOIN)
1 query → all artists via findAllById (IN clause)
```

### Lazy Loading Strategy
- All collection relationships use `FetchType.LAZY` by default
- `@EntityGraph` added to specific repository methods that need related data immediately
- `User.roles` changed from `EAGER` to `LAZY` — `@EntityGraph` on `findByEmail` ensures Spring Security authentication still loads roles in a single JOIN query

---

## 📡 API Endpoints

### User
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/users` | No | Register |
| POST | `/api/users/login` | No | Login |
| GET | `/api/users/verify-otp` | No | Verify email OTP |
| POST | `/api/users/forgot-password` | No | Request password reset |
| POST | `/api/users/reset-password` | No | Reset password |
| PUT | `/api/users/{id}` | Yes | Update user |
| PUT | `/api/users/{id}/switch-to-artist` | Yes | Promote to artist |

### Artist
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| PUT | `/api/artist/profile` | Yes | Update artist profile |
| GET | `/api/artist/profile/{artistId}` | No | Get public artist profile |
| POST | `/api/artist/albums` | Yes | Create album |
| POST | `/api/artist/songs/album/{albumId}` | Yes | Upload song |
| PUT | `/api/artist/songs/{songId}` | Yes | Update song |
| DELETE | `/api/artist/songs/{songId}` | Yes | Delete song |

### Playlist
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/playlists` | Yes | Create playlist |
| GET | `/api/playlists/{playlistId}` | Yes | Get own playlist |
| GET | `/api/playlists/public/{playlistId}` | No | Get public playlist |
| POST | `/api/playlists/{playlistId}/songs/{songId}` | Yes | Add song |
| DELETE | `/api/playlists/{playlistId}/songs/{songId}` | Yes | Remove song |

### Follow
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/follow/user/{followingId}` | Yes | Follow user |
| DELETE | `/api/follow/user/{followingId}` | Yes | Unfollow user |
| POST | `/api/follow/artist/{artistId}` | Yes | Follow artist |
| GET | `/api/follow/stats/{userId}` | No | Get follow stats |
| GET | `/api/follow/followers/{userId}` | No | Get followers list |
| GET | `/api/follow/following/{userId}` | No | Get following list |

### Search
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/search?query=` | No | Search all |
| GET | `/api/search/songs?query=` | No | Search songs |
| GET | `/api/search/albums?query=` | No | Search albums |
| GET | `/api/search/artists?query=` | No | Search artists |
| GET | `/api/search/by-genre?genre=` | No | Filter by genre |
| GET | `/api/search/recent` | No | Latest 20 songs |

### Streaming & Media
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/stream/song/{songId}` | No | Stream audio |
| GET | `/api/stream/song/{songId}/download` | No | Download audio |
| GET | `/api/images/covers/{artistId}/{filename}` | No | Song cover image |
| GET | `/api/images/albums/{artistId}/{filename}` | No | Album cover image |

---

## 🔧 Running Locally

### Prerequisites
- Java 17+
- MySQL 8+
- Maven 3.8+
- Node.js 18+

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/Trinadh-Poli/Aura.git
cd Aura/aura-backend
```

2. Create the database
```sql
CREATE DATABASE aura_db;
```

3. Configure environment

Copy `application.properties.example` to `application.properties` and fill in your values:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/aura_db
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

app.jwt.secret=YOUR_JWT_SECRET_KEY
app.jwt.expiration=86400000

spring.mail.username=YOUR_EMAIL
spring.mail.password=YOUR_EMAIL_APP_PASSWORD

app.upload.dir=YOUR_UPLOAD_DIRECTORY_PATH
app.music.storage-path=YOUR_MUSIC_STORAGE_PATH
```

4. Run
```bash
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`

### Frontend Setup

```bash
cd Aura/aura-frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 📌 Known Improvements / Next Steps

- `getTrendingSongs()` currently returns all songs — should be replaced with a play-count based trending algorithm
- Range request support in Streaming Module (`206 Partial Content`) for proper audio seeking
- Audio content type detection from file extension (currently hardcoded to `audio/mpeg`)
- Path traversal protection in Media Module (currently present only in Streaming Module)
- Remaining COUNT query N+1 in Follow Module — batch aggregate query as next step

---

## 👤 Author

Built by Trinadh Poli
