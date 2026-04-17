export interface FormData {
  fullName: string;
  phone: string;
  birthDate: string;
  email: string;
  appointmentType: string;
  appointmentTypeName: string;
  location: string;
  locationName: string;
  insurance: string;
  insuranceName: string;
  otherInsurance: string;
  selectedDate: Date | undefined;
  selectedTime: string;
  acceptFirstAvailable: boolean;
  acceptNotifications: boolean;
}

export const initialFormData: FormData = {
  fullName: "",
  phone: "",
  birthDate: "",
  email: "",
  appointmentType: "",
  appointmentTypeName: "",
  location: "",
  locationName: "",
  insurance: "",
  insuranceName: "",
  otherInsurance: "",
  selectedDate: undefined,
  selectedTime: "",
  acceptFirstAvailable: false,
  acceptNotifications: true,
};
