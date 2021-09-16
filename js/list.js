class List {
    //Initialize the list
    constructor(){
        this.listSize = 0;
        this.pos = 0;
        this.items = [];
    }

    //Add item to list
    append = (element) => {
        this.items[this.listSize++] = element;
    }

    //Find item in the list
    find = (element) => {
        if(typeof element === 'object' && element !== null){
            for(let i = 0; i < this.listSize; i++){
                if(Object.entries(this.items[i]).toString() === Object.entries(element).toString()){
                    return i;
                }
            }
        }else{
            for(let i = 0; i < this.listSize; i++){
                if(this.items[i] === element){
                    return i;
                }
            }
        }
        return -1;
    }

    //Remove item from the list
    remove = (element) => {
        let index = this.find(element);

        if(index > -1){
            this.items.splice(index, 1);
            --this.listSize;
            return true;
        }

        return false;
    }

    //Insert item at specific position in the list
    insert = (element, after) => {
        let insertPos = this.find(after);

        if(insertPos > -1){
            this.items.splice(insertPos+1, 0, element);
            ++this.listSize;
            return true;
        }

        return false;
    }

    //Check if items is there in list
    contains = (element) => {
        let index = this.find(element);
        return index > -1 ? true : false;
    }

    //Move to the front of the list
    front = () => {
        this.pos = 0;
    }

    //Move to the end of the list
    rear = () => {
        this.pos = this.listSize - 1;
    }

    //Move to the prev item in the list
    prev = () => {
        if(this.pos > 0){
            --this.pos;
        }
    }

    //Move to the next item in the list
    next = () => {
        if(this.pos < this.listSize - 1){
            ++this.pos;
        }
    }

    //Return the currentPos in the list
    currPos = () => {
        return this.pos;
    }

    //Move to any particular position in the list
    moveTo = (pos) => {
        if(pos > 0 && pos <= this.listSize){
            this.pos = pos - 1;
        }
    }

    //Get the current element in the list
    getElement = () => {
        return this.items[this.pos];
    }

    //Size of the list
    size = () => {
        return this.listSize;
    }

    //Print the list
    print = () => {
        return this.items.join(',');
    }

    //Clear the list
    clear = () => {
        this.listSize = 0;
        this.pos = 0;
        this.items = [];
    }
}