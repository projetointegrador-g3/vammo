<<<<<<< HEAD
export class NumericTransformer {
    to(data: number): number {
        return data;
    }
    from(data: string): number {
=======
export class NumericTransformer{
    to(data:number):number{
        return data;
    }
    from(data:string):number{
>>>>>>> origin/03_usuario
        return parseFloat(data);
    }
}