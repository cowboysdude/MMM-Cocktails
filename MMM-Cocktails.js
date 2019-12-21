      /* Magic Mirror
    * Module: MMM-Cocktails
    *
    * By Mykle1 ~ Edited by Cowboysdude
    * 
    */
   Module.register("MMM-Cocktails", {

       // Module config defaults.
       defaults: {
           updateInterval: 15 * 1000, // every ten minutes
           fadeSpeed: 3000,
           initialLoadDelay: 1250, // ms seconds delay
           retryDelay: 2500,
           maxWidth: "900px",
           
       },
	   

       getStyles: function() {
           return ["MMM-Cocktails.css"];
       },
	   
       // Define start sequence.
       start: function() {
           Log.info("Starting module: " + this.name);
           this.today = "";
           this.Cocktails = [];
           this.url = "http://www.thecocktaildb.com/api/json/v1/1/random.php";
           this.scheduleUpdate();
       },

       getDom: function() {

         var cocktails = this.cocktails; 
 
           var wrapper = document.createElement("div");
           wrapper.className = "wrapper";
           wrapper.style.maxWidth = this.config.maxWidth;


           if (!this.loaded) {
               wrapper.innerHTML = "Mixing your drink...";
               wrapper.className = "bright light small";
               return wrapper;
           }
           

           var top = document.createElement("div");
           top.classList.add("post-container");
           
           var title = document.createElement("div");
           title.classList.add("post-title"); 
           title.innerHTML = "Drink: "+cocktails.recipeName + "  <br> Glass: " + cocktails.glass + "  <br> Category: " + cocktails.category+"<br>"; 
           top.appendChild(title);

           var drinkLogo = document.createElement("div");
           var drinkIcon = document.createElement("img"); 
           drinkIcon.src = cocktails.thumb;
           drinkIcon.classList.add("post-thumb");
           drinkLogo.appendChild(drinkIcon);
           top.appendChild(drinkLogo);

           var des = document.createElement("p");
           des.classList.add("xsmall", "bright","post-content"); 
		   for (i = 0; i < cocktails.ingredients.length; i++) {
		   var mixins = cocktails.ingredients[i]; 
           des.innerHTML +=  mixins.ingredient +"<br>";
		   }
           top.appendChild(des);
           
           var str = document.createElement("p");
           str.classList.add("xsmall", "bright","inst");
           str.innerHTML = "<br>"+cocktails.instruction;
           top.appendChild(str);  

           wrapper.appendChild(top); 
           
           return wrapper;

       },
	   
/////////// For use with Hello-Lucy voice enhancement /////////////////////	   
	   notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_COCKTAILS') {
            this.hide(1000);
            this.updateDom(300);
        }  else if (notification === 'SHOW_COCKTAILS') {
            this.show(1000);
            this.updateDom(300);
        }
            
    },
////////////////////////////////////////////////////////////////////////////	   
       
     showObject:  function (obj) {
  var result = "";
  for (var strIngredient in this.cocktails) {
    if( this.cocktails.hasOwnProperty(strIngredient) ) {
      result += strIngredient + " , " + this.cocktails[strIngredient] + "\n";
    } 
  }              
  return result;
},

       processCocktails: function(data) {
  //    console.log(data); // for checking
   //        this.today = data.Today;
           this.cocktails = data;
           this.loaded = true;
       },

       scheduleUpdate: function() {
           setInterval(() => {
               this.getCocktails();
           }, this.config.updateInterval);

           this.getCocktails(this.config.initialLoadDelay);
       },


       getCocktails: function() {
           this.sendSocketNotification('GET_COCKTAILS', this.url);
       },

       socketNotificationReceived: function(notification, payload) {
           if (notification === "COCKTAILS_RESULT") {
               this.processCocktails(payload);
               this.updateDom(this.config.fadeSpeed);
           }
           this.updateDom(this.config.initialLoadDelay);
       },

   });
