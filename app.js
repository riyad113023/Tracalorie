//Storage Controlller


// Item Controller
const ItemCtrl = (function(){

  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  const data ={
    items : [
      // {id: 0, name: 'Steak Dinner', calories : 1200},
      // {id: 1, name: 'Cookie', calories : 1200},
      // {id: 2, name: 'Eggs', calories : 1200}
    ],
    currentItem : null,
    totalCalories : 0
  }

  return {
    getItems: function(){
      return data.items;
    },

    addItem : function (name, calories){
      let ID;

      if(data.items.length >0){
        ID = data.items[data.items.length -1].id + 1;
      }
      else{
        ID = 0;
      }

      calories = parseInt(calories);

      let newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;

    },

    getItemById : function(id){
      let found = null;
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });
      return found;
    },

    updateItem : function(name, calories){

      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem : function(id){
      const ids = data.items.map(function(item){
        return item.id;
      });

      const index = ids.indexOf(id);

      data.items.splice(index, 1);

    },

    setCurrentItem : function(item){
      data.currentItem = item;
    },

    getCurrentItem : function(){
      return data.currentItem;
    },

    getTotalCalories : function(){
      let total = 0;
      data.items.forEach(function(item){
        total += item.calories;
      });

      data.totalCalories = total;

      return data.totalCalories;

    },

    logData : function(){
      return data;
    },

    clearAllItems: function(){
      data.items = [];
    }
  }

})();







//UI Controller
const UICtrl = (function(){

  const UISelectors = {
    itemList : "#item-list",
    listItems : "#item-list li",
    addBtn : ".add-btn",
    updateBtn : ".update-btn",
    deleteBtn : ".delete-btn",
    backBtn : ".back-btn",
    clearBtn : ".clear-btn",
    itemNameInput : "#item-name",
    itemCaloriesInput : "#item-calories",
    totalCalories : ".total-calories"
  }

  return {
    polulateItemList: function(items){
      let html = "";

      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong> ${item.name}: </strong> <em>
        ${item.calories} calories </em>
        <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
        </a>
        </li>`;
      });

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getInputItem : function(){
      return {
        name : document.querySelector(UISelectors.itemNameInput).value,
        calories : document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem : function(item){

      document.querySelector(UISelectors.itemList).style.display = 'block';

      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong> ${item.name}: </strong> <em>
      ${item.calories} calories </em>
      <a href="#" class="secondary-content">
      <i class="edit-item fa fa-pencil"></i>
      </a>`;

      document.querySelector(UISelectors.itemList).insertAdjacentElement
      ('beforeend', li);
    },

    updateListItem : function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
      const itemId =   listItem.getAttribute('id');
        if(itemId === `item-${item.id}`){
            document.querySelector(`#${itemId}`).innerHTML=`<strong> ${item.name}: </strong> <em>
            ${item.calories} calories </em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>`;
        }
      });

    },

    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item= document.querySelector(itemID);
      item.remove();

    },

    removeAllItems: function(){

      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });

    },

    clearInputFields : function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';

    },

    addItemtoForm : function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories; 
      UICtrl.showrEditState();
    },

    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories : function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState : function(){
      UICtrl.clearInputFields();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showrEditState : function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors : function(){
      return UISelectors;
    }
  }
  
})();


//App Controller

 const App = (function(ItemCtrl, UICtrl){

  //Load event listeners
  const loadEventListeners = function(){
    const UISelectors = UICtrl.getSelectors();

    document.querySelector(UISelectors.addBtn).addEventListener
    ('click', itemAddSubmit);

    document.addEventListener('keypress', function(e){

      if(e.keyCode ===13 || e.which ===13){
        e.preventDefault();
        return false;
      }
    });

    document.querySelector(UISelectors.itemList).addEventListener
    ('click', itemEditClick);

    document.querySelector(UISelectors.updateBtn).addEventListener
    ('click', itemUpdateSubmit);

    document.querySelector(UISelectors.deleteBtn).addEventListener
    ('click', itemDeleteSubmit)

    document.querySelector(UISelectors.backBtn).addEventListener
    ('click', UICtrl.clearEditState);

    document.querySelector(UISelectors.clearBtn).addEventListener
    ('click', clearAllItemsClick);

  }


  const itemAddSubmit = function(e){
    const input = UICtrl.getInputItem();

    if(input.name !== '' && input.calories !== ''){
      let newItem = ItemCtrl.addItem(input.name, input.calories);
      UICtrl.addListItem(newItem);

      const totalCalories = ItemCtrl.getTotalCalories();

      UICtrl.showTotalCalories(totalCalories);

      UICtrl.clearInputFields();
    }

    e.preventDefault();

  }


  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
      const listId = e.target.parentNode.parentNode.id;
      const listIdArray= listId.split('-');
      const id = parseInt(listIdArray[1]);
      const itemToEdit = ItemCtrl.getItemById(id);
      ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.addItemtoForm();
    }
    e.preventDefault();
  }

  const itemUpdateSubmit = function(e){
    const input = UICtrl.getInputItem();
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    UICtrl.updateListItem(updatedItem);
    const totalCalories = ItemCtrl.getTotalCalories();

    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
    e.preventDefault();
  }

  const itemDeleteSubmit = function(e){

    const currentItem = ItemCtrl.getCurrentItem();
    ItemCtrl.deleteItem(currentItem.id);

    UICtrl.deleteListItem(currentItem.id);
    const totalCalories = ItemCtrl.getTotalCalories();

    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }


  const clearAllItemsClick = function(e){
    ItemCtrl.clearAllItems();

    UICtrl.removeAllItems();

    const totalCalories = ItemCtrl.getTotalCalories();

    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    UICtrl.hideList();

    e.preventDefault();

  }

  return {
    init : function(){
      console.log("Initializing App ..........");
      UICtrl.clearEditState();
      let items = ItemCtrl.getItems();

      if(items.length ==0)
      {
        UICtrl.hideList();
      }
      else
      {
        UICtrl.polulateItemList(items);
      }

      const totalCalories = ItemCtrl.getTotalCalories();

      UICtrl.showTotalCalories(totalCalories);

      //load event listeners
      loadEventListeners();
    }
  }
  
})(ItemCtrl, UICtrl);

App.init();
