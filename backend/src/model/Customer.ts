import { default as Database, DatabaseQuery } from './Database';
import {  CustomerConstructor, NewCustomerBody  } from '../interface/Customer.interface';
import { QueryResult, FieldDef } from 'pg';
import uuid = require('uuid/v4');
import { Address, EmailAddress, PhoneNum } from "../type/Location";

export class ActiveCustomer {
  private _session: Map<string, Customer>;
  constructor(customers: Customer[]) {
    this._session = new Map();
    if (customers !== null) {
      for (let i = 0; i < customers.length; i++) {
        const cur: Customer = customers[i];
        this._session.set(cur.getValue().id, cur);
      }
    }
  }
  public add(customer: Customer): void {
    this._session.set(customer.getValue().id, customer);
    return;
  }
  public remove(customerID: string): void {
    this._session.delete(customerID);
    return;
  }
  public fetch(customerID: string): Customer {
    return this._session.get(customerID);
  }
}

export class Customer
{
  private _value: CustomerConstructor;
  private _details: DatabaseQuery;
  constructor(customer: CustomerConstructor)
  {
    this._value = customer;
    //const query: DatabaseQuery = this._details.insert();
  }
  public getValue(): CustomerConstructor
  {
    return this._value;
  }
  public delete(): void
  {
    
    //const query: DatabaseQuery = this._details.delete();
  }
  public save(): void {

  }
  public update(body: any): void
  {
    if (body.firstName) this._value.firstName = body.firstName;
    if (body.lastName) this._value.lastName = body.lastName;
    if (body.username) this._value.username = body.username;
    if (body.address) this._value.address = new Address(body.address);
    if (body.email) this._value.email = new EmailAddress(body.email);
    if (body.phone) this._value.phone = new PhoneNum(body.phoneNum);
  }
  public static generate(body: NewCustomerBody): Customer {
    const customer: CustomerConstructor = {
      firstName: body.firstName,
      lastName: body.lastName,
      id: uuid(),
      ordersID: [],
      username: body.username,
      password: body.password,
      lastOrderDate: null,
      address: new Address(body.address),
      email: new EmailAddress(body.email),
      phone: new PhoneNum(body.phone)
    }
    return new Customer(customer);
  }
  public static From = class
  {
    public static id(id: string): Customer
    {
      
    }
    public static username(username: string): Customer
    {
      
    }
    public static cred(username: string, password: string): Customer {

    }
  }
}


export default Customer;