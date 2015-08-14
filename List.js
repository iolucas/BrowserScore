function List(capacity) { 
    
    var collection = []; 
    
    if (capacity != null) { 
        collection[capacity]; 
    } 
                        
    //Get the element at the specified index 
    this.GetItem = function (index) { 
        if (index <= collection.length - 1) { 
            return collection[index]; 
        } else { 
            throw "Index was out of range. Must be non-negative and less than the size of the collection"; 
        } 
    }
    
    //Set the element at the specified index 
    this.SetItem = function (index, item) { 
        if (index <= collection.length - 1) { 
            collection[index] = item; 
        } else { 
            throw "Index was out of range. Must be non-negative and less than the size of the collection"; 
        } 
    }

    //Adds an object to the end of the Collections. 
    this.Add = function (item) { 
        collection[collection.length] = item; 
    }

    //Adds the elements of the specified collection to the end of the Collections. 
    this.AddRange = function (items) { for (var i = 0; i < items.Count(); i++) { collection[collection.length] = items.GetItem(i); } }


    
    //Inserts an element into the System.Collections.Generic.List<T> at the specified index. 
    this.Insert = function (pos, item) { if (pos <= collection.length - 1) { collection.splice(pos, 0, item); } else { throw "Index must be within the bounds of the List"; } }


    
    //Removes all elements from the Collections. 
    this.Clear = function () { collection = []; }


    
    //Gets the number of elements actually contained in the Collections. 
    this.Count = function () { return collection.length; }


    
    //Determines whether the specified object instances are considered equal. 
    this.Equal = function (x, y) { return (x === y); }


    
    //Searchs the element in collection. 
    this.Find = function (obj) { 
        var index = -1; 
        for (var i = 0; i < collection.length; i++) { 
            var item = collection[i]; 
            if (this.Equal(item, obj)) { 
                index = i; break; 
            } 
        } 
        return index; 
    }

    //Checks whether the element exists in the collection 
    this.Exists = function (obj) { 
        var isFind = false; 
        if (this.Find(obj) > -1) { 
            isFind = true; 
        } 
        return isFind; 
    }

    //Performs the specified action on each element of the Collections. 
    this.ForEach = function (action) { 
        for (var i = 0; i < collection.length; i++) { 
            var item = collection[i]; action(item); 
        } 
    }

    //Removes the element at the specified index of the collection 
    this.RemoveAt = function (index) { 
        collection.splice(index, 1); 
    }

    //Removes a range of elements from the collection 
    this.RemoveRange = function (index, count) { 
        collection.splice(index, count); 
    }

    //Creates a shallow copy of a range of elements in the source collection 
    this.GetRange = function (index, count) { 
        newList = new List(); 
        var indexCount = 0; 
        for (var i = index; i < collection.length; i++) { 
            var item = collection[i]; 
            if (indexCount < count) { 
                newList.Add(item); 
            } else { 
                break; 
            } indexCount++; 
        } 
        return newList; 
    }                 
}
