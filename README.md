# clonprojectBE

# 1. 프로젝트 소개
>각자의 취미 결과물을 각 카테고리와 그 카테고리에 맞는 사진과 해당 내용으로 게시하고 공유할 수 있으며, 이에 대한 반응으로 댓글과 좋아요를 표현할 수 있습니다.
http://chamchipack.shop.s3-website.ap-northeast-2.amazonaws.com/
# 2. 제작 기간 & 팀원 소개
- 기간: 2022년 4월 15일~ 22년 4월 21일
- 총 6명으로 구성된 팀 프로젝트. (C반 4조)
### 프론트 3명
조찬익: 에어비엔비 페이지 지도, 전체 리스트, 작성페이지 구현
이태훈: 상세페이지 전체 뷰, 상세페이지 지도기능, 댓글기능 구현
한유정: 메인페이지 전체 뷰, 상단 헤더, 로그인 기능 구현
### 백엔드 3명(Router 부분으로 파트 배분)
한재혁: 리스트페이지, 호스트게시글작성, 호스트게시글삭제 API
김연유: 로그인 API, 회원가입 API
신상렬: 상세페이지API, 후기 작성API, 후기 삭제API
# 3. 사용 기술(개발 툴)
- Server: AWS EC2 (Ubuntu 18.04 LTS)
- Framework: React(FE), Node.js + Express(BE) (Javascript)
- Database: MongoDB
- Design Tool: Figma
- Tool : Git Hub, Notion, Git Book
# 4. 핵심 기능
- S3 버킷에 여러개의 이미지 저장, 삭제 구현
- 이메일, 아이디, 비밀번호를 정규식으로 입력 조건 설정
- multer-s3 패키지 사용
