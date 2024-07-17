import { Book } from "./book";
import { User } from "./user";

export interface Checkout {
    id : number,
    startDate : Date,
    endDate? : Date,
    book : Book,
    user : User
}
