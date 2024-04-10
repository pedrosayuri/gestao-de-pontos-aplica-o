import { useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import React from 'react';

interface TimePickerValueProps {
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
}

export default function TimePickerViewRenderers({ value: propValue, onChange }: TimePickerValueProps) {
  const [selectedTime, setSelectedTime] = useState(dayjs() as Dayjs | null);

  React.useEffect(() => {
    setSelectedTime(propValue || null);
  }, [propValue])

  const handleChange = (newValue: Dayjs | null) => {
    if (newValue) {
        setSelectedTime(newValue);
        if (onChange) {
            onChange(newValue);
        }
    } else {
        setSelectedTime(dayjs().hour(0).minute(0)); 
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <DemoContainer components={['TimePicker']}>
        <TimePicker
          label="Selecione um horário"
          value={selectedTime}
          onChange={handleChange}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
