sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("com.test.cvamenares.controller.Main", {

        // Se ejecuta al cargar la vista por primera vez
        onInit: function () {
            var oModel = new JSONModel({
                titulo: "Selecciona una sección",
                contenido: "Pulsa un botón para ver la información.",
                resumen: "",
                mostrarTabla: false,
                referencias: []
            });
            this.getView().setModel(oModel);

            // Cargar el texto de "Datos Contacto" automáticamente al iniciar la app
            fetch(sap.ui.require.toUrl("com/test/cvamenares") + "/texts/resumen.txt")
                .then(r => r.text())
                .then(texto => oModel.setProperty("/resumen", texto));
        },

        // Se ejecuta cada vez que el usuario presiona un GenericTile
        onBotonPress: function (oEvent) {
            var sKey = oEvent.getSource().data("key");
            var oModel = this.getView().getModel();
            var that = this; // guardamos referencia a "this" para usarla dentro del .then

            var mTitulos = {
                res_prof: "Resumen Profesional",
                habilidades: "Fortalezas",
                educacion: "Certificaciones",
                experiencia: "Historial laboral",
                contactos: "Referencias"
            };

// Función para hacer scroll al panel de contenido
var fnScroll = function () {
    setTimeout(function() {
        var oPanel = that.byId("infoPanel");
        if (oPanel && oPanel.getDomRef()) {
            oPanel.getDomRef().scrollIntoView({ behavior: "smooth" });
        }
    }, 300); // espera 300ms para que UI5 termine de renderizar
};

            // CASO ESPECIAL: Referencias se muestra como TABLA (desde JSON)
            if (sKey === "contactos") {
                fetch(sap.ui.require.toUrl("com/test/cvamenares") + "/texts/referencias.json")
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (oData) {
                        oModel.setProperty("/referencias", oData.referencias);
                        oModel.setProperty("/mostrarTabla", true);
                        oModel.setProperty("/titulo", mTitulos[sKey]);
                        fnScroll(); // scroll al panel
                    })
                    .catch(function () {
                        oModel.setProperty("/titulo", mTitulos[sKey]);
                        oModel.setProperty("/contenido", "No se pudo cargar las referencias.");
                        oModel.setProperty("/mostrarTabla", false);
                    });

            // CASO NORMAL: el resto de los tiles se muestra como TEXTO (desde .txt)
            } else {
                oModel.setProperty("/mostrarTabla", false);

                fetch(sap.ui.require.toUrl("com/test/cvamenares") + "/texts/" + sKey + ".txt")
                    .then(function (response) {
                        return response.text();
                    })
                    .then(function (sTexto) {
                        oModel.setProperty("/titulo", mTitulos[sKey]);
                        oModel.setProperty("/contenido", sTexto);
                        fnScroll(); // scroll al panel
                    })
                    .catch(function () {
                        oModel.setProperty("/titulo", mTitulos[sKey]);
                        oModel.setProperty("/contenido", "No se pudo cargar el contenido.");
                    });
            }
        }

    });
});