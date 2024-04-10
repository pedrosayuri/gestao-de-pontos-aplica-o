import { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React from 'react';
import 'dayjs/locale/pt-br';

interface DatePickerValueProps {
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
}

export default function DatePickerValue({ value: propValue, onChange }: DatePickerValueProps) {
  const [value, setValue] = React.useState<Dayjs | null>(propValue);

  React.useEffect(() => {
    setValue(propValue || null);
  }, [propValue]);

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DatePicker
          label="Selecione uma data"
          value={value}
          format='DD/MM/YYYY'
          onChange={handleChange}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
