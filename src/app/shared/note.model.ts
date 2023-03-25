export class Notes{
    id ?: string;
    title : string;
    description : string;
    imagePath? : string;
    isImportant ?: boolean;
    constructor(id,title,description,isImportant,imagePath){
        this.id = id;
        this.title = title;
        this.description = description;
        this.isImportant = isImportant || false;
        if(imagePath){
            this.imagePath = imagePath;
        }
    }
}