export interface Enquiry {
  enquiryId?: number;
  enquiryTypeId: number;
  enquiryStatusId: number;
  customerName: string;
  phone: string;
  email: string;
  message: string;
  createdDate?: string;
  resolution?: string;
  createdBy?: string;
  updatedBy?: string;
  updatedAt?: string;
  folio?: string;
  costo?: number | null;
  anticipo?: number | null;
  saldoPago?: number;
  dueDate?: string;
}

// Optional: Enum for enquiry types
export enum EnquiryType {
  Wedding = 1,
  BirthDay = 2
}

// Optional: Enum for enquiry statuses
export enum EnquiryStatus {
  New = 1,
  InProgress = 2,
  OnHold = 3,
  Resolved = 4
}
