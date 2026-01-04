export interface SchoolResponseObject {
    id: number;
    name: string;
    address: string;
    contact_mail: string;
    contact_phone: string;
    created_at: string;
    updated_at: string;
}
export interface SchoolRequestObject {
    name: string;
    address: string;
    contact_mail: string;
    contact_phone: string;
}
