import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import httpClient from "@/lib/http/httpClient";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const SelectAutoComplete = ({
  value,
  setValue,
  api,
  label,
  labelKey,
  valueKey,
  filterParam,
  renderOption,
  arrayKey,
}) => {
  const [options, setOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [searchText, setSearchText] = useState("");

  // Para evitar chamadas excessivas à API enquanto o usuário digita
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText) {
        onSearch(searchText);
      }
    }, 300); // Tempo de debounce de 300ms

    return () => clearTimeout(timeoutId); // Limpa o timeout ao mudar o valor
  }, [searchText]);

  // Função para buscar dados na API
  const fetchOptionsFromApi = async (searchText) => {
    try {
      const response = await httpClient.get(
        `${api}?${filterParam}=${searchText}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar os dados da API");
      }
      const data = await response.json();
      if (data?.data?.[arrayKey] && Array.isArray(data.data[arrayKey])) {
        return data.data[arrayKey];
      } else {
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

  // Função para lidar com a pesquisa no autocomplete
  const onSearch = async (text) => {
    const results = await fetchOptionsFromApi(text);
    if (Array.isArray(results)) {
      const filteredResults = results.filter(
        (item) => !value.some((v) => v[valueKey] === item[valueKey])
      );

      setOptions(
        filteredResults.map((item) => ({
          label: renderOption ? renderOption(item) : item[labelKey],
          value: item,
        }))
      );
      setIsDropdownOpen(true);
    }
  };

  // Função para lidar com a alteração dos valores selecionados
  const onChange = (newValue) => {
    setValue(newValue);
  };

  const handleSelect = (selectedValue) => {
    if (!value.some((val) => val[valueKey] === selectedValue[valueKey])) {
      // Cria um novo array sem o item selecionado
      const newOptions = options.filter((option) => option.value[valueKey] !== selectedValue[valueKey]);
      setOptions(newOptions); // Atualiza o estado com o novo array de opções
      onChange([...value, selectedValue]); // Adiciona o item selecionado à lista de "value"
    }
    // Não fechar o dropdown após a seleção
  };
  

  const handleClear = () => {
    onChange([]);
    setIsDropdownOpen(false);
  };

  // Detecta se clicou fora do input ou da lista de opções
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        <Input
          ref={inputRef}
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)} // Atualiza o texto da busca
          placeholder="Digite para buscar"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isDropdownOpen && options.length > 0 && (
        <div
          ref={dropdownRef}
          className="mt-3 w-full bg-white rounded-lg shadow-md border border-gray-200"
        >
          <ul className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <li
                className="p-3 hover:bg-blue-100 cursor-pointer rounded-md transition duration-200"
                key={option.value[valueKey]} // Usando o valueKey como chave única
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Itens Selecionados
        </h3>
        <ul className="flex flex-wrap mt-2 gap-2 text-base">
          {value.map((selectedValue, index) => (
            <li
              key={index}
              className="flex items-center bg-gray-50 p-2 rounded-lg space-x-2 mb-2"
            >
              <span className="flex-grow">
                {renderOption
                  ? renderOption(selectedValue)
                  : selectedValue[labelKey]}{" "}
                {/* Renderiza usando a função de customização */}
              </span>
              <button
                type="button" // Garante que o botão não seja um submit
                onClick={(e) => {
                  e.preventDefault();
                  onChange(
                    value.filter(
                      (id) => id[valueKey] !== selectedValue[valueKey]
                    )
                  );
                  setOptions((prevOptions) => [
                    ...prevOptions,
                    {
                      label: renderOption
                        ? renderOption(selectedValue)
                        : selectedValue[labelKey],
                      value: selectedValue,
                    },
                  ]);
                }}
              >
                <X />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectAutoComplete;
