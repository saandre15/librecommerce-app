import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import SaleController from "./Sale.controller";
import SaleService from "./Sale.service";
import CustomerService from "../account/customer/Customer.service";
import PaymentService from "../billing/payments/Payment.service";
import CartService from "../cart/Cart.service";
import OrderService from "../order/Order.service";
import TransactionService from "../billing/transaction/Transaction.service";

@Module({
  controllers: [SaleController],
  exports: [SaleService],
  imports: [
    CustomerService,
    TransactionService,
    OrderService,
    CartService,
    PaymentService
  ]
})
export class SaleModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {}
}

export default SaleModule;
