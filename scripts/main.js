const panel = require("dbp/command");
require("redirect");

Events.on(ClientLoadEvent, () => {
    try {
        Vars.ui.settings.game.checkPref("console", true);
        
        let overlaymarkerTable = Vars.ui.hudGroup.find("overlaymarker");
        if (!overlaymarkerTable) return; 
        
        overlaymarkerTable.row();

        let tab = new Table();
        overlaymarkerTable.add(tab).bottom().left();

        tab.table(Tex.pane, t => {
            let lab = new Label("[accent]" + Core.bundle.format("commandblock.title"));
            t.add(lab).colspan(6).row();
            
            const icons = [
                Icon.units,        
                Icon.cancel,       
                Icon.host,         
                Icon.defense,      
                Icon.pencil,       
                Icon.waves,        
                Icon.book,         
                Icon.fill,         
                Icon.command,      
                Icon.status,       
                Icon.time,         
                Icon.file,         
                Icon.map,          
                Icon.effect,       
                Icon.admin,        
                Icon.image,        
                Icon.audio         
            ];
            
            for (let i = 0; i <= 16; i++) {
                const id = i;
                let btnIcon = icons[id] || Icon.command; 
                
                t.button(btnIcon, () => {
                    try {
                        if (id == 0) panel.clearUnits();
                        else if (id == 1) panel.stopPlayer();
                        else if (id == 2) panel.changeTeam();
                        else if (id == 3) panel.toggleGameOver();
                        else if (id == 4) panel.toggleEditor();
                        else if (id == 5) panel.toggleUnitCap();
                        else if (id == 6) panel.openUnitLibrary();
                        else if (id == 7) panel.fillCore();
                        else if (id == 8) panel.runJavaScript();
                        else if (id == 9) panel.openStatusEffects();
                        else if (id == 10) panel.openTimeScale();
                        else if (id == 11) panel.openPatcher();
                        else if (id == 12) panel.generatePixMap();
                        else if (id == 13) panel.openEffects();
                        else if (id == 14) panel.runUnitAI();
                        else if (id == 15) panel.openTextureAtlas();
                        else if (id == 16) panel.openSounds();
                    } catch (e) {
                        Vars.ui.showInfoToast(String(e), 15);
                    }
                }).size(50);
            
                if ((i + 1) % 6 === 0) t.row();
            }
        });
        tab.visibility = () => !Vars.net.client();

    } catch (e) {
        Vars.ui.showInfoToast(String(e), 15);
    }
});
