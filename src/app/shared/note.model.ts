export class Notes{
    id ?: string;
    title : string;
    description : string;
    image? : string;
    isImportant ?: boolean;
    constructor(id,title,description,isImportant,image){
        this.id = id;
        this.title = title;
        this.description = description;
        this.isImportant = isImportant || false;
        if(image){
            this.image = image;
        }
    }
}