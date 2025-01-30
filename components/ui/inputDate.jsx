import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

export default function InputDate({ value, setInputValue }) {



    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <DemoContainer components={["DateField"]}>
                <DateField
                    value={value ? dayjs(value) : null}
                    onChange={(e) => {
                        const formattedDate = e ? e.format("DD-MM-YYYY") : "";
                        console.log("Nova data:", formattedDate);
                        setInputValue(formattedDate);
                      }}
                    className="w-full"
                    label="Digite a data"
                    format="DD/MM/YYYY"
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}


