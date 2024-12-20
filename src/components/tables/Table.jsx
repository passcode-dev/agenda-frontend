import React, { useState } from "react";
import Checkbox from '@mui/material/Checkbox';

const btnStyle = {
    backgroundColor: "black",
    color: "white",
    border: "none",
    padding: "5px 10px",
};

function Table({
    list,
    columns,
    pageNum = 0,
    pageSize = 10,
}) {
    const [page, setPage] = useState(pageNum);

    // Inicializa todos os itens como não selecionados
    const initialCheckedItems = {};
    list.slice(pageSize * page, pageSize * page + pageSize).forEach((_, index) => {
        initialCheckedItems[index] = false;
    });

    const [checkedItems, setCheckedItems] = useState(initialCheckedItems);
    const [allChecked, setAllChecked] = useState(false);

    const onBack = () => {
        setPage(page - 1 > -1 ? page - 1 : page);
    };

    const onNext = () => {
        setPage(page + 1 < list.length / pageSize ? page + 1 : page);
    };

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setAllChecked(checked);

        const newCheckedItems = {};
        if (checked) {
            list.slice(pageSize * page, pageSize * page + pageSize).forEach((_, index) => {
                newCheckedItems[index] = true;
            });
        } else {
            list.slice(pageSize * page, pageSize * page + pageSize).forEach((_, index) => {
                newCheckedItems[index] = false;
            });
        }
        setCheckedItems(newCheckedItems);
    };

    const handleCheckboxChange = (rowIndex, e) => {
        const newCheckedItems = {
            ...checkedItems,
            [rowIndex]: e.target.checked,
        };

        setCheckedItems(newCheckedItems);

        // Atualiza o estado de "selecionar todos"
        const allChecked = Object.keys(newCheckedItems).length === pageSize &&
            Object.values(newCheckedItems).every((checked) => checked);
        setAllChecked(allChecked);
    };

    return (
        <div className="text-center flex flex-col items-center justify-center bg-black">
            {list.length > 0 && (
                <table
                    className="max-w-3xl"
                    cellSpacing="0"
                    style={{ width: "100%", padding: "5px 10px", background: "white" }}
                >
                    <thead style={{ backgroundColor: "white", color: "#9e9e9e", borderBottom: "1px solid #ccc" }}>
                        <tr>
                            <th style={{ textAlign: "center", verticalAlign: "middle" }}>
                                <Checkbox
                                    checked={allChecked}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            {columns.map((col, index) => (
                                <th key={index} style={{ padding: "5px 10px" }}>
                                    {col.headerName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {list.slice(pageSize * page, pageSize * page + pageSize).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td style={{ textAlign: "center", verticalAlign: "middle", borderBottom: "1px solid #ccc" }}>
                                    <Checkbox
                                        checked={!!checkedItems[rowIndex]}
                                        onChange={(e) => handleCheckboxChange(rowIndex, e)}
                                    />
                                </td>
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        style={{ padding: "5px 10px", textAlign: "center", borderBottom: "1px solid #ccc" }}
                                    >
                                        {col.renderCell
                                            ? col.renderCell({ row })
                                            : col.valueGetter
                                                ? col.valueGetter(row[col.field])
                                                : row[col.field]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Table;
