import { Paper } from '@mui/material';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import getLPTheme from './getLPTheme';
import userService from '../../services/user.service';
import Loader from '../loader/loader';


export default function CustomTable({ mode }) {
    const [tableData, setTableData] = useState([]);
    const [showSpinner, setSpinner] = useState(false);
    const LPtheme = createTheme(getLPTheme(mode));


    const columns = [
        { field: 'indexId', headerName: 'ID', width: 70 },
        { field: 'firstName', headerName: 'First Name', width: 70 },
        { field: 'lastName', headerName: 'Last Name', width: 200 },
        {
            field: 'loginId', headerName: 'Last Login Date', width: 200
        },
        { field: 'phone', headerName: 'Phone', width: 150 },
        { field: 'roleName', headerName: 'Role Name', width: 150 },
        { field: 'mobileId', headerName: 'Mobile Id', width: 200 }
    ];

    const StyledPaper = styled(Paper)(({ theme }) => ({
        height: 450,
        padding: '1em',
        paddingBottom: '8em',
        width: '100%',
        border: theme.palette.mode === 'dark' ? '' : '1px solid #ccc',
        backgroundColor: theme.palette.mode === 'dark' ? '#090E10' : '#ffffff',

    }));

    useEffect(() => {
        const fetchTableData = async () => {
            setSpinner(true);
            try {
                const response = await userService.getTableData();
                setTableData(response.data.result.userList);
            } catch (error) {
                console.error('Error Table Data receipts:', error);
            } finally {

            }
        };

        setTimeout(() => {
            setSpinner(false);
        }, 2000);

        fetchTableData();
    }, []);


    return (
        <ThemeProvider theme={LPtheme}>
            <Container
                id="testimonials"
                sx={{
                    pt: { xs: 6, sm: 16 },
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: { xs: 3, sm: 6 },
                    minWidth: '100%'
                }}
            >
                <StyledPaper elevation={3} className="container" id="receipt-form"
                    style={{
                        boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 10px 10px, rgba(60, 64, 67, 0.15) 0px 2px 10px 10px'
                    }}
                >
                    <DataGrid
                        rows={tableData.map((item, index) => ({ indexId: index + 1, ...item }))}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        sx={{
                            height: '125%',
                            border: `1px solid ${LPtheme.palette.grey[300]}`,
                            '& .MuiDataGrid-cell': {
                                borderBottom: `1px solid ${LPtheme.palette.grey[300]}`,
                                color: LPtheme.palette.text.primary,
                                backgroundColor: LPtheme.palette.background.default,
                                '&:hover': {
                                    backgroundColor: LPtheme.palette.action.selected,
                                },
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: LPtheme.palette.grey[100],
                                borderBottom: `1px solid ${LPtheme.palette.grey[300]}`,
                                color: LPtheme.palette.text.primary,
                            },
                            '& .MuiDataGrid-footerContainer': {
                                backgroundColor: LPtheme.palette.background.paper,
                                color: LPtheme.palette.text.primary,
                            },
                            '& .MuiTablePagination-root': {
                                color: LPtheme.palette.text.secondary,
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: LPtheme.palette.action.hover,
                            },
                        }}

                    />
                    {showSpinner && <Loader />}
                </StyledPaper>
            </Container>
        </ThemeProvider>
    );
}
