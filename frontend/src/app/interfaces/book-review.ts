import { User } from "./user";

export interface BookReview {
    bookId : number,
    userId? : string,
    rating : number,
    review : string,
    user : User
}
