import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuth = () => {
  // const router = useRouter();
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     router.push("/admin");
  //     return;
  //   }
  //   const [datePart, loggedPart] = token.split("*");
  //   const currentDate = new Date().getTime();
  //   const tokenDate = parseInt(datePart, 10);
  //   const timeDifference = currentDate - tokenDate;
  //   if (timeDifference > 1800000) {
  //     localStorage.removeItem("token");
  //     router.push("/admin");
  //   }
  // }, []);
};

export default useAuth;
