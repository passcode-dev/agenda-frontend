import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";



const CustomInputPassword = styled(OutlinedInput)`
    margin-bottom: 16px;
    border-radius: 4px;
    

    &.Mui-focused {
    box-shadow: none;
    border-color: #171717;
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: #c5c5c5 !important;
  }

    label {
      font-size: 1rem;
      font-weight: 600;
      color: #555;
      margin-bottom: 8px;
    }
  
    input {
      width: 100%;
      height: 13px;
      padding: 12px;
      border-radius: 4px;
      font-size: 1rem;
      outline: none;
      transition: all 0.3s ease;
  
      &:focus {
        border-color: unset !important;
      }
  
      &::placeholder {
        color: #aaa;
      }
    }
  `;




export default function InputPassword({onChange}) {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    return (
        <FormControl  variant="outlined">
            <label>Password</label>
            <CustomInputPassword
                
                onChange={(e) => onChange("password",e.target.value)}
                
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={
                                showPassword ? 'hide the password' : 'display the password'
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility
                            />}
                        </IconButton>
                    </InputAdornment>
                }
                
            />
        </FormControl>
    )

}