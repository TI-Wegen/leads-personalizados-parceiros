import styled from "@emotion/styled";
import { Skeleton } from "@mui/material";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  background-size: cover;
  background-position: center;

  @media (max-width: 1024px) {
  }
`;

export const NavSkeleton = styled(Skeleton)`
  width: 100%;
  height: 10%;
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

export const ContentLeft = styled.div`
  width: 50%;
  padding: 100px 50px;

  @media (max-width: 1024px) {
    height: 400px;
    width: 100%;
    padding: 75px 30px;
  }
`;

export const SkeletonTextDescription = styled(Skeleton)`
  width: 100%;
  height: 120px;

  @media (max-width: 1024px) {
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

export const SkeletonFormContato = styled(Skeleton)`
  width: 80%;
  height: 70%;

  @media (max-width: 1024px) {
    width: 100%;
    height: 500px;
    border-radius: 0;
    box-shadow: none;
  }
`;
