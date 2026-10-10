sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    var NS = "com/test/cvamenares/texts/";

    return Controller.extend("com.test.cvamenares.controller.Main", {

        onInit: function () {
            var oModel = new JSONModel({
                contacto: "",
                titulo: "Resumen Profesional",
                texto: "",
                esTexto: true,
                esTabla: false,
                referencias: []
            });
            this.getView().setModel(oModel, "view");

            this._leer("resumen.txt").then(function (sTexto) {
                oModel.setProperty("/contacto", sTexto);
            });

            this._leer("res_prof.txt").then(function (sTexto) {
                oModel.setProperty("/texto", sTexto);
            });
        },

        _url: function (sArchivo) {
            return sap.ui.require.toUrl(NS + sArchivo);
        },

        _leer: function (sArchivo) {
            return fetch(this._url(sArchivo)).then(function (oResp) {
                return oResp.text();
            });
        },

        // Solo en celular: baja hasta el panel de contenido
        _irAlContenido: function () {
            if (!window.matchMedia("(max-width: 600px)").matches) {
                return;
            }
            var oPanel = this.byId("panelContenido");
            // pequeña espera para que UI5 termine de pintar el texto nuevo
            setTimeout(function () {
                var oDom = oPanel && oPanel.getDomRef();
                if (oDom) {
                    oDom.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
        },

        onTile: function (oEvent) {
            var oTile = oEvent.getSource();
            var sArchivo = oTile.data("file");
            var oModel = this.getView().getModel("view");
            var that = this;

            oModel.setProperty("/titulo", oTile.getHeader());

            if (sArchivo.endsWith(".json")) {
                this._leer(sArchivo).then(function (sJson) {
                    oModel.setProperty("/referencias", JSON.parse(sJson).referencias);
                    oModel.setProperty("/esTexto", false);
                    oModel.setProperty("/esTabla", true);
                    that._irAlContenido();
                });
            } else {
                this._leer(sArchivo).then(function (sTexto) {
                    oModel.setProperty("/texto", sTexto);
                    oModel.setProperty("/esTexto", true);
                    oModel.setProperty("/esTabla", false);
                    that._irAlContenido();
                });
            }
        },

        onDescargar: function () {
            window.open(this._url("CV_Andres_Menares_Senior_ABAP_2026.pdf"), "_blank");
        }
    });
});
