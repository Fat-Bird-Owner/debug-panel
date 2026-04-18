var lastUnit = "";
var lastCommand = "";
var lastTeam = 1;
var consolePanel = null;

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

                    const teams = Team.all;
                    const dialog = new BaseDialog("dialog");

                    let count = 0;
   
                    let width = Core.graphics.getWidth() * 0.085;
                    let height = Core.graphics.getHeight() * 0.085;

                    //if (height > width) height = Core.graphics.getHeight() * 0.05;
                            
                    dialog.cont.pane(p => {
                    for (let i = 0; i < teams.length; i++){

                    let team = teams[i]
                            
                    const button = new Button(Styles.squareTogglet);
                    button.image(Tex.whiteui).size(60).color(team.color);
                    button.row();
                    button.add(team.coloredName());
                            
                    button.clicked(() => {
                    try{
                    const player = Vars.player;
                    player.team(team);
                    dialog.hide();
                    } catch(e){
                    Vars.ui.showInfoToast(e,5);
                    }});

                    p.add(button).size(width,height).padTop(10);
                    p.add().width(10);
                    count++;

                    if (count >= 5){
                    p.row();
                    count = 0;
                    }
                            
                    }
                    })

                    dialog.addCloseButton();
                    dialog.show();

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
                        
                const button = new Button(Styles.squareTogglet);
                        
                button.image(unit.uiIcon).size(40).pad(12);
                button.row();
                button.add(unit.localizedName);

                button.clicked(() => {
                unit.spawn(build.team(),build.x,build.y,build.unit().rotation);
                Sounds.waveSpawn.play();
                });
                        
                p.add(button).size(width,height).padTop(10);
                p.add().width(10);
                count++;
                   if(count % 3 == 0){
                        p.row();
                    }
                } catch(e){
                Vars.ui.showInfoToast(e, 5);           
                }});
                }).size(Core.graphics.getWidth() / 2, Core.graphics.getHeight() / 2);
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
                    if (consolePanel == null){

                    let consoleTable = null;
                            
                    consolePanel = new BaseDialog("panel");
                    consolePanel.cont.top().row();

                    const field = new TextField("");
                    field.setMessageText("Insert Command");
                    consolePanel.cont.add(field).width(Core.graphics.getWidth() / 2);

                    const button = new Button();
                    button.add("Use");
                    consolePanel.cont.add(button);
                    consolePanel.cont.row();
                
                   consolePanel.cont.pane(p => {
                   consoleTable = new Table();
                   consolePanel.cont.add(consoleTable);
                   }).size(0, Core.graphics.getHeight() / 2);
                            
                   let errorV = null;
                            
                        function output(string){
                        try{
                        if (!consoleTable) return;
                           consoleTable.add(string).row();
                           //consoleTable.parent.setScrollY(999999);
                        } catch(e){
                        Vars.ui.showInfoToast(e,5);
                        }}
                            
                    button.clicked(() => {
                    try{
                    eval(field.getText());
                    output("ran: " + field.getText());
                    } catch(e){
                    output(String(e));  
                    }});

                    consolePanel.addCloseButton();
                    }
  
                    consolePanel.show();
                   
                    } catch(e){
                    Vars.ui.showInfoToast(e,10);       
                    }}
            }
        );


}

exports.panel = panel;
