({
    initReorder: function (component, event, helper) {
        //console.log('In initReorder')
        this.initializeLists(component, event, helper);
    },
    LightningToastmessage : function(component, event, helper,message,toasttype) 
    {  
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({            
            "type":toasttype,            
            "message": message
        });
        toastEvent.fire();
    },
    handleListClick: function (component,event,listName,selectedListName,selectedItemName) {
        var id = event.currentTarget.id;
        var items = component.get(listName);
        var itemOriginal = component.get(selectedItemName);
        var item = this.getItem(id, items);
        items = this.removeStyles(items);
        if (event.shiftKey && itemOriginal) {
            //make a selection from one to the next!
            var start = item.sort < itemOriginal.sort ? item.sort : itemOriginal.sort;
            var end = item.sort > itemOriginal.sort ? item.sort : itemOriginal.sort;
            var subset = this.getItems(start, end, items);
            subset = this.addStyles(subset, " select-focus ");
            component.set(selectedListName, subset);
            component.set(selectedItemName, "");
        } else {
            component.set(selectedItemName, item);
            component.set(selectedListName, []);
        }
        component.set(listName, items);
    },
    reorderItem: function (component,sourceName,selectedListName,selectedItemName,direction) {
        var item = component.get(selectedItemName);
        if (!item) {
            return;
        }
        var swapItem, swapIndex;
        //clear selected list
        component.get(selectedListName, []);
        var source = component.get(sourceName);
        source = this.renumberItems(source);
        if (direction == "up") {
            if (item.sort < 1) {
                return;
            }
            swapIndex = item.sort - 1;
        }
        if (direction == "down") {
            if (item.sort == source.length) {
                return;
            }
            swapIndex = item.sort + 1;
        }
        swapItem = this.getItem(swapIndex, source);
        if (!swapItem) {
            return;
        }
        var temp = item.sort;
        item.sort = swapItem.sort;
        swapItem.sort = temp;
        source = this.sortItems(source);
        component.set(sourceName, source);
        item.style = " select-focus ";
        component.set(selectedItemName, item);
    },
    handleDragStart: function (component, event, listName) {
        var id = event.currentTarget.id;
        var items = component.get(listName);
        var item = this.getItem(id, items);
        event.dataTransfer.setData("text", JSON.stringify(item));
    },

    handleOnDropSelf: function (component, event) {
        var selectedItemsDiv = component.find("selectedItems");
        $A.util.removeClass(selectedItemsDiv, " select-focus ");
        var selectedItems = component.get("v.selectedItems");
        var droppedItem = JSON.parse(event.dataTransfer.getData("text"));
        var receivingItem;
        //if dropping destination onto destination
        if (droppedItem.type == "destination") {
            //prevent event from going further
            //this item is not "connected" as it was serialized, so connect via it's index
            droppedItem = this.getItem(droppedItem.sort, selectedItems);
            receivingItem = this.getItem(event.currentTarget.id, selectedItems);
            selectedItems = this.insertItemAt(
                droppedItem,
                receivingItem,
                selectedItems
            );
            // selectedItems = this.sortItems(selectedItems);
            component.set("v.selectedItems", selectedItems);
            event.preventDefault();
            event.stopPropagation();
            // this.broadcastDataChange(component);
        }
        //if not destination, allow to be handled by parent
    },
    handleOnDrop: function (component, event) {
        event.preventDefault();
        var selectedItemsDiv = component.find("selectedItems");
        $A.util.removeClass(selectedItemsDiv, " select-focus ");
        var selectedItems = component.get("v.selectedItems");
        selectedItems = this.renumberItems(selectedItems);
        component.set("v.selectedItems", selectedItems);
    },
    initializeLists: function (component, event, helper) {
        //console.log('In initializeLists')
        var selectedItems = component.get("v.selectedValues");
        //console.log('selectedItems ::: ' , JSON.stringify(component.get("v.selectedValues")))
        selectedItems.forEach(function (item, index) {            
            item.sort = index + 1;
            item.type = "destination";
            item.style = "";
        });
        
        //console.log('selectedItems ::: ' , JSON.stringify(selectedItems))
        //needed to make work with locker service otherwise bindings don't work :(
        component.set("v.selectedItems", selectedItems);
        component.set("v.spinner",false);
    },
    insertItemAt: function (fromItem, toItem, items) {
        var fromIndex = fromItem.sort;
        var toIndex = toItem.sort;

        if (fromIndex == toIndex) {
            return items;
        }
        if (Math.abs(fromIndex - toIndex) == 1) {
            var temp = fromItem.sort;
            fromItem.sort = toItem.sort;
            toItem.sort = temp;
        } else if (fromIndex > toIndex) {
            items.forEach(function (item) {
                if (item.sort >= toIndex && item.sort <= fromIndex) {
                    item.sort++;
                }
            });
            fromItem.sort = toIndex;
        } else if (toIndex > fromIndex) {
            items.forEach(function (item) {
                if (item.sort <= toIndex && item.sort > fromIndex) {
                    item.sort--;
                }
            });
            fromItem.sort = toIndex;
        }
        return this.sortItems(items);
    },

    getItem: function (indexVar, items) {
        var itemToReturn;
        items.forEach(function (item) {
            if (item.sort == indexVar) {
                itemToReturn = item;
            }
        });
        return itemToReturn;
    },
    getItems: function (start, end, items) {
        var itemsToReturn = [];
        items.forEach(function (item) {
            if (item.sort >= start && item.sort <= end) {
                itemsToReturn.push(item);
            }
        });
        return itemsToReturn;
    },

    removeStyles: function (items) {
        items.forEach(function (item) {
            item.style = "";
        });
        return items;
    },

    addStyles: function (items, style) {
        items.forEach(function (item) {
            item.style = style;
        });
        return items;
    },

    sortItems: function (items) {
        items.sort(function (a, b) {
            return a.sort > b.sort ? 1 : -1;
        });
        return items;
    },

    renumberItems: function (items) {
        items = this.sortItems(items);
        items.forEach(function (item, index) {
            item.sort = index + 1;
        });
        return items;
    },
    toggleHelper: function (component, event) {
        var toggleText = component.find("tooltip");
        $A.util.toggleClass(toggleText, "toggle");
        var clr = component.find("icnHelp");
        $A.util.toggleClass(clr, "icn");
    },
    escapeEventHelper: function (component, event, helper) {
        window.addEventListener(
            "keydown",
            function (event) {
                var kcode = event.code;
                if (kcode == "Escape") {
                    if (component.find("overlayLib") != undefined) {
                        component.find("overlayLib").notifyClose();
                    }
                }
            },
            true
        );
    }
});