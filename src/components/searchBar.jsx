import React, { useState } from "react";

export default function SearchBar({ data, searchField, placeholder, onSearch }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filteredData = data.filter((item) =>
            item[searchField]?.toLowerCase().includes(term.toLowerCase())
        );
        onSearch(filteredData);
    };

    return (
        <div style={styles.container}>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder={placeholder || "Search..."}
                style={styles.input}
            />
        </div>
    );
}

const styles = {
    container: {
        width: "100%",
    },
    input: {
        width: "100%",
        padding: "10px 40px 10px 10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "16px",
        outline: "none",
    },
};
