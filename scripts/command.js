var lastUnit = "";
var lastCommand = "";
var lastTeam = 1;
var consolePanel = null;
var value = 0;
var unitsTab = null;
var timeScaleDialog = null;
var speed = 1;

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
                [Core.bundle.format("commandblock.commands.status")],
                [Core.bundle.format("commandBlock.timescale")],
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
                    }).grow();

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
                        
                if (unitsTab == null){  
                unitsTab = new BaseDialog("Units");
                unitsTab.cont.add(Core.bundle.format("commandBlock.dialog.unitLib.info")).top().row();
                let count = 0;

                // Remove because of being too unreliable to work with
              /*  const slider = new Slider(0, 20, 1, false);
                const label = new Label(String(value));
                            
                slider.changed(() => {
                value = Math.floor(slider.getValue());
                label.setText(String(value));
                });

                dialog.cont.add(slider).width(200).row();
                dialog.cont.add(label).row();
                  */
                            
                unitsTab.cont.pane(p => {
                        
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
                /*Vars.ui.showInfoToast(value + ":" + unit, 10);
                const p = Vars.player;

                value = Math.floor(slider.getValue());
                         
                for (let i = 0; i < value; i++){
                unit.spawn(build.team(), build.x, build.y, build.unit().rotation);
                }*/
                         
                unit.spawn(build.team(), build.x, build.y, build.unit().rotation);

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
                        
                }).width(Core.graphics.getWidth()).growY();
                    //dialog.cont.pane({}).size(400,300);
                    unitsTab.addCloseButton();
                }
                    unitsTab.show();
                    
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
                            
                    consolePanel = new BaseDialog(Core.bundle.format("commandblock.commands.run-javascript"));
                    consolePanel.cont.top().row();

                    const field = new TextField("");
                    field.setMessageText("Insert Command");
                    consolePanel.cont.add(field).growX();

                    const button = new Button();
                    button.add("Use");

                    const clearButton = new Button();
                    clearButton.add("clear");

                    //consolePanel.cont.row();
                    consolePanel.cont.add(button);
                    consolePanel.cont.add(clearButton);
                    consolePanel.cont.row().row();
                
                        consolePanel.cont.pane(p => {

                         consoleTable = new Table();
                        consoleTable.background(Tex.button);
                        
                         p.add(consoleTable).grow(); // IMPORTANT: attach to pane

                        }).grow();
                            
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
                    const code = eval(field.getText());
                    output("[accent]ran:[] " + field.getText() + " [grey](" + code + ")");
                    } catch(e){
                    output("[red]" + String(e));  
                    }});

                    clearButton.clicked(() => {
                    try{
                    consoleTable.clear();
                    } catch(e){
                    Vars.ui.showInfoToast(e,5);
                    }});
                            
                    consolePanel.addCloseButton();
                    }
  
                    consolePanel.show();
                   
                    } catch(e){
                    Vars.ui.showInfoToast(e,10);       
                    }} else if (i == 9){

                    const dialog = new BaseDialog("dialog");

                    let count = 0;
   
                    let width = Core.graphics.getWidth() * 0.075;
                    let height = Core.graphics.getHeight() * 0.075;

                    const slider = new Slider(0, 325, 1, false);
                    const label = new Label(String(value));
                            
                    slider.changed(() => {
                    value = Math.floor(slider.getValue());
                    if (value >= 305){
                    value = Infinity;
                    }
                    label.setText(String(value));
                    });

                    dialog.cont.add(slider).width(350).row();
                    dialog.cont.add(label).row();
                        
                    dialog.cont.pane(p => {
                    Vars.content.statusEffects().each(e => {

                    const button = new Button(Styles.squareTogglet);
                    button.image(e.uiIcon).size(60);
                    button.row();
                    button.add(e.name).left();
                            
                    button.clicked(() => {
                    try{
                    const player = Vars.player;
                    player.unit().apply(e,value*60);
                    } catch(e){
                    Vars.ui.showInfoToast(e,5);
                    }});

                    p.add(button).size(width,height).padTop(10);
                    p.add().width(10);
                    count++;

                    if (count >= 6){
                    p.row();
                    count = 0;
                    }
                            
                    });
                    }).grow();

                    dialog.addCloseButton();
                    dialog.show();
                        
                    } else if (i == 10){
                    try{ 
                            
                    if (Vars.mods.getMod("tc") != null){
                    Vars.ui.showInfoToast("Time control is active not taking effect");
                    return;
                    }
                            
                    if (timeScaleDialog == null){
                    timeScaleDialog = new BaseDialog(Core.bundle.format("commandBlock.timescale"));

                    const slider = new Slider(0, 9, 0.05, false);
                    const button = new Button();
                    const label = new Label("1.00");

                    button.add(new Image(Icon.play));

                    Time.setDeltaProvider(() => {
                    return Core.graphics.getDeltaTime() * 60 * speed;
                    });
                            
                    slider.changed(() => {
                    try {
                    speed = slider.getValue() + 1;
                    label.setText(speed.toFixed(2));
                    } catch(e){
                    Vars.ui.showInfoToast(e,5);      
                    }});

                    button.clicked(() => {
                    speed = 1;   
                    slider.setValue(0);
                    label.setText(speed.toFixed(2));
                    });

                    timeScaleDialog.cont.add(slider).width(150);
                    timeScaleDialog.cont.add().width(15);
                    timeScaleDialog.cont.add(label);
                    timeScaleDialog.cont.add().width(15);
                    timeScaleDialog.cont.add(button);
                    timeScaleDialog.addCloseButton()
                            
                    }
                
                    timeScaleDialog.show();

                    } catch(e){
                    Vars.ui.showInfoToast(e,5);
                    }}
            }
        );


}

exports.panel = panel;
