import React, { useState, useEffect } from "react";
import { BookContainer } from "../../components/Style";

const Book = () => {
  // 상태 관리
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const serviceKey = "c6f78a56-8246-44c2-b049-46de2d5b7261";
  const apiUrl = `http://api.kcisa.kr/openapi/service/rest/meta13/getNLSF0401?serviceKey=${serviceKey}&numOfRows=50&pageNo=1`;

  // 책 정보 불러오기
  const fetchBookData = async () => {
    try {
      const response = await fetch(apiUrl);
      const xmlData = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, "application/xml");

      const items = xmlDoc.getElementsByTagName("item");
      const bookList = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const subjectCategory =
          item.getElementsByTagName("subjectCategory")[0]?.textContent;

        // '추천도서'만 필터링
        if (subjectCategory && subjectCategory.includes("추천도서")) {
          bookList.push({
            title: item.getElementsByTagName("title")[0]?.textContent,
            alternativeTitle:
              item.getElementsByTagName("alternativeTitle")[0]?.textContent,
            imageUrl: item.getElementsByTagName("referenceIdentifier")[0]
              ?.textContent,
            url: item.getElementsByTagName("url")[0]?.textContent,
            rights: item.getElementsByTagName("rights")[0]?.textContent,
          });
        }
      }

      setBooks(bookList);
      setLoading(false);
    } catch (error) {
      console.error("API 호출 오류:", error);
      alert("도서 정보를 불러오는 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  // 랜덤 추천 도서 정보를 선택
  const showRandomBookInfo = () => {
    if (books.length === 0) {
      alert("추천 도서를 로딩 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const randomBook = books[Math.floor(Math.random() * books.length)];
    setSelectedBook(randomBook);
  };

  // 페이지 로드 시 책 정보 로딩 및 랜덤 책 선택
  useEffect(() => {
    fetchBookData();
  }, []);

  // 페이지가 로드된 후 자동으로 랜덤 도서를 선택하도록 설정
  useEffect(() => {
    if (!loading && books.length > 0) {
      showRandomBookInfo(); // 로딩이 끝나고 책 목록이 준비되면 랜덤 책을 자동으로 선택
    }
  }, [loading, books]); // books나 loading이 바뀔 때마다 호출

  return (
    <BookContainer>
      <h1>
        오늘의 <br />
        추천 도서
      </h1>
      <div className="book">
        {selectedBook && (
          <>
            <h2>{selectedBook.title}</h2>
            <h3>{selectedBook.alternativeTitle || ""}</h3>
            <img
              src={selectedBook.imageUrl}
              alt={selectedBook.title}
              className="book-image"
            />
            <p>
              <strong>지은이:</strong> {selectedBook.rights || "권리 정보 없음"}
            </p>
            <p>
              <a
                href={selectedBook.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                자세히 보기
              </a>
            </p>
          </>
        )}

        {loading && <p>도서 정보를 불러오는 중입니다...</p>}
      </div>
    </BookContainer>
  );
};

export default Book;
