import { FilterIcon } from 'lucide-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Separator } from '../ui/separator';

const FilterIconContainer = styled.div`
    cursor: pointer;
    padding: 12px;
    border-radius: 50%;
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s ease, transform 0.3s ease;
    width: 40px;
    &:hover {
        background-color: #e0e0e0;
        transform: scale(1.1);
    }
`;

const ModalContainer = styled.div`
    position: fixed;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    width: 250px;
    transform: translateX(-150px);

`;

const ModalHeader = styled.h3`
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin: 0;
`;

const FilterOption = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
`;

const FilterName = styled.span`
    font-size: 14px;
    color: #555;
    padding: 0 10px;
`;

const FilterModal = ({ filterSchema }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({});

    const openModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        setFilters(prevFilters => ({
            ...prevFilters,
            [field]: value
        }));
    };

    return (
        <div>
            <FilterIconContainer onClick={openModal}>
                <FilterIcon className="w-5 h-5 text-gray-700" />
            </FilterIconContainer>
            {isModalOpen && (
                <ModalContainer>
                    <ModalHeader>Filtros</ModalHeader>
                    <Separator />
                    {filterSchema.map((filter, index) => (
                        <FilterOption key={index}>
                            <FilterName>{filter.name}</FilterName>
                            <Separator />
                        </FilterOption>
                    ))}
                </ModalContainer>
            )}
        </div>
    );
};

export default FilterModal;
