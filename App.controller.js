sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/TextArea"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("Quickstart.App", {
		onPress : function () {
            MessageToast.show("Getting Northwind Products!");
            var settings = {
				"url": "/products",
				"method": "GET"
			};
			var txtAreaControl = this.byId("output");

			$.ajax(settings).done(function (response) {
                console.log(response);
                txtAreaControl.setValue(JSON.stringify(response));
			});
        },
        onB1Login : function () {
            MessageToast.show("Login into B1!");
            var settings = {
				"url": "/b1",
				"method": "GET"
			};
			var txtAreaControl = this.byId("output");

			$.ajax(settings).done(function (response) {
                console.log(response);
                txtAreaControl.setValue(JSON.stringify(response));
			});
		},
		onB1GetItems : function () {
            MessageToast.show("Getting B1 Items!");
            var settings = {
				"url": "/b1items",
				"method": "GET"
			};
			var txtAreaControl = this.byId("output");

			$.ajax(settings).done(function (response) {
                console.log(response);
                txtAreaControl.setValue(JSON.stringify(response));
			});
		},
		onByDServiceRequest : function () {
            MessageToast.show("Posting Service Request in ByD!");
            var settings = {
				"url": "/byd",
				"method": "GET"
			};
			var txtAreaControl = this.byId("output");

			$.ajax(settings).done(function (response) {
                console.log(response);
                txtAreaControl.setValue(JSON.stringify(response));
			});
        },
        onS4ServiceRequest : function () {
            MessageToast.show("Get Top 10 Sales Orders in S4!");
            var settings = {
				"url": "/s4",
				"method": "GET"
			};
			var txtAreaControl = this.byId("output");

			$.ajax(settings).done(function (response) {
                console.log(response);
                txtAreaControl.setValue(JSON.stringify(response));
			});
		}
	});

});