import { useState } from "react";
import { AutoComplete } from "antd"; // Ou outro pacote que você esteja usando
import styled from "styled-components";

const AutoCompleteCustom = styled(AutoComplete)`
    font-size: 14px !important;
    width: 100% !important;
    height: 42px;
`


const AutoCompleteComponent = ({ value, setValue }) => {
    const [options, setOptions] = useState([]); // Para armazenar as opções filtradas

    // Mock de dados para a pesquisa
    const mockData = [
        { id: 1, name: "Maçã" },
        { id: 2, name: "Banana" },
        { id: 3, name: "Laranja" },
        { id: 4, name: "Morango" },
        { id: 5, name: "Uva" },
        { id: 6, name: "Pera" },
        { id: 7, name: "Abacaxi" },
    ];

    // Função para simular a busca na API
    const fetchOptionsFromApi = (searchText) => {
        // Filtro simples para pesquisar nas opções pelo nome
        return mockData.filter((item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    // Função chamada durante a pesquisa
    const onSearch = (text) => {
        const results = fetchOptionsFromApi(text);
        setOptions(results);
    };


    // Função chamada quando o valor é alterado (ao digitar)
    const onChange = (value) => {
        setValue(value); // Atualiza o estado do valor no componente pai
    };

    return (
        <AutoCompleteCustom
            options={options.map((option) => ({ value: option.name }))}
            style={{ width: 200 }}
            onSelect={(value) => setValue(value)}
            onSearch={onSearch}
            onChange={onChange}
            value={value}
            placeholder="Digite para buscar"
            getPopupContainer={(triggerNode) => triggerNode.parentElement} // Define onde renderizar o dropdown
        />

    );
};

export default AutoCompleteComponent;