var lastUnit = "";
var lastCommand = "";
var lastTeam = 1;

function panel(){

        const build = Vars.player;

        if (!build) return;
        const buildTeam = build.team;

        Sounds.click.play();

        Vars.ui.showMenu(
            Core.bundle.format("commandblock.title"),
            Core.bundle.format("commandblock.description"),
            [
                [Core.bundle.format("commandblock.commands.clear-units")],
                [Core.bundle.format("commandblock.commands.stop-player")],
                [Core.bundle.format("commandblock.commands.change-team")],
                [Core.bundle.format("commandblock.commands.toggle-cancanover")],
                [Core.bundle.format("commandblock.commands.toggle-editor")],
                [Core.bundle.format("commandblock.commands.toggle-disable-unitcap")],
                [Core.bundle.format("commandblock.commands.unit-library")],
                [Core.bundle.format("commandblock.commands.fill-core")],
                [Core.bundle.format("commandblock.commands.run-javascript")],
                [Core.bundle.format("close")]
            ],
            i => {

                if (i == 0) {

                    Sounds.uiButton.play();
                    Groups.unit.clear();
                    Vars.ui.hudfrag.showToast(Icon.tree, Core.bundle.format("commandblock.showtoast.clear-units"));

                } else if (i == 1) {
                    try {

                        Sounds.uiButton.play();

                        const p = Vars.player;
                        if (!p) {
                            Vars.ui.hudfrag.showToast(Icon.tree, "[grey]Player does not exist.");
                            return;
                        }
                        const unit = p.unit();
                        if (!unit) {
                            Vars.ui.hudfrag.showToast(Icon.tree, "[grey]No unit found");
                            return;
                        }

                        unit.apply(StatusEffects.unmoving, 9999 * 60);
                        Vars.ui.hudfrag.showToast(Icon.tree, "[grey]Stopped player unit");

                    } catch (err) {
                        Vars.ui.showInfoToast("err: " + err, 5);
                    }

                } else if (i == 2) {
                    try {

                        Vars.ui.showTextInput(Core.bundle.format("commandblock.commands.change-team"), Core.bundle.format("commandblock.showtoast.change-team-1"), 100, lastTeam, false, text => {
                        try{

                        Sounds.uiButton.play();
                        const p = Vars.player;
                        if (!p) {
                            Vars.ui.showInfoToast(Core.bundle.format("commandblock.showtoast.change-team-2"), 3);
                            return;
                        }

                        const currentTeam = p.team();
                        const newTeam = Team.get(text);

                        p.team(newTeam);
                        Vars.ui.hudfrag.showToast(Icon.tree, Core.bundle.format("commandblock.showtoast.change-team-3"));

                        } catch(e){
                        Vars.ui.showInfoToast(e,10);
                        }});

                    } catch (err) {
                        Vars.ui.showInfoToast(String(err), 15);
                    }} else if (i == 3){
                        try{

                    Sounds.uiButton.play();
                    const gameOver = Vars.state.rules.canGameOver;
                    Vars.state.rules.canGameOver = !gameOver;

                    Vars.ui.hudfrag.showToast(Icon.tree, Core.bundle.format("commandblock.showtoast.toggle-cancanover") + "[lightgrey]" + !gameOver);
                        
                    } catch(e){
                    Vars.ui.showInfoToast(e,5);    
                    }} else if (i == 4){
                        try {

                    const editor = Vars.state.rules.editor;
                    Vars.state.rules.editor = !editor;

                    Vars.ui.hudfrag.showToast(Icon.tree, Core.bundle.format("commandblock.showtoast.toggle-editor") + "[lightgrey]" + !editor);
                             
                    } catch(e){
                    Vars.ui.showInfoToast(e,5);  
                    }} else if (i == 5){
                        try{

                    Sounds.uiButton.play();
                    const disableUnitCap = Vars.state.rules.disableUnitCap;
                    Vars.state.rules.disableUnitCap = !disableUnitCap;

                    Vars.ui.hudfrag.showToast(Icon.tree, Core.bundle.format("commandblock.showtoast.toggle-disable-unitcap") + "[lightgrey]" + !disableUnitCap);
                            
                    } catch(e){
                    Vars.ui.showInfoToast(e,10);
                    }} else if(i == 6){
                    try{

                    Sounds.uiButton.play();
                    var units = [];
                        
                    
                const dialog = new BaseDialog("Units");
                dialog.cont.add(Core.bundle.format("commandBlock.dialog.unitLib.info")).top().row();
                let count = 0;

                dialog.cont.pane(p => {
                Vars.content.units().each(unit => {
                try{
                  if(unit == null || unit.internal ) return;

                let width = Core.graphics.getWidth() * 0.15;
                let height = Core.graphics.getHeight() * 0.15;

                if (height > width) height = Core.graphics.getHeight() * 0.05;
                        
                const button = new Button(Styles.geni);
                        
                button.image(unit.uiIcon).size(40).pad(12);
                button.row();
                button.add(unit.localizedName);

                button.clicked(() => {
                unit.spawn(build.team(),build.x,build.y,build.unit().rotation);
                Sounds.uiChat.play();
                });
                        
                p.add(button).size(width,height);;
                p.add().width(10);
                count++;
                   if(count % 3 == 0){
                        p.row();
                    }
                } catch(e){
                Vars.ui.showInfoToast(e, 5);           
                }});
                }).size(Core.graphics.getWidth() * 0.5, Core.graphics.getHeight() * 0.5);
                    //dialog.cont.pane({}).size(400,300);
                    dialog.addCloseButton();
                    dialog.show();
                    
                    } catch(e){
                    Vars.ui.showInfoToast(e,10);
                    }} else if(i == 7){

                    Sounds.uiButton.play();
                    let core = Vars.player.core();
                    let amount = 0;
                    
                    Vars.content.items().each(item => {
                    try{
                        
                    core.items.set(item, core.storageCapacity);
                    amount++;
                    } catch(e){
                    Vars.ui.showInfoToast(e,15);
                    }});

                    Vars.ui.hudfrag.showToast(Icon.effect, Core.bundle.format("commandblock.showtoast.fill-core-1") + amount + Core.bundle.format("commandblock.showtoast.fill-core-2"));
                    
                    } else if (i == 8){
                    try{

                    Sounds.uiButton.play();
                    Vars.ui.showTextInput("<" + Core.bundle.format("commandblock.commands.run-javascript") + ">", Core.bundle.format("commandblock.showtoast.run-javascript-1"), 100, lastCommand, false, text => {
                    try{      

                    const error = Core.bundle.format("commandblock.showtoast.run-javascript-2");
                    lastCommand = text;
                    eval("try{ " + text + "} catch(e) { Vars.ui.showText(error,e)}");
                    
                    Sounds.waveSpawn.play();
                    Vars.ui.hudfrag.showToast(Icon.chat, Core.bundle.format("commandblock.showtoast.run-javascript-3") + text);
                    
                    } catch(e){
                    Vars.ui.showInfoToast(e,10);
                    }});
                        
                    } catch(e){
                    Vars.ui.showInfoToast(e,10);       
                    }}
            }
        );


}

exports.panel = panel;
