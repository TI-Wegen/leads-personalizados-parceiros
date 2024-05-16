import styled from "@emotion/styled";
import Image from "next/image";

export const Container = styled.div<{ secondaryColor: string; bgUrl?: string }>`
  width: 100%;
  height: 100%;
  background: ${({ bgUrl, secondaryColor }) =>
    bgUrl ? `url(${bgUrl}) no-repeat` : `${secondaryColor}`};
  background-size: cover;
  background-position: center;

  @media (max-width: 1024px) {
    background: ${(props) => props.secondaryColor};
  }
`;

export const NavbarContainer = styled.div<{ primaryColor: string }>`
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  background: ${(props) => props.primaryColor};
`;

export const NavbarLogo = styled(Image)`
  width: 120px;
  height: auto;
`;

export const Wpp = styled.a`
  display: flex;
  align-items: center;
  font-size: 24px !important;
  cursor: pointer;

  &:hover {
    text-decoration: none;
    color: lightgray;
  }

  img {
    width: 28px;
    height: 28px;
    margin-right: 10px;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const WppNumber = styled.h4`
  color: white;
  margin: 0 !important;
`;

export const DDD = styled.span`
  font-size: 20px;
`;

export const Content = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: row;

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
  }
`;

export const ContentLeft = styled.div<{
  secondaryColor: string;
  bgUrl?: string;
}>`
  width: 50%;
  padding: 100px 50px;

  @media (max-width: 1024px) {
    height: 400px;
    width: 100%;
    background: ${({ bgUrl, secondaryColor }) =>
      bgUrl ? `url(${bgUrl}) no-repeat` : `${secondaryColor}`};
    background-size: cover;
    background-position: right;
    padding: 75px 30px;
  }
`;

export const TextDescription = styled.h2`
  color: white;
  font-weight: 700;
  font-size: 34px;

  @media (max-width: 1024px) {
    font-weight: 700;
    font-size: 12px;
    width: 60%;
  }
`;

export const ContentRight = styled.div`
  display: flex;
  width: 50%;
  height: 100%;
  align-items: center;
  justify-content: right;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const FormContato = styled.form<{ primaryColor: string }>`
  display: flex;
  flex-direction: column;
  padding: 40px 30px;
  width: 80%;
  background: ${(props) => props.primaryColor};
  border-radius: 30px 0 0 30px;
  box-shadow: -11px 12px 110px 2px rgba(0, 0, 0, 0.59);

  @media (max-width: 1024px) {
    width: 100%;
    border-radius: 0;
    box-shadow: none;
  }
`;

export const TitleArea = styled.div`
  width: 100%;
  text-align: center;
  color: white;
`;

export const Title = styled.h4`
  font-weight: 700;
  font-size: 24px;
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 12px;
  }
`;

export const MarkedText = styled.span<{ secondaryColor: string }>`
  color: ${(props) => props.secondaryColor};
`;

export const Subtitle = styled.p`
  @media (max-width: 1024px) {
    font-size: 10px;
  }
`;

export const InputArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    color: white;
  }
`;
