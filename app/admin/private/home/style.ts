import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f1f1;

  @media (max-width: 1024px) {
  }
`;

export const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  width: 60%;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Card = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 10px 10px 23px -3px rgba(0, 0, 0, 0.56);
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
`;
