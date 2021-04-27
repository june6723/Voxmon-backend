## 가입
```
POST /auth/register
Content-Type: application/jso
{
  "username"
  "email"
  "password"
}
```
## 로그인
```
POST /auth/login 
input: {
  email
  password
}

output: {
  accessToken
  refreshToken
}
```

## 로그아웃
```
DELETE /auth/logout
input: 없음 토큰만 헤더에 심어서 보내면됨
output: 없음 클라이언트에서 쿠키로 심어진 토큰삭제
```
## 토큰 갱신
```
POST /auth/refresh-token
input: 없음 토큰만 헤더에 심어서 보내면됨
output: {
  accessToken
  refreshToken
}
```
