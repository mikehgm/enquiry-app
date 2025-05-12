export interface Enquiry {
  enquiryId?: number;
  enquiryTypeId: number;
  enquiryStatusId: number;
  customerName: string;
  phone: string;
  email: string;
  message: string;
  createdDate: Date;
  resolution: string;
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
