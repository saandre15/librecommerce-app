import { Injectable } from "@nestjs/common";
import TagService from "src/common/services/Tag.service";
import { OrderDOT } from "./Order.interface";
import ServiceFactory from "src/common/factory/Service.factory";
import Order from "./Order.model";

@Injectable()
export class OrderService extends ServiceFactory(Order) {
  constructor(public readonly tags: TagService<OrderDOT>) {
    super();
  }
}

export default OrderService;
