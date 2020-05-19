import {Injectable} from "@angular/core";
import {OrderPosition, Position} from "../shared/interfaces";

@Injectable()

export class OrderService {

  public list: OrderPosition[] = [];
  public price: number = 0;

  add(position: Position) {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    })

    const candidate = this.list.find(el => el._id === orderPosition._id);
    if (candidate) {
      candidate.quantity += orderPosition.quantity;
    } else {
      this.list.push(orderPosition);
    }

    this.computePrice();
  }

  computePrice() {
    this.price = this.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0)
  }

  remove(orderPosition: OrderPosition) {
    const index = this.list.findIndex(el => el._id === orderPosition._id);
    if (index || index === 0) {
      this.list.splice(index, 1);
      this.computePrice();
    }
  }

  clear() {
    this.list = [];
    this.price = 0;
  }
}
