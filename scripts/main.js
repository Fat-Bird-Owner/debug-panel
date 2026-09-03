const panel = require("dbp/Command");
require("dbp/Redirect");
require("dbp/Infini-source");
require("dbp/Infini-fluid-source");
require("dbp/Stat");
//require("dbp/icons");
let drill = null;

Events.on(ClientLoadEvent, () => {
    try {
        Vars.ui.settings.game.checkPref("console", true);
        Vars.ui.planet.debugSelect = true;
        
        let overlaymarkerTable = Vars.ui.hudGroup.find("overlaymarker");
        if (!overlaymarkerTable) return; 
        
        overlaymarkerTable.row();

        let tab = new Table();
        overlaymarkerTable.add(tab).bottom().left();

        tab.table(Tex.pane, t => {
            let lab = new Label("[accent]" + Core.bundle.format("commandblock.title"));
            t.add(lab).colspan(6).row();
            
            const icons = [
                Icon.none,        
                Icon.lock,       
                Icon.commandRally,         
                Icon.defense,      
                Icon.edit,       
                Icon.waves,        
                Icon.units,         
                Icon.effect,         
                Icon.terminal,      
                Icon.list,       
                Icon.play,         
                Icon.file,         
                Icon.map,          
                Icon.book,       
                Icon.modeAttack,        
                Icon.image,        
                Icon.chat,
                Icon.admin,
                Icon.production
            ];
            
            for (let i = 0; i <= 18; i++) {
                const id = i;
                let btnIcon = icons[id] || Core.atlas.find("error");
                const icon = new TextureRegionDrawable(btnIcon);
                
                t.button(icon, () => {
                    try {
                        
                        if (Vars.player.selectedBlock != null) {
                        drill = Vars.player.selectedBlock
                        }
                        
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
                        else if (id == 17) panel.emojis();
                        else if (id == 18) {
                        if (drill == null){
                        Vars.ui.showInfoToast("No drills selected", 3);
                        return;
                        }
                        
                        panel.vainFiller(drill);
                        }
                        
                    } catch (e) {
                        Vars.ui.showInfoToast(String(e), 15);
                    }
                }).size(40).pad(4).padTop(4);
            
                if ((i + 1) % 6 === 0) t.row();
            }
        });
        tab.visibility = () => Vars.ui.hudfrag.shown && !Vars.net.client();

    } catch (e) {
        Vars.ui.showText("e", String(e));
    }
});
