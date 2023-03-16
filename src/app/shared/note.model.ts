export class Notes{
    id ?: string;
    title : string;
    description : string;
    image? : File;
    isImportant ?: boolean;
    constructor(id,title,description,isImportant){
        this.id = id;
        this.title = title;
        this.description = description;
        this.isImportant = isImportant;
    }
}