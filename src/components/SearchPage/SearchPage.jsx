import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  buildSearchBox,
  buildResultList,
  buildSearchStatus,
  buildFacet,
  buildPager,
  buildSort,
  buildQuerySummary,
} from "@coveo/headless";
import { loadClickAnalyticsActions } from "@coveo/headless";

import {
  setQuery,
  setSuggestions,
  setResults,
  setStatus,
  setFacet,
  setPager,
  setSort,
  setSummary,
  setControllers,
} from "../../reduxTookit/slices/searchSlice";

import { Box } from "@mui/material";
import SearchBox from "./SearchBox";
import Suggestions from "./Suggestions";
import Status from "./Status";
import Summary from "./Summary";
import Facet from "./Facet";
import Sort from "./Sort";
import Results from "./Results";
import Pager from "./Pager";
import InfoSection from './InfoSection'

function SearchPage({ engine }) {
  const dispatch = useDispatch();

  const searchBoxRef = useRef(null);
  const resultListRef = useRef(null);
  const searchStatusRef = useRef(null);
  const facetRef = useRef(null);
  const pagerRef = useRef(null);
  const sortRef = useRef(null);
  const summaryRef = useRef(null);

  if (!searchBoxRef.current) {
    searchBoxRef.current = buildSearchBox(engine, {
      options: { numberOfSuggestions: 5 },
    });

    resultListRef.current = buildResultList(engine, {
      options: {
        fieldsToInclude: [
          "title",
          "excerpt",
          "fsource",
          "duration_minutes",
          "duration_hours",
          "destination",
          "price",
        ],
        // advancedExpression: '@source=="TestDocs"',
        numberOfResults: 10,
      },
    });

    searchStatusRef.current = buildSearchStatus(engine);
    facetRef.current = buildFacet(engine, {
      options: { field: "destination", numberOfValues: 5 },
    });
    pagerRef.current = buildPager(engine, { options: { numberOfPages: 5 } });
    sortRef.current = buildSort(engine);
    summaryRef.current = buildQuerySummary(engine);
  }

  useEffect(() => {
    const searchBox = searchBoxRef.current;
    const resultList = resultListRef.current;
    const searchStatus = searchStatusRef.current;
    const facet = facetRef.current;
    const pager = pagerRef.current;
    const sort = sortRef.current;
    const summary = summaryRef.current;

    dispatch(
      setControllers({
        searchBox,
        resultList,
        searchStatus,
        facet,
        pager,
        sort,
        summary,
      })
    );

    const unsubs = [
      searchBox.subscribe(() => {
        dispatch(setQuery(searchBox.state.value ?? ""));
        dispatch(setSuggestions(searchBox.state.suggestions ?? []));
      }),
      resultList.subscribe(() =>
        dispatch(setResults(resultList.state.results))
      ),
      searchStatus.subscribe(() => dispatch(setStatus(searchStatus.state))),
      facet.subscribe(() => dispatch(setFacet(facet.state))),
      pager.subscribe(() => dispatch(setPager(pager.state))),
      sort.subscribe(() => dispatch(setSort(sort.state))),
      summary.subscribe(() => dispatch(setSummary(summary.state))),
    ];

    return () => unsubs.forEach((u) => u());
  }, [dispatch, engine]);

  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      engine.executeFirstSearch();
    }
  }, [engine]);

  
const handleClickAnalytics = (e, item) => {
  // if (e) e.preventDefault(); 
  const { logDocumentOpen } = loadClickAnalyticsActions(engine);
    engine.dispatch(logDocumentOpen(item));
};

  return (
    <Box p={3} maxWidth={900} mx="auto">
      <InfoSection/>
      <SearchBox />
      <Suggestions />
      <Status />
      <Summary />
      <hr />
      <Facet engine={engine} />
      <hr />
      <Sort />
      <Results handleClickAnalytics={handleClickAnalytics}/>
      <Pager />
    </Box>
  );
}

export default SearchPage;
