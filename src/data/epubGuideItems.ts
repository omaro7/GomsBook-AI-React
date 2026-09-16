import type {
  EpubGuideItem
} from "@/models/EpubGuideItem"


export const epubGuideItems:
  EpubGuideItem[] = [

    /*
     * EPUB 정보
     */
    {
      id: "inspect-project",
      category: "EPUB 정보",
      title: "프로젝트 정보 확인",
      prompt: "현재 EPUB 프로젝트 정보를 보여줘",
      description: "현재 열려 있는 EPUB 프로젝트의 기본 정보를 확인합니다."
    },

    {
      id: "inspect-epub",
      category: "EPUB 정보",
      title: "EPUB 구조 확인",
      prompt: "현재 EPUB의 전체 구조를 보여줘",
      description: "현재 EPUB의 주요 구조와 구성 정보를 확인합니다."
    },

    {
      id: "read-package",
      category: "EPUB 정보",
      title: "Package 정보 확인",
      prompt: "현재 EPUB의 package 정보를 보여줘",
      description: "content.opf의 package 기본 정보를 확인합니다."
    },

    {
      id: "read-metadata",
      category: "EPUB 정보",
      title: "메타데이터 확인",
      prompt: "현재 EPUB의 메타데이터를 보여줘",
      description: "제목, 저자, 언어 등 EPUB 메타데이터를 확인합니다."
    },

    {
      id: "read-manifest",
      category: "EPUB 정보",
      title: "Manifest 확인",
      prompt: "현재 EPUB의 manifest를 보여줘",
      description: "EPUB에 등록된 문서와 리소스를 확인합니다."
    },

    {
      id: "read-spine",
      category: "EPUB 정보",
      title: "Spine 확인",
      prompt: "현재 EPUB의 spine 순서를 보여줘",
      description: "EPUB 본문의 읽기 순서를 확인합니다."
    },

    {
      id: "read-navigation",
      category: "EPUB 정보",
      title: "목차 확인",
      prompt: "현재 EPUB의 목차를 보여줘",
      description: "현재 EPUB의 Navigation 목차를 확인합니다."
    },

    {
      id: "list-documents",
      category: "EPUB 정보",
      title: "문서 목록 확인",
      prompt: "현재 EPUB의 문서 목록을 보여줘",
      description: "EPUB에 포함된 XHTML 문서 목록을 확인합니다."
    },

    {
      id: "list-resources",
      category: "EPUB 정보",
      title: "리소스 목록 확인",
      prompt: "현재 EPUB의 리소스 목록을 보여줘",
      description: "이미지, CSS, 폰트 등 EPUB 리소스를 확인합니다."
    },

    {
      id: "list-images",
      category: "EPUB 정보",
      title: "이미지 목록 확인",
      prompt: "현재 EPUB의 이미지 목록을 보여줘",
      description: "EPUB에 포함된 이미지 파일을 확인합니다."
    },


    /*
     * EPUB 작성
     */
    {
      id: "create-author",
      category: "EPUB 작성",
      title: "작가소개 생성",
      prompt: "작가소개 페이지를 만들어줘",
      description: "EPUB에 작가소개 페이지를 생성합니다."
    },

    {
      id: "create-part",
      category: "EPUB 작성",
      title: "Part 생성",
      prompt: "새로운 Part를 만들어줘",
      description: "EPUB에 새로운 Part를 생성합니다."
    },

    {
      id: "create-chapter",
      category: "EPUB 작성",
      title: "Chapter 생성",
      prompt: "새로운 Chapter를 만들어줘",
      description: "EPUB에 새로운 Chapter를 생성합니다."
    },

    {
      id: "create-loi",
      category: "EPUB 작성",
      title: "그림목차 생성",
      prompt: "현재 EPUB에 그림목차를 만들어줘",
      description: "EPUB의 그림목차(LOI)를 생성합니다."
    },

    {
      id: "create-lot",
      category: "EPUB 작성",
      title: "표목차 생성",
      prompt: "현재 EPUB에 표목차를 만들어줘",
      description: "EPUB의 표목차(LOT)를 생성합니다."
    },


    /*
     * EPUB 수정
     */
    {
      id: "update-author",
      category: "EPUB 수정",
      title: "작가소개 수정",
      prompt: "작가소개 페이지를 수정해줘",
      description: "기존 작가소개 페이지 내용을 수정합니다."
    },

    {
      id: "update-part",
      category: "EPUB 수정",
      title: "Part 수정",
      prompt: "현재 EPUB의 Part를 수정해줘",
      description: "기존 Part 정보를 수정합니다."
    },

    {
      id: "update-chapter",
      category: "EPUB 수정",
      title: "Chapter 수정",
      prompt: "현재 EPUB의 Chapter를 수정해줘",
      description: "기존 Chapter 내용을 수정합니다."
    },

    {
      id: "update-metadata",
      category: "EPUB 수정",
      title: "메타데이터 수정",
      prompt: "현재 EPUB의 메타데이터를 수정해줘",
      description: "EPUB의 메타데이터를 추가하거나 수정합니다."
    },

    {
      id: "update-xhtml-attribute",
      category: "EPUB 수정",
      title: "XHTML 속성 수정",
      prompt: "현재 EPUB 문서의 XHTML 속성을 수정해줘",
      description: "XHTML 요소의 id, class, role 등 속성을 수정합니다."
    },

    {
      id: "clean-xhtml",
      category: "EPUB 수정",
      title: "XHTML 정리",
      prompt: "현재 EPUB의 XHTML을 정리해줘",
      description: "XHTML 구조와 불필요한 마크업을 정리합니다."
    },

    {
      id: "clean-typography",
      category: "EPUB 수정",
      title: "문장부호 정리",
      prompt: "현재 EPUB의 따옴표와 말줄임표를 정리해줘",
      description: "따옴표, 말줄임표 등 문장부호를 정규화합니다."
    },

    {
      id: "apply-stylesheet",
      category: "EPUB 수정",
      title: "스타일시트 적용",
      prompt: "현재 EPUB 문서에 스타일시트를 적용해줘",
      description: "준비된 CSS 스타일시트를 EPUB 문서에 적용합니다."
    },


    /*
     * EPUB 삭제
     */
    {
      id: "delete-author",
      category: "EPUB 삭제",
      title: "작가소개 삭제",
      prompt: "작가소개 페이지를 삭제해줘",
      description: "EPUB에서 작가소개 페이지를 삭제합니다."
    },

    {
      id: "delete-part",
      category: "EPUB 삭제",
      title: "Part 삭제",
      prompt: "현재 EPUB의 Part를 삭제해줘",
      description: "선택한 Part를 EPUB에서 삭제합니다."
    },

    {
      id: "delete-chapter",
      category: "EPUB 삭제",
      title: "Chapter 삭제",
      prompt: "현재 EPUB의 Chapter를 삭제해줘",
      description: "선택한 Chapter를 EPUB에서 삭제합니다."
    },


    /*
     * 검증
     */
    {
      id: "validate-project",
      category: "검증",
      title: "프로젝트 구조 검증",
      prompt: "현재 EPUB 프로젝트를 검증해줘",
      description: "EPUB 프로젝트의 구조와 필수 파일을 검증합니다."
    },

    {
      id: "validate-epub-file",
      category: "검증",
      title: "EPUBCheck 검증",
      prompt: "현재 EPUB 파일을 EPUBCheck로 검증해줘",
      description: "생성된 EPUB 파일을 EPUBCheck 기준으로 검증합니다."
    },

    {
      id: "validate-accessibility",
      category: "검증",
      title: "접근성 검증",
      prompt: "현재 EPUB의 접근성을 검증해줘",
      description: "EPUB 접근성 규칙을 기준으로 문서를 검증합니다."
    },

    {
      id: "inspect-images",
      category: "검증",
      title: "이미지 검증",
      prompt: "현재 EPUB의 이미지를 검사해줘",
      description: "이미지 리소스와 참조 상태를 검사합니다."
    },


    /*
     * 출판
     */
    {
      id: "publish-epub",
      category: "출판",
      title: "EPUB 파일 생성",
      prompt: "현재 프로젝트를 EPUB 파일로 생성해줘",
      description: "현재 프로젝트를 배포 가능한 EPUB 파일로 생성합니다."
    },


    /*
     * AI · RAG
     */
    {
      id: "index-project-documents",
      category: "AI · RAG",
      title: "문서 인덱싱",
      prompt: "현재 프로젝트 문서를 RAG에 인덱싱해줘",
      description: "현재 EPUB 문서를 검색할 수 있도록 RAG 인덱스를 생성합니다."
    },

    {
      id: "search-project-documents",
      category: "AI · RAG",
      title: "EPUB 내용 검색",
      prompt: "현재 EPUB에서 관련 내용을 검색해줘",
      description: "RAG를 이용해 현재 EPUB의 관련 내용을 검색합니다."
    }

  ]