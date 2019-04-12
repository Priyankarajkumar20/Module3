(function () {
    var NarrowItDownApp = angular.module('NarrowItDownApp', []);
    NarrowItDownApp.controller('NarrowItDownController', NarrowItDownController);
    NarrowItDownApp.service('MenuSearchService', MenuSearchService);
    NarrowItDownApp.directive('foundItems', FoundItems);
    NarrowItDownApp.constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com/');
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var menu = this;
        menu.searchItem = "";
        menu.getMenuItems = function (searchItem) {
            menu.menuItems = [];
            menu.showError = false;
            if (searchItem === "" || searchItem == null) {
                menu.showError = true;
            } else {
                var menuPromise = MenuSearchService.getMatchedMenuItems(searchItem);
                menuPromise.then(function (response) {
                   
                    if (response.length > 0) {
                        menu.menuItems = response;
                    } else {
                        menu.showError = true;

                    }
                });
            }
        }
        menu.removeItem = function (index) {
            MenuSearchService.removeMenuItem(index);
        }
    };

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function (searchItem) {
            var foundItems = [];
            return $http({
                method: "GET",
                url: (ApiBasePath + "menu_items.json")
            }).then(function (response) {
                for (var i = 0; i < response.data.menu_items.length; i++) {
                    if (response.data.menu_items[i].description.toLowerCase().indexOf(searchItem.toLowerCase().trim()) !== -1) {
                        foundItems.push(response.data.menu_items[i]);
                    }
                }
                return foundItems;
            });

        };
        service.removeMenuItem = function (index) {
            foundItems.splice(index, 1);
        };
    };

    function FoundItems() {
        var ddo = {
            templateUrl: 'MenuList.html',
            scope: {
                found: '<',
                onRemove: '&'
            }
        };
        return ddo;
    };
})();
