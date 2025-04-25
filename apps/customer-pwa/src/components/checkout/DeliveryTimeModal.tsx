import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@repo/ui/components/ui/sheet';
import { RadioGroup as RadioGroupRoot, RadioGroupItem as RadioGroupItemRoot } from '@repo/ui/components/ui/radio-group';
import { Label } from '@repo/ui/components/ui/label';
import { Button } from '@repo/ui/components/ui/button';
import { DayPicker } from 'react-day-picker';
import { addDays, format, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import 'react-day-picker/dist/style.css';

export type DeliveryType = 'now' | 'schedule';

interface DeliveryTimeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (type: DeliveryType, date?: Date) => void;
  initialType?: DeliveryType;
  initialDate?: Date;
}

// Type-safe RadioGroup wrapper
const RadioGroup = RadioGroupRoot as React.FC<{
  value: DeliveryType;
  onValueChange: (value: DeliveryType) => void;
  className?: string;
  children: React.ReactNode;
}>;

// Type-safe RadioGroupItem wrapper
const RadioGroupItem = RadioGroupItemRoot as React.FC<{
  value: DeliveryType;
  id: string;
  className?: string;
}>;

export function DeliveryTimeModal({
  isOpen,
  onOpenChange,
  onConfirm,
  initialType = 'now',
  initialDate,
}: DeliveryTimeModalProps) {
  const { t } = useTranslation();
  const [deliveryType, setDeliveryType] = React.useState<DeliveryType>(initialType);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(initialDate || new Date());
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(
    initialDate ? format(initialDate, 'HH:mm') : undefined
  );

  // Calculate date range
  const today = startOfToday();
  const maxDate = addDays(today, 14); // 14 days from today

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setDeliveryType(initialType);
      setSelectedDate(initialDate || new Date());
      setSelectedTime(initialDate ? format(initialDate, 'HH:mm') : undefined);
    }
  }, [isOpen, initialType, initialDate]);

  // Generate time slots between 9:00 and 22:00 with 30-minute intervals
  const timeSlots = React.useMemo(() => {
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 22;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minutes of [0, 30]) {
        slots.push(
          `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        );
      }
    }
    return slots;
  }, []);

  const handleConfirm = () => {
    if (deliveryType === 'now') {
      onConfirm('now');
      onOpenChange(false);
    } else if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledDate = new Date(selectedDate);
      scheduledDate.setHours(hours, minutes);
      onConfirm('schedule', scheduledDate);
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col h-full w-full sm:max-w-lg">
        <div className="flex-1 overflow-y-auto">
          <SheetHeader className="px-6 pt-6">
            <SheetTitle>{t('checkout.deliveryTime.title')}</SheetTitle>
          </SheetHeader>

          <div className="p-6 space-y-6">
            <RadioGroup
              value={deliveryType}
              onValueChange={(value: DeliveryType) => {
                setDeliveryType(value);
                if (value === 'now') {
                  setSelectedDate(undefined);
                  setSelectedTime(undefined);
                }
              }}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="now" id="now" className="mt-1" />
                <Label htmlFor="now" className="flex flex-col cursor-pointer">
                  <span className="font-medium text-base">
                    {t('checkout.deliveryTime.express')}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">
                    {t('checkout.deliveryTime.expressDescription')}
                  </span>
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem value="schedule" id="schedule" className="mt-1" />
                <Label htmlFor="schedule" className="flex flex-col cursor-pointer">
                  <span className="font-medium text-base">
                    {t('checkout.deliveryTime.scheduled')}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">
                    {t('checkout.deliveryTime.scheduledDescription')}
                  </span>
                </Label>
              </div>
            </RadioGroup>

            {deliveryType === 'schedule' && (
              <div className="space-y-6">
                <div className="rounded-md border p-3 flex justify-center">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    defaultMonth={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={{ before: today, after: maxDate }}
                    fromDate={today}
                    toDate={maxDate}
                    locale={navigator.language === 'es' ? es : undefined}
                    showOutsideDays
                    fixedWeeks
                    modifiersStyles={{
                      selected: {
                        backgroundColor: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                      },
                      today: {
                        border: '1px solid hsl(var(--primary))',
                        color: 'hsl(var(--primary))',
                      }
                    }}
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: cn(
                        "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
                        "text-primary focus-visible:outline-none focus-visible:ring-2",
                        "focus-visible:ring-ring focus-visible:ring-offset-2"
                      ),
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: cn(
                        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                        "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                      ),
                      day: cn(
                        "h-9 w-9 p-0 font-normal",
                        "flex items-center justify-center rounded-md",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      ),
                      day_selected: "hover:bg-primary hover:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50",
                      day_disabled: "text-muted-foreground opacity-50 pointer-events-none",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t('checkout.deliveryTime.selectTime')}
                  </Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 rounded-md border p-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        className={cn(
                          'h-9',
                          selectedTime === time && 'bg-primary text-primary-foreground hover:bg-primary/90'
                        )}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t">
          <Button
            className="w-full"
            disabled={deliveryType === 'schedule' && (!selectedDate || !selectedTime)}
            onClick={handleConfirm}
          >
            {t('checkout.deliveryTime.confirm')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
} 