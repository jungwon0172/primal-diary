# 원시인 다이어리 (정적 HTML 버전)

빌드/설치 과정이 전혀 없는 순수 HTML/CSS/JS 사이트예요. npm, Next.js, 서버 없음.
기록은 방문자의 브라우저(localStorage)에만 저장됩니다.

## 배포 방법 (터미널 없이, GitHub 웹사이트에서)

1. https://github.com/new 에서 새 저장소 생성 (README/.gitignore 체크 안 함)
2. 저장소 페이지의 "uploading an existing file" 링크 클릭
3. 이 폴더 안의 **모든 파일**(폴더 없이 파일들만, `index.html`, `style.css`, `common.js` 등)을 전체 선택해서 드래그
4. "Commit changes" 클릭
5. https://vercel.com 에서 GitHub 로그인 → "Add New" → "Project" → 방금 만든 저장소 Import
   - Framework Preset: **Other** 선택 (자동 감지 안 되면 직접 선택)
   - Build Command, Output Directory는 비워두고 그대로 "Deploy"

이후 파일을 수정할 때마다 저장소 페이지에서 "Add file" → "Upload files"로 바뀐 파일만 다시 올리면 자동 재배포됩니다.

## 파일 구성

- `index.html` — 오늘 탭 (체크리스트 + 벽화 시각화)
- `routines.html` — 루틴 관리
- `history.html` — 기록 (목록/달력)
- `tools.html` — 계산기 (수면 시간, 물 적정량)
- `guide.html` — 습관 가이드 (원본 콘텐츠)
- `about.html`, `contact.html`, `privacy.html`, `terms.html` — 정책/소개 페이지
- `style.css`, `common.js` — 모든 페이지가 공유하는 스타일/로직
- `ads.txt`, `robots.txt`, `sitemap.xml`, `google...html` — AdSense/검색엔진용 파일

## 배포 전 확인할 것

- `sitemap.xml`, `robots.txt` 안의 `REPLACE-WITH-YOUR-DOMAIN`을 실제 도메인으로 교체하세요.
- 구글/네이버 인증 코드, AdSense 코드는 이미 모든 페이지의 `<head>`에 들어가 있어요.

## AdSense 심사 전 체크리스트

- [x] AdSense 게시자 스크립트, `ads.txt`
- [x] 구글 서치 콘솔 / 네이버 서치어드바이저 인증 완료
- [x] 개별 페이지 URL (`index.html`, `routines.html`, `history.html`, `tools.html`, `guide.html`, `about.html`, `contact.html`, `privacy.html`, `terms.html`)
- [x] 개인정보처리방침(쿠키 고지 포함), 이용약관, 소개, 문의 페이지
- [x] 원본 텍스트 콘텐츠 (`guide.html`), 실용 도구 (`tools.html`)
- [ ] 커스텀 도메인 연결
- [ ] `sitemap.xml`, `robots.txt` 도메인 교체
- [ ] AdSense 승인 후 `<div class="ad-slot">` 부분을 실제 광고 태그로 교체
