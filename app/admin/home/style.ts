import styled from "@emotion/styled";
import { TextField } from "@mui/material";

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

export const FormLogin = styled.form`
  flex-direction: column;
  gap: 30px;
  padding: 50px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 10px 10px 23px -3px rgba(0, 0, 0, 0.56);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LoginTextField = styled(TextField)`
  width: 300px;
`;
