import { Address, EmailAddress, PhoneNum } from "../type/Location";
import { Schedule } from "../model/Schedule";

export interface UserConstructor
{
  id: string,
  firstName: string,
  lastName: string,
  privilege: Privilege,
  task: string,
  username: string,
  password: string,
  address: Address,
  emailAddress: EmailAddress,
  phoneNum: PhoneNum,
  schedule: Schedule,
}

export enum Privilege
{
  basic,
  mod,
  admin
}