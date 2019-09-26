import { Address, EmailAddress, PhoneNum, IPAddress } from "../type/Location";

export interface CustomerConstructor
{
  isBan: boolean;
  firstName: string;
  lastName:  string;
  readonly id: string;
  ordersID: string[];
  username: string;
  password: string;
  lastOrderDate?: Date;
  address: Address;
  email: EmailAddress;
  phone: PhoneNum;
  associatedIP: IPAddress[];
}

export interface NewCustomerBody {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  address: string;
  email: string;
  phone: string;
}

export interface CustomerPasswordReset {
  id: string;
  password: string;
}