sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("com.test.cvamenares.controller.Main", {

        // Se ejecuta al cargar la vista por primera vez
        onInit: function () {

            // Modelo de datos local (JSON) que alimenta toda la vista vía binding
            var oModel = new JSONModel({
                titulo: "Selecciona una sección",       // título del panel derecho
                contenido: "Pulsa un botón para ver la información.", // texto del panel derecho
                resumen: "",                              // texto del panel "Datos Contacto"
                mostrarTabla: false,                      // controla si se muestra Texto o Tabla
                referencias: []                           // datos de la tabla de referencias
            });
            this.getView().setModel(oModel);

            // Cargar el texto de "Datos Contacto" automáticamente al iniciar la app
            fetch(sap.ui.require.toUrl("com/test/cvamenares") + "/texts/resumen.txt")
                .then(r => r.text())
                .then(texto => oModel.setProperty("/resumen", texto));
        },

        // Se ejecuta cada vez que el usuario presiona un GenericTile
        onBotonPress: function (oEvent) {
            // Obtiene el "key" definido en data:key del tile presionado
            // Ej: data:key="experiencia" -> sKey = "experiencia"
            var sKey = oEvent.getSource().data("key");
            var oModel = this.getView().getModel();

            // Diccionario: key del tile -> título a mostrar en el panel
            var mTitulos = {
                res_prof: "Resumen Profesional",
                habilidades: "Fortalezas",
                educacion: "Certificaciones",
                experiencia: "Historial laboral",
                contactos: "Referencias"
            };

            // CASO ESPECIAL: Referencias se muestra como TABLA (desde JSON)
            if (sKey === "contactos") {
                fetch(sap.ui.require.toUrl("com/test/cvamenares") + "/texts/referencias.json")
                    .then(function (response) {
                        return response.json(); // parsea el JSON a objeto JS
                    })
                    .then(function (oData) {
                        oModel.setProperty("/referencias", oData.referencias); // llena la tabla
                        oModel.setProperty("/mostrarTabla", true);              // muestra tabla, oculta texto
                        oModel.setProperty("/titulo", mTitulos[sKey]);
                    })
                    .catch(function () {
                        oModel.setProperty("/titulo", mTitulos[sKey]);
                        oModel.setProperty("/contenido", "No se pudo cargar las referencias.");
                        oModel.setProperty("/mostrarTabla", false);
                    });

            // CASO NORMAL: el resto de los tiles se muestra como TEXTO (desde .txt)
            } else {
                oModel.setProperty("/mostrarTabla", false); // oculta tabla, muestra texto

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
                    });
            }
        }

    });
});