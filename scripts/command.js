var lastUnit = "";
var lastCommand = "";

function panel(){

        const build = Vars.player;

        if (!build) return;
        const buildTeam = build.team;

        const target = Vars.content.block("gr-command-block");

        Sounds.click.at(build.x, build.y);

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
                [Core.bundle.format("commandblock.commands.spawn-unit")],
                [Core.bundle.format("commandblock.commands.get-current-unit")],
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
                    }} else if (i == 6){
                        try{

                    Sounds.uiButton.play();
                    Vars.ui.showTextInput(Core.bundle.format("commandblock.commands.spawn-unit"), Core.bundle.format("commandblock.showtoast.spawn-unit-1"), 100, lastUnit, false, text => {
                        try{
                    lastUnit = text;
                    const unit = Vars.content.getByName(ContentType.unit, text);

                    if (unit == null){
                    Vars.ui.hudfrag.showToast(Icon.chat, Core.bundle.format("commandblock.showtoast.spawn-unit-2"));
                    return;
                    }
                        
                    unit.spawn(build.team(),build.x,build.y,build.unit().rotation);
                    Sounds.waveSpawn.at(build.x,build.y);
                    Fx.spawn.at(build.x,build.y);
                            
                    Vars.ui.hudfrag.showToast(Icon.chat, Core.bundle.format("commandblock.showtoast.spawn-unit-3") + unit.localizedName);

                    } catch(e){
                    Vars.ui.showInfoToast(e,5);
                    }});

                            

                    } catch(e){
                    Vars.ui.showInfoToast(e,5);
                    }} else if (i == 7){
                        try{

                    Sounds.uiButton.play();
                    const unit = Vars.player.unit();
                    if (!unit) return;
                    const type = unit.type.name;
                    lastUnit = type;
                    Vars.ui.hudfrag.showToast(Icon.eye, Core.bundle.format("commandblock.showtoast.get-current-unit"));
                            
                    } catch(e){
                    Vars.ui.showInfoToast(e,5);
                    }} else if(i == 8){
                    try{

                    Sounds.uiButton.play();
                    var units = [];
                        
                    
                const dialog = new BaseDialog("Units");

                let count = 0;

                dialog.cont.pane(p => {
                Vars.content.units().each(unit => {
                try{
                  if(unit == null) return;
                    p.add(unit.localizedName);
                    p.add().width(10);
                        count++;
                   if(count % 5 == 0){
                        p.row(); // 👈 NEW LINE
                    }
                } catch(e){
                Vars.ui.showInfoToast(e, 5);           
                }});
                }).size(Core.graphics.getWidth() * 0.75, Core.graphics.getHeight() * 0.75);
                    //dialog.cont.pane({}).size(400,300);
                    dialog.addCloseButton();
                    dialog.show();
                    
                    } catch(e){
                    Vars.ui.showInfoToast(e,10);
                    }} else if(i == 9){

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
                    
                    } else if (i == 10){
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
