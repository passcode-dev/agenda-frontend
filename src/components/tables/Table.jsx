import { Checkbox, Button, Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useEffect, useState } from "react";

function Table({
    list,
    columns,
    pageNum = 0,
    pageSize = 10,
    allChecked,
    setAllChecked,
    selectedRows,
    setSelectedRows,
}) {
    const [page, setPage] = useState(pageNum);

    useEffect(() => {
        const initialCheckedItems = {};
        list.slice(pageSize * page, pageSize * page + pageSize).forEach((_, index) => {
            initialCheckedItems[index] = false;
        });
        setSelectedRows([]);
        setAllChecked(false);
    }, [page, list, pageSize, setAllChecked, setSelectedRows]);

    const onBack = () => {
        setPage(page - 1 > -1 ? page - 1 : page);
    };

    const onNext = () => {
        setPage(page + 1 < list.length / pageSize ? page + 1 : page);
    };

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setAllChecked(checked);

        const selectedRows = [];
        list.slice(pageSize * page, pageSize * page + pageSize).forEach((row, index) => {
            if (checked) {
                selectedRows.push(row);
            }
        });

        setSelectedRows(selectedRows);
    };

    const handleCheckboxChange = (rowIndex, e) => {
        const row = list[pageSize * page + rowIndex];
        const newSelectedRows = [...selectedRows];

        if (e.target.checked) {
            newSelectedRows.push(row);
        } else {
            const index = newSelectedRows.findIndex((r) => r === row);
            if (index !== -1) {
                newSelectedRows.splice(index, 1);
            }
        }

        setSelectedRows(newSelectedRows);
        setAllChecked(newSelectedRows.length === pageSize);
    };

    return (
        <div className="text-center flex flex-col items-center justify-center">
            {list.length > 0 && (
                <TableContainer component={Paper} style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}>
                    <MuiTable sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">
                                    <Checkbox
                                        checked={allChecked}
                                        onChange={handleSelectAll}
                                        color="primary"
                                    />
                                </TableCell>
                                {columns.map((col, index) => (
                                    <TableCell key={index} align="center" style={{ fontWeight: "bold" }}>
                                        {col.headerName}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.slice(pageSize * page, pageSize * page + pageSize).map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    <TableCell align="center">
                                        <Checkbox
                                            checked={selectedRows.includes(row)}
                                            onChange={(e) => handleCheckboxChange(rowIndex, e)}
                                            color="primary"
                                        />
                                    </TableCell>
                                    {columns.map((col, colIndex) => (
                                        <TableCell key={colIndex} align="center" style={{ borderBottom: "1px solid #ddd" }}>
                                            {col.renderCell ? col.renderCell({ row }) : col.valueGetter ? col.valueGetter(row[col.field]) : row[col.field]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </MuiTable>
                </TableContainer>
            )}
            <div style={{ marginTop: "20px" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onBack}
                    style={{ marginRight: "10px", padding: "6px 16px", borderRadius: "4px" }}
                    disabled={page === 0}
                >
                    Anterior
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onNext}
                    style={{ padding: "6px 16px", borderRadius: "4px" }}
                    disabled={page + 1 >= Math.ceil(list.length / pageSize)}
                >
                    Próximo
                </Button>
            </div>
        </div>
    );
}

export default Table;
