import { Request, Response } from 'express';
import Order from '../model/Order';
import OrderQueue from '../model/OrderQueue';
import { Customer } from '../model/Customer';
import uuid = require('uuid/v4');
import { EmailAddress, PhoneNum, IPAddress } from '../type/Location';
import { Money } from '../type/Money';
import { PaypalSetup, Paypal } from '../model/Paypal';
import { Shipping } from '../model/Shipping';
import { wsServer } from '../index';
import {
  ExistingBody,
  SearchQuery,
  Value,
  Constructor
} from '../interface/Order.interface';
import { HttpMethod, HttpFunction } from '../decorator/Http.decorator';
import OrderFeed from '../model/OrderFeed';
import { ServerError, ClientError } from '../type/Error';
import * as CustomerController from './Customer.controller';
import Cart from '../model/Cart';
import Controller from './_.controller';
import Model from '../model/Model';

//const queue: OrderQueue = new OrderQueue();
const test = Order;
const contoller = Controller<Constructor, Value, Required<ExistingBody>>()<
  Order
>(Order, 'order');

const feeds: OrderFeed = new OrderFeed();

export const get = controller.get('System was unable to get an order');

export const update = controller.update(
  'System was unable to update an order.',
  'cancelled' || 'id'
);

export const remove = controller.remove('System was unable to remove an order');

export const add = controller.add('System was unable to add an order');

export const search = controller.search<keyof SearchQuery>(
  'System was unable to search for the order'
);

export const hold = [
  get,
  HttpFunction(
    'Order ID must be be an existing order ID in holding cell',
    (req, res, next) => {
      req.order.hold();
      return next();
    }
  )
];

export const unhold = [
  get,
  HttpFunction('System was unable to unhold the order.', (req, res, next) => {
    if (req.order.isHeld()) req.order.unhold();
    else
      throw new ClientError(
        'Client cannot unhold an order that was never held.'
      );
    return next();
  })
];

export const getHoldList = HttpFunction(
  'System was unable to retrieve the holds!',
  async (req, res, next) => {
    const orderIDs: string[] = await Order.search({ hold: true });
    res.send({ success: true, orders: orders });
  }
);

export const complete = [
  get,
  HttpFunction(
    'System was unable to complete the next order!',
    (req, res, next) => {
      const shipping: Shipping = req.order.getShipping();
      req.order.complete();
      shipping.complete();
      req.order.save();
      shipping.save();
      return next();
    }
  )
];

export const feed = HttpFunction(
  'System was unable to get the order feed.',
  (req, res, next) => {
    feeds.subscribe(wsServer);
    return next();
  }
);
