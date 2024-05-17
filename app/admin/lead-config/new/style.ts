import styled from "@emotion/styled";
import { Stack, TextField } from "@mui/material";

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
  align-items: flex-end;
  flex-direction: column;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 10px 10px 23px -3px rgba(0, 0, 0, 0.56);
  gap: 30px;

  h3 {
    margin: 0;
  }
`;

export const FullWidthStack = styled(Stack)`
  width: 100%;
`;
