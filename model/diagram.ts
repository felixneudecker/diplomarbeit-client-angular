export class Diagram {

    id : number = null;
    title : string;
    type : string;
    labels : string[];
    datasource_id : number;
    userid : number;
    

    constructor()
    {
        this.title = "";
        this.type = "";
        this.datasource_id = null;
        this.userid = null;
    }

    

}
