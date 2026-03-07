import { useState } from "react";
import Select, { StylesConfig } from "react-select";

interface OptionType {
    value: string;
    label: string;
}

interface TagProps {
    onChange: (value: OptionType | null) => void;
    options: OptionType[];
}

export default function Tag({ options, onChange }: TagProps) {
    const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

    const handleChange = (option: OptionType | null) => {
        setSelectedOption(option);
        onChange(option);
    };

    // Estilos personalizados para react-select siguiendo la línea HUD/Dark
    const customStyles: StylesConfig<OptionType, false> = {
        control: (base, state) => ({
            ...base,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: state.isFocused ? 'rgba(255, 237, 0, 0.5)' : 'rgba(30, 41, 59, 1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '7px',
            padding: '2px 8px',
            boxShadow: state.isFocused ? '0 0 10px rgba(255, 237, 0, 0.1)' : 'none',
            '&:hover': {
                borderColor: 'rgba(255, 237, 0, 0.3)',
            }
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: '#0a0a0a',
            border: '1px solid rgba(30, 41, 59, 1)',
            borderRadius: '7px',
            marginTop: '8px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 50
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? 'rgba(255, 237, 0, 0.1)' : 'transparent',
            color: state.isFocused ? '#ffed00' : 'white',
            cursor: 'pointer',
            fontSize: '14px',
            '&:active': {
                backgroundColor: 'rgba(255, 237, 0, 0.2)',
            }
        }),
        singleValue: (base) => ({
            ...base,
            color: 'white',
            fontSize: '14px'
        }),
        input: (base) => ({
            ...base,
            color: 'white'
        }),
        placeholder: (base) => ({
            ...base,
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: '14px'
        })
    };

    return (
        <Select
            name="tags"
            options={options}
            value={selectedOption}
            onChange={handleChange}
            isSearchable
            placeholder="Añadir temática..."
            styles={customStyles}
            noOptionsMessage={() => "No se encuentran etiquetas"}
        />

    );
}