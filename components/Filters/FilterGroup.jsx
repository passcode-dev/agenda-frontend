import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
`;

const Filter = styled.a`
    cursor: pointer;
    padding: 5px 10px;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    display: flex;
    align-items: center;
    text-decoration: none;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover {
        border-color: #007bff;
    }
`;

const Name = styled.span`
    font-weight: bold;
    margin-right: 6px;
    color: #333;
`;

const Value = styled.span`
    color: #666;
`;

const Icon = styled.i`
    font-size: 16px;
    margin-right: 8px;
    color: #007bff;
`;

const FilterGroup = ({ filterSchema }) => {
    const searchParams = useSearchParams();
    const [filter, setFilter] = useState([]);

    useEffect(() => {
        const params = [];
        searchParams.forEach((value, key) => {
            if (key != 'page')
                params.push({ key, value });
        });
        setFilter(params);
    }, [searchParams]);

    return (
        <>
            <GlobalStyle />

            <div className="flex flex-wrap justify-end gap-x-2 my-3">
                {filter.map((filterItem, index) => {
                    const schema = Array.isArray(filterSchema)
                        ? filterSchema.find(item => item.parameterName === filterItem.key)
                        : null;

                    return (
                        <div key={index}>
                            <Filter>
                                {schema?.icon}
                                <div>
                                    <Name>{schema?.name}:</Name>
                                    <Value>{filterItem.value}</Value>
                                </div>
                            </Filter>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default FilterGroup;
