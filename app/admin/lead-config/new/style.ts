import styled from "@emotion/styled";
import { Stack } from "@mui/material";
import Image from "next/image";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f1f1;
  overflow: hidden;

  @media (max-width: 1024px) {
  }
`;

export const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  width: 80%;
  height: 100%;
  flex-direction: column;
  padding: 30px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  overflow-y: scroll;
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
  overflow-y: scroll;
  h3 {
    margin: 0;
  }
`;

export const FullWidthStack = styled(Stack)`
  width: 100%;
`;

export const TextWarning = styled.p`
  font-size: 14px;
  color: blue;
  width: 100%;

  span {
    color: red;
  }
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  height: 56px;

  label {
    font-size: 18px;
  }
`;

export const ButtonDiv = styled.div`
  width: 40%;
  display: flex;
  align-items: start;
  justify-content: center;
`;

export const ImageDiv = styled.div`
  width: 60%;
  background-color: #f1f1f1;
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16/9;

  img {
    width: 100%;
    object-fit: scale-down;
  }
`;

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const ButtonArea = styled.div`
  width: 100%;
  display: flex;

  align-items: flex-end;
  justify-content: flex-end;
`;
