import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

function Summary() {
  const summary = useSelector((state) => state.search.summary);

  return (
    <Typography my={2} variant="subtitle1">
      {summary.hasResults
        ? `${summary.firstResult}-${summary.lastResult} of ${summary.total.toLocaleString()} results for `
        : `0 results for `}
      <strong>"{summary.query}"</strong>
    </Typography>
  );
}

export default Summary;