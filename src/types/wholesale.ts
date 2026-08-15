export interface WholesaleStatus {
  status: string;
  application: WholesaleApplication | null;
}

export interface BusinessAddress {
  street: string;
  city: string;
  state: string;
  postalCode?: string;
  country?: string;
}

export interface WholesaleApplication {
  _id: string;
  userId: any;
  companyName: string;
  panVatNumber: string;
  businessType: string;
  contactPerson: string;
  businessPhone: string;
  businessAddress: BusinessAddress;
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  appliedAt: string;
  reviewedAt?: string;
}
