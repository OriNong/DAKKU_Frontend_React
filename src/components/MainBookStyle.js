import styled from "styled-components";

export const BookContainer = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
  margin-top: 50px;

  .book {
    border: 1px solid #ccc;
    padding: 20px;
    width: 100%;
    max-width: 500px;
    margin: 20px auto;
    background-color: #f4f4f4;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  .book-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    margin-bottom: 10px;
  }

  .book .loading {
    font-size: 1.2rem;
    color: #5bc0de;
    margin-top: 20px;
  }

  .book a {
    color: #007bff;
    text-decoration: none;
  }

  .book a:hover {
    text-decoration: underline;
  }

  h1 {
    color: #464646;
  }
  h2 {
    color: #464646;
  }
  p {
    color: #464646;
  }
`;
