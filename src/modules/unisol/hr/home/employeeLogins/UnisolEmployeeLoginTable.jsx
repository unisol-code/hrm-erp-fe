import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Tooltip,
  CircularProgress,
  Button,
} from "@mui/material";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useEmployeeLogin from "../../../../../hooks/unisol/homeDashboard/useEmployeeLogin";
import Pagination from "../../../../../components/Pagination";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import BreadCrumb from "../../../../../components/BreadCrumb";

const UnisolEmployeeLoginTable = () => {
  const {
    perCompanyEmployeeLogin,
    fetchPerCompanyEmployeeLogin,
    resetPerCompanyEmployeeLogin,
    fetchEmployeeLoginDetailById,
    loading,
  } = useEmployeeLogin();

  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const companyName = perCompanyEmployeeLogin?.company;
  console.log(perCompanyEmployeeLogin);

  const companies = [
    {
      id: "unisol",
      name: "UniSol",
      tableColor: "#4FA8E533",
      color: "#4FA8E5",
      seeColor: "#89CFF077",
    },
    {
      id: "SurgiSol",
      name: "SurgiSol",
      tableColor: "#C6693C33",
      color: "#C6693C",
      seeColor: "#C6693C22",
    },
    {
      id: "Enviro solution",
      name: "Enviro solution",
      tableColor: "#4A7E4C33",
      color: "#4A7E4C",
      seeColor: "#E8F5E8",
    },
    {
      id: "Ignite Sphere",
      name: "Ignite Sphere",
      tableColor: "#9683EC33",
      color: "#9683EC",
      seeColor: "#D6D8FB",
    },
  ];

  useEffect(() => {
    if (companyName) {
      setIsPageLoading(true);
      fetchPerCompanyEmployeeLogin(companyName, page, limit).finally(() =>
        setIsPageLoading(false)
      );
    }
  }, [companyName, page, limit]);

  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  const onItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
  };

  const handleEdit = (emp) => {
    const id = emp?._id;
    fetchEmployeeLoginDetailById(id, companyName);
    navigate(`/employeeLogins/employeeEdit/${id}`);
  };

  const company = companies.find((com) => com.name === companyName);
  const employees = perCompanyEmployeeLogin?.employees || [];

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Employee Login", href: "/employeeLogins" },
          { text: `${companyName || ""} Employee Login Management` },
        ]}
      />

      <Box>
        {company && (
          <Card variant="outlined" sx={{ borderColor: company.color }}>
            <CardContent
              sx={{
                backgroundColor: company.color,
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 2,
                px: 3,
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <BusinessIcon />
                <Typography variant="subtitle1" fontWeight={600}>
                  {loading ? "Loading..." : companyName}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <PeopleIcon fontSize="small" />
                <Typography variant="body2">
                  {loading
                    ? "..."
                    : `${perCompanyEmployeeLogin?.pagination?.totalCount} employees`}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        {isPageLoading ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Card variant="outlined">
            <CardContent sx={{ p: 0 }}>
              <TableContainer component={Paper} variant="outlined">
                <Table size="medium">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                      {[
                        "Employee ID",
                        "Employee Name",
                        "Username",
                        "Password",
                        "Action",
                      ].map((label) => (
                        <TableCell
                          key={label}
                          align="center"
                          sx={{ fontWeight: "bold", fontSize: 14 }}
                        >
                          {label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.length > 0 ? (
                      employees.map((emp) => (
                        <TableRow
                          key={emp._id}
                          hover
                          sx={{
                            backgroundColor: company?.tableColor || "#fff",
                            transition: "background 0.2s ease",
                          }}
                        >
                          <TableCell align="center">{emp.employeeId}</TableCell>
                          <TableCell align="center">{emp.fullName}</TableCell>
                          <TableCell align="center">
                            {emp.officialEmail}
                          </TableCell>
                          {/* <TableCell align="center">{emp.empPassword || "********"}</TableCell> */}
                          <TableCell align="center">{"********"}</TableCell>

                          <TableCell align="center">
                            <Tooltip title="Edit" arrow>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(emp)}
                              >
                                <FaEdit />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No employee data available.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {employees.length > 0 && (
                  <Pagination
                    currentPage={
                      perCompanyEmployeeLogin?.pagination?.currentPage || 1
                    }
                    totalPages={
                      perCompanyEmployeeLogin?.pagination?.totalPages || 1
                    }
                    totalItems={
                      perCompanyEmployeeLogin?.pagination?.totalCount || 0
                    }
                    onPageChange={onPageChange}
                    onItemsPerPageChange={onItemsPerPageChange}
                  />
              )}
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </div>
  );
};

export default UnisolEmployeeLoginTable;
