import * as React from 'react';
import { Select } from './select';
import { Label } from './label';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
  minTime?: string;
  maxTime?: string;
  interval?: number;
}

export function TimePicker({
  value,
  onChange,
  className,
  label,
  minTime = '00:00',
  maxTime = '23:59',
  interval = 30,
}: TimePickerProps) {
  const timeOptions = React.useMemo(() => {
    const options: string[] = [];
    const [minHour, minMinute] = minTime.split(':').map(Number);
    const [maxHour, maxMinute] = maxTime.split(':').map(Number);
    const minMinutes = minHour * 60 + minMinute;
    const maxMinutes = maxHour * 60 + maxMinute;

    for (let minutes = minMinutes; minutes <= maxMinutes; minutes += interval) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(time);
    }

    return options;
  }, [minTime, maxTime, interval]);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        {timeOptions.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </Select>
    </div>
  );
} 