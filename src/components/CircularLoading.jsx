import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CircularLoading = () => {
  const { status: financeStatus } = useSelector((state) => state.finance);
  const { status: userStatus } = useSelector((state) => state.user);
  const { status: portfolioStatus } = useSelector((state) => state.portfolio);
  const { status: stocksStatus } = useSelector((state) => state.stocks);
  const { status: indicesStatus } = useSelector((state) => state.indices);
  const { status: newsStatus } = useSelector((state) => state.news);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(
      financeStatus === "loading" ||
        userStatus === "loading" ||
        portfolioStatus === "loading" ||
        stocksStatus === "loading" ||
        indicesStatus === "loading" ||
        newsStatus === "loading",
    );
  }, [
    financeStatus,
    userStatus,
    portfolioStatus,
    stocksStatus,
    indicesStatus,
    newsStatus,
  ]);
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={isLoading}
    >
      <CircularProgress sx={{ overflow: "hidden" }} color="primary" />
    </Backdrop>
  );
};

export default CircularLoading;
