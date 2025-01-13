import { FilterIcon, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Separator } from '../ui/separator';
import { useRouter, useSearchParams } from 'next/navigation';

const fadeInAndSlideDown = keyframes`
    from {
        opacity: 0;
        transform: translateY(-100%);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const fadeInAndSlideDownFilterModal = keyframes`
    from {
        opacity: 0;
        transform: translate(-150px,-100%);
    }
    to {
        opacity: 1;
        transform: translate(-150px,0);
    }
`;

const Backdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    z-index: 9998;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
`;

const Button = styled.button`
    margin-top: 10px;
    padding: 10px 16px;
    border: none;
    border-radius: 4px;
    width: 100%;
    background-color: #171717;
    color: white;
    font-size: 14px;
    cursor: pointer;
    align-self: center;
    &:hover {
        background-color: #171717e6;
    }
`;

const FilterOption = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 14px;
    justify-content: center;
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0;
        border-radius: 4px;
    }
`;

const FilterIconContainer = styled.div`
    cursor: pointer;
    padding: 8px;
    border-radius: 5px;
    background-color: #171717;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    &:hover {
        background-color: #171717e6;
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
    padding: 16px;
    width: 200px;
    transform: translateX(-150px);
    animation: ${fadeInAndSlideDownFilterModal} 0.5s ease;
`;

const ModalHeader = styled.h3`
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 16px;
`;

const FilterName = styled.span`
    padding-left: 5px;
    flex-grow: 1;
    font-size: 14px;
    color: #555;
    text-align: start;
`;

const GenericModalContent = styled.div`
    position: absolute;
    top: 150px;
    left: 0;
    right: 0;
    margin: auto;
    max-width: 350px;
    height: 250px;
    display: flex;
    flex-direction: column;
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    animation: ${fadeInAndSlideDown} 0.5s ease;
`;

const Icon = styled.i`
    font-size: 16px;
    margin-right: 8px;
    color: #007bff;
`;

const GenericModal = ({ isOpen, onClose, filterName, onSubmit, selectedFilter, searchParams, router }) => {
    const [inputValue, setInputValue] = useState('');

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(selectedFilter.parameterName, inputValue);
        const newParams = new URLSearchParams(window.location.search);
        newParams.set(selectedFilter.parameterName, inputValue);
        router.push(`${window.location.pathname}?${newParams.toString()}`);
        onSubmit(inputValue);
        onClose();
    };


    return (
        <>
            <Backdrop onClick={onClose} />
            <GenericModalContent>
                <div>
                    <ModalHeader>{filterName}</ModalHeader>
                    <Separator />
                </div>
                <div className='flex flex-col justify-center h-full'>
                    {selectedFilter?.renderCell
                        ? selectedFilter?.renderCell({ value: inputValue, onChange: handleInputChange })
                        : (
                            <Input
                                type="text"
                                defaultValue={searchParams.get(selectedFilter.parameterName)}
                                onChange={handleInputChange}
                                placeholder={`Digite o valor para ${filterName}`}
                            />
                        )
                    }

                    <Button onClick={handleSubmit}>Salvar</Button>
                </div>
            </GenericModalContent>
        </>
    );
};

const FilterModal = ({ filterSchema }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenericModalOpen, setIsGenericModalOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const searchParams = useSearchParams()
    const modalRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const openModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openGenericModal = (filter) => {
        setIsModalOpen(false);
        setSelectedFilter(filter);
        setIsGenericModalOpen(true);
    };

    const closeGenericModal = () => {
        setIsGenericModalOpen(false);
        setSelectedFilter(null);
    };

    const handleFilterSubmit = (value) => {
        console.log(`Valor para ${selectedFilter?.name}:`, value);
    };
    const clearFilters = useCallback(() => {
        router.push(window.location.pathname);
        setIsModalOpen(false);
    }, [router]);
    return (
        <div>
            <FilterIconContainer onClick={openModal}>
                <FilterIcon className="w-full h-full text-white" />
            </FilterIconContainer>
            {isModalOpen && (
                <ModalContainer ref={modalRef}>
                    <ModalHeader>Filtros</ModalHeader>
                    <Separator />
                    <FilterOption onClick={clearFilters}>
                        <div >
                            <X  className='text-black'/>
                        </div>
                        <FilterName>Limpar Filtros</FilterName>
                    </FilterOption>
                    <Separator />
                    {filterSchema.map((filter, index) => (
                        <React.Fragment key={index}>
                            <FilterOption onClick={() => openGenericModal(filter)}>
                                <div >
                                    {filter.icon}
                                </div>
                                <FilterName>{filter.name}</FilterName>
                            </FilterOption>
                            {index < filterSchema.length - 1 && <Separator />}
                        </React.Fragment>
                    ))}
                </ModalContainer>
            )}
            <GenericModal
                isOpen={isGenericModalOpen}
                onClose={closeGenericModal}
                filterName={selectedFilter?.name || 'Filtro'}
                onSubmit={handleFilterSubmit}
                selectedFilter={selectedFilter}
                searchParams={searchParams}
                router={router}
            />
        </div>
    );
};

export default FilterModal;
