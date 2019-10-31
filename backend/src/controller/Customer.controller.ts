import { Request, Response, NextFunction } from 'express';
import Customer from '../model/Customer';
import ActiveCustomer from '../model/CustomerActive';
import AccountReset from '../model/AccountReset';
import { HttpMethod, HttpFunction } from '../decorator/HttpMethod';
import { NewBody } from '../interface/Customer.interface';
import { ClientError, ServerError, DatabaseError } from '../type/Error';
import { ExistingBody } from '../interface/Customer.interface';
import CookieFactory from '../factory/Cookie.factory';
import { CookieStorage, ResetPassword } from '../interface/Account.interface';

const session: ActiveCustomer = new ActiveCustomer();

const prl: AccountReset = new AccountReset();

const cf: CookieFactory = new CookieFactory('customer');

const cs: CookieStorage = {
  accessToken: cf.new('accessToken')
};

export const verify = HttpFunction(
  'ALL',
  'System was unable to verify the customer account.',
  (req, res, next) => {
    const accessToken: string = req.cookies[cs.accessToken.string()];
    const cID: string | null = session.fetch(accessToken);
    if (null) return;
    const customer: Customer[] = Customer.search({ id: cID ? cID : undefined });
    if (customer.length !== 1)
      throw new ServerError("Server didn't fetch one customer account");
    return customer[0];
  }
);

export const signin = HttpFunction(
  'POST',
  'System was unable to sign in the customer',
  (req, res) => {
    const { id } = req.body.customer as Pick<ExistingBody, 'id'>;
    const details = Customer.decrypt(id);
    if (!details)
      throw new ServerError(
        "Client didn't provide a valid username or password",
        true
      );
    const [username, password] = details;
    const customer: Customer[] = Customer.search({ username: username });
    if (customer.length !== 1)
      throw new ServerError("Server didn't fetch one customer account");
    if (customer[0].isPassword(password)) {
      const accessToken: string = session.add(customer[0]);
      res.cookie(cs.accessToken.string(), accessToken);
    }
    const accessToken: string = session.add(customer[0]);
    res.cookie('customer_access_token', accessToken).send({ success: true });
  }
);

export const add = HttpFunction(
  'POST',
  'System was unable to add the customer.',
  (req, res) => {
    const body: NewBody = req.body.customer;
    const customer: Customer = Customer.generate(body);
    customer.add();
    res.send({ success: true });
  }
);

export const update = HttpFunction(
  'PATCH',
  'System was unable to update the customer.',
  (req, res) => {
    const { id } = req.body.customer as Pick<ExistingBody, 'id'>;
    const body: Partial<NewBody> = req.body.customer;
    const customers: Customer[] = Customer.search({ id });
    if (customers.length !== 1)
      throw new ServerError('System found 2 customers account from one id.');
    customers[0].update(body);
  }
);

export const remove = HttpFunction(
  'DELETE',
  'System was unable to delete the customer account',
  (req, res) => {
    const { id } = req.body.customer as Pick<ExistingBody, 'id'>;
    const customers: Customer[] = Customer.search({ id });
    if (customers.length !== 1)
      throw new ServerError('System found 2 customers account from one id.');
    customers[0].remove();
  }
);
/**
 *  A request has been sent to change your password. Here a link to change your password
 *   https://rufftiger.com/client/resetpassword
 *   Note: The link will expire in 24 hours.
 */
export const email = HttpFunction(
  'POST',
  'System was unable to email the customer their password',
  (req, res) => {
    // Check if reset is in the system
    // NODE EMAIL SERVER
  }
);
// Rework this
export const resetPASS = HttpFunction(
  'PATCH',
  'System was unable to reset your password.',
  (req, res) => {
    const { credientals } = req.body.customer as ResetPassword;
    const details: [string, string] | null = Customer.decrypt(credientals);
    if (!details)
      throw new ClientError("Client didn't provide a valid credientals");
    const [username, password] = details;
    const customers: Customer[] = Customer.search({ username });
    if (customers[0].isPassword(password)) prl.add(customers[0]);
    else throw new ClientError('Client Provided the wrong password');
  }
);
