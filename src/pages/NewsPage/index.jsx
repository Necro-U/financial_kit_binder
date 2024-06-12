// NewsPage.js
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  InputAdornment,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import NewsCard from "./NewsCard";

const NewsPage = () => {
  const [selectedCompany, setSelectedCompany] = useState("Nvidia");
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchNewsTerm, setSearchNewsTerm] = useState("");
  const [filter, setFilter] = useState("relevancy");
  const searchTimeout = useRef(null);

  const companies = [
    { id: 1, companyName: "Nvidia" },
    { id: 2, companyName: "Apple Inc." },
    { id: 3, companyName: "Amazon.com Inc." },
    { id: 4, companyName: "Tesla, Inc." },
    { id: 5, companyName: "Microsoft Corporation" },
    { id: 6, companyName: "Alphabet Inc. (Google)" },
    { id: 7, companyName: "Facebook, Inc." },
    { id: 8, companyName: "Alibaba Group Holding Limited" },
    { id: 9, companyName: "Johnson & Johnson" },
    { id: 10, companyName: "Visa Inc." },
  ];

  useEffect(() => {
    const fetchNewsForCompany = async (
      companyName,
      pageNumber = 1,
      searchNewsTerm = "",
      filter = "relevancy",
    ) => {
      try {
        const apiKey = "cbda4c04725546cbb4bf24b7c55a34e4";
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${companyName}+${searchNewsTerm}&page=${pageNumber}&pageSize=10&sortBy=${filter}&apiKey=${apiKey}`,
        );
        const data = await response.json();
        console.log(data);
        setNews(data.articles);
        setTotalPages(Math.ceil(data.totalResults / 10));
      } catch (error) {
        console.error(`Error fetching news for ${companyName}:`, error);
      }
    };

    if (selectedCompany) {
      fetchNewsForCompany(selectedCompany, page, searchNewsTerm, filter);
    }
  }, [selectedCompany, page, searchNewsTerm, filter]);

  const handleCompanyClick = (companyName) => {
    setSelectedCompany(companyName);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = () => {
    const filteredCompanies = companies.filter((company) =>
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return filteredCompanies;
  };

  const handleSearchNews = (event) => {
    clearTimeout(searchTimeout.current);
    const value = event.target.value;
    setSearchNewsTerm(value);

    searchTimeout.current = setTimeout(() => {
      setPage(1);
    }, 1500);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Dummy sentiment analysis
  const getSentiment = () => {
    const sentiments = ["positive", "negative"];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography sx={{ my: 4 }} variant="h3">
        News for {selectedCompany}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2, width: "60%" }}>
        <TextField
          fullWidth
          label="Search News"
          variant="outlined"
          onChange={handleSearchNews}
        />
        <FormControl fullWidth>
          <InputLabel>Filter By</InputLabel>
          <Select
            value={filter}
            onChange={handleFilterChange}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="relevancy">Relevancy</MenuItem>
            <MenuItem value="popularity">Popularity</MenuItem>
            <MenuItem value="publishedAt">Published Date</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-between",
          alignItems: "center",
        }}
      >
        <List component="nav" sx={{ alignSelf: "start", width: "20%" }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Companies
          </Typography>
          <TextField
            label="Search"
            variant="outlined"
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          {handleSearch().map((company, index) => (
            <ListItem
              key={index}
              button
              onClick={() => handleCompanyClick(company.companyName)}
            >
              <ListItemText primary={company.companyName} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ textAlign: "left", ml: 4, width: "80%" }}>
          <Grid container spacing={2}>
            {news.length > 0 &&
              news.map((article, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <NewsCard article={article} sentiment={getSentiment()} />
                </Grid>
              ))}
          </Grid>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              my: 4,
            }}
          >
            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewsPage;
