/* Magic Mirror
 * Module: MMM-Cocktails
 *
 * By Mykle1 ~ edited by Cowboysdude
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getCocktails: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).drinks[0];
				var recipe = {
                    recipeName: result.strDrink,
                    instruction: result.strInstructions,
                    thumb: result.strDrinkThumb,
                    glass: result.strGlass,
                    category: result.strCategory,
                    ingredients: []
                };
				for (var i = 1; i <= 24; i++) {
                    if (!result['strIngredient' + i]) {
                        break;
                    }
					if (!result['strMeasure' + i]) {
                        break;
                    }
                    recipe.ingredients.push({
                        ingredient: result['strMeasure' + i] + "" + result['strIngredient' + i]
                    });
                }
			//	console.log(response.statusCode); // for checking
                this.sendSocketNotification('COCKTAILS_RESULT', recipe);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_COCKTAILS') {
            this.getCocktails(payload);
        }
    }
});
