// NewsCard.js
import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Link,
  Box,
} from "@mui/material";

const NewsCard = ({ article, sentiment }) => {
  return (
    <a href={article.url} target="_blank" style={{ textDecoration: "none" }}>
      <Card
        sx={{
          maxWidth: 345,
          backgroundColor: sentiment === "positive" ? "#e0f7fa" : "#ffebee",
          borderLeft: `5px solid ${sentiment === "positive" ? "#00acc1" : "#d32f2f"}`,
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={article.urlToImage}
          alt={article.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {article.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Author: {article.author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Published At: {new Date(article.publishedAt).toLocaleString()}
          </Typography>
          <Link href={article.url} target="_blank" rel="noopener">
            Read More
          </Link>
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: sentiment === "positive" ? "#00acc1" : "#d32f2f",
                fontWeight: "bold",
              }}
            >
              Sentiment: {sentiment}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </a>
  );
};

export default NewsCard;
