import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@repo/ui/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@repo/ui/components/ui/radio-group';
import { Label } from '@repo/ui/components/ui/label';
import { Button } from '@repo/ui/components/ui/button';
import { DayPicker } from 'react-day-picker';
import { addDays, format, isAfter, isBefore, startOfToday } from 'date-fns';
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

  // Debug logging for state changes
  React.useEffect(() => {
    console.log('State updated:', {
      deliveryType,
      selectedDate: selectedDate?.toISOString(),
      selectedTime,
      isButtonEnabled: !(deliveryType === 'schedule' && (!selectedDate || !selectedTime))
    });
  }, [deliveryType, selectedDate, selectedTime]);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setDeliveryType(initialType);
      setSelectedDate(initialDate || new Date());
      setSelectedTime(initialDate ? format(initialDate, 'HH:mm') : undefined);
    }
  }, [isOpen, initialType, initialDate]);

  const today = startOfToday();
  const maxDate = addDays(today, 7);

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

  // Generate time slots between 9:00 and 22:00 with 30-minute intervals
  const timeSlots = React.useMemo(() => {
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 22;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minutes of [0, 30]) {
        if (hour === endHour && minutes > 0) continue;
        slots.push(
          `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        );
      }
    }
    return slots;
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <div className="flex flex-col h-[100dvh] sm:h-full">
          <div className="p-6 border-b">
            <SheetHeader>
              <SheetTitle>{t('checkout.deliveryTime.title')}</SheetTitle>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <RadioGroup
                value={deliveryType}
                onValueChange={(value: DeliveryType) => {
                  console.log('Delivery type changed:', value);
                  setDeliveryType(value);
                  if (value === 'now') {
                    setSelectedDate(undefined);
                    setSelectedTime(undefined);
                  }
                }}
                className="flex flex-col gap-4"
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
                <div className="space-y-6 mt-6">
                  <div className="rounded-md border p-3">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      defaultMonth={selectedDate}
                      onSelect={(date) => {
                        console.log('Date selected:', date?.toISOString());
                        setSelectedDate(date);
                      }}
                      disabled={[
                        { before: today },
                        { after: maxDate }
                      ]}
                      locale={es}
                      showOutsideDays
                      fixedWeeks
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {t('checkout.deliveryTime.selectTime')}
                    </Label>
                    <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto rounded-md border p-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          className={cn(
                            'h-9',
                            selectedTime === time && 'bg-primary text-primary-foreground hover:bg-primary/90'
                          )}
                          onClick={() => {
                            console.log('Time selected:', time);
                            setSelectedTime(time);
                          }}
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

          <div className="p-6 border-t mt-auto">
            <Button
              className="w-full"
              size="lg"
              onClick={handleConfirm}
              disabled={deliveryType === 'schedule' && (!selectedDate || !selectedTime)}
            >
              {t('checkout.deliveryTime.confirm')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 