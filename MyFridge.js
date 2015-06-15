Products = new Mongo.Collection('products');

if (Meteor.isClient) {

    // all templates have a helpers function
    Template.fridge.helpers({

        products: function(){
            // search collections for items with attribute place = 'fridge' and return an array
            return Products.find({place: 'fridge'});
        }
    });

    Template.productList.helpers({
        products: function(){
            return Products.find({place: 'supermarket'});
        }
    });

    // must wait for template to be rendered before implementing function
    Template.fridge.rendered = function() {

        // limit jQuery’s scope to this template instance, instead of entire DOM
        var templateInstance = this;

        // define <div id="fridge"> as a droppable target
        templateInstance.$('#fridge').droppable({

            // event handler, listens for drop events. ui is used to identify dropped objects
            drop: function(evt, ui) {
                // get db id of dropped item from the HTML attribute data-id - data('id')
                var query = { _id: ui.draggable.data('id') };

                // set the update statement, we're moving an item to the fridge
                var changes = { $set: { place: 'fridge' } };

                // apply changes to collection
                // query returns a document based on id
                // changes apply a $set function to the place attribute to the document
                Products.update(query, changes);
            }
        });
    };

    Template.productList.rendered = function() {
        var templateInstance = this;
        templateInstance.$('#supermarket').droppable({
            drop: function(evt, ui) {
                var query = { _id: ui.draggable.data('id') };
                var changes = { $set: { place: 'supermarket' } };
                Products.update(query, changes);
            }
        });
    };

    // use jQuery-UI to mark the list items as draggable
    // For every productListItem that’s rendered, this rendered callback will be executed
    // once, effectively making each food movable
    Template.productListItem.rendered = function() {
        var templateInstance = this;
        // access the HTML element that’s dragged
        templateInstance.$('.draggable').draggable({
            cursor: 'move',
            helper: 'clone'
        });
    };
}

if (Meteor.isServer) {

    Meteor.startup(function () {
        // clear the db on each startup
        Products.remove({});

        // re-fill the database with some products
        Products.insert({
        name: 'Milk',
            img: '/milk.png',
            place: 'fridge'
        });

        Products.insert({
        name: 'Bread',
            img: '/bread.png',
            place: 'supermarket'
        });
    });
}