import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TabsLayout from "@/pages/EquitiesPage";
import { useParams } from "react-router-dom";
import FinancialsTabsLayout from "@/pages/EquitiesFinancialsPage";
import { getInfo } from "@/actions/stockActions";

const ProfileSubpage = () => {
  const dispatch = useDispatch();
  const { symbol } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(getInfo(symbol));
      setData(result.payload);
      console.log(result.payload);
    };

    fetchData();
  }, [dispatch, symbol]);

  return (
    <TabsLayout>
      <FinancialsTabsLayout>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ mb: 2 }}></Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h5">Basic Information</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography>Company Name: {data?.companyName}</Typography>
                <Typography>Industry: {data?.industry}</Typography>
                <Typography>Sector: {data?.sector}</Typography>
                <Typography>
                  Full-Time Employees: {data?.fullTimeEmployees}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h5">Contact Information</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography>
                  Address: {data?.address}, {data?.city}, {data?.state},{" "}
                  {data?.zip}
                </Typography>
                <Typography>Country: {data?.country}</Typography>
                <Typography>Phone: {data?.phone}</Typography>
                <Typography>
                  Website: <a href={data?.website}>{data?.website}</a>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h5">Key Executives</Typography>
                <Divider sx={{ my: 2 }} />
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f3f3f3" }}>
                        <TableCell>Name</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Year Born</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.keyExecutives?.map((executive, index) => (
                        <TableRow key={index}>
                          <TableCell>{executive.name}</TableCell>
                          <TableCell>{executive.title}</TableCell>
                          <TableCell>{executive.yearBorn}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </FinancialsTabsLayout>
    </TabsLayout>
  );
};

export default ProfileSubpage;
