export interface BookQueryParams {
    title : string,
    author : string,
    isCheckedOut : boolean | null,
    orderBy : string,
    orderAsc : boolean
}
