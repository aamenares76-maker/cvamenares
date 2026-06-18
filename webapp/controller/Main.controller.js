sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("com.test.cvamenares.controller.Main", {


        onInit: function () {
            var oModel = new JSONModel({
                titulo: "Selecciona una sección",
                contenido: "Pulsa un botón para ver la información.",
                resumen: "",
                habilidades: ""
            });
            this.getView().setModel(oModel);

            // Cargar resumen al inicio
            fetch(sap.ui.require.toUrl("com/test/cvamenares") + "/texts/resumen.txt")
                .then(r => r.text())
                .then(texto => oModel.setProperty("/resumen", texto));

            // Cargar habilidades al inicio
        //    fetch(sap.ui.require.toUrl("com/test/cvamenares") + "/texts/habilidades.txt")
          //      .then(r => r.text())
            //    .then(texto => oModel.setProperty("/habilidades", texto));
        },

onBotonPress: function (oEvent) {
    var sKey = oEvent.getSource().data("key");
    var oModel = this.getView().getModel();

    var mTitulos = {
        experiencia: "Experiencia",
        habilidades: "Habilidades",
        educacion: "Educación",
        contactos: "Contactos"
    };

    // Cargar el .txt correspondiente
    fetch(sap.ui.require.toUrl("com/test/cvamenares") + "/texts/" + sKey + ".txt")
        .then(function (response) {
            return response.text();
        })

        .then(function (sTexto) {
            oModel.setProperty("/titulo", mTitulos[sKey]);
            oModel.setProperty("/contenido", sTexto);
        })
        .catch(function () {
            oModel.setProperty("/titulo", mTitulos[sKey]);
            oModel.setProperty("/contenido", "No se pudo cargar el contenido.");
        })
        .catch(function () {
            oModel.setData({
                titulo: mTitulos[sKey],
                contenido: "No se pudo cargar el contenido."
            });
        });
},
})});