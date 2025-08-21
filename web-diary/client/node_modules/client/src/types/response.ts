export default interface ApiResponseType<T> {
    success: boolean;
    data: T | null;
    error: string | null;
}
  
export const response: ApiResponseType<any> = {
    success: false,
    data: null,
    error: null
};