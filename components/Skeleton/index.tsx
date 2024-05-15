"use client";

import * as C from "./style";

export default function SkeletonLoad() {
  return (
    <C.Container>
      <C.NavSkeleton animation="wave" variant="rounded" />
      <C.Content>
        <C.ContentLeft>
          <C.SkeletonTextDescription animation="wave" variant="rounded" />
        </C.ContentLeft>
        <C.ContentRight>
          <C.SkeletonFormContato animation="wave" variant="rounded" />
        </C.ContentRight>
      </C.Content>
    </C.Container>
  );
}
