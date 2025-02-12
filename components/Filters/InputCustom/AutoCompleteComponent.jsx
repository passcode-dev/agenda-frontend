import { useState } from "react";
import { AutoComplete } from "antd";
import styled from "styled-components";
import { useToast } from "@/hooks/use-toast";

const AutoCompleteCustom = styled(AutoComplete)`
    font-size: 14px !important;
    width: 100% !important;
    height: 42px;
`

const AutoCompleteComponent = ({ value, setValue }) => {
    const [options, setOptions] = useState([]);
    const { toast } = useToast();


    const fetchOptionsFromApi = async (searchText) => {
        try {
            const response = await fetch(`/api/teachers?name=${searchText}`);
            if (!response.ok) {
                throw new Error("Erro ao buscar os dados da API");
            }
            const data = await response.json();


            if (data?.data?.teachers && Array.isArray(data.data.teachers)) {
                return data.data.teachers;
            } else {
                console.error("A resposta da API não contém um array de professores:", data);
                return [];
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao buscar os dados.",
                variant: "destructive",
                autoClose: 3000,
            });
            return [];
        }
    };

    const onSearch = async (text) => {
        if (text) {
            const results = await fetchOptionsFromApi(text);


            if (Array.isArray(results)) {
                setOptions(results.map(item => ({
                    value: `${item.name}`,
                    key: item.id
                })));
            } else {
                setOptions([]);
            }
        } else {
            setOptions([]);
        }
    };



    const onChange = (value) => {
        setValue(value);
    };

    return (
        <AutoCompleteCustom
            options={options}
            style={{ width: 200 }}
            onSelect={(value) => setValue(value)}
            onSearch={onSearch}
            onChange={onChange}
            value={value}
            placeholder="Digite para buscar"
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
        />
    );
};

export default AutoCompleteComponent;
